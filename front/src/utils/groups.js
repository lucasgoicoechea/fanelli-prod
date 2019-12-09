let toString = Object.prototype.toString
function isFunction (o) { return toString.call(o) === '[object Function]' }

/**
 * @param list = list to group
 * @param prop = group by prop
 * @return An Object where each prop is a group lists.
 */
function group (list, prop) {
  return list.reduce(function (grouped, item) {
    const key = isFunction(prop) ? prop.apply(this, [item]) : item[prop]
    grouped[key] = grouped[key] || []
    grouped[key].push(item)
    return grouped
  }, {})
}

export default group
