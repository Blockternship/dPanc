import { getStepWiseArray } from './StepWiseArrayService';

export const getTimeWeightedMean = (glucoseEvents) => {
  const sumOfGlucodeDurationProducts = getSumOfGlucodeDurationProducts(glucoseEvents);
  const eventsDuration = getGlucoseEventsDuration(glucoseEvents);

  return sumOfGlucodeDurationProducts / eventsDuration;
}

const getSumOfGlucodeDurationProducts = glucoseEvents => {
  const stepWiseEvents = getStepWiseArray(glucoseEvents);

  return stepWiseEvents.reduce((cumulativeSum, { start, end }) => cumulativeSum + getGlucodeDurationProduct(start, end), 0);
};

const getGlucodeDurationProduct = (firstGlucoseEvent, secondGlucoseEvent) => {
  const glucoseAverage = (secondGlucoseEvent.glucose + firstGlucoseEvent.glucose) / 2;
  const stepDuration = secondGlucoseEvent.timestamp - firstGlucoseEvent.timestamp;

  return glucoseAverage * stepDuration;
};

const getGlucoseEventsDuration = glucoseEvents => (
  glucoseEvents[glucoseEvents.length - 1].timestamp - glucoseEvents[0].timestamp
);
