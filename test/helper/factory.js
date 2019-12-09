module.exports = {
  earlyStaffNews: function (props) {
    const defaultEarly = {
      collaborator: '5a3c3fe94470566265b1f3bc',
      creator: '5a3c3fe94470566265b1f3bc',
      observation: 'observacion',
      time: '12:30',
      withNotice: true,
      type: 'EARLY'
    }
    return Object.assign({}, defaultEarly, props)
  },
  lateStaffNews: function (props) {
    const defaultEarly = {
      collaborator: '5a3c3fe94470566265b1f3bc',
      creator: '5a3c3fe94470566265b1f3bc',
      observation: 'observacion',
      time: '12:30',
      withNotice: true,
      type: 'LATE'
    }
    return Object.assign({}, defaultEarly, props)
  },
  absentStaffNews: function (props) {
    const defaultEarly = {
      collaborator: '5a3c3fe94470566265b1f3bc',
      creator: '5a3c3fe94470566265b1f3bc',
      observation: 'observacion',
      time: '12:30',
      withNotice: true,
      type: 'ABSENT'
    }
    return Object.assign({}, defaultEarly, props)
  },
  /**
   * Must send inPlant, informed and left.
   */
  accidentStaffNews: function (props) {
    const defaultEarly = {
      collaborator: '5a3c3fe94470566265b1f3bc',
      creator: '5a3c3fe94470566265b1f3bc',
      observation: 'observacion',
      withNotice: true,
      type: 'ACCIDENT',
      inPlant: true,
      informed: true,
      left: false
    }
    return Object.assign({}, defaultEarly, props)
  },

  leaveEarlyStaffRequest: function (props) {
    const defaultEarly = {
      type: 'EARLY',
      reason: 'motivo',
      time: '13:00',
      returnsTime: '14:00',
      creator: '5a3c3fe94470566265b1f41d',
      canceled: false,
      archived: false,
      printed: false,
      state: 1,
      returns: true,
      daysToCompensate: [
        {
          from: '2018-08-08T15:00:00.000Z',
          to: '2018-08-08T16:00:00.000Z'
        }
      ],
      days: [
        '2018-08-06T15:00:00.000Z'
      ],
      collaborators: [
        '5a3c3fe94470566265b1f3bc'
      ],
      approvedBy: '5a3c3fe94470566265b1f41d',
      approvedDate: '2018-08-06T15:33:44.669Z',
      resolution: 'COMPENSATE'
    }
    return Object.assign({}, defaultEarly, props)
  },

  medicalOrder: function (props) {
    const defaultMedicalOrder = {
      type: 'MEDICAL_ORDER',
      observation: 'le duele el estomago',
      medicalAppointment: '2018-08-16T03:00:00.000Z',
      collaborator: '5a3c3fe94470566265b1f3bc',
      creator: '5a3c3fe94470566265b1f41d'
    }
    return Object.assign({}, defaultMedicalOrder, props)
  },

  availability: function (props) {
    const defaultAvailability = {
      updated_at: '2018-08-07T18:32:05.066Z',
      created_at: '2018-08-07T18:32:05.066Z',
      collaborator: '5a3c3fe94470566265b1f3b6',
      collectionRequest: 'StaffRequest',
      request: '5b69e5a5681a6c3575a1ca90',
      type: 'MEDICAL_ORDER',
      from: '2018-08-16T00:00:00.000Z',
      to: '2018-08-16T00:00:00.000Z',
      isAvailable: false
    }
    return Object.assign({}, defaultAvailability, props)
  },

  timeline: function (props) {
    const defaultTimeline = {
      updated_at: '2018-08-24T15:21:42.683Z',
      created_at: '2018-08-24T14:05:08.822Z',
      collaborator: '5a3c3fe94470566265b1f3b6',
      archived: false,
      events: [
        {
          type: 'StaffNews',
          item: '5b801094a42dd414abd3d94e',
          _id: '5b801094a42dd414abd3d952',
          archived: false
        },
        {
          type: 'StaffRequest',
          item: '5b8022860f1ac4102cf7fe70',
          _id: '5b8022860f1ac4102cf7fe72',
          archived: false
        }
      ]
    }
    return Object.assign({}, defaultTimeline, props)
  },

  sanction: function (props) {
    const defaultSanction = {
      collaborators: ['5a3c3fe94470566265b1f3b6'],
      creator: '5a3c3fe94470566265b1f3b7',
      type: 'WARNING',
      reason: 'full reason',
      writtenReason: 'written reason'

    }
    return Object.assign({}, defaultSanction, props)
  },

  occurrence: function (props) {
    const occurrenceDefault = {
      actionPlan: 'Comprar despertador.',
      observation: 'LLega tarde todos los dias.',
      creator: '5a3c3fe94470566265b1f41d',
      printed: false,
      archived: false,
      recommendations: [
        'DISCIPLINE'
      ],
      collaborators: [
        '5b3b63534b62803b0a870a39'
      ]
    }
    return Object.assign({}, occurrenceDefault, props)
  },

  announcement: function (props) {
    const announcementDefault = {
      description: 'Una descripcion',
      creator: '5b3b63534b62803b0a870a39'
    }
    return Object.assign({}, announcementDefault, props)
  },
  meeting: function (props) {
    const meetingDefault = {
      collaborators: ['5b3b63534b62803b0a870a39'],
      creator: '5b3b63534b62803b0a870a37',
      type: 'INDIVIDUAL',
      recommendations: ['OPERATIVE'],
      description: 'descripcion',
      date: new Date()
    }
    return Object.assign({}, meetingDefault, props)
  },
  mock: function (props) {
    const mockDefault = {
      collaborators: ['5b3b63534b62803b0a870a39'],
      creator: '5b3b63534b62803b0a870a37',
      description: 'descripcion',
      date: new Date()
    }
    return Object.assign({}, mockDefault, props)
  },
  user: function (props) {
    const userDefault = {
      'legajo': 456,
      'name': 'nombre',
      'lastname': 'apellido',
      'address': '20 NRO. 611 E/ 126 Y 127',
      'phone': '4528765 - 155382595',
      'birthdate': '1986-08-20',
      'cuil': '20 32320348-3',
      'dni': '32320348',
      'nationality': 'ARGENTINA',
      'civil_status': 'CASADO',
      'area': '5b031930e0389954d01deff2',
      'sector': '5b031930e0389954d01deff2',
      'position': '5b031930e0389954d01deff2',
      'line': '5b031930e0389954d01deffa',
      'shift': '5b031930e0389954d01deffa',
      'category': 'NO CONV 1',
      'union': 'NO CONV.',
      'incorporation_date': '1914-02-25'
    }
    return Object.assign({}, userDefault, props)
  }
}
