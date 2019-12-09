const users = require(__dirname + '/users.json')
const fs = require('fs')
const parseDate = date => '19' + date.split('/')[2] + '-' + date.split('/')[1] + '-' + date.split('/')[0]

users.forEach(u => {
  u.incorporation_date = parseDate(u.incorporation_date)

  u.birthdate = parseDate(u.birthdate)

  if (u.area === 'Of. Técnica') {
    u.area = 'oficina tecnica'
  }

  u.area = u.area.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(' ', '_').replace('.', '')

  if (u.area === 'PANOL') {
    u.area = 'PAÑOL'
  }

  if (u.line === '') {
    delete u.line
  }
  if (u.area === '') {
    delete u.area
  }
  if (u.sector === '') {
    delete u.sector
  }
  if (u.position === '') {
    delete u.position
  }
  if (u.shift === '') {
    delete u.shift
  }
  if (u.ING_ANTERIOR === '') {
    delete u.ING_ANTERIOR
  }
  if (u.ANT_ANTERIOR === '') {
    delete u.ANT_ANTERIOR
  }

  const name = u.name.toLowerCase().split(' ')
  if (u.position === 'Supervisor de turno') {
    u.auth = {
      username: name[0] + '_' + name[1],
      password: name[0] + '_' + name[1]
    }
    u.user_type = 'SUPERVISOR'
  }

  if (u.position === 'Supervisor de linea') {
    u.auth = {
      username: name[0] + '_' + name[1],
      password: name[0] + '_' + name[1]
    }
    u.user_type = 'JEFE_LINEA'
  }

  if (u.position === 'Sup de Fabrica') {
    u.auth = {
      username: name[0] + '_' + name[1],
      password: name[0] + '_' + name[1]
    }
    u.user_type = 'JEFE_PLANTA'
  }

  if (u.position === 'Sup Pañol') {
    u.auth = {
      username: name[0] + '_' + name[1],
      password: name[0] + '_' + name[1]
    }
    u.user_type = 'PANOL'
  }
})
fs.writeFile('userDateParsed.json', JSON.stringify(users))
