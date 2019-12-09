<template>
  <modal width="100%"
         height="auto"
         :max-width="800"
         :scrollable="true"
         :adaptive="true"
         @before-open="beforeOpen"
         name="event-information">
    <div v-if="timelineData">
      <div class="container-fluid">
        <div class="row">
          <div class="col-xs-12">
            <div class="top-container">
              <h1> {{ collaboratorLegajo }} {{ timelineData.collaborator.lastname }}, {{ timelineData.collaborator.name
                }} - {{
                getEventTypeInformation() }} </h1>
              <!--<img src="~@img/trashgrey.svg" class="thrash-icon" title="Eliminar evento">-->
              <img src="~@img/cross.svg" class="cross-icon"
                   title="Cerrar"
                   @click="closeModal()">
            </div>

            <div class="content-container">
              <spinner class="spinner" size="25" :show="$loading.isLoading('events updateEvent')"></spinner>

              <img v-show="!$loading.isLoading('events updateEvent')"
                   class="fields-edit-icon"
                   v-if="permission"
                   @click="editFields"
                   :src="fieldsEditIcon">

              <div class="additional-field"> Reporta: {{ eventData.item.creator.name }}
                {{eventData.item.creator.lastname }}
              </div>
              <div class="additional-field"> Fecha: {{ eventData.item.created_at | moment('DD-MM-YYYY h:mm A') }}</div>
              <div class="additional-field" v-for="eventField in additionalEventFields">
                {{ eventField.name }}: {{ eventField.value }}
              </div>

              <div v-if="isMedicalReportWithMedicalDischarge" class="additional-field">
                Fecha de alta:
                <span v-if="!editingFields" class="additional-field"> {{ eventData.item.dischargeDate | moment('DD-MM-YYYY')}} </span>

                <input-date v-else
                            name="dischargeDate"
                            type="date"
                            max="9999-12-31"
                            class="inline-date-field"
                            :flat="true"
                            width="140px"
                            :min="minDate"
                            v-model="dischargeDate"></input-date>
              </div>

              <div v-else-if="isMedicalReportWithLicense" class="additional-field">
                Fecha de próxima visita al médico:
                <span v-if="!editingFields" class="additional-field"> {{ eventData.item.nextMedicalVisit | moment('DD-MM-YYYY')}} </span>
                <input-date v-else
                            name="nextMedicalVisit"
                            type="date"
                            max="9999-12-31"
                            class="inline-date-field"
                            :flat="true"
                            width="140px"
                            :min="minDate"
                            v-model="nextMedicalVisit"></input-date>
              </div>

              <a v-if="checkEventType($constants.event_types.MEDICAL_REPORT)"
                 :href="eventData.item.medicalOrder">
                Click aquí para descargar el informe médico</a>
            </div>
            <h3>Observaciones</h3>
            <textarea class="observations-input" placeholder=""
                      name="observation"
                      v-model="observation"
                      :disabled="!editingFields"></textarea>
          </div>
        </div>
      </div>
      <div v-if="eventData.type === $constants.staff_action_types.STAFF_NEWS" class="exculpatory-container">
        <h3 class="exculpatory-label">Descargo</h3>
        <textarea class="exculpatory-input"
                  :class="{active: editingFields}"
                  name="exculpatory"
                  v-model="exculpatory"
                  :disabled="!editingFields"></textarea>
      </div>
    </div>
  </modal>
</template>

<script>
  import { mapState } from 'vuex'
  import Constants from '@/const.js'
  import dateAndTime from '@/utils/dateAndTime.js'
  import Spinner from '@/components/SpinnerWrapper.vue'
  import InputDate from '@/components/InputDate'
  import authorize from '@/utils/authorize'

  export default {
    name: 'EventInformation',
    components: {InputDate, Spinner},
    data () {
      return {
        loading: false,
        timelineData: null,
        eventData: null,
        additionalEventFields: null,
        editingFields: false,
        dischargeDate: null,
        nextMedicalVisit: null,
        observation: null,
        exculpatory: null
      }
    },
    methods: {
      beforeOpen (event) {
        this.timelineData = event.params.timelineData
        this.eventData = event.params.eventData
        this.additionalEventFields = this.getAdditionalEventFields()
        this.editingFields = false
        this.nextMedicalVisit = this.eventData.item.nextMedicalVisit !== undefined && !this.eventData.item.medicalDischarge
          ? this.eventData.item.nextMedicalVisit
          : null
        this.dischargeDate = this.eventData.item.dischargeDate !== undefined
          ? this.eventData.item.dischargeDate
          : null
        this.exculpatory = this.eventData.item.exculpatory !== undefined
          ? this.eventData.item.exculpatory
          : null
        this.observation = this.eventData.item.observation
      },
      getEventTypeInformation () {
        let withNotice = ''

        if (this.eventData.item.type !== 'ACCIDENT' && this.eventData.type === 'StaffNews') {
          withNotice = this.eventData.item.withNotice ? 'CON AVISO' : 'SIN AVISO'
        }
        return Constants.news_types_text[this.eventData.item.type] + ' ' + withNotice
      },
      checkEventType (type) {
        return this.eventData.item.type === type
      },
      getAdditionalEventFields () {
        const additionalFields = []

        switch (this.eventData.item.type) {
          case Constants.news_types.ACCIDENT:
            additionalFields.push({name: 'Lugar', value: this.eventData.item.inPlant ? 'en Planta' : 'in itinere'})
            additionalFields.push({name: 'Fue denunciado', value: this.eventData.item.informed ? 'si' : 'no'})
            additionalFields.push({
              name: this.eventData.item.left ? 'Se retiró a las' : 'Se ausentó',
              value: this.eventData.item.time ? this.eventData.item.time : 'si'
            })
            break
          case Constants.news_types.EARLY:
            additionalFields.push({name: 'Hora de salida', value: dateAndTime.time24ToAMPM(this.eventData.item.time)})
            break
          case Constants.news_types.LATE:
            additionalFields.push({name: 'Hora de ingreso', value: dateAndTime.time24ToAMPM(this.eventData.item.time)})
            break
          case Constants.news_types.HOLIDAYS:
            const lastDay = new Date(this.eventData.item.incorporationDate)
            lastDay.setDate(lastDay.getDate() - 1)
            const holidaysRange = `${dateAndTime.dateDayAndMonth(this.eventData.item.initialDate)} - ${dateAndTime.dateDayAndMonth(lastDay)}`
            additionalFields.push({name: 'Vacaciones periodo', value: holidaysRange})
            break
          case Constants.event_types.BIRTH_LICENSE:
          case Constants.event_types.DEATH_LICENSE:
          case Constants.event_types.SINDICAL_LICENSE:
          case Constants.event_types.UNION_LICENSE:
            additionalFields.push({
              name: 'Fecha de baja',
              value: dateAndTime.dateWithTimeLong(this.eventData.item.initialDate)
            })
            additionalFields.push({
              name: 'Fecha de reincorporación',
              value: dateAndTime.dateWithTimeLong(this.eventData.item.incorporationDate)
            })
            break
          case Constants.event_types.MEDICAL_ORDER:
            additionalFields.push({
              name: 'Fecha de retiro de orden',
              value: dateAndTime.dateWithTimeLong(this.eventData.item.medicalAppointment)
            })
            break
        }
        return additionalFields
      },
      updateField (e) {
        this.$store.commit('events/updateToSubmitField', {field: e.target.name, value: e.target.value})
      },
      editFields () {
        if (this.editingFields) {
          const data = {
            payload: {},
            type: this.eventData.type,
            id: this.eventData.item._id
          }

          if (this.observation) {
            data.payload.observation = this.observation
          }
          if (this.exculpatory) {
            data.payload.exculpatory = this.exculpatory
          }
          if (this.nextMedicalVisit && !this.eventData.item.medicalDischarge) {
            data.payload.nextMedicalVisit = this.nextMedicalVisit
          }
          if (this.dischargeDate && this.eventData.item.medicalDischarge) {
            data.payload.dischargeDate = this.dischargeDate
          }
          this.$store.dispatch('events/updateEventFields', data)
            .then(
              () => {
                this.$snotifyWrapper.success('Los datos fueron modificados exitosamente')
              })
            .catch(
              () => {
                this.$snotifyWrapper.error('Ocurrió un error al modificar los datos')
              })
        }
        this.editingFields = !this.editingFields
      },
      closeModal () {
        this.$modal.hide('event-information')
      },
      convertFullDateToHTMLDate (date) {
        return this.$moment(date).format('YYYY-MM-DD')
      }
    },
    computed: {
      permission () {
        const ROLES = this.$constants.ROLES
        return this.$can(authorize(ROLES.JEFE_PLANTA, ROLES.ADMINISTRACION))
      },
      fieldsEditIcon () {
        return `../../../../../static/img/${this.editingFields ? 'tickgrey' : 'pencilgrey'}.svg`
      },
      ...mapState('events', [
        'dataToSubmit'
      ]),
      minDate () {
        const today = new Date()
        return this.$moment(today).format('YYYY-MM-DD')
      },
      collaboratorLegajo () {
        let legajo = ''
        if (this.timelineData.collaborator.hasOwnProperty('legajo') && this.timelineData.collaborator.legajo !== null) {
          legajo = `${this.timelineData.collaborator.legajo} - `
        }
        return legajo
      },
      isMedicalReportWithMedicalDischarge () {
        return this.eventData.item.type === this.$constants.event_types.MEDICAL_REPORT &&
          this.eventData.item.medicalDischarge
      },
      isMedicalReportWithLicense () {
        return this.eventData.item.type === this.$constants.event_types.MEDICAL_REPORT &&
          !this.eventData.item.medicalDischarge
      }
    }
  }
</script>

<style lang="scss" scoped>

  @import "../../../../assets/styles/variables";

  h1 {
    width: 95%;
  }

  h3 {
    color: $secondary-color;
  }

  h4 {
    margin: 4px 0;
    font-size: 16px;
    color: #acacac;
  }

  .content-container {
    padding-left: 10px;
  }

  .additional-field {
    font-size: 16px;
    font-family: 'Roboto Mono';
    color: #acacac;
  }

  .reporter {
    font-size: 18px;
    font-weight: 600;
    color: $secondary-darker;
  }

  .action-button {
    font-size: 22px;
    cursor: pointer;

    &:hover {
      color: #d3d3d3;
    }
  }

  .cancel-button {
    color: #afc3db;
    margin-left: 15px;
  }

  .confirm-button {
    background-color: rgba(255, 255, 255, 0);
    color: #ffffff;
    margin-right: 15px;
  }

  .observations-input {
    position: relative;
    margin-top: 5px;
    margin-bottom: 20px;
    padding-left: 10px;
    width: 95%;
    min-height: 100px;
    resize: none;
    border: 2px solid $primary-light;

    &:disabled {
      background-color: #e6e6e6;
      border: none;
    }
  }

  .exculpatory-label {
    color: #ffffff;
  }

  .exculpatory-input {
    margin-top: 5px;
    margin-bottom: 20px;
    padding-left: 10px;
    padding-top: 10px;
    border: none;
    width: 95%;
    min-height: 100px;
    resize: none;
    color: #ffffff;

    &.active {
      background-color: $secondary-color;
      border: 2px solid #ffffff;
    }

    &:disabled {
      background-color: rgba(1, 1, 1, 0.2);
    }
  }

  .exculpatory-container {
    background-color: $secondary-color;
    height: 185px;
    padding: 5px 15px;
  }

  .icon {
    width: 20px;
    height: 20px;
    position: absolute;
    right: 8%;
    bottom: 90px;
    cursor: pointer;
  }

  .cross-icon {
    display: inline-block;
    width: 18px;
    height: 18px;
    cursor: pointer;
    margin-left: 5px;
  }

  .thrash-icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  .top-container {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }

  .fields-edit-icon {
    width: 20px;
    height: 20px;
    position: absolute;
    right: 8%;
    cursor: pointer;
  }

  .inline-date-field {
    display: inline-block;
    padding: 0;
    margin: 0;
    width: 135px;
  }

  .spinner {
    width: 20px;
    height: 20px;
    position: absolute;
    right: 8%;
  }

  @media (max-width: 480px) {
    .spinner {
      right: 11%;
    }

    .fields-edit-icon {
      right: 11%;
    }
  }

</style>
