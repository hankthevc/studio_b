(function () {
  const PENDING = new Set();

  function activateSubscription(appSlug) {
    const event = new CustomEvent("subscription:activated", { detail: { appSlug, timestamp: Date.now() } });
    window.dispatchEvent(event);
    console.info(`[BillingMock] Activated subscription for ${appSlug}`);
  }

  window.requestSubscription = function requestSubscription(appSlug) {
    if (!appSlug) {
      return Promise.reject(new Error("billingMock: appSlug is required"));
    }

    if (PENDING.has(appSlug)) {
      return Promise.reject(new Error("billingMock: subscription already pending for " + appSlug));
    }

    PENDING.add(appSlug);
    console.info(`[BillingMock] Simulating checkout for ${appSlug}…`);

    return new Promise((resolve) => {
      setTimeout(() => {
        PENDING.delete(appSlug);
        activateSubscription(appSlug);
        resolve({ appSlug, status: "activated" });
      }, 900);
    });
  };
})();

