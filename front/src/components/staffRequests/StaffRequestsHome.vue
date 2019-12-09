<template>
  <div class="staff-requests-home">
    <navigation :title="title"></navigation>
    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-xs-6 col-sm-4">
            <card-button
              :to="{ name: 'staff-requests-permission' }"
              icon="/static/img/icons-staff-request/permisos_padding.svg"
              title="Permisos"></card-button>
          </div>
          <div class="col-xs-6 col-sm-4">
            <card-button
              :to="{ name: 'staff-requests-changes-hours' }"
              icon="/static/img/icons-staff-request/cambio_hora_padding.svg"
              title="Cambios de horario"></card-button>
          </div>
          <div class="col-xs-6 col-sm-4">
            <card-button
              :to="{ name: 'staff-requests-extra-hours' }"
              icon="/static/img/icons-staff-request/horas_extras_padding.svg"
              title="Horas Extras"></card-button>
          </div>
          <div class="col-xs-6 col-sm-4">
            <card-button
              :to="{ name: 'occurrence-creation' }"
              iconPadding="25px"
              icon="/static/img/icon-occurrence/acontecimiento.svg"
              title="Acontecimientos"></card-button>
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
    name: 'StaffRequestsHome',
    components: {
      CardButton,
      Navigation
    },
    data () {
      return {
        title: 'Solicitudes'
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
