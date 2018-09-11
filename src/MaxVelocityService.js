const SECONDS_PER_MINUTE = 60;

export const getMaxVelocity = (arrayOfGlucoseEvents) => {
  const arrayOfSlopes = [];
   arrayOfGlucoseEvents.forEach((val, i) => {
    if (i !== arrayOfGlucoseEvents.length - 1) {
      const slope = SECONDS_PER_MINUTE * getSegmentSlope(arrayOfGlucoseEvents[i], arrayOfGlucoseEvents[i+1]);

      arrayOfSlopes.push(slope);
    }
  });

  return Math.max(...arrayOfSlopes);
};

const getSegmentSlope = (firstGlucoseEvent, secondGlucoseEvent) => {
  const glucoseDifference = secondGlucoseEvent.glucose - firstGlucoseEvent.glucose;
  const timeDifference = secondGlucoseEvent.timestamp - firstGlucoseEvent.timestamp;

  return glucoseDifference / timeDifference;
};
