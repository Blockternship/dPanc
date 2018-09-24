import { getMaxSpeedPerMinute } from './MaxSpeedService';

const dataProvider = [
  {
    description: 'equally spaced and strictly increasing velocities',
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
    description: 'un-equally spaced and strictly increasing velocities',
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
  },
  {
    description: 'equally spaced and negative velocities',
    expectedMaxSpeedPerMinute: 6,
    glucoseEvents: [
      {
        timestamp: 0,
        glucose: 100
      },
      {
        timestamp: 60,
        glucose: 96
      },
      {
        timestamp: 120,
        glucose: 90
      }
    ]
  },
  {
    description: 'equally spaced and positive and negative velocities',
    expectedMaxSpeedPerMinute: 12,
    glucoseEvents: [
      {
        timestamp: 0,
        glucose: 100
      },
      {
        timestamp: 60,
        glucose: 110
      },
      {
        timestamp: 120,
        glucose: 98
      }
    ]
  }
];

dataProvider.forEach((testInstance) => {
  it(`returns the max speed for ${testInstance.description}`, () => {
    const maxSpeedPerMinute = getMaxSpeedPerMinute(testInstance.glucoseEvents);

    expect(maxSpeedPerMinute).toEqual(testInstance.expectedMaxSpeedPerMinute);
  });
});
