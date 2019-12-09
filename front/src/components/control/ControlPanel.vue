<template>
  <div class="control-panel">
    <navigation title="Panel de Control"></navigation>
    <router-view></router-view>
  </div>
</template>

<script>
  import Navigation from '../Navigation.vue'

  export default {
    components: {Navigation},
    name: 'ControlPanel'
  }
</script>
<style lang="scss" scoped>

</style>
