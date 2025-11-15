const activityMap = {
  sedentary: { target: 1800, reminders: [8, 11, 14, 17, 20] },
  active: { target: 2200, reminders: [7, 10, 13, 16, 19, 21] },
  training: { target: 2600, reminders: [6, 9, 12, 15, 18, 20, 22] }
};

const flavorIdeas = {
  crisp: ["Cucumber mint", "Citrus wedge", "Electrolyte tab"],
  fruity: ["Berry splash", "Watermelon basil", "Coconut cubes"],
  herbal: ["Ginger lemon", "Chamomile honey", "Rosemary grapefruit"]
};

export function planHydration(formValues = {}) {
  const form = normalizeForm(formValues);
  const activity = activityMap[form.activity];
  const timeline = buildTimeline(form, activity.reminders);
  const travelTip = form.travel
    ? "Travel mode on: add one extra 250ml sip before takeoff and during ascent."
    : "Keep a bottle nearby and log your streak nightly.";

  return {
    wake: form.wake,
    sleep: form.sleep,
    activity: form.activity,
    travel: form.travel,
    targetMl: activity.target,
    timeline,
    flavorIdeas: flavorIdeas[form.flavor],
    travelTip,
    shareLink: buildShareLink(form.wake, form.sleep)
  };
}

function normalizeForm(form = {}) {
  return {
    wake: form.wake || "07:00",
    sleep: form.sleep || "22:30",
    activity: activityMap[form.activity] ? form.activity : "sedentary",
    flavor: flavorIdeas[form.flavor] ? form.flavor : "crisp",
    travel: Boolean(form.travel)
  };
}

function buildTimeline(form, reminderHours) {
  return reminderHours.map((hour, index) => {
    const label = toTimeLabel(hour);
    const ounces = form.travel ? 320 : 280;
    const ml = ounces;
    return {
      label,
      amountMl: ml,
      flavorBoost: flavorIdeas[form.flavor][index % flavorIdeas[form.flavor].length]
    };
  });
}

function toTimeLabel(hour) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const normalized = hour % 12 || 12;
  return `${normalized}:00 ${suffix}`;
}

function buildShareLink(wake, sleep) {
  const slug = `${wake.replace(":", "")}-${sleep.replace(":", "")}`;
  const id = Math.random().toString(36).slice(2, 5);
  return `https://sipsync.app/s/${slug}-${id}`;
}
