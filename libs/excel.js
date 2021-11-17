const Excel = require('exceljs')
const dateFns = require('date-fns')
const _ = require('lodash')

module.exports = {
  /**
   *
   * @param {Object} event
   * @param {Date[]} event.dates array containing dates
   * @param {String} event.type event type
   * @param {String} event.data array with the event information
   * @param {Object} collaborator collaborator
   * @param sheet
   * @return {*}
   */
  addEvent: function (event, collaborator, sheet) {
    return sheet.addRow([`${collaborator.lastname} ${collaborator.name}`, event.dates[0], event.type, event.data])
  },
  addMaterial: function (total, sheet) {
    return sheet.addRow([total.sector, total.fecha, total.turno, total.schedule,total.unidades, total.toneladas, total.material, total.machine])
  },
  addEventsByDay: function (event, collaborator, sheet) {
    event.dates.forEach(day => {
      sheet.addRow([`${collaborator.lastname} ${collaborator.name}`, day, event.type, event.data])
    })
  },
  addEventsByDayFilter: function (event, collaborator, sheet,dayFilter) {
    event.dates.forEach(day => {
      if (dateFns.isEqual(dayFilter, day)) {
        //console.log('llegue2')
        sheet.addRow([`${collaborator.lastname} ${collaborator.name}`, day, event.type, event.data])
      }
    })
  },
  toMaterialExcelObject: function (material) {
    const excelObject = {
      sector: '',
      fecha: '',
      turno: '',
      schedule: '',
      material: '',
      unidades: '',
      toneladas: '',
      machine: '',
      pesoLadrillo: ' ',
      tiempoMarcha: '',
      palletReposicion: ''
    }
    
    excelObject.sector = material.sector
    excelObject.fecha = material.fecha
    excelObject.turno =  material.turno
    excelObject.schedule = material.schedule
    excelObject.material = material.material
    excelObject.unidades = material.unidades
    excelObject.toneladas = material.toneladas
    excelObject.machine = material.machine
    excelObject.pesoLadrillo = material.pesoLadrillo
    excelObject.tiempoMarcha = material.tiempoMarcha
    excelObject.palletReposicion = material.palletReposicion
    return excelObject
  },
  addMaterialByDayFilter: function (material, sheet) {
    const eventsOrdered = this.toMaterialExcelObject(material)
    this.addMaterial(eventsOrdered, sheet)
    return sheet
  },
  colorRow: function (row, color) {
    row.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        bgColor: {argb: color},
        fgColor: {argb: color}
      }
    })
  },
  /**
   *
   * @param {Object} data to fill sheet
   * @param {Object} data.collaborator collaborator data
   * @param {Object[]} data.events collaborator events
   * @param sheet
   * @return {*}
   */
  addDataToSheetForCollaborator: function (data, sheet) {
    const eventsOrdered = data.events
      .map(e => e.toExcelObject())
      .sort((pre, act) => dateFns.compareAsc(pre.date, act.date))
    eventsOrdered.forEach(event => {
      this.addEvent(event, data.collaborator, sheet)
    })
    return sheet
  },
  /**
   * @param {Object[]} data
   * @param {Object[]} data[].events
   * @param {Object[]} data[].collaborator
   */
  generateExcel: function (data) {
    const wb = new Excel.Workbook()
    let sheet = wb.addWorksheet('Reporte')
    sheet.columns = [
      {header: 'Nombre', key: 'name', width: 20},
      {header: 'Fecha', key: 'date', width: 15},
      {header: 'Tipo.', key: 'type', width: 25, outlineLevel: 1},
      {header: 'Descripcion.', key: 'description', width: 160, outlineLevel: 1}
    ]
    this.colorRow(sheet.getRow(1), 'FFFFA420')
    data.forEach(d => {
      sheet = this.addDataToSheetForCollaborator(d, sheet)
    })
    sheet.autoFilter = {
      from: 'A1',
      to: 'C1'
    }
    return wb
  },

  /**
   * @param {Object[]} data
   * @param {Object[]} data[].events
   * @param {Object[]} data[].collaborator
   */
  generateExcelMultipleCollaborators: function (data) {
    const wb = new Excel.Workbook()
    let sheet = wb.addWorksheet('Reporte')
    sheet.columns = [
      {header: 'Nombre', key: 'name', width: 20},
      {header: 'Fecha', key: 'date', width: 15},
      {header: 'Tipo.', key: 'type', width: 25, outlineLevel: 1},
      {header: 'Descripcion.', key: 'description', width: 160, outlineLevel: 1}
    ]
    this.colorRow(sheet.getRow(1), 'FFFFA420')
    data.forEach(d => {
      d.events
      .map(e => e.toExcelObject())
      .forEach(eventExcelObject => {
        this.addEventsByDay(eventExcelObject, d.collaborator, sheet)
      })
    })
    sheet.autoFilter = {
      from: 'A1',
      to: 'C1'
    }
    sheet.getColumn(2).alignment = {
      vertical: 'center',
      horizontal: 'center'
    }
    return wb
  },

   /**
   * @param {Object[]} data
   * @param {Object[]} data[].events
   * @param {Object[]} data[].collaborator
   */
  generateExcelMultipleCollaboratorsByDay: function (data,day) {
    const wb = new Excel.Workbook()
    let sheet = wb.addWorksheet('Reporte')
    sheet.columns = [
      {header: 'Nombre', key: 'name', width: 20},
      {header: 'Fecha', key: 'date', width: 15},
      {header: 'Tipo.', key: 'type', width: 25, outlineLevel: 1},
      {header: 'Descripcion.', key: 'description', width: 160, outlineLevel: 1}
    ]
    this.colorRow(sheet.getRow(1), 'FFFFA420')
    console.log('llegue2')
    if (data.length > 0 ) {
      data.forEach(d => {
        d.events
        .map(e => e.toExcelObject())
        .forEach(eventExcelObject => {
          this.addEventsByDayFilter(eventExcelObject, d.collaborator, sheet, day)
        })
      })
    }
    sheet.autoFilter = {
      from: 'A1',
      to: 'C1'
    }
    sheet.getColumn(2).alignment = {
      vertical: 'center',
      horizontal: 'center'
    }
    return wb
  },

    /**
   * @param {Object[]} data
   * @param {Object[]} data[].events
   * @param {Object[]} data[].collaborator
   */
  generateExcelSupervisionPartByDay: function (data) {
    const wb = new Excel.Workbook()
    let sheet = wb.addWorksheet('Reporte')
    sheet.columns = [
      {header: 'Sector', key: 'sector', width: 15},
      {header: 'Fecha', key: 'date', width: 15},
      {header: 'Turno', key: 'turno', width: 20},
      {header: 'Turno', key: 'schedule', width: 25, outlineLevel: 1},
      {header: 'Unidades', key: 'unidades', width: 30, outlineLevel: 1},
      {header: 'Toneladas', key: 'toneladas', width: 30, outlineLevel: 1},
      {header: 'Tipo', key: 'material', width: 25, outlineLevel: 1},
      {header: 'Maquina', key: 'machine', width: 25, outlineLevel: 1}
    ]
    this.colorRow(sheet.getRow(1), 'FFFFA420')
    if (data.length > 0 ) {
      data.forEach(d => {
        sheet = this.addMaterialByDayFilter(d, sheet)
        })
    }
    
    /*sheet.autoFilter = {
      from: 'A1',
      to: 'C1'
    }
    sheet.getColumn(2).alignment = {
      vertical: 'center',
      horizontal: 'center'
    }*/
    return wb
  }
}
