import { getStepWiseArray } from './StepWiseArrayService';

const SECONDS_PER_MINUTE = 60;

const getMaxSpeedPerMinute = (arrayOfGlucoseEvents) => {
  const stepWiseArray = getStepWiseArray(arrayOfGlucoseEvents);

  return stepWiseArray.reduce((rollingMax, { start, end }) => Math.max(rollingMax, getStepSpeed(start, end)), 0);
};

const getStepSpeed = (firstGlucoseEvent, secondGlucoseEvent) => {
  const glucoseDifference = secondGlucoseEvent.glucose - firstGlucoseEvent.glucose;
  const timeDifference = secondGlucoseEvent.timestamp - firstGlucoseEvent.timestamp;

  return Math.abs(SECONDS_PER_MINUTE * (glucoseDifference / timeDifference));
};

export { getMaxSpeedPerMinute }
