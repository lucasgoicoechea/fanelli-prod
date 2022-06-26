<template>
  <div class="lines-container">
    <div v-if="isTimelineLoading" class="spinner-container">
      <spinner class="spinner" :show="isTimelineLoading" loadingMessage="Cargando novedades..."></spinner>
    </div>
    <div v-else>
    <div  v-if="!isTimelineLoading && timelines_archived.length!=0" > 
      <div v-for="(item, index) in timelines_archived"   :key="index" >   
      <event-line-container :eventLineData="item"></event-line-container>
      </div>
    </div>
      <div class="empty-timelines" v-if="!isTimelineLoading && timelines_archived.length==0">No hay novedades
      </div>
      <div v-else>
        <new-event-modal></new-event-modal>
        <event-information-modal></event-information-modal>
        <v-dialog></v-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import EventLineContainer from '@/components/control/events/EventLineContainer.vue'
  import NewEventModal from '@/components/control/events/modals/NewEvent.vue'
  import EventInformationModal from '@/components/control/events/modals/EventInformation.vue'
  import Spinner from '@/components/SpinnerWrapper.vue'
  import { mapState } from 'vuex'

  export default {
    name: 'EventsIndex',
    components: {
      EventLineContainer,
      Spinner,
      NewEventModal,
      EventInformationModal
    },
    data () {
      return {
        timelinesArchivedLocal: []
      }
    },
    created: function () {
      this.$store.dispatch('events/fetchEventLinesArchived')
      this.timelinesArchivedLocal = this.timelines_archived
    },
    destroyed: function () {
      this.$store.commit('events/reset')
    },
    computed: {
      isTimelineLoading () {
        return this.$loading.isLoading('timeline fetch')
      },
      ...mapState(
        'events', [
          'timelines_archived'
        ])
    }
  }
</script>

<style lang="scss" scoped>

  .lines-container {
    height: 100%;
  }

  .empty-timelines {
    font-size: 20px;
    text-align: center;
    margin-top: 20px;
  }

  .spinner-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }

</style>
