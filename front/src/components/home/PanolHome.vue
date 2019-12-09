<template>
  <div class="panol-home">
    <div class="container-fluid">
      <div class="row">
        <div class="col-xs-6 col-sm-4">
          <card-button
            :to="{ name: 'panol-catalogo' }"
            title="Edición Catalogo"
            icon="/static/img/icon-forms/catalogo.svg"></card-button>
        </div>
        <div class="col-xs-6 col-sm-4">
          <card-button
            :to="{ name: 'panol-requests' }"
            title="Solicitudes"
            icon="/static/img/icon-forms/epp-form.svg"></card-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CardButton from '@/components/CardButton.vue'

  export default {
    name: 'PanolHome',
    components: {CardButton},
    data () {
      return {}
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .container-fluid {
    width: 80%;
  }

  @media (max-width: 599px)  {
    .container-fluid {
      width: 100%;
    }
  }
</style>
