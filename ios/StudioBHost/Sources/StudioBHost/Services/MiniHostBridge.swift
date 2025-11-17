import Foundation
import WebKit

protocol MiniHostBridgeDelegate: AnyObject {
    func miniHostBridge(
        _ bridge: MiniHostBridge,
        didReceive action: MiniHostBridge.Action,
        payload: [String: Any],
        webView: WKWebView?,
        reply: @escaping (Result<[String: Any], Error>) -> Void
    )
}

final class MiniHostBridge: NSObject {
    enum Action: String {
        case requestSubscription
        case isSubscribed
        case getAgeCategory
        case getAgeRange
        case track
    }

    private enum Constants {
        static let handlerName = "MiniHost"
    }

    weak var delegate: MiniHostBridgeDelegate?
    private weak var userContentController: WKUserContentController?

    func attach(to controller: WKUserContentController) {
        userContentController = controller
        controller.addUserScript(Self.bootstrapScript)
        controller.add(self, name: Constants.handlerName)
    }

    func detach() {
        userContentController?.removeScriptMessageHandler(forName: Constants.handlerName)
        userContentController = nil
    }

    func dispatchEvent(name: String, detail: [String: Any], in webView: WKWebView?) {
        guard let data = try? JSONSerialization.data(withJSONObject: detail, options: []),
              let json = String(data: data, encoding: .utf8)
        else { return }
        let script = """
        window.dispatchEvent(new CustomEvent('\(name)', { detail: \(json) }));
        """
        DispatchQueue.main.async {
            webView?.evaluateJavaScript(script, completionHandler: nil)
        }
    }

    private func respond(
        result: Result<[String: Any], Error>,
        messageId: String,
        webView: WKWebView?
    ) {
        var envelope: [String: Any] = [
            "id": messageId
        ]
        switch result {
        case let .success(data):
            envelope["success"] = true
            envelope["data"] = data
        case let .failure(error):
            envelope["success"] = false
            envelope["error"] = error.localizedDescription
        }
        guard let jsonData = try? JSONSerialization.data(withJSONObject: envelope),
              let jsonString = String(data: jsonData, encoding: .utf8)
        else { return }
        let script = "window.MiniHost && window.MiniHost.__resolve(\(jsonString));"
        DispatchQueue.main.async {
            webView?.evaluateJavaScript(script, completionHandler: nil)
        }
    }
}

extension MiniHostBridge: WKScriptMessageHandler {
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard message.name == Constants.handlerName,
              let body = message.body as? [String: Any],
              let actionName = body["action"] as? String,
              let action = Action(rawValue: actionName)
        else {
            return
        }
        let payload = body["payload"] as? [String: Any] ?? [:]
        let expectsResponse = body["expectsResponse"] as? Bool ?? true
        let messageId = body["id"] as? String

        let reply: (Result<[String: Any], Error>) -> Void = { [weak self, weak message] result in
            guard expectsResponse, let id = messageId else { return }
            self?.respond(result: result, messageId: id, webView: message?.webView)
        }

        delegate?.miniHostBridge(
            self,
            didReceive: action,
            payload: payload,
            webView: message.webView,
            reply: reply
        )

        return
    }
}

private extension MiniHostBridge {
    static let bootstrapScript: WKUserScript = {
        let source = """
        (function () {
          if (window.MiniHost) { return; }
          const pending = new Map();

          function makeMessageId(action) {
            return action + ":" + Date.now() + ":" + Math.random().toString(16).slice(2);
          }

          function post(action, payload = {}, expectsResponse = true) {
            const id = makeMessageId(action);
            const message = { id, action, payload, expectsResponse };
            const handler = window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.MiniHost;
            if (!handler || typeof handler.postMessage !== "function") {
              if (expectsResponse) {
                return Promise.reject(new Error("MiniHost handler unavailable"));
              }
              return Promise.resolve();
            }
            handler.postMessage(message);
            if (!expectsResponse) {
              return Promise.resolve();
            }
            return new Promise((resolve, reject) => {
              pending.set(id, { resolve, reject });
              setTimeout(() => {
                if (pending.has(id)) {
                  pending.delete(id);
                  reject(new Error("MiniHost request timed out"));
                }
              }, 15000);
            });
          }

          const bridge = {
            requestSubscription(slug, metadata = {}) {
              if (!slug) {
                return Promise.reject(new Error("slug required"));
              }
              return post("requestSubscription", { slug, metadata }, true);
            },
            isSubscribed(slug) {
              if (!slug) {
                return Promise.resolve(false);
              }
              return post("isSubscribed", { slug }, true);
            },
            getAgeCategory() {
              return post("getAgeCategory", {}, true);
            },
            getAgeRange() {
              return post("getAgeRange", {}, true);
            },
            track(eventName, props = {}) {
              if (!eventName) { return Promise.resolve(); }
              return post("track", { eventName, props }, false);
            },
            __resolve(message) {
              const pendingEntry = pending.get(message.id);
              if (!pendingEntry) { return; }
              pending.delete(message.id);
              if (message.success) {
                pendingEntry.resolve(message.data || {});
              } else {
                pendingEntry.reject(new Error(message.error || "MiniHost error"));
              }
            }
          };

          Object.defineProperty(window, "MiniHost", {
            value: bridge,
            writable: false,
            configurable: false
          });
        })();
        """
        return WKUserScript(source: source, injectionTime: .atDocumentStart, forMainFrameOnly: false)
    }()
}

