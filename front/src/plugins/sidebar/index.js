import SidebarWrapper from '@/plugins/sidebar/SidebarWrapper'

const Sidebar = {
  install (Vue, options) {
    this.eventBus = new Vue()
    this.status = {}
    this.eventBus.$on('status', (name, status) => {
      this.status[name] = status
    })

    Vue.component(SidebarWrapper.name, SidebarWrapper)

    Vue.mixin({
      mounted () {}
    })

    Vue.directive('sidebar-push', function (el, binding) {
      Sidebar.eventBus.$emit('push-content', binding.value.name, el)
    })

    Vue.prototype.$Sidebar = {
      log () { },
      ping () {
        Sidebar.eventBus.$emit('ping')
      },
      toggle (name) {
        Sidebar.eventBus.$emit('toggle', name)
      },
      show (name) {
        Sidebar.eventBus.$emit('show', name)
      },
      hidden (name) {
        Sidebar.eventBus.$emit('hidden', name)
      },
      forcePushContent (name) {
        Sidebar.eventBus.$emit('force-push-content', name)
      },
      status (name) {
        return Sidebar.status[name]
      }
    }
  }
}
export default Sidebar
