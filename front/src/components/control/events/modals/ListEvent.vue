<template>
  <modal width="100%"
         height="auto"
         :max-width="400"
         :scrollable="true"
         :adaptive="true"
         @before-open="beforeOpen"
         name="list-event">
    <div style="background:#ee8d66">
      <div class="container-fluid">
        <div class="row">
          <div class="col-xs-12">
            <div class="top-container">
            <!--  <h1> {{ collaboratorLegajo }} {{ timelineData.collaborator.lastname }}, {{ timelineData.collaborator.name
                }} </h1>
              <img src="~@img/trashgrey.svg" class="thrash-icon" title="Eliminar evento">-->
                <img src="~@img/cross.svg" class="cross-icon"
                   title="Cerrar"
                   @click="closeModal()">
            </div>

            <div class="content-container">
             <!--<spinner class="spinner" size="25" :show="$loading.isLoading('events updateEvent')"></spinner>-->
                   <event-card-item v-for="eventData in showCards()"
                       :cardData="eventData"
                       :timelineId="eventLineData._id"
                       @click.native="showEventInformation(eventLineData, eventData)"
                       :key="eventData.item._id"></event-card-item>
              </div>
              </div>
            </div>
          </div>
    </div>
  </modal>
</template>

<script>
  import { mapState } from 'vuex'
  import Spinner from '@/components/SpinnerWrapper.vue'
  import InputDate from '@/components/InputDate'
  import authorize from '@/utils/authorize'
  import EventCardItem from '@/components/control/events/EventCardItem.vue'

  export default {
    name: 'ListEvent',
    components: {InputDate, Spinner, EventCardItem},
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
        exculpatory: null,
        eventLineData: {
          type: Object,
          required: true
        }
      }
    },
    methods: {
      showEventInformation: function (timelineData, eventData) {
        this.$modal.show('event-information', {timelineData, eventData})
      },
      beforeOpen (event) {
        this.eventLineData = event.params.timeline
      },
      closeModal () {
        this.$modal.hide('list-event')
      },
      showCards: function () {
        return this.eventLineData.events
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
    margin-left:340px;
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
