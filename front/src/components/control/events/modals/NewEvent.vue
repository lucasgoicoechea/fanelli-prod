<template>
  <modal width="100%"
         height="auto"
         :max-width="800"
         :scrollable="true"
         :adaptive="true"
         name="new-timeline-event"
         @before-open="beforeOpen">
    <div class="container-fluid">
      <h2> Selecciona el evento que se desencadenó a partir del anterior </h2>
      <div class="events-container">
        <article v-for="event in eventTypes"
                 class="event-type-card"
                 @click="changeEventType(event.type)"
                 :class="{'active': isActive(event.type) }">
          <h4 class="event-type-name"
              :class="{'active': isActive(event.type) }">{{ event.name }}</h4>
        </article>
      </div>
      <component :is="eventType" class="col-md-10 event-form"></component>
    </div>
    <div class="footer">
      <transition name="fade" mode="out-in">
          <span class="cancel-button action-button"
                @click="closeModal()">CANCELAR</span>
      </transition>
      <blockable-button class="confirm-button action-button"
                        :clickMethod="addEvent"
                        :isLoading="loading"
                        buttonBackgroundColor="transparent"
                        color="#afc3db"
                        buttonWidth="150px">CONFIRMAR
      </blockable-button>
    </div>
  </modal>
</template>

<script>
  import MedicOrder from '@/components/news/NewsMedicOrderControl.vue'
  import MedicInform from '@/components/news/NewsMedicInformControl.vue'
  import GenericLicense from '@/components/news/NewsGenericLicenseControl.vue'
  import BlockableButton from '@/components/buttons/blockableButton.vue'
  import Constants from '@/const.js'
  import {mapState} from 'vuex'

  export default {
    name: 'NewEvent',
    components: {
      BlockableButton,
      MEDICAL_ORDER: MedicOrder,
      MEDICAL_REPORT: MedicInform,
      LICENSE: GenericLicense
    },
    data () {
      return {
        eventType: Constants.event_types.MEDICAL_ORDER,
        loading: false
      }
    },
    methods: {
      changeEventType: function (type) {
        this.eventType = type
        this.$store.commit('events/resetDataToSubmit')
        this.$store.commit('events/updateSelectedEventType', {event: this.eventType})
      },
      isActive: function (type) {
        return type === this.eventType
      },
      checkEmptyFields: function () {
        switch (this.dataToSubmit.type) {
          case Constants.event_types.UNION_LICENSE:
          case Constants.event_types.BIRTH_LICENSE:
          case Constants.event_types.DEATH_LICENSE:
          case Constants.event_types.SINDICAL_LICENSE:
            if (this.dataToSubmit.exculpatory === undefined ||
              this.dataToSubmit.time === undefined ||
              this.dataToSubmit.type === undefined) {
              return false
            }
            break
          case Constants.event_types.MEDICAL_ORDER:
            if (this.dataToSubmit.medicalAppointment === undefined) {
              return false
            }
            break
          case Constants.event_types.MEDICAL_REPORT:
            if (!this.dataToSubmit.hasOwnProperty('medicalDischarge')) {
              return false
            }

            if (this.dataToSubmit.medicalDischarge === 'true' && this.dataToSubmit.date === undefined) {
              return false
            }
            break
          case Constants.event_types.LICENSE:
            return false
        }
        return true
      },
      addEvent: function () {
        if (!this.checkEmptyFields()) {
          this.$modal.show('dialog', {
            title: 'Información',
            text: 'Por favor rellene los campos necesarios',
            buttons: [
              {
                title: 'Aceptar'
              }
            ]
          })
          return
        }

        this.loading = true
        this.$store.dispatch('events/addEventToTimeline', {eventType: this.eventType})
          .then(() => {
            this.closeModal()
            this.loading = false
          })
          .catch(() => {
            this.closeModal()
            this.loading = false
          })
      },
      beforeOpen: function () {
        this.$store.commit('events/resetDataToSubmit')
        this.eventType = Constants.event_types.MEDICAL_ORDER
      },
      closeModal: function () {
        this.$modal.hide('new-timeline-event')
      }
    },
    computed: {
      ...mapState('events',
        [
          'eventTypes',
          'dataToSubmit'
        ])
    },
    created: function () {
      this.$store.commit('events/updateSelectedEventType', {event: this.eventType})
    }
  }
</script>

<style lang="scss" scoped>

  @import "../../../../assets/styles/variables";

  h2 {
    font-size: 22px;
    padding: 5px 10px;
    text-align: center;
  }

  .event-type-card {
    width: 230px;
    height: 45px;
    background-color: #ebebeb;
    cursor: pointer;
    padding: 15px;
    margin: 10px;
    display: flex;
    justify-content: center;
    align-items: center;

    &.active {
      background-color: $secondary-color;
    }
  }

  .event-type-name {
    font-size: 18px;
    font-weight: 600;
    color: #000000;

    &.active {
      color: #ffffff;
      font-weight: 300;
    }
  }

  .events-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }

  .event-form {
    margin: 20px 0 10px 10px;
  }

  .footer {
    height: 70px;
    width: 100%;
    margin-top: 15px;
    background-color: $secondary-color;
    display: flex;
    justify-content: space-between;
    align-items: center;
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

  .fade-enter-active {
    transition: opacity 1s;
  }

  .fade-leave-active {
    opacity: 0;
    will-change: opacity;
  }

</style>
