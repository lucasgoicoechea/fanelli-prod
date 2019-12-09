import jwtDecode from 'jwt-decode'

const TOKEN_NAME = 'cf-token'
const USER_SUBSCRIPTION = 'user_subscription'

/*
  auth set and get user's information at localstorage.
  auth allow get information about current logged user
  after the windows has been refreshing.
 */

export default {
  token () {
    return localStorage.getItem(TOKEN_NAME)
  },
  login (user) {
    localStorage.setItem(TOKEN_NAME, user.token)
  },
  checkAuth () {
    const token = this.token()
    return !!token
  },
  logout () {
    localStorage.removeItem(TOKEN_NAME)
  },
  getAuthHeader () {
    return 'Bearer ' + this.token()
  },
  getPermission () {
    const token = this.token()
    return (token) ? jwtDecode(token).user_type + '&any' : 'any'
  },
  getUser () {
    const token = this.token()
    return (token !== null) ? jwtDecode(token) : {}
  },
  setUserSubscription (id) {
    localStorage.setItem(USER_SUBSCRIPTION, id)
  },
  getUserSubscription () {
    return localStorage.getItem(USER_SUBSCRIPTION)
  },
  removeUserSubscription () {
    localStorage.removeItem(USER_SUBSCRIPTION)
  }
}
