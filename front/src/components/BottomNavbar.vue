<template>
  <div class="bottom-navbar" :class="withSidebar">
    <slot></slot>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'BottomNavbar',
    computed: {
      ...mapState('ui', [
        'sidebarStatus'
      ]),
      withSidebar () {
        return {
          'with-sidebar': this.sidebarStatus
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/styles/variables";
  .bottom-navbar {
    position: fixed;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: $primary-color;
    color: white;
    text-align: center;
    box-shadow: 0 -1px 1px rgba(0, 0, 0, 0.26);
    z-index: 9;
    transition: all 0.5s;

    &.with-sidebar {
      margin-left: 280px;
      width: calc(100% - 280px);
    }
  }
</style>
