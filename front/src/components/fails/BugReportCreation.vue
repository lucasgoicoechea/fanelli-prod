<template>
  <div class="bug-report-creation">
    <navigation
      :title="title"></navigation>

    <form-component
      @update="update"
      @fetchRelations="fetchRelations"
       ></form-component>
  <div :v-if="hayRelacionadas" sytle="margin-bottom: 100px;" >
    REPORTES RELACIONADOS ACTIVOS
      <bugReport-card-new-tab
        v-for="request in bugReportListDelivered"
        :key="request._id"
        :request="request">
      </bugReport-card-new-tab>
    </div>
    <bottom-navbar>
      <div class="submit">
        <div
          v-if="!loading"
          class="msg pointer"
          @click="confirm">
          <h5 class="items">Reporte falla</h5>
          <span class="glyphicon glyphicon-send items icon-action"></span>
        </div>

        <div class="msg" v-else>
          <h5 class="items">Reportando falla</h5>
          <spinner
            class="items"
            :show="loading"></spinner>
        </div>
      </div>
    </bottom-navbar>
  
  </div>
  
</template>

<script>
  import Navigation from '@/components/Navigation.vue'
  import BottomNavbar from '@/components/BottomNavbar.vue'
  import Spinner from '@/components/SpinnerWrapper.vue'
  import FormComponent from '@/components/fails/BugReportForm'
  import BugReportCardNewTab from '@/components/fails/BugReportCardNewTab'

  export default {
    name: 'BugReportCreation',
    components: {
      BottomNavbar,
      Navigation,
      Spinner,
      FormComponent,
      BugReportCardNewTab
    },
    data () {
      return {
        title: 'Fallas',
        form: {},
        validation: {},
        loading: false,
        sendStoreAction: 'bugReport/create',
        bugReportListDelivered: [],
        line: '',
        sector: '',
        sub_sector: '',
        equipo: '',
        hayRelacionadas: false
      }
    },
    methods: {
      update (data) {
        this.form = data.form
        this.validation = data.validation
      },
      showModal ({title, msg}) {
        this.$modal.show('dialog', {
          title: title,
          text: msg,
          buttons: [{title: 'Aceptar'}]
        })
      },
      successfulCreation (res) {
        this.loading = false
        if (res.success) {
          this.$snotifyWrapper.success('La falla se ha creado con exito')
          this.$router.push({name: 'bug-report-solicitudes-reparacion'})
        } else {
          this.$snotifyWrapper.error(res.message)
        }
      },
      failedCreation () {
        this.loading = false
        this.$snotifyWrapper.warning('Se produjo un error. Intente nuevamente')
      },
      send () {
        this.loading = true
        this.$store.dispatch(this.sendStoreAction, this.form)
          .then(this.successfulCreation)
          .catch(this.failedCreation)
      },
      fetchRelations () {
        // this.bugReport.loading = true
        console.log('buscando relacionadas')
        this.bugReportListDelivered = []
        this.hayRelacionadas = false
        const action = 'bugReport/fetchActiveRelacionadas'
        this.$store.dispatch(action,
          {
            line: this.line.text,
            sector: this.sector.text,
            sub_sector: this.sub_sector.text,
            equipo: this.equipo.text
          })
          .then(this.successFetchR)
          .catch(this.failFetchR)
      },
      successFetchR (response) {
        if (response.bugReports.length === 0) {
          // this.bugReport.lastOne = true
          console.log('vacio')
        } else {
          this.hayRelacionadas = true
          console.log('tiene')
          response.bugReports.forEach(e => {
            this.bugReportListDelivered.push(e)
          })
          // this.bugReport.page += 1
        }
        // this.bugReport.loading = false
      },
      failFetchR (error) {
        this.$snotifyWrapper.error(error)
        // this.bugReport.loading = false
      },
      confirm () {
        if (this.loading) {
          return
        }

        if (!this.validation.valid) {
          this.showModal({title: 'Completar', msg: this.validation.msg})
          return
        }

        this.$modal.show('dialog', {
          title: 'Confirmación',
          text: '¿Esta seguro de generar esta falla?',
          buttons: [
            {
              title: 'Aceptar',
              handler: () => {
                this.$modal.hide('dialog')
                this.send()
              }
            },
            {
              title: 'Cancelar',
              handler: this.$modal.hide('dialog')
            }
          ]
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/_variables.scss";
  @import "~@/assets/styles/_mixins.scss";

  .msg {
    display: flex;
    flex-direction: row;
    padding: 18px;

    &.pointer {
      cursor: pointer;
    }

    .items {
      padding: 0 5px;
      font-weight: bold;
    }

    .icon-action {
      font-size: 34px;
    }
  }
</style>