<template>
  <medic-inform-base>
    <div slot="file">
      <h3>Archivo de informe</h3>
    </div>
    <div slot="action">
      <h3>Acción</h3>
    </div>
    <div slot="observations">
      <h3>Observaciones de Oficina de Personal</h3>
    </div>
  </medic-inform-base>
</template>

<script>
  import MedicInformBase from '@/components/news/NewsMedicInformBase.vue'

  export default {
    name: 'MedicInformControl',
    components: {MedicInformBase}
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
