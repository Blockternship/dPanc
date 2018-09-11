import { getMaxVelocity } from './MaxVelocityService';

const dataProvider = [
  {
    expectedMaxVelocity: 5,
    glucoseEvents: [
      {
        timestamp: 0,
        glucose: 100
      },
      {
        timestamp: 60,
        glucose: 101
      },
      {
        timestamp: 120,
        glucose: 103
      },
      {
        timestamp: 180,
        glucose: 106
      },
      {
        timestamp: 240,
        glucose: 110
      },
      {
        timestamp: 300,
        glucose: 115
      }
    ]
  },
  {
    expectedMaxVelocity: 5,
    glucoseEvents: [
      {
        timestamp: 0,
        glucose: 100
      },
      {
        timestamp: 60,
        glucose: 104
      },
      {
        timestamp: 360,
        glucose: 129
      }
    ]
  }
];

it('returns the max velocity', () => {
  dataProvider.forEach((testInstance) => {
    const average = getMaxVelocity(testInstance.glucoseEvents);

    expect(average).toEqual(testInstance.expectedMaxVelocity);
  });
});
