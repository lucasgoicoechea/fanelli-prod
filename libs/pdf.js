'use strict'
const PdfPrinter = require('pdfmake')
const path = require('path')
const Const = require(path.join(__dirname, '/../libs/const'))
const AREA = Const.AREA
const dateFns = require('date-fns')
const _ = require('lodash')

const areaMap = new Map(
  [
    [AREA.PRODUCCION, 'Ropa de trabajo, casco de seguridad, calzado de seguridad, protección auditiva, protección visual, protección respiratoria, mameluco descartable y guantes'],
    [AREA.MANTENIMIENTO, 'Ropa de trabajo, casco de seguridad, calzado de seguridad, protección auditiva, protección visual, protección respiratoria, mameluco descartable, guantes y arnés de seguridad'],
    [AREA.SOLDADORES, 'Ropa de trabajo, casco de seguridad, calzado de seguridad, protección auditiva, protección visual, protección respiratoria, mameluco descarta ble, guantes,arnés de seguridad, delantal de soldador, polainas y mangas'],
    [AREA.VAGONETA, 'Ropa de trabajo, casco de seguridad, calzado de seguridad, protección auditiva, protección visual, protección respiratoria, mameluco descartable, guantes y delantal']
  ]
)

const HEADER_STYLE = {
  fontSize: 14,
  bold: true,
  alignment: 'center',
  margin: [0, 20, 0, 20]
}

const pdf = {
  createPdf: function (content) {
    const fonts = {
      Roboto: {
        normal: path.join(__dirname, '/../fonts/Roboto-Regular.ttf'),
        bold: path.join(__dirname, '/../fonts/Roboto-Medium.ttf'),
        italics: path.join(__dirname, '/../fonts/Roboto-Italic.ttf'),
        bolditalics: path.join(__dirname, '/../fonts/Roboto-Italic.ttf')
      }
    }
    let printer = new PdfPrinter(fonts)
    return printer.createPdfKitDocument(content)
  },

  getSecurityElementContent: function (employee, securityElements) {
    let title = {
      text: 'CONSTANCIA DE ENTREGA DE ROPA DE TRABAJO Y ELEMENTOS DE PROTECCIÓN PERSONAL\n\n',
      style: 'header'
    }
    let metadataTable = getEmployeeCompanyTable(employee)
    let securityElementsTable = getSecurityElementsTable(securityElements)

    return {
      header: {
        text: [
          'Numero de solicitud: ',
          securityElements.global_request_counter
        ],
        margin: [0, 20, 20, 0],
        alignment: 'right'
      },
      content: [
        title,
        metadataTable,
        {text: '\n\n'},
        securityElementsTable
      ],
      styles: {
        header: HEADER_STYLE
      },
      pageOrientation: 'landscape'
    }
  },

  getChecklistContent: function (checklist) {
    let title = {
      text: 'Chequeo ' + checklist[0].sector + '\n\n',
      style: 'header'
    }
    return {
      content: [
        title,
        getChecksTable(checklist)
      ],
      styles: {
        header: HEADER_STYLE
      }
    }
  },

  getStaffNewsContent: function (staffNews) {
    staffNews = staffNews.toObject()
    const header = {
      image: path.join(Const.PDF_IMAGES_PATH, 'REG-RRHH-021' + '.jpg'),
      width: 600,
      height: 120
    }
    const shift = staffNews.collaborator.hasOwnProperty('shift') ? staffNews.collaborator.shift.value : ''
    const sector = staffNews.collaborator.hasOwnProperty('sector.value') ? staffNews.collaborator.sector.value : ''
    const collaborator = [
      {text: 'Colaborador: \n', style: {bold: true}},
      staffNews.collaborator.name + ' ' + staffNews.collaborator.lastname + '\n',
      'Legajo ' + staffNews.collaborator.legajo + '\n',
      sector + ' ' + shift + '\n']

    const creator = {text: 'Realizada el ' + dateFns.format(staffNews.created_at, 'DD/MM/YYYY - HH:mm a') + ' por ' + staffNews.creator.lastname}
    const details = [
      {text: [{text: 'Dia: ', bold: true}, dateFns.format(staffNews.created_at, 'DD/MM/YYYY')]},
      {text: [{text: staffNews.withNotice ? 'Con AVISO' : 'Sin AVISO', bold: true}]},
      {
        text: [{
          text: 'Motivo: ',
          bold: true
        }, staffNews.hasOwnProperty('observation') ? staffNews.observation : '', '\n\n\n\n\n']
      }
    ]
    return {
      header,
      content: [
        {text: '', margin: [0, 100, 0, 0]},
        collaborator,
        {text: '\n\n'},
        creator,
        {text: '\n\n'},
        details,
        {
          text: [
            'Queda debidamente notificado con fecha: __/__/__ \n\n',
            'Firma del Colaborador: \n\n',
            'Firma de Jefe de Planta:'
          ],
          margin: [0, 300, 0, 0]
        }
      ],
      styles: {
        header: HEADER_STYLE
      }
    }
  },

  getStaffRequestContentInManyPages: function (staffRequest) {
    const content = []
    const header = {
      image: path.join(Const.PDF_IMAGES_PATH, staffRequest.getRegisterNumber() + '.jpg'),
      width: 600,
      height: 120
    }

    staffRequest.collaborators.forEach((collaborator, index) => {
      const detailsList = []

      detailsList.push({
        text: [
          {text: 'Estado: ', bold: true},
          {text: staffRequest.state !== Const.STAFF_REQUEST_STATE.REJECTED ? 'APROBADO' : 'RECHAZADO', bold: true},
          ' por ' + staffRequest.approvedBy.lastname
        ]
      })
      const printableContent = staffRequest.printableDetails()
      printableContent.forEach((content) => {
        detailsList.push({text: [{text: content.key, bold: true}, content.value]})
      })

      const details = {
        ul: detailsList
      }
      const shift = collaborator.shift !== undefined ? collaborator.shift.value : ''
      const sector = collaborator.sector !== undefined ? collaborator.sector.value : ''
      const collaboratorDetails = [
        {text: 'Colaborador: \n', style: {bold: true}, margin: [0, 70, 0, 0]},
        collaborator.name + ' ' + collaborator.lastname + '\n',
        'Legajo ' + collaborator.legajo + '\n',
        sector + ' ' + shift + '\n'
      ]

      const creator = {
        text: 'Realizada el ' + dateFns.format(staffRequest.created_at, 'DD/MM/YYYY - HH:mm a') + ' por ' + staffRequest.creator.lastname,
        style: {italics: true}
      }

      content.push([
        {text: '\n\n'},
        collaboratorDetails,
        {text: '\n\n'},
        creator,
        {text: '\n\n'},
        details,
        {
          text: [
            'Queda debidamente notificado con fecha: __/__/__ \n\n',
            'Firma del Colaborador: \n\n',
            'Firma de Jefe de Planta:'
          ],
          margin: [0, 300, 0, 0]
        }
      ])
      if (index !== staffRequest.collaborators.length - 1) {
        content.push({text: '', pageBreak: 'before'})
      }
    })

    return {
      header,
      content,
      styles: {
        header: HEADER_STYLE
      },
      pageOrientation: 'portrait'
    }
  },

  getStaffRequestContentSinglePage: function (staffRequest) {
    const header = {
      image: path.join(Const.PDF_IMAGES_PATH, staffRequest.getRegisterNumber() + '.jpg'),
      width: 600,
      height: 120
    }

    const collaboratorsList = [{text: 'Colaboradores: \n', style: {bold: true}, margin: [0, 70, 0, 0]}]

    staffRequest.collaborators.forEach(c => {
      const shift = c.shift !== undefined ? c.shift.value : ''
      const sector = c.sector !== undefined ? c.sector.value : ''
      collaboratorsList.push([
        c.name + ' ' + c.lastname + '\n',
        'Legajo ' + c.legajo + '\n',
        sector + ' ' + shift + '\n\n'
      ])
    })

    const collaborators = {text: collaboratorsList}

    const creator = {text: 'Realizada el ' + dateFns.format(staffRequest.created_at, 'DD/MM/YYYY - HH:mm a') + ' por ' + staffRequest.creator.lastname}

    const detailsList = []

    detailsList.push({
      text: [
        {text: 'Estado: ', bold: true},
        {text: staffRequest.state !== Const.STAFF_REQUEST_STATE.REJECTED ? 'APROBADO' : 'RECHAZADO', bold: true},
        {text: ' por ' + staffRequest.approvedBy.lastname}
      ]
    })
    const printableContent = staffRequest.printableDetails()
    printableContent.forEach((content) => {
      detailsList.push({text: [{text: content.key, bold: true}, content.value]})
    })

    const details = {
      ul: detailsList
    }

    return {
      header,
      content: [
        {text: '', margin: [0, 80, 0, 0]},
        collaborators,
        {text: '\n\n'},
        creator,
        collaborators,
        {text: '\n\n'},
        details
      ],
      footer: {
        text: [
          'Firma de Jefe de Planta:'
        ],
        margin: [20, 0, 0, 0]
      },
      styles: {
        header: HEADER_STYLE
      },
      pageOrientation: 'portrait'
    }
  },

  getSanctionContent: function (sanction) {
    const content = []
    const header = {
      image: path.join(Const.PDF_IMAGES_PATH, sanction.type + '.jpg'),
      width: 600,
      height: 120
    }

    sanction.collaborators.forEach((collaborator, index) => {
      const detailsList = []

      const printableContent = sanction.printableDetails()
      printableContent.forEach((content) => {
        detailsList.push({text: [{text: content.key, bold: true}, content.value]})
      })

      const details = {
        ul: detailsList
      }
      const shift = collaborator.shift !== undefined ? collaborator.shift.value : ''
      const sector = collaborator.sector !== undefined ? collaborator.sector.value : ''
      const collaboratorDetails = [
        {text: 'Colaborador: \n', style: {bold: true}, margin: [0, 70, 0, 0]},
        collaborator.name + ' ' + collaborator.lastname + '\n',
        'Legajo ' + collaborator.legajo + '\n',
        'DNI ' + collaborator.dni + '\n' +
        sector + ' ' + shift + '\n'
      ]

      const pageContent = [
        {text: '\n\n'},
        collaboratorDetails,
        {text: '\n\n'},
        details
      ]
      // Two pages
      content.push(pageContent)
      content.push({text: '', pageBreak: 'before'})
      content.push(_.cloneDeep(pageContent))

      if (index !== sanction.collaborators.length - 1) {
        content.push({text: '', pageBreak: 'before'})
      }
    })

    // Signatures
    const colaboratorSignature = [
      '________________________\n\n',
      'Firma y aclaración colaborador'
    ]

    const EmployerSignature = [
      '________________________\n\n',
      'Firma y aclaración empleador'
    ]
    return {
      header,
      content,
      styles: {
        header: HEADER_STYLE
      },
      footer: {
        columns: [
          {text: colaboratorSignature, alignment: 'center', margin: [30, 70, 0, 0]},
          {text: 'Queda debidamente notificado \n\n ___ /___ /___', alignment: 'center', margin: [0, 0, 0, 0]},
          {text: EmployerSignature, alignment: 'center', margin: [0, 70, 30, 0]}
        ]
      },
      pageMargins: [30, 30, 30, 150],
      pageOrientation: 'portrait'
    }
  },

  getOccurrenceContent: function (occurrence, previousOccurrences) {
    const content = []
    const header = {
      image: path.join(Const.PDF_IMAGES_PATH, occurrence.registerNumber + '.jpg'),
      width: 600,
      height: 120
    }

    occurrence.collaborators.forEach((collaborator, index) => {
      const details = []
      const printableContent = occurrence.printableDetails()
      printableContent.forEach((content) => {
        details.push({text: [{text: content.key, bold: true}, `\n ${content.value}`], margin: [0, 20, 0, 0]})
      })

      const shift = collaborator.shift !== undefined ? collaborator.shift.value : ''
      const sector = collaborator.sector !== undefined ? collaborator.sector.value : ''
      const position = collaborator.position !== undefined ? collaborator.position.value : ''
      const collaboratorOccurrences = previousOccurrences.get(collaborator._id)
      const previousOccurrencesReadable = `Total: ${collaboratorOccurrences.operative + collaboratorOccurrences.safety + collaboratorOccurrences.discipline} - ${collaboratorOccurrences.operative} operativas, ${collaboratorOccurrences.safety} seguridad, ${collaboratorOccurrences.discipline} disciplina `
      const collaboratorDetails = [
        {text: 'Colaborador: \n', style: {bold: true}, margin: [0, 70, 0, 0]},
        {text: `${collaborator.name} ${collaborator.lastname}`},
        {text: `Legajo ${collaborator.legajo}`},
        {text: `DNI ${collaborator.dni}`},
        {text: `${sector} ${shift}`},
        {text: `${position}`},
        {text: `Notificaciones previas: ${previousOccurrencesReadable}`}
      ]

      const pageContent = [
        {text: '\n\n'},
        collaboratorDetails,
        {text: '\n\n'},
        details
      ]
      content.push(pageContent)

      if (index !== occurrence.collaborators.length - 1) {
        content.push({text: '', pageBreak: 'before'})
      }
    })

    // Signatures
    const rightSignature = [
      '________________________\n\n',
      'Firma y aclaración Jefe Gerente de Fabrica\n\n',
      '________________________\n\n',
      'Firma y aclaración de Personal'
    ]

    const leftSignature = [
      '________________________\n\n',
      'Firma y aclaración Colaborador\n\n\n',
      '________________________\n\n',
      'Firma y aclaración Supervisor'
    ]
    return {
      header,
      content,
      styles: {
        header: HEADER_STYLE
      },
      footer: {
        columns: [
          {text: leftSignature, alignment: 'center', margin: [30, 70, 0, 0]},
          {text: 'Queda debidamente notificado \n\n ___ /___ /___', alignment: 'center', margin: [0, 0, 0, 0]},
          {text: rightSignature, alignment: 'center', margin: [0, 70, 30, 0]}
        ]
      },
      pageMargins: [30, 30, 30, 250],
      pageOrientation: 'portrait'
    }
  },

  getMeetingContent: function (meeting) {
    const content = []
    const header = {
      image: path.join(Const.PDF_IMAGES_PATH, 'REUNION' + '.jpg'),
      width: 600,
      height: 120
    }

    content.push({text: 'Participantes: \n', style: {bold: true}})

    meeting.collaborators.forEach((collaborator) => {
      content.push([
        {text: `${collaborator.legajo} - ${collaborator.name} ${collaborator.lastname}`}
      ])
    })
    content.push([
      {text: `${meeting.creator.legajo} - ${meeting.creator.name} ${meeting.creator.lastname}`}
    ])
    const printableContent = meeting.printableDetails()
    const detailList = []
    printableContent.forEach((content) => {
      detailList.push({text: [{text: content.key, bold: true}, `\n ${content.value}`], margin: [0, 20, 0, 0]})
    })
    content.push(detailList)
    content.push({text: '', pageBreak: 'before'})
    content.push(`Reunion del ${dateFns.format(meeting.date, 'DD/MM/YYYY')} a hora ${meeting.time}`)
    const notificationList = [{text: 'Notificado', bold: true, alignment: 'left'}]
    const nameList = [{text: 'Apellido', bold: true}]
    const presentList = [{text: 'Presente', bold: true}]
    const signatureList = [{text: 'Firma', bold: true}]

    meeting.collaborators.forEach(c => {
      nameList.push({text: `${c.legajo} - ${c.lastname}`, margin: [0, 20, 0, 0]})
      notificationList.push({text: '_____', margin: [0, 20, 0, 0]})
      presentList.push({text: '_____', margin: [0, 20, 0, 0]})
      signatureList.push({text: '_______________', margin: [0, 20, 0, 0]})
    })

    nameList.push({text: `${meeting.creator.legajo} - ${meeting.creator.lastname}`, margin: [0, 20, 0, 0]})
    notificationList.push({text: '_____', margin: [0, 20, 0, 0]})
    presentList.push({text: '_____', margin: [0, 20, 0, 0]})
    signatureList.push({text: '_______________', margin: [0, 20, 0, 0]})

    const assistanceList = {
      columns: [
        nameList,
        notificationList,
        presentList,
        signatureList
      ],
      margin: [0, 20, 0, 0],
      alignment: 'center'
    }

    content.push(assistanceList)
    return {
      header,
      content,
      styles: {
        header: HEADER_STYLE
      },
      pageMargins: [30, 140, 30, 30],
      pageOrientation: 'portrait'
    }
  }

}

function checkAsStringArray (check) {
  let checkInfo = [check[0].check.text]
  check.forEach(c => checkInfo.push(c.last ? c.last.value : ''))
  return checkInfo
}

function append (arr, val) {
  arr.push(val)
  return arr
}

function getChecksTable (checklists) {
  const headers = ['Check', 'T1']
  let checks = checklists.map(c => c.checks)
  checks = _.flatMap(checks)
  checks = _.groupBy(checks, c => c.check._id)
  checks = _.reduce(checks, (arr, c) => append(arr, checkAsStringArray(c)), [])
  return {
    table: {
      widths: ['*', 50],
      body: [headers].concat(checks)
    }
  }
}

function getRequestDataAsString (securityElements) {
  let dataTable = securityElements.items.map(obj => {
    let model = obj.model
    if (obj.colour !== '') {
      model += ' ' + obj.colour
    }
    if (obj.size !== '') {
      model += ' ' + obj.size
    }
    return [obj.type, model, obj.brand, obj.certified ? 'SI' : 'NO', obj.cant.toString(), '', '']
  })
  dataTable.forEach((data, index) => data.unshift(index + securityElements.number_request))
  return dataTable
}

function getEmployeeCompanyTable (employee) {
  const razonSocial = {text: [{text: 'Razón Social:', bold: true}, ' CERAMICA FANELLI S.A.'], colSpan: 2}
  const cuit = {text: [{text: 'Cuit:', bold: true}, ' 30-62989561-9'], colSpan: 2}
  const direccion = {text: [{text: 'Dirección:', bold: true}, ' Av. 66 e/ 177 y 179']}
  const localidad = {text: [{text: 'Localidad: ', bold: true}, 'La Plata']}
  const cp = {text: [{text: 'C.P.:', bold: true}, ' 1900']}
  const provincia = {text: [{text: 'Provincia: ', bold: true}, 'Buenos Aires']}
  const employeeName = {
    text: [{text: 'Nombre y Apellido del Trabajador: ', bold: true}, employee.lastname + ' ' + employee.name],
    colSpan: 2
  }
  const employeeDni = {text: [{text: 'D.N.I. ', bold: true}, employee.dni], colSpan: 2}
  const employeeSector = {
    text: ['Descripcion breve de los puestos de trabajo en el/los cuales se desempeña el trabajador: ', {
      text: employee.area && employee.area.value ? employee.area.value : 'Sin Area',
      bold: true
    }],
    colSpan: 2
  }
  const employeeSecurityElements = {
    text: [{
      text: 'Elementos de protección personal necesarios para el trabajador según el puesto de trabajo: ',
      bold: true
    }, employee.area && areaMap.has(employee.area.value) ? areaMap.get(employee.area.value) : ''],
    colSpan: 2
  }
  return {
    table: {
      widths: ['*', '*', '*', '*'],
      body: [
        [razonSocial, {}, cuit, {}],
        [direccion, localidad, cp, provincia],
        [employeeName, {}, employeeDni, {}],
        [employeeSector, {}, employeeSecurityElements, {}]
      ]
    }
  }
}

function getSecurityElementsTable (securityElements) {
  let securityElementsData = getRequestDataAsString(securityElements)

  let headers = ['', 'Producto', 'Tipo/Modelo', 'Marca', 'Certificación', 'Cantidad', 'Fecha de entrega', 'Firma del trabajador']

  return {
    style: 'tableExample',
    table: {
      widths: ['*', '*', '*', '*', '*', '*', '*', '*'],
      body: [headers].concat(securityElementsData)
    }
  }
}

function getCollaboratorDetails (collaborator) {
  collaborator = collaborator.toObject()
  const shift = collaborator.hasOwnProperty('shift') ? collaborator.shift.value : ''
  const sector = collaborator.hasOwnProperty('sector.value') ? collaborator.sector.value : ''
  return [
    {text: 'Colaborador: \n', style: {bold: true}},
    collaborator.name + ' ' + collaborator.lastname + '\n',
    'Legajo ' + collaborator.legajo + '\n',
    sector + ' ' + shift + '\n'
  ]
}

module.exports = pdf
