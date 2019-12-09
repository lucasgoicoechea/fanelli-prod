<template>
  <div class="error">
    <navigation :title="title"></navigation>
    <section>
      <h3>Error</h3>
    </section>
  </div>
</template>

<script>
  import Navigation from './Navigation.vue'

  export default {
    name: 'Error',
    components: {Navigation},
    data () {
      return {
        title: 'Error de Acceso'
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/styles/variables";

  section {
    margin-top: $navigation-height + 10px;
    padding: 2px 20px;
  }
</style>
