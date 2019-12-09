import Constant from '@/const.js'

const userType = function (value) {
  if (!value) return ''
  const roles = Constant.USER_TYPE_READABLE
  if (roles.hasOwnProperty(value)) {
    return roles[value]
  } else {
    return value
  }
}
export default userType
