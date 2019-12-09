<template>
  <div class="form-step-1">
    <div class="container-fluid">
      <h3>Elementos de Protección Personal (EPP)</h3>
      <div class="row">
        <div class="col-xs-6 col-sm-4 col-md-3" v-for="element in filterByCategory('SEGURIDAD')">
          <form-element :element="element.type"></form-element>
        </div>
      </div>
      <h3>Vestimenta</h3>
      <div class="row">
        <div class="col-xs-6 col-sm-4 col-md-3" v-for="element in filterByCategory('VESTIMENTA')">
          <form-element :element="element.type"></form-element>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import FormElement from './FormElement.vue'
  import { mapState, mapGetters } from 'vuex'

  export default {
    name: 'form-step-1',
    components: {FormElement},
    computed: {
      ...mapGetters('catalog', [
        'filterByCategory'
      ]),
      ...mapState('catalog', [
        'data',
        'toForm',
        'catalog'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  h3 {
    font-weight: bold;
    padding: 5px 0;
    border-bottom: 4px solid $primary-color;
  }

  .container-fluid {
    width: 80%;
  }

  @media (min-width: 600px) and (max-width: 1200px) {
    .container-fluid {
      width: 90%;
    }
  }

  @media (max-width: 599px)  {
    .container-fluid {
      width: 100%;
    }
  }
</style>
