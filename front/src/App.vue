<template>
  <div id="app">
    <vue-snotify></vue-snotify>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style lang="scss">
  @import './assets/styles/app';

  #app {
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
</style>
