<template>
  <div class="container">
    <div class="date-line-container">
      <figure class="circle"></figure>
      <div class="event-time">{{ cardData.item.created_at | moment("DD-MM-YYYY h:mm:ss A") }}</div>
      <figure class="line"></figure>
    </div>

    <div class="event-card">
      <div class="top-container">
        <header class="event-type" :title="getEventType()">
          {{ getEventType() }}
        </header>

        <img src="/static/img/cross.svg" class="cross-delete"
             title="Eliminar evento"
             v-if="permission"
             @click.stop="deleteEvent">
      </div>

      <div class="event-reporter truncate" :title="getReporterName()">
        Reportó: {{ getReporterName() }}
      </div>

      <div v-if="cardData.item.observation" class="event-observation" :title="cardData.item.observation">
        Observación: {{ cardData.item.observation }}
      </div>
    </div>
    <form v-if="!cardData.item.exculpatory && cardData.type === 'StaffNews'"
          @submit.prevent="addExculpatory">
      <input class="discharge-input"
             placeholder="Añadir descargo"
             v-model="exculpatory"
             @click.stop>
    </form>
    <div v-else-if="cardData.item.exculpatory"
         class="discharge-view"
         :title="cardData.item.exculpatory">
      Descargo: {{cardData.item.exculpatory}}
    </div>
    <div v-else class="blank-card">
    </div>
  </div>
</template>

<script>
  import Constants from '@/const.js'
  import authorize from '@/utils/authorize'

  export default {
    name: 'EventCardItem',
    components: {},
    data () {
      return {
        exculpatory: ''
      }
    },
    props: {
      cardData: {
        type: Object,
        required: true
      },
      timelineId: {
        type: String,
        required: true
      }
    },
    methods: {
      getEventType () {
        return Constants.news_types_text[this.cardData.item.type]
      },
      getReporterName () {
        return `${this.cardData.item.creator.lastname} ${this.cardData.item.creator.name}`
      },
      closeModal () {
        this.$modal.hide('dialog')
      },
      deleteEvent () {
        this.$modal.show('dialog', {
          text: `¿Desea eliminar el evento "${this.getEventType()}"?`,
          buttons: [
            {
              title: 'Si',
              handler: () => {
                this.$store.dispatch('events/deleteEventFromTimeline', {
                  eventsTimelineId: this.timelineId, eventId: this.cardData.item._id
                })
                  .then(() => {
                  })
                  .catch(() => {
                  })
                this.closeModal()
              }
            },
            {
              title: 'No'
            }
          ]
        })
      },
      addExculpatory () {
        this.$modal.show('dialog', {
          text: `¿Desea agregar el descargo?`,
          buttons: [
            {
              title: 'Si',
              handler: () => {
                const data = {
                  payload: {
                    exculpatory: this.exculpatory
                  },
                  type: Constants.staff_action_types.STAFF_NEWS,
                  id: this.cardData.item._id
                }
                this.$store.dispatch('events/updateEventFields', data)
                  .then(
                    () => {
                      this.$snotifyWrapper.success('Los datos fueron modificados exitosamente')
                      this.closeModal()
                    })
                  .catch(
                    () => {
                      this.$snotifyWrapper.error('Ocurrió un error al modificar los datos')
                      this.closeModal()
                    })
              }
            },
            {
              title: 'No'
            }
          ]
        })
      }
    },
    computed: {
      permission () {
        const ROLES = this.$constants.ROLES
        return this.$can(authorize(ROLES.JEFE_PLANTA, ROLES.ADMINISTRACION))
      }
    }
  }

</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/variables";

  .container {
    height: 140px;
    width: 280px;
    min-width: 280px;
    padding: 0;
    margin-right: 0;
    margin-left: 30px;
  }

  .top-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .date-line-container {
    position: relative;
  }

  .truncate {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .event-time {
    font-family: monospace;
    color: #ffffff;
    text-align: center;
    margin-bottom: 1px;
    width: 250px;
  }

  .circle {
    background-color: #ffffff;
    border-radius: 100%;
    height: 30px;
    width: 30px;
    left: -45px;
    top: 5px;
    position: absolute;
  }

  .line {
    display: inline-block;
    margin-bottom: 20px;
    bottom: 20px;
    width: 250px;
    height: 6px;
    background: rgba(255, 255, 255, 0.5)
  }

  .event-card {
    width: 250px;
    height: 65px;
    background-color: #ffffff;
    padding: 0 7px;
    cursor: pointer;
    border-top-left-radius: $card-border-radius;
    border-top-right-radius: $card-border-radius;
  }

  .event-reporter {
    margin: 0;
    color: #4f4f4f;
  }

  .event-type {
    font-size: 18px;
    font-weight: 300;
    color: $secondary-color;
    background-color: #ffffff;
    width: 250px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .discharge-area {
    height: 21px;
    width: 250px;
    background-color: rgba(1, 1, 1, 0.3);
  }

  .discharge-input {
    width: 250px;
    font-size: 11px;
    padding: 3px 5px;
    margin: 0;
    border-bottom: none;
    border-bottom-left-radius: $card-border-radius;
    border-bottom-right-radius: $card-border-radius;
    background-color: rgba(1, 1, 1, 0.4);
    color: #ffffff;

    &:focus {
      outline: none;
    }
  }

  .discharge-view {
    font-size: 11px;
    padding: 3px 7px;
    background-color: rgba(1, 1, 1, 0.4);
    color: #ffffff;
    width: 250px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    border-bottom-left-radius: $card-border-radius;
    border-bottom-right-radius: $card-border-radius;
  }

  .event-observation {
    color: #949494;
    font-size: 12px;
    width: 230px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cross-delete {
    width: 12px;
    height: 12px;
  }

  .cross-delete path {
    fill: red;
  }

  .blank-card {
    background-color: #ffffff;
    height: 20px;
    width: 250px;
    border-bottom-left-radius: $card-border-radius;
    border-bottom-right-radius: $card-border-radius;
    cursor: pointer;
  }

  ::placeholder {
    color: #ffffff;
    opacity: 1;
  }

  :-ms-input-placeholder {
    color: #ffffff;
  }

</style>
