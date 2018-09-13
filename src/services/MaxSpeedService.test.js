import { getMaxSpeedPerMinute } from './MaxSpeedService';

const dataProvider = [
  {
    expectedMaxSpeedPerMinute: 5,
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
    expectedMaxSpeedPerMinute: 5,
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

it('returns the max spped per minute', () => {
  dataProvider.forEach((testInstance) => {
    const maxSpeedPerMinute = getMaxSpeedPerMinute(testInstance.glucoseEvents);

    expect(maxSpeedPerMinute).toEqual(testInstance.expectedMaxSpeedPerMinute);
  });
});
