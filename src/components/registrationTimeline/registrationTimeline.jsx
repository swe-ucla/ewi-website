import React from "react";
import "./registrationTimeline.css";

export const STEPS = ["early registration", "normal registration", "waitlist", "EWI"];

export const getCurrentStep = (dates) => {
  const now = new Date();

  if (now < dates.earlyRegistrationStart) {
    return -1; // registration hasn't opened yet
  }
  if (now < dates.normalRegistrationStart) {
    return 0; // early registration is open
  }
  if (now < dates.waitlistStart) {
    return 1; // normal registration is open
  }
  if (now < dates.eventDate) {
    return 2; // now on the waitlist stage
  }
  return 3; // event date has arrived/passed
};

const RegistrationTimeline = ({ dates }) => {
  const currentStep = getCurrentStep(dates);

  return (
    <div className="reg-timeline-wrapper">
      <div className="reg-timeline">
        {STEPS.map((label, index) => {
          const isCompleted = currentStep !== -1 && index < currentStep;
          const isActive = index === currentStep;
          const isLastStep = index === STEPS.length - 1;
          const lineIsSolid = currentStep !== -1 && index < currentStep;

          return (
            <React.Fragment key={label}>
              <div className="reg-timeline-step">
                <div
                  className={
                    "reg-timeline-circle" +
                    (isCompleted ? " reg-timeline-circle--completed" : "") +
                    (isActive ? " reg-timeline-circle--active" : "") +
                    (!isCompleted && !isActive ? " reg-timeline-circle--upcoming" : "")
                  }
                >
                  {isCompleted && <span className="reg-timeline-check">✓</span>}
                  {isActive && <span className="reg-timeline-dot" />}
                </div>
                <span className="reg-timeline-label">{label}</span>
              </div>

              {!isLastStep && (
                <div
                  className={
                    "reg-timeline-line" +
                    (lineIsSolid ? " reg-timeline-line--solid" : " reg-timeline-line--dashed")
                  }
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default RegistrationTimeline;