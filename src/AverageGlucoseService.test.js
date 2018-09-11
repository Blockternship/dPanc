import { getTimeWeightedMean } from './AverageGlucoseService';

const dataProvider = [
  {
    expectedTimeWeightedMean: 200,
    glucoseEvents: [
      {
        timestamp: 0,
        glucose: 100
      },
      {
        timestamp: 1,
        glucose: 200
      },
      {
        timestamp: 2,
        glucose: 300
      }
    ]
  },
  {
    expectedTimeWeightedMean: 50,
    glucoseEvents: [
      {
        timestamp: 0,
        glucose: 0
      },
      {
        timestamp: 1,
        glucose: 10
      },
      {
        timestamp: 10,
        glucose: 100
      }
    ]
  }
];

it('returns the time weighted mean', () => {
  dataProvider.forEach((testInstance) => {
    const average = getTimeWeightedMean(testInstance.glucoseEvents);

    expect(average).toEqual(testInstance.expectedTimeWeightedMean);
  });
});
