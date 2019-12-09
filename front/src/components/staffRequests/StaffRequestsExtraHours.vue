<template>
  <div class="staff-requests-extra-hours">
    <navigation :title="title"></navigation>
    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-xs-12">
            <h3>Selección de colaboradores</h3>
            <hr>
            <collaborator-selector :multipleSelection="true"></collaborator-selector>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12">
            <h3>Día</h3>
            <hr>
            <div class="calendar">
              <div class="picker">
                <flat-pickr
                  v-model="extraHoursRequest.days"
                  :config="conf"
                  ref="_flatpickr"
                  placeholder="Seleccione una fecha o varias..."></flat-pickr>
              </div>
              <button class="button" @click="clearDatePicker">Borrar</button>
            </div>
          </div>
          <div class="col-xs-12">
            <h3>Horario</h3>
            <hr>
            <div class="col-xs-6">
              <h4>De</h4>
              <div class="picker">
                <flat-pickr
                  v-model="extraHoursRequest.time.from"
                  :config="confTime"
                  ref="_timeFrom"
                  placeholder="Seleccione una hora..."></flat-pickr>
              </div>
            </div>
            <div class="col-xs-6">
              <h4>A</h4>
              <div class="picker">
                <flat-pickr
                  v-model="extraHoursRequest.time.to"
                  :config="confTime"
                  ref="_timeTo"
                  placeholder="Seleccione una hora..."></flat-pickr>
              </div>
            </div>
          </div>
          <div class="col-xs-12">
            <h3>Motivo</h3>
            <hr>
            <textarea
              v-model="extraHoursRequest.reason"
              placeholder="Escriba aquí el motivo de la falta"></textarea>
          </div>
        </div>
      </div>
    </section>
    <bottom-navbar>
      <div class="msg pointer" @click="confirm" v-if="!$loading.isLoading('staffRequests createExtraHours')">
        <h5 class="items">Enviar solicitud</h5>
        <span class="glyphicon glyphicon-send items icon-action"></span>
      </div>
      <div class="msg" v-else>
        <h5 class="items">Enviando solicitud</h5>
        <spinner class="items" :show="$loading.isLoading('staffRequests createExtraHours')"></spinner>
      </div>
    </bottom-navbar>
    <modal-confirmation
      name="modal"
      @reject="reject"
      @acept="acept">
      <p slot="title">Esta por enviar la solicitud, una vez creada tenga en cuenta que debe firmar la solicitud</p>
      <p slot="subtitle">Esta solicitud involucra a {{ getSelectedIds.length }} colaboradores </p>
    </modal-confirmation>
  </div>
</template>

<script>
  import Navigation from '@/components/Navigation.vue'
  import BottomNavbar from '@/components/BottomNavbar.vue'
  import CollaboratorSelector from '@/components/selectors/collaborator/CollaboratorSelector.vue'
  import { mapState, mapGetters } from 'vuex'
  import { Spanish } from 'flatpickr/dist/l10n/es'
  import ModalConfirmation from '@/components/modals/ModalConfirmation'
  import Spinner from '@/components/SpinnerWrapper.vue'
  import dateAndTime from '@/utils/dateAndTime'

  export default {
    name: 'StaffRequestsExtraHours',
    components: {
      BottomNavbar,
      Navigation,
      CollaboratorSelector,
      ModalConfirmation,
      Spinner
    },
    data () {
      return {
        title: 'Horas Extras',
        extraHoursRequest: {
          days: [],
          time: {
            from: null,
            to: null
          },
          reason: null,
          collaborator: {}
        },
        conf: {
          mode: 'multiple',
          inline: true,
          locale: Spanish,
          disableMobile: true
        },
        confTime: {
          enableTime: true,
          noCalendar: true,
          dateFormat: 'H:i',
          time_24hr: true,
          disableMobile: true
        }
      }
    },
    mounted () {
      this.clearDatePicker()
    },
    methods: {
      clearDatePicker () {
        this.$refs._flatpickr.fp.clear()
      },
      setTimes () {
        this.extraHoursRequest.time.from = dateAndTime.toTime24(this.$refs._timeFrom.fp.selectedDates[0])
        this.extraHoursRequest.time.to = dateAndTime.toTime24(this.$refs._timeTo.fp.selectedDates[0])
      },
      confirm () {
        this.setTimes()
        if (this.isValid) {
          this.$modal.show('modal')
        } else {
          this.invalidModal()
        }
      },
      reject () {
        this.$modal.hide('modal')
      },
      acept () {
        this.$modal.hide('modal')
        this.sendStaffRequest()
      },
      sendStaffRequest () {
        this.extraHoursRequest.days = this.$refs._flatpickr.fp.selectedDates
        this.extraHoursRequest.collaborators = this.getSelectedIds
        this.$store.dispatch('staffRequests/createExtraHours', this.extraHoursRequest)
          .then(this.successfulCreation)
          .catch(this.failedCreation)
      },
      successfulCreation (res) {
        if (res.success) {
          this.$router.push({name: 'staff-requests'})
          this.$snotifyWrapper.success('La solicitud se ha creado con exito')
        } else {
          this.$snotifyWrapper.error(res.message)
        }
      },
      failedCreation () {
        this.$snotifyWrapper.warning('Se produjo un error. Intente nuevamente')
      },
      invalidModal () {
        this.$modal.show('dialog', {
          title: 'Faltan completar campos',
          text: 'Todos los campos deber ser completados',
          buttons: [
            {
              title: 'Aceptar',
              handler: () => { this.$modal.hide('dialog') }
            }
          ]
        })
      }
    },
    computed: {
      ...mapGetters('collaborators', [
        'hasSelected',
        'getSelectedIds'
      ]),
      ...mapState('collaborators', [
        'collaboratorSelected'
      ]),
      isValid () {
        const time = this.extraHoursRequest.time.from !== null && this.extraHoursRequest.time.to !== null
        const hasDates = this.$refs._flatpickr.fp.selectedDates.length !== 0
        return hasDates && time && this.hasSelected && this.hasReason
      },
      hasReason () {
        return this.extraHoursRequest.reason !== null && this.extraHoursRequest.reason !== ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";
  @import "../../assets/styles/mixins";

  .container-fluid {
    width: 90%;
  }

  .collaborator-selector {
    margin-top: 20px;
  }

  h3 {
    color: $secondary-darker;
    font-weight: bold;
    margin-bottom: 0;
  }

  hr {
    margin-top: 2px;
    margin-bottom: 8px;
    border: 1.5px solid $primary-light;
    border-radius: 4px;
  }

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

  .ta-left {
    text-align: left;
  }

  .ta-right {
    text-align: right;
  }

  .calendar {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .picker {
    display: inline-block;
  }

  .button {
    background-color: #fb8964;
    border: none;
    border-radius: 100px;
    color: white;
    padding: 8px 16px;
    box-shadow: 0px 1px 4px 0 rgba(0, 0, 0, 0.3);
    text-align: center;
    text-decoration: none;
    outline: none;
    display: inline-block;
    margin: 15px 0;

    &:hover {
      background-color: #dc725c;
    }
  }

  @media (max-width: 500px) {
    .container-fluid {
      width: 100%;
    }

    ul {
      flex-direction: column;
    }
  }

  textarea {
    border: 2px solid $primary-light;
    margin-bottom: 100px;
    width: 100%;
    padding: 10px;
    display: block;
    resize: none;
    min-height: 100px;
    background-color: #f6f6f6;

    &:focus {
      outline-color: $primary-color;
    }
  }

</style>
