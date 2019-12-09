const TEN_HOURS = 1000 * 60 * 60 * 10
const NINE_HOURS = 1000 * 60 * 60 * 9
const EIGHT_HOURS = 1000 * 60 * 60 * 8
const FIVE_HOURS = 1000 * 60 * 60 * 5
module.exports = [
  {
    'value': 'T1',
    'rotative': true,
    'from': '2017-09-08T09:00:00.000Z',
    'rules': [
      {
        'days': 6,
        'in': '8',
        'hours': EIGHT_HOURS
      },
      {
        'days': 2,
        'franco': true
      },
      {
        'days': 6,
        'in': '14',
        'hours': EIGHT_HOURS
      },
      {
        'days': 2,
        'franco': true
      },
      {
        'days': 6,
        'in': '22',
        'hours': EIGHT_HOURS
      },
      {
        'days': 2,
        'franco': true
      }
    ]
  },
  {
    'value': 'T2',
    'rotative': true,
    'from': '2017-09-02T09:00:00.000Z',
    'rules': [
      {
        'days': 6,
        'in': '8',
        'hours': EIGHT_HOURS
      },
      {
        'days': 2,
        'franco': true
      },
      {
        'days': 6,
        'in': '14',
        'hours': EIGHT_HOURS
      },
      {
        'days': 2,
        'franco': true
      },
      {
        'days': 6,
        'in': '22',
        'hours': EIGHT_HOURS
      },
      {
        'days': 2,
        'franco': true
      }
    ]
  },
  {
    'value': 'T3',
    'rotative': true,
    'from': '2017-09-20T09:00:00.000Z',
    'rules': [
      {
        'days': 6,
        'in': '8',
        'hours': EIGHT_HOURS
      },
      {
        'days': 2,
        'franco': true
      },
      {
        'days': 6,
        'in': '14',
        'hours': EIGHT_HOURS
      },
      {
        'days': 2,
        'franco': true
      },
      {
        'days': 6,
        'in': '22',
        'hours': EIGHT_HOURS
      },
      {
        'days': 2,
        'franco': true
      }
    ]
  },
  {
    'value': 'T4',
    'rotative': true,
    'from': '2017-09-14T09:00:00.000Z',
    'rules': [
      {
        'days': 6,
        'in': '8',
        'hours': EIGHT_HOURS
      },
      {
        'days': 2,
        'franco': true
      },
      {
        'days': 6,
        'in': '14',
        'hours': EIGHT_HOURS
      },
      {
        'days': 2,
        'franco': true
      },
      {
        'days': 6,
        'in': '22',
        'hours': EIGHT_HOURS
      },
      {
        'days': 2,
        'franco': true
      }
    ]
  },
  {
    'value': 'D67',
    'from': '2018-05-07T03:00:00.000Z',
    'rotative': false,
    'rules': [
      {
        'days': 5,
        'in': '8',
        'hours': NINE_HOURS
      },
      {
        'days': 1,
        'in': '8',
        'hours': FIVE_HOURS
      },
      {
        'days': 1,
        'franco': 1
      },
      {
        'days': 1,
        'in': '8',
        'hours': NINE_HOURS
      },
      {
        'days': 1,
        'in': '8',
        'hours': FIVE_HOURS
      },
      {
        'days': 3,
        'in': '8',
        'hours': NINE_HOURS
      },
      {
        'days': 2,
        'franco': 1
      }]
  },
  {
    'value': 'D68',
    'from': '2018-05-07T03:00:00.000Z',
    'rotative': false,
    'rules': [
      {
        'days': 1,
        'in': '8',
        'hours': NINE_HOURS
      },
      {
        'days': 1,
        'in': '8',
        'hours': TEN_HOURS
      },
      {
        'days': 3,
        'in': '8',
        'hours': NINE_HOURS
      },
      {
        'days': 2,
        'franco': 1
      },
      {
        'days': 5,
        'in': '8',
        'hours': NINE_HOURS
      },
      {
        'days': 1,
        'in': '8',
        'hours': FIVE_HOURS
      },
      {
        'days': 1,
        'franco': 1
      }]
  }
]
