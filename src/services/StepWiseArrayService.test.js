import { getStepWiseArray } from './StepWiseArrayService';

const dataProvider = [
  {
    glucoseEvents: [
      {
        timestamp: 0,
        glucose: 100
      },
    ],
    expectedStepWiseArray: [],
  },
  {
    glucoseEvents: [
      {
        timestamp: 0,
        glucose: 100
      },
      {
        timestamp: 60,
        glucose: 104
      }
    ],
    expectedStepWiseArray: [
      {
        start: {
          timestamp: 0,
          glucose: 100
        },
        end: {
          timestamp: 60,
          glucose: 104
        }
      },
    ],
  },
  {
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
    ],
    expectedStepWiseArray: [
      {
        start: {
          timestamp: 0,
          glucose: 100
        },
        end: {
          timestamp: 60,
          glucose: 104
        }
      },
      {
        start: {
          timestamp: 60,
          glucose: 104
        },
        end: {
          timestamp: 360,
          glucose: 129
        }
      },
    ],
  },
];

it('returns the step wise array', () => {
  dataProvider.forEach((testInstance) => {
    const stepWiseArray = getStepWiseArray(testInstance.glucoseEvents);

    expect(stepWiseArray).toEqual(testInstance.expectedStepWiseArray);
  });
});
