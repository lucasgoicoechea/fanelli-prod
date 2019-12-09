<template>
  <div class="report-news">
    <navigation :title="title"></navigation>
    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-xs-6 col-sm-4">
            <card-button
              :to="{ name: 'report-news-tarde' }"
              icon="/static/img/icons-novedades/tarde.svg"
              title="Ingreso tarde"></card-button>
          </div>
          <div class="col-xs-6 col-sm-4">
            <card-button
              :to="{ name: 'report-news-falta' }"
              icon="/static/img/icons-novedades/falta.svg"
              title="Falta"></card-button>
          </div>
          <div class="col-xs-6 col-sm-4">
            <card-button
              :to="{ name: 'report-news-early' }"
              icon="/static/img/icons-novedades/saleantes.svg"
              title="Salida temprana"></card-button>
          </div>
          <div class="col-xs-6 col-sm-4">
            <card-button
              :to="{ name: 'report-news-accident' }"
              icon="/static/img/icons-novedades/accidentes.svg"
              title="Accidente"></card-button>
          </div>

          <div class="col-xs-6 col-sm-4">
            <card-button
              :to="{ name: 'report-news-observation' }"
              icon="/static/img/icon-control-panel/personalctrl.svg"
              title="Observación"></card-button>
          </div>

          <div v-if="$can($constants.ROLES.ADMINISTRACION)" class="col-xs-6 col-sm-4">
            <card-button
              :to="{ name: 'report-news-sanction' }"
              icon="/static/img/icon-control-panel/sanction.svg"
              title="Sanción"></card-button>
          </div>

          <div v-if="$can($constants.ROLES.ADMINISTRACION)" class="col-xs-6 col-sm-4">
            <card-button
              :to="{ name: 'report-news-scheduled' }"
              icon="/static/img/icons-novedades/scheduled.svg"
              title="Novedad de Personal"></card-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import Navigation from '@/components/Navigation.vue'
  import CardButton from '../CardButton.vue'

  export default {
    name: 'ReportNews',
    components: {
      CardButton,
      Navigation
    },
    data () {
      return {
        title: 'Agregar novedades'
      }
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
