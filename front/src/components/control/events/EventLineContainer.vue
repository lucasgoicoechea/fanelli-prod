<template>
  <div class="line-container" :style="getLineStyle()">
    <div class="top-text">
      <h2 class="line-title">
        <router-link class="link-redirect" :to="profileRedirect">
          {{ collaboratorLegajo }} {{ eventLineData.collaborator.lastname }} {{ eventLineData.collaborator.name }}
        </router-link>
         - {{ getTypeText() }}
      </h2>
      <h5
        class="archive"
        title="Archivar evento"
        v-show="permission"
        @click="archiveTimeline()"> ARCHIVAR </h5>
      <h5
        class="archive"
        title="Archivar evento"
        v-show="permission && eventLineData.archive"
        @click="desarchiveTimeline()"> DESARCHIVAR </h5>  
    </div>

    <horizontal-scrolling-container ref="containerRef" class="horizontal-container">
      <event-card-item v-for="eventData in eventLineData.events"
                       :cardData="eventData"
                       :timelineId="eventLineData._id"
                       @click.native="showEventInformation(eventLineData, eventData)"
                       :key="eventData.item._id"></event-card-item>
      <event-card-add-item v-if="permission && getEventType() !== $constants.news_types.OBSERVATION"
                           :timeline="eventLineData._id"
                           :collaborator="eventLineData.collaborator._id"></event-card-add-item>
    </horizontal-scrolling-container>
  </div>
</template>

<script>
  import HorizontalScrollingContainer from '@/components/containers/HorizontalScrolling.vue'
  import EventCardItem from '@/components/control/events/EventCardItem.vue'
  import EventCardAddItem from '@/components/control/events/EventCardAddItem.vue'
  import Constants from '../../../const.js'
  import authorize from '@/utils/authorize'

  export default {
    name: 'EventLineContainer',
    data: function () {
      return {
        containerRef: ''
      }
    },
    components: {
      EventCardItem,
      EventCardAddItem,
      HorizontalScrollingContainer
    },
    props: {
      eventLineData: {
        type: Object,
        required: true
      }
    },
    methods: {
      getLineStyle: function () {
        let color
        switch (this.eventLineData.events[0].item.type) {
          case Constants.news_types.ABSENT:
            color = '#4672a3'
            break
          case Constants.news_types.ACCIDENT:
            color = '#ff5453'
            break
          case Constants.news_types.EARLY:
            color = '#ed8d47'
            break
          case Constants.news_types.LATE:
            color = '#33547a'
            break
          default:
            color = '#6b6b6b'
        }

        return {'background-color': color}
      },
      getTypeText () {
        return Constants.news_types_text[this.eventLineData.events[0].item.type]
      },
      showEventInformation: function (timelineData, eventData) {
        this.$modal.show('event-information', {timelineData, eventData})
      },
      closeModal () {
        this.$modal.hide('dialog')
      },
      getEventType () {
        return this.eventLineData.events[0].item.type
      },
      archiveTimeline: function () {
        this.$modal.show('dialog', {
          text: '¿Desea archivar los eventos en el historial permanente del colaborador?',
          buttons: [
            {
              title: 'Si',
              handler: () => {
                this.$store.dispatch('events/archiveTimeline', {timeline: this.eventLineData._id})
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
      desarchiveTimeline: function () {
        this.$modal.show('dialog', {
          text: '¿Desea desarchivar los eventos en el historial permanente del colaborador?',
          buttons: [
            {
              title: 'Si',
              handler: () => {
                this.$store.dispatch('events/desarchiveTimeline', {timeline: this.eventLineData._id})
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
      }
    },
    computed: {
      collaboratorLegajo () {
        let legajo = ''
        if (this.eventLineData.collaborator.hasOwnProperty('legajo') && this.eventLineData.collaborator.legajo !== null) {
          legajo = `${this.eventLineData.collaborator.legajo} - `
        }
        return legajo
      },
      profileRedirect () {
        return {
          name: 'profile',
          params: { id: this.eventLineData.collaborator._id }
        }
      },
      permission () {
        const ROLES = this.$constants.ROLES
        return this.$can(authorize(ROLES.JEFE_PLANTA, ROLES.ADMINISTRACION))
      }
    },
    created: function () {
      this.containerRef = 'container' + Math.floor(Math.random() * Math.floor(100000))
    },
    mounted: function () {
      const element = this.$refs.containerRef.$el
      element.scrollLeft = element.scrollWidth - element.clientWidth
    }
  }

</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/variables";

  .line-container {
    width: 100%;
    height: 250px;
    padding: 5px 0 50px 0;
  }

  .line-title {
    font-size: 1.875em;
    color: #ffffff;
    margin: 5px 15px 10px 10px;
    display: inline-block;
  }

  .horizontal-container {
    margin: 5px 10px 0 10px;
    padding-left: 20px;
  }

  .archive {
    margin-right: 40px;
    font-size: 20px;
    color: #ffffff;
    cursor: pointer;

    &:hover {
      color: #d3d3d3;
    }
  }

  .create-event {
    margin-right: 40px;
    font-size: 20px;
    color: #ffffff;
    cursor: pointer;

    &:hover {
      color: #d3d3d3;
    }
  }

  .top-text {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .link-redirect {
    color: white;

    &:hover {
      color: #c4c4c4;
    }
  }

  @media (max-width: 430px) {

    .line-title {
      font-size: 20px;
    }

    .archive {
      font-size: 16px;
    }

  }

  @media (max-width: 340px) {

    .line-title {
      font-size: 15px;
    }

    .archive {
      font-size: 12px;
    }

  }
</style>
