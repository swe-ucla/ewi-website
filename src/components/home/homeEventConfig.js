/**
 * Home page event copy and countdown target.
 * countdownTarget must match the published event start (ISO 8601).
 */
export const homeEventConfig = {
  date: "November 20, 2026",
  time: "[time]",
  location: "Carnesale Commons",
  countdownTarget: "2026-11-20T17:30:00-08:00",
};

export const getCountdownTargetDate = () =>
  new Date(homeEventConfig.countdownTarget);
