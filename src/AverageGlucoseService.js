export const getTimeWeightedMean = (arrayOfGlucoseEvents) => {
  const arrayOfRectangleSums = [];

  arrayOfGlucoseEvents.forEach((val, i) => {
    if (i !== arrayOfGlucoseEvents.length - 1) {
      const rectangle = getSegmentAverage(arrayOfGlucoseEvents[i], arrayOfGlucoseEvents[i+1]);

      arrayOfRectangleSums.push(rectangle);
    }
  });

  const sumOfRectanges = arrayOfRectangleSums.reduce((cumulativeSum, rectangleSum) => (
    cumulativeSum + rectangleSum
  ), 0);

  const timeDifference = arrayOfGlucoseEvents[arrayOfGlucoseEvents.length - 1].timestamp - arrayOfGlucoseEvents[0].timestamp;

  return sumOfRectanges / timeDifference;
}

const getSegmentAverage = (firstGlucoseEvent, secondGlucoseEvent) => {
  const average = (secondGlucoseEvent.glucose + firstGlucoseEvent.glucose) / 2;
  const period = secondGlucoseEvent.timestamp - firstGlucoseEvent.timestamp;

  return average * period;
};
