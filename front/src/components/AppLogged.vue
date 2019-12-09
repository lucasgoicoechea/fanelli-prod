<template>
  <div id="app-logged">
    <sidebar-wrapper
      name="sidebar"
      :sidebarWidth="280"
      :zIndexSlider="9"
      :zIndexSidebar="12"
      :zIndexOverlay="11"
      :swipe="sidebarSwipe"
      sidebarBoxShadow="-1px 0 15px 0 #555"
      :defaultVisibility="false"
      @onToggle="toggleSidebar">
      <sidebar-content></sidebar-content>
    </sidebar-wrapper>
    <main v-sidebar-push="{name: 'sidebar'}">
      <router-view></router-view>
    </main>
    <v-dialog></v-dialog>
  </div>
</template>

<script>
  import SidebarContent from '@/components/SidebarContent.vue'
  import StaffRequestAcceptModal from './control/staffRequests/AcceptModal'

  export default {
    name: 'app',
    components: {
      StaffRequestAcceptModal,
      SidebarContent
    },
    data () {
      return {
        sidebarSwipe: false
      }
    },
    methods: {
      toggleSidebar (status) {
        this.$store.commit('ui/setSidebarStatus', status)
      }
    },
    mounted () {
      if (this.$mq === 'desktop' || this.$mq === 'large') {
        this.$Sidebar.show('sidebar')
        this.$Sidebar.forcePushContent('sidebar')
        this.sidebarSwipe = false
      } else {
        this.sidebarSwipe = true
      }
    },
    watch: {
      '$mq' (newSize) {
        switch (newSize) {
          case 'desktop':
          case 'large':
            this.$Sidebar.show('sidebar')
            this.sidebarSwipe = false
            break
          case 'mobile':
          case 'tablet':
            this.$Sidebar.hidden('sidebar')
            this.sidebarSwipe = true
            break
          default:
            this.$Sidebar.show('sidebar')
            this.sidebarSwipe = false
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '../assets/styles/app';
  @import '../assets/styles/variables';

  #app-logged {
    display: flex;
    position: relative;
    height: 100%;
  }

  main {
    flex: 1;
    height: 100%;
    width: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
  }

  .snotify-rightTop {
    top: $navigation-height;
  }

  .snotify-centerTop {
    top: $navigation-height;
  }

  * {
    -webkit-overflow-scrolling: touch;
  }
</style>
