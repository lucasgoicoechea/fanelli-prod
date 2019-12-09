<template>
  <div ref="visualization">
    <navigation :title="title"></navigation>
    <div v-if="request === null" class="spinner-container">
      <spinner class="spinner" :show="$loading.isLoading('staffRequests fetchDetail')"
               loadingMessage="Cargando solicitud..."></spinner>
    </div>
    <div v-else>
      <div class="container-fluid">
        <div class="row">
          <div class="request-info-container col-xs-12">
            <div class="top-container">
              <div class="request-type-icon-container">
                <img class="request-type-icon" :src="requestTypeIcon">
              </div>
              <div class="request-type-title big-bold orange">
                <!--<span class="orange">Solicitud de {{ requestType }} </span>-->
                Solicitud de {{ requestType }}
              </div>
              <img class="request-state-icon" :src="requestStateIcon">
            </div>
          <div class="request-info">
            <div class="info-separated">Realizada el
              <span class="time"> {{ request.data.created_at | formatDate }} </span>
              <div class="ellipsis" :title="creatorName">
                por {{ creatorName }}
              </div>
              <div v-if="resolved" class="ellipsis">
                <span :style="requestStatusTextStyle"> {{requestStatusText}} </span>
                <span :title="approvedByName"> por {{ approvedByName }} </span>
              </div>
              <div v-if="canceled" class="ellipsis">
                <span class="canceled-text"> ANULADA </span>
              </div>
              <div v-if="pending" class="ellipsis">
                PENDIENTE
              </div>
              <div v-if="archived" class="ellipsis">
                ARCHIVADA
              </div>
              <button v-if="approved && !canceled && !archived && $can($constants.ROLES.JEFES+'|'+$constants.ROLES.RRHH)"
                      class="button-cancel-request"
                      @click="cancelButton">
                <p>ANULAR</p>
              </button>
            </div>
            <staff-request-field-visualization class="info" :request="request"></staff-request-field-visualization>
          </div>
        </div>
      </div>
      <div class="collaborators-section row">
        <div class="col-xs-12">
          <div class="for-collaborators info">Para</div>
          <ul class="collaborators-container">
            <li class="collaborator-item" v-for="collaborator in request.data.collaborators"
                @click="goToProfile(collaborator)">
                <span class="profile-picture-container">
                  <img class="profile-picture" :src="getPicture(collaborator.picture)">
                </span>
              <div class="collaborator-info-container" :title="collaboratorName(collaborator)">
                <div class="collaborator-info big-bold underlined ellipsis">
                  {{ collaboratorName(collaborator) }}
                </div>
                <div class="bold ellipsis collaborator-info">
                  Legajo: {{ collaborator.legajo }}
                </div>
                <div class="bold ellipsis collaborator-info">
                  {{ collaborator.sector && collaborator.sector.value }} - {{ getShift(collaborator) }}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="$can(permission)" class="row">
        <div class="col-xs-12">
          <div v-if="pending">
            <div class="row">
              <div class="col-xs-12">
                <div class="buttons-container">
                  <button class="reject" @click.stop="rejectButton">
                    RECHAZAR
                  </button>
                  <button class="accept" @click.stop="acceptButton">
                    APROBAR
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="request.data.collaborators.length === 1 && pending && !$can($constants.ROLES.SUPERVISORES)"
           class="row">
        <div class="col-xs-12 last-requests">
          <h3> Últimas solicitudes de {{ request.data.collaborators[0].lastname
            }} {{ request.data.collaborators[0].name }}</h3>
          <last-user-staff-requests :request="request"></last-user-staff-requests>
        </div>
      </div>

      <div v-if="resolved" class="print-button horizontal-center">
        <blockable-button class="button-icon"
                          icon="../../static/img/icons-kanban/print.svg"
                          title="Imprimir"
                          :clickMethod="confirmPrint"
                          :isLoading="$loading.isLoading(`staffRequests printing-${this.request.data._id}`)"
                          :buttonBackgroundColor="printButtonColor"
                          buttonRadius="20%"
                          buttonWidth="80px"
                          buttonHeight="45px"></blockable-button>
      </div>
    </div>

    <staff-request-accept-modal></staff-request-accept-modal>
    <modal-confirmation
      :name="`reject-${request.data._id}`"
      @reject="cancelReject"
      @acept="acceptReject">
      <p slot="title">¿Está seguro que desea RECHAZAR la solicitud de "{{ collaboratorNames }}"?</p>
    </modal-confirmation>

    <modal-confirmation
      :name="`accept-${request.data._id}`"
      @reject="cancelApprove"
      @acept="acceptApprove">
      <p slot="title">¿Está seguro que desea ACEPTAR la solicitud de "{{ collaboratorNames }}"?</p>
    </modal-confirmation>

    <modal-confirmation
      :name="`cancel-${request.data._id}`"
      @reject="cancelRequestReject"
      @acept="cancelRequestAccept">
      <p slot="title">¿Está seguro que desea ANULAR la solicitud de "{{ collaboratorNames }}"?</p>
    </modal-confirmation>
  </div>
  </div>
</template>

<script>
  import CardContainer from '@/components/cards/CardContainer.vue'
  import CardHeader from '@/components/cards/CardHeader.vue'
  import CardSection from '@/components/cards/CardSection.vue'
  import CardFooter from '@/components/cards/CardFooter.vue'
  import CardStatus from '@/components/cards/Status.vue'
  import Navigation from '@/components/Navigation.vue'

  import Constants from '@/const.js'
  import authorize from '@/utils/authorize'
  import Spinner from '@/components/SpinnerWrapper.vue'
  import StaffRequestAcceptModal from '@/components/control/staffRequests/AcceptModal.vue'
  import StaffRequestFieldVisualization from '@/components/control/staffRequests/StaffRequestFieldVisualization.vue'

  import {mapState} from 'vuex'
  import ModalConfirmation from '@/components/modals/ModalConfirmation.vue'
  import LastUserStaffRequests from './LastUserStaffRequests.vue'
  import dateAndTime from '@/utils/dateAndTime.js'
  import BlockableButton from '@/components/buttons/blockableButton'

  const {ROLES} = Constants

  export default {
    name: 'StaffRequestVisualization',
    components: {
      BlockableButton,
      LastUserStaffRequests,
      ModalConfirmation,
      StaffRequestAcceptModal,
      Spinner,
      CardContainer,
      CardHeader,
      CardSection,
      CardFooter,
      CardStatus,
      Navigation,
      StaffRequestFieldVisualization
    },
    data () {
      return {
        title: 'Solicitud',
        request: null,
        route: {
          type: '',
          id: ''
        }
      }
    },
    beforeRouteUpdate (to, from, next) {
      if (to.name === from.name) {
        this.route.type = to.params.type
        this.route.id = to.params.id
        this.request = null
        this.getStaffRequest()
      }
      next()
    },
    methods: {
      getStaffRequest () {
        const vm = this
        this.$store.dispatch('staffRequests/getDetail', {
          type: this.route.type,
          id: this.route.id
        })
          .then(
            (res) => {
              vm.request = res
              this.$refs.visualization.scrollIntoView({block: 'start'})
            }
          )
          .catch(
            () => {
              this.$snotifyWrapper.error('Se produjo un error al obtener la solicitud')
            }
          )
      },
      rejectButton () {
        if (this.$loading.isLoading(`staffRequests card-request-${this.request.data._id}`)) {
          return
        }

        this.$modal.show(`reject-${this.request.data._id}`)
      },
      acceptButton () {
        if (this.$loading.isLoading(`staffRequests card-request-${this.request.data._id}`)) {
          return
        }
        if (this.request.type !== this.$constants.staff_requests_types.LEAVE) {
          this.$modal.show(`accept-${this.request.data._id}`)
          return
        }

        this.$modal.show('staff-request-accept-modal', {
          type: this.request.type,
          buttons: [
            {
              title: 'Cancelar',
              class: 'button reject'
            },
            {
              title: 'Aceptar',
              handler: () => {
                if (!this.isFormValid()) {
                  this.showInvalidModal()
                  return
                }
                const successMessage = this.$t('staff_request_approve_success')
                const failureMessage = this.$t('staff_request_approve_failure')
                const alreadyApprovedMessage = this.$t('staff_request_already_approved')

                this.$store.dispatch('staffRequests/approval', {
                  request: {
                    _id: this.request.data._id,
                    approved: true
                  },
                  type: this.request.type
                })
                  .then(
                    () => this.$snotifyWrapper.success(successMessage))
                  .catch(
                    (err) => {
                      if (err.body.hasOwnProperty('statusCode') && err.body.statusCode === this.$constants.SERVER_ERROR.STAFF_REQUEST_ALREADY_APPROVED) {
                        this.$snotifyWrapper.error(alreadyApprovedMessage)
                      } else {
                        this.$snotifyWrapper.error(failureMessage)
                      }
                    })

                this.$modal.hide('staff-request-accept-modal')
                this.$router.replace({name: 'control-staff-requests'})
              },
              class: 'button accept'
            }
          ]
        })
      },
      cancelButton () {
        this.$modal.show(`cancel-${this.request.data._id}`)
      },
      acceptReject () {
        const successMessage = this.$t('staff_request_reject_success')
        const failureMessage = this.$t('staff_request_reject_failure')
        const alreadyApprovedMessage = this.$t('staff_request_already_approved')

        this.$store.dispatch('staffRequests/approval', {
          request: {
            _id: this.request.data._id,
            approved: false
          },
          type: this.request.type
        })
          .then(
            () => this.$snotifyWrapper.success(successMessage))
          .catch(
            (err) => {
              if (err.body.hasOwnProperty('statusCode') && err.body.statusCode === this.$constants.SERVER_ERROR.STAFF_REQUEST_ALREADY_APPROVED) {
                this.$snotifyWrapper.error(alreadyApprovedMessage)
              } else {
                this.$snotifyWrapper.error(failureMessage)
              }
            })

        this.$modal.hide(`reject-${this.request.data._id}`)
        this.$router.replace({name: 'control-staff-requests'})
      },
      cancelReject () {
        this.$modal.hide(`reject-${this.request.data._id}`)
      },
      acceptApprove () {
        const successMessage = this.$t('staff_request_approve_success')
        const failureMessage = this.$t('staff_request_approve_failure')

        this.$store.dispatch('staffRequests/approval', {
          request: {
            _id: this.request.data._id,
            approved: true
          },
          type: this.request.type
        })
          .then(
            () => this.$snotifyWrapper.success(successMessage))
          .catch(
            (err) => {
              if (err.body.hasOwnProperty('statusCode') && err.body.statusCode === this.$constants.SERVER_ERROR.STAFF_REQUEST_ALREADY_APPROVED) {
                this.$snotifyWrapper.error('La solicitud ya fue procesada por otro usuario')
              } else {
                this.$snotifyWrapper.error(failureMessage)
              }
            })

        this.$modal.hide(`accept-${this.request.data._id}`)
        this.$router.replace({name: 'control-staff-requests'})
      },
      cancelApprove () {
        this.$modal.hide(`accept-${this.request.data._id}`)
      },
      cancelRequestAccept () {
        this.$store.dispatch('staffRequests/cancel', {
          _id: this.request.data._id,
          type: this.$constants.staff_requests_types_uri[this.request.type]
        })
          .then(
            () => this.$snotifyWrapper.success('La solicitud ha sido anulada exitosamente'))
          .catch(
            () => {
              this.$snotifyWrapper.error('Se produjo un error al anular la solicitud')
            })

        this.$modal.hide(`cancel-${this.request.data._id}`)
        this.$router.replace({name: 'control-staff-requests'})
      },
      cancelRequestReject () {
        this.$modal.hide(`cancel-${this.request.data._id}`)
      },
      isFormValid () {
        return this.dataToSubmit.resolution && this.dataToSubmit.resolution !== ''
      },
      showInvalidModal () {
        this.$modal.show('dialog', {
          title: 'Faltan completar campos',
          text: 'Todos los campos deber ser completados',
          buttons: [
            {
              title: 'Aceptar',
              handler: () => {
                this.$modal.hide('dialog')
              }
            }
          ]
        })
      },
      getTitleBackgroundColor (color) {
        switch (color) {
          case 'DEEPBLUE':
            return '#1e3773'
          case 'PINK':
            return '#f86567'
          case 'GREEN':
            return '#65c25a'
          case 'MARINEBLUE':
            return '#3063ac'
          case 'TERRACOTA':
            return '#e28c44'
          case 'ORANGE':
            return '#e28c44'
          default:
            return '#e28c44'
        }
      },
      getSubTitleBackgroundColor (color) {
        switch (color) {
          case 'MARINEBLUE':
            return '#2b4a9f'
          case 'PINK':
            return '#f78384'
          case 'LIGHTGREEN':
            return '#a2da9b'
          case 'BLUE':
            return '#3c7ed9'
          case 'LIGHTPINK':
            return '#fbc697'
          default:
            return '#e2cea4'
        }
      },
      getPicture (url) {
        return url === null ? '../../static/img/icon-navigation/nofoto.svg' : url
      },
      getShift (collaborator) {
        if (!collaborator) {
          return ''
        }
        return collaborator.hasOwnProperty('shift') ? collaborator.shift.value : 'Sin turno asignado'
      },
      collaboratorName (collaborator) {
        return `${collaborator.lastname} ${collaborator.name}`
      },
      print () {
        this.$store.dispatch('staffRequests/getPdf', {
          _id: this.request.data._id,
          type: this.request.type,
          created_at: this.request.data.created_at
        })
      },
      confirmPrint () {
        if (this.printed) {
          this.askPrint()
        } else {
          this.print()
          this.request.data.printed = true
        }
      },
      askPrint () {
        this.$modal.show('dialog', {
          title: 'La solicitud ya fue impresa, ¿Desea imprimirla nuevamente?',
          buttons: [
            {
              title: 'Aceptar',
              handler: () => {
                this.print()
                this.$modal.hide('dialog')
              }
            },
            {
              title: 'Cancelar',
              handler: () => {
                this.$modal.hide('dialog')
              }
            }
          ]
        })
      },
      goToProfile (collaborator) {
        this.$router.push({name: 'profile', params: {id: collaborator._id}})
      }
    },
    computed: {
      ...mapState('staffRequests', [
        'dataToSubmit'
      ]),
      permission () {
        return authorize(ROLES.JEFES, ROLES.RRHH)
      },
      requestType () {
        if (!this.request) {
          return ''
        }

        if (this.request.type === Constants.staff_requests_types.LEAVE) {
          switch (this.request.data.type) {
            case Constants.staff_requests_types.LATE:
              return this.$t('staff_requests_types.late')
            case Constants.staff_requests_types.EARLY:
              return this.$t('staff_requests_types.early')
            case Constants.staff_requests_types.ABSENT:
              return this.$t('staff_requests_types.absent')
          }
        }
        switch (this.request.type) {
          case Constants.staff_requests_types.SHIFT_CHANGE:
            return this.$t('staff_requests_types.shift_change')
          case Constants.staff_requests_types.EXTRA_HOURS:
            return this.$t('staff_requests_types.extra_hours')
        }
      },
      collaboratorNames () {
        return this.request !== null ? this.request.data.collaborators.map(e => `${e.lastname} ${e.name}`).join(', ') : ''
      },
      days () {
        return this.request !== null ? this.request.data.days.map(e => dateAndTime.dateDayAndMonth(e)).join(', ') : ''
      },
      requestTypeIcon () {
        switch (this.request.type) {
          case Constants.staff_requests_types.SHIFT_CHANGE:
            return '../../static/img/icons-staff-request/cambio_hora.svg'
          case Constants.staff_requests_types.EXTRA_HOURS:
            return '../../static/img/icons-staff-request/horas_extras.svg'
          case Constants.staff_requests_types.LEAVE:
            return '../../static/img/icons-staff-request/permisos.svg'
        }
      },
      requestExtraInfo () {
        switch (this.request.type) {
          case Constants.staff_requests_types.LEAVE:
            return ['Solicitud para ', this.days]
          case Constants.staff_requests_types.SHIFT_CHANGE:
            return ['Cambio a turno ', this.getShift(this.request.collaborator)]
          case Constants.staff_requests_types.EXTRA_HOURS:
            return ['Solicitud para ', this.days]
        }
      },
      requestStateIcon () {
        if (this.request.data.archived) {
          return '../../static/img/icons-staff-request/archivada.svg'
        }
        if (this.request.data.canceled) {
          return '../../static/img/icons-staff-request/canceled-grey.svg'
        }
        switch (this.request.data.state) {
          case Constants.STAFF_REQUEST_STATE.APPROVED:
            return '../../static/img/icons-staff-request/aprobada-verde.svg'
          case Constants.STAFF_REQUEST_STATE.REJECTED:
            return '../../static/img/icons-staff-request/denegada-rojo.svg'
          case Constants.STAFF_REQUEST_STATE.PENDING_APPROVAL:
            return '../../static/img/icons-staff-request/pendiente.svg'
        }
      },
      requestStatusTextStyle () {
        let textColor
        switch (this.request.data.state) {
          case Constants.STAFF_REQUEST_STATE.APPROVED:
            textColor = '#a2da9b'
            break
          case Constants.STAFF_REQUEST_STATE.REJECTED:
            textColor = '#f86567'
            break
          case Constants.STAFF_REQUEST_STATE.PENDING_APPROVAL:
            textColor = 'default'
            break
          default:
            textColor = 'default'
        }

        return {
          color: textColor,
          'text-decoration': this.request.data.canceled ? 'line-through' : ''
        }
      },
      requestStatusText () {
        switch (this.request.data.state) {
          case Constants.STAFF_REQUEST_STATE.APPROVED:
            return 'APROBADA'
          case Constants.STAFF_REQUEST_STATE.REJECTED:
            return 'DENEGADA'
          case Constants.STAFF_REQUEST_STATE.PENDING_APPROVAL:
            return 'PENDIENTE'
        }
      },
      pending () {
        return this.request.data.state === this.$constants.STAFF_REQUEST_STATE.PENDING_APPROVAL
      },
      approved () {
        return this.request.data.state === this.$constants.STAFF_REQUEST_STATE.APPROVED
      },
      resolved () {
        return this.request.data.state === this.$constants.STAFF_REQUEST_STATE.APPROVED ||
          this.request.data.state === this.$constants.STAFF_REQUEST_STATE.REJECTED
      },
      canceled () {
        return this.request.data.canceled
      },
      compensateDays () {
        return this.request.data.daysToCompensate.map(e => `${e}`).join(', ')
      },
      creatorName () {
        return `${this.request.data.creator.lastname} ${this.request.data.creator.name}`
      },
      approvedByName () {
        return `${this.request.data.approvedBy.lastname} ${this.request.data.approvedBy.name}`
      },
      archived () {
        return this.request.data.archived
      },
      printed () {
        return this.request.data.printed
      },
      printButtonColor () {
        return (this.printed)
          ? '#7d7d7d'
          : '#2b3775'
      }
    },
    created () {
      this.route.type = this.$route.params.type
      this.route.id = this.$route.params.id
      this.getStaffRequest()
    },
    filters: {
      formatDate (val) {
        return dateAndTime.dateWithTimeLong(val)
      },
      formatToAMPM (val) {
        return dateAndTime.time24ToAMPM(val)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .container-fluid {
    margin-top: 40px;
  }

  .request-info {
    position: relative;
    left: 110px;
    color: #000000;
  }

  h3 {
    font-weight: bold;
    padding: 5px 0;
    border-bottom: 4px solid #ec6e25;
  }

  .collaborators-container {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
  }

  button {
    margin: 2px 0;
    padding: 4px 16px;
    text-decoration: none;
    border: none;
    border-radius: 50px;
    color: white;
    width: 130px;
    height: 70px;
    font-size: 22px;

    &.accept {
      background-color: #65c25a;
      margin-left: 25px;
    }
    &.reject {
      background-color: #f86567;
      padding-left: 10px;
    }

    &:disabled {
      cursor: not-allowed;
    }
  }

  .buttons-container {
    display: flex;
    justify-content: center;
    margin: 10px 0;
  }

  .time {
    font-family: monospace;
    color: $time-date;
  }

  .cards-container {
    height: 100%;
  }

  .horizontal-center {
    display: flex;
    justify-content: center;
  }

  .justify-around {
    justify-content: space-around;
  }

  .times-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .request-type-icon-container {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    background-color: $secondary-color;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
  }

  .request-type-icon {
    width: 55px;
    height: 55px;
  }

  .request-state-icon {
    width: 70px;
    height: 70px;
  }

  .request-type-title {
    margin: 0 20px;
    line-height: 1;
    text-align: center;
  }

  .request-info-container {
    height: auto;
    width: 80%;
    padding-bottom: 25px;
  }

  section {
    .header {
      font-size: 20px;
      font-weight: bolder;
      border-bottom: 2px solid $primary-color;
      margin-top: 10px;
    }
  }

  .collaborator-info-container {
    position: relative;
    flex-grow: 1;
  }

  .collaborator-info {
    position: relative;
    width: 100%;
  }

  .collaborator-item {
    position: relative;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    margin: 10px 0;
  }

  .profile-picture-container {
    position: relative;
    right: 18px;
    height: 70px;
    width: 70px;
    border-radius: 50%;
    background-color: #ffffff;
    z-index: 3;
  }

  .profile-picture {
    height: 70px;
    width: 70px;
    border-radius: 50%;
  }

  .big-bold {
    font-size: 22px;
    font-weight: bold;
  }

  .bold {
    font-weight: bold;
  }

  .orange {
    color: $primary-color;
  }

  .sector {
    font-size: 18px;
    color: $secondary-color;
  }

  .underlined {
    text-decoration: underline;
  }

  .info-separated {
    margin: 10px 0;
    font-size: 16px;
  }

  .info {
    font-size: 16px;
  }

  .monospace {
    font-family: monospace;
  }

  .grey {
    color: $time-date;
  }

  .ellipsis {
    width: 95%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .for-collaborators {
    position: relative;
    left: 71px;
    top: 8px;
    font-weight: bolder;
    color: #000000;
  }

  .collaborators-section {
    position: relative;
    left: 40px;
  }

  .spinner-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .print-button {
    margin: 25px 0;
  }

  .collaborators-container {
    flex-direction: column;
  }

  .button-cancel-request {
    position: relative;
    width: 90px;
    height: 30px;
    background-color: #FFFFFF;
    border: 2px solid $primary-light;

    p {
      color: $primary-light;
      font-size: 15px;
      font-weight: bold;
    }
  }

  .canceled-text {
    font-weight: bolder;
    color: lightslategrey;
    text-decoration: underline;
  }

  .top-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    left: 18px;
  }

  .last-requests {
    padding: 0 30px;
  }

  @media screen and (max-width: 768px) {
    .container-fluid {
      padding: 0;
      margin-top: 70px;
    }

    .request-info {
      left: 50px;
    }

    .profile-picture {
      height: 50px;
      width: 50px;
    }

    .collaborator-info-container {
      left: 21px;
    }

    .for-collaborators {
      left: 67px;
    }

    .collaborators-section {
      left: 30px;
    }

    .collaborators-container {
      grid-template-columns: 1fr;
    }

    .profile-picture-container {
      width: 45px;
      height: 45px;
    }

    .collaborator-item {
      align-items: center;
    }

    .top-container {
      left: 30px;
    }

    .request-type-icon {
      width: 40px;
      height: 40px;
    }

    .request-type-icon-container {
      width: 50px;
      height: 50px;
    }

    .request-state-icon {
      width: 50px;
      height: 50px;
    }

    .collaborator-info {
      width: 70vw;
    }

    .profile-picture-container {
      right: 0;
    }

  }
</style>
