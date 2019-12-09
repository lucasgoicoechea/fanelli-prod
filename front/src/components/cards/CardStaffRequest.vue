<template>
  <div>
    <card-container @click.native="goTo">
      <card-header :headerBackground="getTitleBackgroundColor">
        <p slot="header" class="horizontal-space-between">
          <span> Solicitud de {{ requestType }} </span>
          <span v-if="request.request.archived"> ARCHIVADA </span>
          <span v-if="request.request.canceled"> ANULADA </span>
        </p>
        <p v-if="resolved" slot="subHeader" class="subheader">
          {{ requestStatus }} por {{ statusResponsible }}
        </p>
      </card-header>
      <card-section>
        <div class="card-section" slot="content">
          <span class="time"> {{ createdDate }} </span>
          <span class="request-info"> de {{ creatorName }} para
          <span class="collaborator-names">
            {{ collaborators }}
          </span>
        </span>
          <div class="request-extra-info">
            <span> {{ requestExtraInfo[0] }} </span>
            <span class="monospace grey">{{ requestExtraInfo[1] }} </span>
          </div>
        </div>
        <div v-if="$can(permission) && pending" class="action-buttons" @click.stop slot="actions">
          <button class="reject"
                  @click.stop="rejectButton"
                  :disabled="$loading.isLoading(loadingRejectName) || $loading.isLoading(loadingApproveName)"
                  title="Rechazar solicitud">
            <img v-if="!$loading.isLoading(loadingRejectName)"
                 src="/static/img/checklists/cross.svg"
                 alt="">
            <spinner v-else size="small"></spinner>
          </button>

          <button class="accept"
                  @click.stop="acceptButton"
                  :disabled="$loading.isLoading(loadingRejectName) || $loading.isLoading(loadingApproveName)"
                  title="Aceptar solicitud">
            <img v-if="!$loading.isLoading(loadingApproveName)"
                 src="/static/img/checklists/tick.svg"
                 alt="">
            <spinner v-else size="small"></spinner>
          </button>
        </div>
        <span
          v-if="resolved && !canceled"
          slot="actions" @click.stop>
        <blockable-button class="button-icon"
                          icon="/static/img/icons-kanban/print.svg"
                          title="Imprimir"
                          :clickMethod="confirmPrint"
                          :isLoading="$loading.isLoading(`staffRequests printing-${this.request.request._id}`)"
                          :buttonBackgroundColor="printButtonColor"
                          buttonRadius="20%"
                          buttonWidth="80px"
                          buttonHeight="45px"></blockable-button>
      </span>
      </card-section>


    </card-container>
    <modal-confirmation
      :name="`reject-${request.request._id}`"
      @reject="cancelReject"
      @acept="acceptReject">
      <p slot="title">¿Está seguro que desea RECHAZAR la solicitud de "{{ collaborators }}"?</p>
      <!--<p slot="subtitle">Esta solicitud involucra a  </p>-->
    </modal-confirmation>

    <modal-confirmation
      :name="`accept-${request.request._id}`"
      @reject="cancelApprove"
      @acept="acceptApprove">
      <p slot="title">¿Está seguro que desea ACEPTAR la solicitud de "{{ collaborators }}"?</p>
      <!--<p slot="subtitle">Esta solicitud involucra a  </p>-->
    </modal-confirmation>
  </div>

</template>

<script>
  import CardContainer from '@/components/cards/CardContainer.vue'
  import CardHeader from '@/components/cards/CardHeader.vue'
  import CardSection from '@/components/cards/CardSection.vue'
  import CardFooter from '@/components/cards/CardFooter.vue'

  import Constants from '@/const.js'
  import authorize from '@/utils/authorize'
  import BlockableButton from '../buttons/blockableButton.vue'
  import DialogWithContent from '@/components/modals/DialogWithContent'
  import Spinner from 'vue-simple-spinner'

  import { mapState } from 'vuex'
  import ModalConfirmation from '@/components/modals/ModalConfirmation.vue'
  import dateAndTime from '@/utils/dateAndTime.js'

  const {ROLES} = Constants

  export default {
    name: 'CardStaffRequest',
    components: {
      ModalConfirmation,
      CardContainer,
      CardHeader,
      CardSection,
      CardFooter,
      BlockableButton,
      DialogWithContent,
      Spinner
    },
    props: {
      request: {
        type: Object,
        required: true
      }
    },
    data () {
      return {}
    },
    methods: {
      goTo () {
        this.$router.push({
          name: 'staff-request-visualization',
          params: {id: this.request.request._id, type: this.$constants.staff_requests_types_uri[this.request.type]}
        })
      },
      print () {
        this.$store.dispatch('staffRequests/getPdf', {
          _id: this.request.request._id,
          type: this.request.type,
          created_at: this.request.request.created_at
        })
      },
      confirmPrint () {
        if (this.printed) {
          this.askPrint()
        } else {
          this.print()
          this.request.request.printed = true
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
      rejectButton () {
        if (this.$loading.isLoading(`staffRequests card-request-${this.request.request._id}`)) {
          return
        }

        this.$modal.show(`reject-${this.request.request._id}`)
      },
      acceptButton () {
        if (this.$loading.isLoading(`staffRequests card-request-${this.request.request._id}`)) {
          return
        }
        if (this.request.type !== this.$constants.staff_requests_types.LEAVE) {
          this.$modal.show(`accept-${this.request.request._id}`)
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
                    _id: this.request.request._id,
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
                        this.$store.dispatch('staffRequests/fetchResolved')
                        this.$store.dispatch('staffRequests/fetchPending')
                      } else {
                        this.$snotifyWrapper.error(failureMessage)
                      }
                    })
                this.$modal.hide('staff-request-accept-modal')
              },
              class: 'button accept'
            }
          ]
        })
      },
      acceptReject () {
        const successMessage = this.$t('staff_request_reject_success')
        const failureMessage = this.$t('staff_request_reject_failure')
        const alreadyApprovedMessage = this.$t('staff_request_already_approved')

        this.$store.dispatch('staffRequests/approval', {
          request: {
            _id: this.request.request._id,
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
                this.$store.dispatch('staffRequests/fetchResolved')
                this.$store.dispatch('staffRequests/fetchPending')
              } else {
                this.$snotifyWrapper.error(failureMessage)
              }
            })

        this.$modal.hide(`reject-${this.request.request._id}`)
      },
      cancelReject () {
        this.$modal.hide(`reject-${this.request.request._id}`)
      },
      acceptApprove () {
        const successMessage = this.$t('staff_request_approve_success')
        const failureMessage = this.$t('staff_request_approve_failure')
        const alreadyApprovedMessage = this.$t('staff_request_already_approved')

        this.$store.dispatch('staffRequests/approval', {
          request: {
            _id: this.request.request._id,
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
                this.$store.dispatch('staffRequests/fetchResolved')
                this.$store.dispatch('staffRequests/fetchPending')
              } else {
                this.$snotifyWrapper.error(failureMessage)
              }
            })

        this.$modal.hide(`accept-${this.request.request._id}`)
      },
      cancelApprove () {
        this.$modal.hide(`accept-${this.request.request._id}`)
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
      }
    },
    computed: {
      getTitleBackgroundColor () {
        if (this.request.request.canceled) {
          return '#5f5f5f'
        }
        switch (this.request.request.state) {
          case Constants.STAFF_REQUEST_STATE.APPROVED:
            return '#65c25a'
          case Constants.STAFF_REQUEST_STATE.REJECTED:
            return '#f86567'
          case Constants.STAFF_REQUEST_STATE.PENDING_APPROVAL:
            return '#1e3773'
        }
      },
      requestType () {
        if (this.request.type === Constants.staff_requests_types.LEAVE) {
          switch (this.request.request.type) {
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
      requestExtraInfo () {
        switch (this.request.type) {
          case Constants.staff_requests_types.LEAVE:
            return ['Solicitud para ', this.days]
          case Constants.staff_requests_types.SHIFT_CHANGE:
            return ['Cambio a turno ', this.request.request.toShift.value]
          case Constants.staff_requests_types.EXTRA_HOURS:
            return ['Solicitud para ', this.days]
        }
      },
      requestStatus () {
        switch (this.request.request.state) {
          case Constants.STAFF_REQUEST_STATE.APPROVED:
            return 'Aprobada'
          case Constants.STAFF_REQUEST_STATE.REJECTED:
            return 'Rechazada'
          case Constants.STAFF_REQUEST_STATE.PENDING_APPROVAL:
            return 'Pendiente'
        }
      },
      createdDate () {
        return dateAndTime.dateWithTimeLong(this.request.request.created_at)
      },
      ...mapState('staffRequests', [
        'dataToSubmit']),
      permission () {
        return authorize(ROLES.JEFES, ROLES.RRHH)
      },
      collaborators () {
        if (this.request.request.collaborators.length > 1) {
          return `${this.request.request.collaborators.length} colaboradores`
        } else {
          return `${this.request.request.collaborators[0].lastname} ${this.request.request.collaborators[0].name}`
        }
      },
      creatorName () {
        return `${this.request.request.creator.lastname} ${this.request.request.creator.name}`
      },
      statusResponsible () {
        return `${this.request.request.approvedBy.lastname} ${this.request.request.approvedBy.name}`
      },
      days () {
        return this.request.request.days.map(e => dateAndTime.dateDayAndMonth(e)).join(', ')
      },
      loadingApproveName () {
        return `staffRequests card-request-approve-${this.request.request._id}`
      },
      loadingRejectName () {
        return `staffRequests card-request-reject-${this.request.request._id}`
      },
      resolved () {
        return this.request.request.state === this.$constants.STAFF_REQUEST_STATE.APPROVED ||
          this.request.request.state === this.$constants.STAFF_REQUEST_STATE.REJECTED
      },
      approved () {
        return this.request.request.state === this.$constants.STAFF_REQUEST_STATE.APPROVED
      },
      pending () {
        return this.request.request.state === this.$constants.STAFF_REQUEST_STATE.PENDING_APPROVAL
      },
      canceled () {
        return this.request.request.canceled
      },
      printed () {
        return this.request.request.printed
      },
      printButtonColor () {
        return (this.printed)
          ? '#7d7d7d'
          : '#2b3775'
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  p {
    margin: 0;
    font-weight: 300;
  }

  button {
    margin: 2px 5px;
    padding: 4px 16px;
    width: 52px;
    height: 28px;
    text-decoration: none;
    border: none;
    border-radius: 50px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;

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

  .card-section {
  }

  .request-info {
    font-weight: bold;
  }

  .time {
    font-size: 16px;
    font-family: monospace;
  }

  .request-extra-info {
    font-size: 16px;
  }

  .subheader {
    color: #000000;
  }

  .button-icon {
    position: relative;
    bottom: 10px;
  }

  .collaborator-names {
    width: 250px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .horizontal-space-between {
    display: flex;
    justify-content: space-between;
  }

  .action-buttons {
    display: flex;
    align-items: center;
  }
</style>
