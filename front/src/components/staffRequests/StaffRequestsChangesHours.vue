<template>
  <div class="staff-requests-changes-hours">
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
          <div class="col-xs-12 by-fabric">
            <check-box label="Requirido por la planta" v-model="shiftRequest.byFabric"></check-box>
          </div>
          <div class="col-xs-12">
            <h3>Solicitud de cambio de horario</h3>
            <hr>
            <ul>
              <li>
                <input type="radio" id="temporal" :value="true" v-model="shiftRequest.temporary">
                <label for="temporal">Temporal</label>
                <div class="check"></div>
              </li>
              <li>
                <input type="radio" id="permanente" :value="false" v-model="shiftRequest.temporary">
                <label for="permanente">Permanente</label>
                <div class="check"></div>
              </li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12">
            <h3>Cambiar a</h3>
            <hr>
            <ul class="shifts">
              <li v-for="shift in shifts" :key="shift.value">
                <input type="radio" :id="shift.value" :value="shift._id" v-model="shiftRequest.toShift">
                <label :for="shift.value">{{shift.value}}</label>
                <div class="check"></div>
                <div class="shift-description"> {{ shift.description }} </div>
              </li>
            </ul>
          </div>
          <div class="col-md-6">
            <h3>Desde</h3>
            <hr>
            <div class="calendar">
              <div class="picker">
                <flat-pickr
                  v-model="shiftRequest.days.from"
                  :config="conf"
                  ref="_flatpickrStart"
                  placeholder="Seleccione una fecha"></flat-pickr>
              </div>
              <button class="button" @click="clearDatePicker('_flatpickrStart')">Borrar</button>
            </div>
          </div>
          <div v-show="isTemporal" class="col-md-6">
            <h3>Hasta</h3>
            <hr>
            <div class="calendar">
              <div class="picker">
                <flat-pickr
                  v-model="shiftRequest.days.to"
                  :config="conf"
                  ref="_flatpickrEnd"
                  placeholder="Seleccione una fecha"></flat-pickr>
              </div>
              <button class="button" @click="clearDatePicker('_flatpickrEnd')">Borrar</button>
            </div>
          </div>
          <div class="col-xs-12">
            <h3>Motivo</h3>
            <hr>
            <textarea
              v-model="shiftRequest.reason"
              placeholder="Escriba aquí el motivo de la falta"></textarea>
          </div>
        </div>
      </div>
    </section>
    <bottom-navbar>
      <div class="msg pointer" @click="confirm" v-if="!$loading.isLoading('staffRequests createShiftChange')">
        <h5 class="items">Enviar solicitud</h5>
        <span class="glyphicon glyphicon-send items icon-action"></span>
      </div>
      <div class="msg" v-else>
        <h5 class="items">Enviando solicitud</h5>
        <spinner class="items" :show="$loading.isLoading('staffRequests createShiftChange')"></spinner>
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
  import CheckBox from '@/components/CheckBox.vue'

  export default {
    name: 'StaffRequestsChangesHours',
    components: {
      BottomNavbar,
      Navigation,
      CollaboratorSelector,
      ModalConfirmation,
      Spinner,
      CheckBox
    },
    data () {
      return {
        title: 'Cambio de turno',
        shiftRequest: {
          days: {
            from: null,
            to: null
          },
          toShift: null,
          temporary: null,
          reason: null,
          byFabric: true
        },
        conf: {
          inline: true,
          locale: Spanish,
          disableMobile: true
        },
        shifts: []
      }
    },
    created () {
      this.$store.dispatch('fabric/fetch', { attribute: 'shift' })
        .then(response => { this.shifts = response.data })
        .catch(() => this.$snotifyWrapper.error('Error al recuperar la información de los turnos'))
    },
    methods: {
      clearDatePicker (picker) {
        this.$refs[picker].fp.clear()
      },
      confirm () {
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
        this.shiftRequest.collaborators = this.getSelectedIds
        this.shiftRequest.days.from = this.$refs._flatpickrStart.fp.selectedDates[0]
        this.shiftRequest.days.to = this.$refs._flatpickrEnd.fp.selectedDates[0]
        this.$store.dispatch('staffRequests/createShiftChange', this.shiftRequest)
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
      isTemporal () {
        return this.shiftRequest.temporary
      },
      isValid () {
        if (this.shiftRequest.temporary === null) { return false }
        const valid = this.shiftRequest.reason !== null &&
          this.shiftRequest.toShift !== null &&
          this.$refs._flatpickrStart.fp.selectedDates.length !== 0 &&
          this.hasSelected
        if (this.shiftRequest.temporary) return valid && this.$refs._flatpickrEnd.fp.selectedDates.length !== 0
        return valid
      }
    },
    destroyed () {
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

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    overflow: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  ul li {
    display: block;
    position: relative;
    float: left;
  }

  ul li input[type=radio] {
    position: absolute;
    visibility: hidden;
  }

  ul li label {
    display: block;
    color: #5a5a5a;
    position: relative;
    font-weight: 300;
    font-size: 1.35em;
    padding: 10px 5px 10px 60px;
    margin: 10px auto;
    height: 30px;
    z-index: 9;
    cursor: pointer;
  }

  ul li .check {
    display: block;
    position: absolute;
    border: 5px solid $primary-light;
    border-radius: 100%;
    height: 35px;
    width: 35px;
    top: 15px;
    left: 15px;
    z-index: 5;
  }

  ul li .check::before {
    display: block;
    position: absolute;
    content: '';
    border-radius: 100%;
    height: 15px;
    width: 15px;
    top: 5px;
    left: 5px;
    margin: auto;
  }

  input[type=radio]:checked ~ .check {
    border: 5px solid $primary-light;
  }

  input[type=radio]:checked ~ .check::before {
    background: $primary-light;
  }

  input[type=radio]:checked ~ label {
    color: $primary-light;
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

  .shifts {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .shift-description {
    position: relative;
    left: 60px;
    width: 80%;
  }

  @media (max-width: 500px) {
    .container-fluid {
      width: 100%;
    }

    ul {
      flex-direction: column;
    }

    .shifts {
      grid-template-columns: auto;
    }
  }

  .by-fabric {
    margin: 10px 2px;
  }

</style>
