<template>
  <card-container @click.native="goToRequest(request)">
    <card-header :headerBackground="bugReportTypeColor(request)" :subHeaderBackground="bugReportTypeSubColor(request)">
      <p style="color: black" slot="header">Estado de falla: {{ bugReportType(request) }}
        <span v-show="showObservationSection(request)"></span>
        <span v-if="betada(request)"><img  src="/static/img/checklists/tick.svg" alt="">(OT)</span>
        <img v-if="!betada(request)" src="/static/img/checklists/cross.svg" alt="">
      </p>
      <p slot="subHeader" v-if="approved(request)">Por {{ request.approved_by.lastname }}</p>
      <p slot="subHeader" v-if="denied(request)">Por {{ request.approved_by.lastname }}</p>
    </card-header>
    <card-section>

      <p slot="content">
        <span class="time">{{ request.updated_at | moment("DD/MM/YY - hh:mm a") }} - <span class="time">{{ request.line }}</span> - <span class="time">{{ request.sector }}</span> - <span class="time">{{ request.sub_sector }}</span> - <span class="time">{{ request.detectado }}</span> - <span class="time">{{ request.resuelto }}</span> </span></p>
        <img v-if="betada(request)" src="/static/img/checklists/tick.svg" alt="">
        <img v-if="!betada(request)" src="/static/img/checklists/cross.svg" alt="">
      <p slot="content">
        
         </p>
      <p slot="content">
         </p>     
    </card-section>
  </card-container>
</template>

<script>
  import auth from '@/auth'
  import CardContainer from '@/components/cards/CardContainer.vue'
  import CardHeader from '@/components/cards/CardHeader.vue'
  import CardSection from '@/components/cards/CardSection.vue'
  import CardFooter from '@/components/cards/CardFooter.vue'
  import Spinner from '@/components/SpinnerWrapper.vue'
  import SpinnerLittle from '@/components/Spinner.vue'

  import Const from '@/const.js'
  import authorize from '@/utils/authorize'

  const {ROLES} = Const

  export default {
    name: 'BugReportCardJobRequest',
    components: {CardContainer, CardHeader, CardSection, CardFooter, Spinner, SpinnerLittle},
    props: {
      request: {
        type: Object,
        required: true
      }
    },
    methods: {
      fetch () {
        // this.bugReport.loading = true
        const action = 'bugReport/fetchActiveBetadas'
        this.$store.dispatch(action, {})
          .then(this.successFetch)
          .catch(this.failFetch)
      },
      goToRequest (req) {
        this.$router.push({name: 'bugReport-request', params: {id: req._id}})
      },
      received (req) {
        return !req.hasOwnProperty('approved')
      },
      betada (req) {
        return req.hasOwnProperty('betadas') && req.betadas
      },
      denied (req) {
        return req.hasOwnProperty('approved') && !req.approved
      },
      approved (req) {
        return req.hasOwnProperty('approved') &&
          req.approved &&
          req.hasOwnProperty('resolved') &&
          !req.resolved
      },
      pending (req) {
        return req.hasOwnProperty('resolved') &&
          req.resolved &&
          req.hasOwnProperty('delivered') &&
          !req.delivered
      },
      delivered (req) {
        return req.hasOwnProperty('delivered') && req.delivered
      },
      bugReportType (request) {
        if (request.estado === 'SOLUCIONADO') return this.$constants.BUG_REPORT_ESTADO.SOLUCIONADO
        if (request.estado === 'NO_SOLUCIONADO') return this.$constants.BUG_REPORT_ESTADO.NO_SOLUCIONADO
        if (request.estado === 'SOLUCION_TEMPORAL') return this.$constants.BUG_REPORT_ESTADO.SOLUCION_TEMPORAL
        /* if (this.received(request)) return 'Pendiente de aprobación'
        if (this.denied(request)) return 'Denegada'
        if (this.approved(request)) return 'Aprobada'
        if (this.pending(request)) return 'Pendiente de entrega'
        if (this.delivered(request)) return 'Entregada'
        else return 'Estado' */
      },
      // ACOMODAR LOS COLORES DE LA PRIORIDAD
      bugReportTypeColor (request) {
        if (request.estado === 'SOLUCIONADO') return '#65c25a'
        if (request.estado === 'NO_SOLUCIONADO') {
          if (this.betada(request)) {
            return '#c7b032'
          } else {
            return '#f86567'
          }
        }
        if (request.estado === 'SOLUCION_TEMPORAL') return '#e28c44'
      },
      bugReportTypeSubColor (request) {
        if (this.received(request)) return '#2b4a9f'
        if (this.denied(request)) return '#f78384'
        if (this.approved(request)) return '#a2da9b'
        if (this.pending(request)) return '#3c7ed9'
        if (this.delivered(request)) return '#fbc697'
        else return '#e2cea4'
      },
      reject (req) {
        const action = () => {
          this.$store.dispatch('bugReport/approvalById', {
            id: req._id,
            approved: false,
            user: auth.getUser()
          })
          .then(r => { window.location.reload() })
        }
        this.confirmation('¿Esta seguro de RECHAZAR esta solicitud?', action)
      },
      accept (req) {
        const action = () => {
          this.$store.dispatch('bugReport/approvalById', {
            id: req._id,
            approved: true,
            user: auth.getUser()
          })
          .then(r => { window.location.reload() })
        }
        this.confirmation('¿Esta seguro de APROBAR esta solicitud?', action)
      },
      showObservationSection (request) {
        return request.betadas
      },
      confirmation (text, action) {
        this.$modal.show('dialog', {
          title: 'Confirmación',
          text: text,
          buttons: [
            {
              title: 'Aceptar',
              handler: () => {
                action()
                this.$modal.hide('dialog')
              }
            },
            {
              title: 'Cancelar',
              default: true,
              handler: () => { this.$modal.hide('dialog') }
            }
          ]
        })
      }
    },
    computed: {
      permission: function () {
        return authorize(ROLES.JEFES)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  p {
    margin: 0;
  }

    img {
      height: 20px;
      width: 20px;
    }

  button {
    margin: 2px 0;
    padding: 4px 16px;
    text-decoration: none;
    border: none;
    border-radius: 50px;
    color: white;

    img {
      height: 20px;
      width: 20px;
    }

    &.accept {
      background-color: #65c25a;
    }
    &.reject {
      background-color: #f86567;
    }

    &:disabled {
      cursor: not-allowed;
    }
  }

  .time {
    font-family: monospace;
  }

  .cards-container {
    height: 100%;
  }

</style>