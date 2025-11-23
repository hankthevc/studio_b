(function () {
  if (window.MiniHost) return;

  const PENDING = new Set();
  const SUBSCRIPTIONS = new Set();

  function activateSubscription(slug) {
    SUBSCRIPTIONS.add(slug);
    const event = new CustomEvent("subscription:activated", { detail: { slug, timestamp: Date.now() } });
    window.dispatchEvent(event);
    console.info(`[BillingMock] Activated subscription for ${slug}`);
  }

  window.MiniHost = {
    requestSubscription(slug, metadata) {
      if (!slug) {
        return Promise.reject(new Error("billingMock: slug is required"));
      }

      if (PENDING.has(slug)) {
        return Promise.reject(new Error("billingMock: subscription already pending for " + slug));
      }

      if (SUBSCRIPTIONS.has(slug)) {
        return Promise.resolve({ slug, status: "active" });
      }

      PENDING.add(slug);
      console.info(`[BillingMock] Simulating checkout for ${slug}…`);

      return new Promise((resolve) => {
        setTimeout(() => {
          PENDING.delete(slug);
          activateSubscription(slug);
          resolve({ slug, status: "active" });
        }, 900);
      });
    },

    isSubscribed(slug) {
      return Promise.resolve(SUBSCRIPTIONS.has(slug));
    },

    getAgeRange() {
      return Promise.resolve({ min: 18, max: null });
    },

    getAgeCategory() {
      return Promise.resolve("general");
    },

    track(eventName, props) {
      console.log(`[BillingMock] Track: ${eventName}`, props);
      return Promise.resolve();
    }
  };
})();

