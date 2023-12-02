<template>
  <generic-license-base>
    <div slot="license-type">
      <h3>Tipo de licencia</h3>
    </div>
    <div slot="date-from">
      <h3>Fecha desde</h3>
    </div>
    <div slot="date-to">
      <h3>Fecha hasta</h3>
    </div>
    <div slot="observations">
      <h3>Observaciones</h3>
    </div>
  </generic-license-base>
</template>

<script>
  import GenericLicenseBase from '@/components/news/NewsGenericLicenseBase.vue'

  export default {
    name: 'GenericLicenseControl',
    components: {GenericLicenseBase},
    data () {
      return {}
    }
  }
</script>

<style lang="scss" scoped>

  @import "/../../assets/styles/variables";

  h3 {
    width: 100%;
    font-weight: bold;
    border-bottom: 3px solid $primary-color;
    margin: 18px 0;
  }

  .date-input {
    margin-top: 3px;
    width: 170px;
    color: #d3d3d3;
  }

  .observations-input {
    margin-top: 5px;
    border: 2px solid orangered;
    width: 100%;
    display: block;
    min-height: 100px;
  }

  ul li .check {
    display: block;
    position: absolute;
    border: 5px solid $primary-light;
    border-radius: 100%;
    height: 35px;
    width: 35px;
    top: 15px;
    left: 15px;
    z-index: 5;
  }

  ul li .check::before {
    display: block;
    position: absolute;
    content: '';
    border-radius: 100%;
    height: 15px;
    width: 15px;
    top: 5px;
    left: 5px;
    margin: auto;
  }

  input[type=radio]:checked ~ .check {
    border: 5px solid $primary-light;
  }

  input[type=radio]:checked ~ .check::before {
    background: $primary-light;
  }

  input[type=radio]:checked ~ label {
    color: $primary-light;
  }

</style>
