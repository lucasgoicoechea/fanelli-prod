<template>
  <div class="personal-home">
    <div class="container-fluid">
      <div class="row">
        <div class="col-xs-6 col-sm-4">
          <card-button
            :to="{ name: 'report-news' }"
            title="Agregar novedad"
            icon="/static/img/icon-control-panel/personalctrl.svg"></card-button>
        </div>
        <div class="col-xs-6 col-sm-4">
          <card-button
            :to="{ name: 'controlPersonal' }"
            title="Panel de control"
            icon="/static/img/icon-forms/control-panel.svg"></card-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CardButton from '@/components/CardButton.vue'

  export default {
    name: 'PersonalHome',
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
