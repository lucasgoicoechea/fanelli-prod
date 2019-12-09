var pretty = function (value) {
  if (!value) return ''
  value = value.toLowerCase().replace(/[_-]+/g, ' ').replace(/\s{2,}/g, ' ').trim()
  value = value.charAt(0).toUpperCase() + value.slice(1)
  return value
}
export default pretty
