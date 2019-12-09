<template>
  <div class="tab-content profile-information">
    <h3>Novedades</h3>
    <div class="container-fluid">
      ...
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'ProfileActivity',
    computed: {
      ...mapState('users', [
        'user'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  h3 {
    background-color: #8558AF;
    color: #FFF;
    margin: 0;
    padding: 10px;
    font-weight: bold;
    font-size: 18px;
  }

  @media (min-width: 481px) {
    h3 {
      display: none;
    }
  }
</style>
