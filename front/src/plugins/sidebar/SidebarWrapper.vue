<template>
  <div class="sidebar-wrapper">
    <aside :class="['navigation-drawer', styleClass]" ref="sidebar" :style="sidebarStyle">
      <slot></slot>
    </aside>
    <div class="slider" ref="slider" :style="[sliderStyle]"></div>
    <div class="overlay" @click="toggle" :class="[showOverlay]" :style="[overlayStyle]"></div>
  </div>
</template>

<script>
  import Sidebar from '@/plugins/sidebar'

  export default {
    name: 'SidebarWrapper',
    props: {
      name: {
        type: String,
        required: true
      },
      sidebarWidth: {
        type: Number,
        default: 300
      },
      sliderWidth: {
        type: Number,
        default: 30
      },
      swipe: {
        type: Boolean,
        default: true
      },
      sidebarOverlay: {
        type: Boolean,
        default: false
      },
      sliderBackground: {
        type: String,
        default: 'transparent'
      },
      defaultVisibility: {
        type: Boolean,
        default: true
      },
      minWidthToOverlay: {
        type: Number,
        default: 720
      },
      styleClass: {
        type: String,
        default: ''
      },
      zIndexSidebar: {
        type: Number,
        default: 13
      },
      zIndexOverlay: {
        type: Number,
        default: 11
      },
      zIndexSlider: {
        type: Number,
        default: 12
      },
      sidebarBoxShadow: {
        type: String,
        default: '0 0 0 0 0 #FFF'
      }
    },
    data () {
      return {
        sidebarShow: true,
        windowWidth: window.innerWidth,
        sidebar: null,
        slider: null,
        startX: 0,
        contentPush: null
      }
    },
    created: function () {
      this.sidebarShow = this.defaultVisibility
      this.emitEvent()
    },
    beforeMount: function () {
      Sidebar.eventBus.$on('toggle', (name) => {
        if (this.name === name) {
          this.toggle()
          Sidebar.eventBus.$emit('status', this.name, this.sidebarShow)
        }
      })
      Sidebar.eventBus.$on('show', (name) => {
        if (this.name === name) {
          this.sidebarShow = true
          this.emitEvent()
          Sidebar.eventBus.$emit('status', this.name, this.sidebarShow)
        }
      })
      Sidebar.eventBus.$on('hidden', (name) => {
        if (this.name === name) {
          this.sidebarShow = false
          this.emitEvent()
          Sidebar.eventBus.$emit('status', this.name, this.sidebarShow)
        }
      })
      Sidebar.eventBus.$on('push-content', (name, el) => {
        if (this.name === name) {
          this.contentPush = el
          this.contentPush.style.transition = 'margin-left 0.3s'
          this.updateContentPush(this.sidebarShow)
        }
      })
      Sidebar.eventBus.$on('force-push-content', (name) => {
        if (this.name === name) {
          this.updateContentPush(this.sidebarShow)
        }
      })
    },
    mounted () {
      const vm = this
      this.$nextTick(() => {
        window.addEventListener('resize', () => {
          vm.windowWidth = window.innerWidth
        })
      })
      this.sidebar = this.$refs.sidebar
      this.slider = this.$refs.slider
      this.initSwipe()
    },
    destroyed: function () {},
    methods: {
      emitEvent () {
        this.$emit('onToggle', this.sidebarShow)
      },
      toggle () {
        this.sidebarShow = !this.sidebarShow
        this.emitEvent()
      },
      getEvent (e) {
        e = !e ? window.event : e
        e = ('changedTouches' in e) ? e.changedTouches[0] : e
        return e
      },
      mouseDown (e) {
        if (!this.swipe) { return }
        e = this.getEvent(e)
        this.startX = e.pageX
        this.slider.style.width = '100vw'
      },
      mouseUp (e) {
        if (!this.swipe) { return }
        e = this.getEvent(e)
        const offsetX = Math.abs(this.startX - e.pageX)
        const direction = (this.startX < e.pageX) ? 1 : -1
        if (offsetX > (this.sliderWidth / 2)) {
          this.sidebarShow = (direction > 0)
          this.emitEvent()
        }
        this.sidebar.style.transform = (this.sidebarShow) ? 'translateX(0px)' : `translateX(-${this.sidebarWidth}px)`
        this.slider.style.width = this.sliderWidth + 'px'
      },
      initSwipe () {
        this.slider.addEventListener('mousedown', this.mouseDown)
        this.slider.addEventListener('touchstart', this.mouseDown)
        this.slider.addEventListener('mouseup', this.mouseUp)
        this.slider.addEventListener('touchend', this.mouseUp)
        this.sidebar.addEventListener('mousedown', this.mouseDown)
        this.sidebar.addEventListener('touchstart', this.mouseDown)
        this.sidebar.addEventListener('mouseup', this.mouseUp)
        this.sidebar.addEventListener('touchend', this.mouseUp)
      },
      updateContentPush (status) {
        if ((!this.sidebarOverlay) && this.windowWidth > this.minWidthToOverlay) {
          this.contentPush.style.marginLeft = (status) ? `${this.sidebarWidth}px` : 0
        }
      }
    },
    computed: {
      sidebarStyle () {
        return {
          zIndex: this.zIndexSidebar,
          transform: (this.sidebarShow) ? 'translateX(0px)' : `translateX(-${this.sidebarWidth}px)`,
          boxShadow: (this.sidebarShow) ? this.sidebarBoxShadow : 'none',
          width: this.sidebarWidth + 'px'
        }
      },
      sliderStyle () {
        return {
          width: this.sliderWidth + 'px',
          backgroundColor: this.sliderBackground,
          zIndex: this.zIndexSlider
        }
      },
      overlayStyle () {
        return {
          zIndex: this.zIndexOverlay
        }
      },
      showOverlay () {
        return {
          show: this.sidebarShow && (this.sidebarOverlay || this.windowWidth < this.minWidthToOverlay)
        }
      }
    },
    watch: {
      sidebarShow: function (status) {
        this.updateContentPush(status)
      }
    }
  }
</script>

<style lang="scss" scoped>

  .sidebar-wrapper {
    position: relative;
    display: flex;
    flex-direction: row;
    user-select: none;
  }

  .navigation-drawer {
    position: fixed;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    transition: all 0.3s;
    color: white;
  }

  .slider {
    position: fixed;
    left: 0;
    width: 50px;
    height: 100vh;
    background: rgba(0, 0, 255, 0.2);
  }

  .overlay {
    display: none;
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 1;

    &.show {
      display: block;
    }
  }

  .notransition {
    -webkit-transition: none !important;
    -moz-transition: none !important;
    -o-transition: none !important;
    -ms-transition: none !important;
    transition: none !important;
  }
</style>
