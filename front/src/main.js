import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import auth from './auth'
import store from './store'
import infiniteScroll from 'vue-infinite-scroll'
import moment from 'moment'
import VueMoment from 'vue-moment'
import Acl from 'vue-acl'
import shortime from './utils/shortime'
import VueAnalytics from 'vue-analytics'
import userType from './filters/userType'
import capitalize from './filters/capitalize'
import localforage from 'localforage'
import pretty from './filters/pretty'
import Spinner from 'vue-simple-spinner'
import VModal from 'vue-js-modal'
import Croppa from 'vue-croppa'
import Constants from '@/const.js'
import Sidebar from '@/plugins/sidebar'
import VueMq from 'vue-mq'
import Vuelidate from 'vuelidate'
import VueTheMask from 'vue-the-mask'
import Snotify, { SnotifyPosition } from 'vue-snotify'
import SnotifyWrapper from '@/plugins/snotify-wrapper'
import VueI18n from 'vue-i18n'
import messages from '@/messages.js'
import VueLoading from 'vuex-loading'
import flatPickr from 'vue-flatpickr-component'

Vue.use(Croppa)

moment.locale('es')
shortime(moment)

Vue.use(VueMoment)
Vue.use(VueResource)
Vue.use(infiniteScroll)
Vue.use(Spinner)
Vue.use(VModal, {dialog: true})
Vue.use(Acl, {router: router, init: auth.getPermission().split('&')})
Vue.use(Sidebar)
Vue.use(Vuelidate)
Vue.use(VueTheMask)
Vue.use(Snotify, {
  toast: {
    position: SnotifyPosition.rightTop,
    showProgressBar: false,
    timeout: 3000
  }
})
Vue.use(VueI18n)
Vue.use(VueLoading)
Vue.use(flatPickr)

Vue.filter('userType', userType)
Vue.filter('pretty', pretty)
Vue.filter('capitalize', capitalize)

Vue.http.options.root = (window.location.hostname === 'localhost' || /(^127\.)|(^10\.)|(^172\.1[6-9]\.)|(^172\.2[0-9]\.)|(^172\.3[0-1]\.)|(^192\.168\.)/.test(window.location.hostname)) ? `http://${window.location.hostname}:3000/api/` : '/api/'

Vue.http.interceptors.push(function (request, next) {
  request.headers.set('Authorization', auth.getAuthHeader())
  next(res => {
    /* var tokine = res.headers.get('authorization')
    console.log('voy con' + tokine)
    if (typeof tokine !== 'undefined' && tokine !== undefined && tokine !== null) {
      console.log('voy a guardar' + tokine)
      auth.tokenize(tokine)
    } */
    if (res.status >= 500) {
      // SnotifyWrapper.error('Se produjo un error con el servidor')
      console.error('Server error', res)
    }
    if (res.status === 401) {
      auth.logout()
      router.go('/login')
    }
    /* if(res.status === 200 ) {
      auth.login(res.headers.get('authorization'))
    } */
  })
})

Vue.prototype.$constants = Constants

Vue.config.productionTip = false

localforage.config({
  name: 'requests',
  version: 3.0
})

Vue.use(VueMq, {
  breakpoints: {
    iphone5: 321,
    mobile: 481,
    tablet: 769,
    desktop: 993,
    large: Infinity
  }
})

if (process.env.NODE_ENV === 'production') {
  Vue.use(VueAnalytics, {
    id: 'UA-102342011-2',
    router
  })
}

const i18n = new VueI18n({
  locale: 'es', // set locale
  messages // set locale  messages
})

const vm = new Vue({
  el: '#app',
  template: '<App/>',
  components: {App},
  vueLoading: new VueLoading({useVuex: true, moduleName: 'loading', registerComponents: false}),
  router,
  store,
  i18n
})

SnotifyWrapper.setVm(vm)
Vue.prototype.$snotifyWrapper = SnotifyWrapper

if (typeof BroadcastChannel === 'function') {
  const responseChannel = new BroadcastChannel('requests-response') // eslint-disable-line
  responseChannel.onmessage = function (e) {
    store.dispatch('tasksQueue/updateTask', e.data)
  }

  const toastChannel = new BroadcastChannel('toast') // eslint-disable-line
  toastChannel.onmessage = function (toastData) {
    SnotifyWrapper.showWithType(toastData.data.msg, toastData.data.type)
  }

  window.addEventListener('offline', () => {
    SnotifyWrapper.info('Se ha perdido la conexión')
  })

  window.addEventListener('online', () => {
    const replayChannel = new BroadcastChannel('replay-requests') // eslint-disable-line
    replayChannel.postMessage('replay-online')
    SnotifyWrapper.info('Se ha recuperado la conexión')
  })
}

vm.version = '0.0.1'

