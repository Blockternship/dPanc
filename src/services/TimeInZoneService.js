import { getStepWiseArray } from './StepWiseArrayService';

const getAverage = ({ start, end }) => (start.glucose + end.glucose) / 2;

const getDuration = stepWiseArray => stepWiseArray.reduce((sum, step) => (
  sum + (step.end.timestamp - step.start.timestamp)
), 0);

export const getTimeInZone = glucoseEvents => {
  const stepWiseArray = getStepWiseArray(glucoseEvents);

  const lowValues = stepWiseArray.filter(step => getAverage(step) < 80);
  const highValues = stepWiseArray.filter(step => getAverage(step) > 180);
  const normalValues = stepWiseArray.filter(step => (
    !(getAverage(step) < 80) && !(getAverage(step) > 180)
  ));

  const timeInNormal = getDuration(normalValues);
  const timeInLow = getDuration(lowValues);
  const timeInHigh = getDuration(highValues);

  return {
    timeInNormal,
    timeInLow,
    timeInHigh,
  };
}
