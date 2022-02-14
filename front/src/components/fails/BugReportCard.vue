<template>
  <card-container @click.native="goToRequest(request)">
    <card-header :headerBackground="bugReportTypeColor(request)" :subHeaderBackground="bugReportTypeSubColor(request)">
      <p slot="header">Estado de falla: {{ bugReportType(request) }}</p>
      <p slot="subHeader" v-if="approved(request)">Por {{ request.approved_by.lastname }}</p>
      <p slot="subHeader" v-if="denied(request)">Por {{ request.approved_by.lastname }}</p>
    </card-header>
    <card-section>
      <p slot="content">
        <span class="time">{{ request.updated_at | moment("DD/MM/YY - hh:mm a") }}, <span class="time">{{ request.line }}</span></span>, <span class="time">{{ request.sector }}</span>, <span class="time">{{ request.sub_sector }}</span> </p>
      <p slot="content">
         </p>
      <p slot="content">
         </p>
      <!--<div @click.stop slot="actions" v-if="received(request)" v-show="$can(permission)">
        <button class="reject" @click="reject(request)" :disabled="request.rejectLoading || request.acceptLoading">
          <img v-if="!request.rejectLoading" src="/static/img/checklists/cross.svg" alt="">
          <spinner-little v-else :show="request.rejectLoading"></spinner-little>
        </button>
        <button class="accept" @click="accept(request)" :disabled="request.rejectLoading || request.acceptLoading">
          <img v-if="!request.acceptLoading" src="/static/img/checklists/tick.svg" alt="">
          <spinner-little v-else :show="request.acceptLoading"></spinner-little>
        </button>
        ACA ESTA EL BOTON de Aprobado o Denegado
      </div>-->   
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
    name: 'BugReportCard',
    components: {CardContainer, CardHeader, CardSection, CardFooter, Spinner, SpinnerLittle},
    props: {
      request: {
        type: Object,
        required: true
      }
    },
    methods: {
      goToRequest (req) {
        this.$router.push({name: 'bugReport-request', params: {id: req._id}})
      },
      received (req) {
        return !req.hasOwnProperty('approved')
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
        if (request.prioridad === 'SOLUCIONADO') return this.$constants.BUG_REPORT_PRIORIDAD.SOLUCIONADO
        if (request.prioridad === 'NO_SOLUCIONADO') return this.$constants.BUG_REPORT_PRIORIDAD.NO_SOLUCIONADO
        if (request.prioridad === 'SOLUCION_TEMPORAL') return this.$constants.BUG_REPORT_PRIORIDAD.SOLUCION_TEMPORAL
        /* if (this.received(request)) return 'Pendiente de aprobación'
        if (this.denied(request)) return 'Denegada'
        if (this.approved(request)) return 'Aprobada'
        if (this.pending(request)) return 'Pendiente de entrega'
        if (this.delivered(request)) return 'Entregada'
        else return 'Estado' */
      },
      // ACOMODAR LOS COLORES DE LA PRIORIDAD
      bugReportTypeColor (request) {
        if (request.prioridad === 'SOLUCIONADO') return '#65c25a'
        if (request.prioridad === 'NO_SOLUCIONADO') return '#f86567'
        if (request.prioridad === 'SOLUCION_TEMPORAL') return '#e28c44'
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
          this.$store.dispatch('requests/approvalById', {
            id: req._id,
            approved: false,
            user: auth.getUser()
          })
        }
        this.confirmation('¿Esta seguro de RECHAZAR esta solicitud?', action)
      },
      accept (req) {
        const action = () => {
          this.$store.dispatch('requests/approvalById', {
            id: req._id,
            approved: true,
            user: auth.getUser()
          })
        }
        this.confirmation('¿Esta seguro de APROBAR esta solicitud?', action)
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