const isEmpty = (obj) => {
  return Object.keys(obj).length === 0
}

const empty = {
  string: (value) => {
    return value.length !== 0
  },
  object: isEmpty,
  array: isEmpty
}

export default empty
