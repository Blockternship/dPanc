export const getStepWiseArray = (events) => {
  return events.reduce((acc, val, index) => {
    const isFinalIteration = index === events.length - 1;
    if (!isFinalIteration) {
      acc.push({ start: events[index], end: events[index + 1] });
    }

    return acc;
  }, []);
};
