/* eslint-disable no-unused-vars */
import { SnotifyPosition } from 'vue-snotify'
import Constants from '@/const.js'

const SnotifyWrapper = (function () {
  var vm = {}

  return {
    setVm (vm) {
      this.vm = vm
    },

    isTabletOrMobile () {
      return (this.vm.$mq === 'mobile' || this.vm.$mq === 'tablet')
    },

    showWithType (msg, type) {
      switch (type) {
        case Constants.toast_types.SUCCESS:
          this.success(msg)
          break
        case Constants.toast_types.ERROR:
          this.error(msg)
          break
        case Constants.toast_types.INFO:
          this.info(msg)
          break
        case Constants.toast_types.WARNING:
          this.warning(msg)
          break
        default: {
          this.info(msg)
        }
      }
    },

    success (params) {
      if (this.isTabletOrMobile()) {
        this.vm.$snotify.success(params, {position: SnotifyPosition.centerTop})
      } else {
        this.vm.$snotify.success(params)
      }
    },

    error (params) {
      if (this.isTabletOrMobile()) {
        this.vm.$snotify.error(params, {position: SnotifyPosition.centerTop})
      } else {
        this.vm.$snotify.error(params)
      }
    },

    warning (params) {
      if (this.isTabletOrMobile()) {
        this.vm.$snotify.warning(params, {position: SnotifyPosition.centerTop})
      } else {
        this.vm.$snotify.warning(params)
      }
    },

    info (params) {
      if (this.isTabletOrMobile()) {
        this.vm.$snotify.info(params, {position: SnotifyPosition.centerTop})
      } else {
        this.vm.$snotify.info(params)
      }
    }
  }
}())
export default SnotifyWrapper
