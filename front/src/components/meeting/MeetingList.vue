<template>
  <div class="meeting-list">
    <navigation
      :title="title"></navigation>

    <div
      class="cards-container"
      v-infinite-scroll="fetch"
      infinite-scroll-disabled="notUpdateList"
      infinite-scroll-distance="200">

      <div class="empty" v-show="emptyList">
        No hay reuniones.
      </div>

      <meeting-card
        v-for="(item, index) in meeting.list"
        :key="index"
        :meeting="item"></meeting-card>

      <div class="spinner-container">
        <spinner
          class="spinner" :show="meeting.loading"
          loadingMessage="Cargando reuniones..."></spinner>
      </div>
    </div>
  </div>
</template>

<script>
  import Navigation from '@/components/Navigation.vue'
  import Spinner from '@/components/SpinnerWrapper.vue'
  import MeetingCard from '@/components/meeting/MeetingCard.vue'

  export default {
    name: 'MeetingCreation',
    components: {
      MeetingCard,
      Navigation,
      Spinner
    },
    data () {
      return {
        title: 'Listado de reuniones',
        fullAccess: false,
        meeting: {
          list: [],
          loading: false,
          lastOne: false,
          page: 1
        }
      }
    },
    created () {
      this.fullAccess = this.$can(this.$constants.ROLES.JEFES)
    },
    methods: {
      fetch () {
        this.meeting.loading = true
        const action = (this.fullAccess)
          ? 'meetings/fetch'
          : 'meetings/fetch'

        this.$store.dispatch(action, {page: this.meeting.page})
          .then(this.successFetch)
          .catch(this.failFetch)
      },
      successFetch (response) {
        if (response.meetings.length === 0) {
          this.meeting.lastOne = true
        } else {
          response.meetings.forEach(e => {
            this.meeting.list.push(e)
          })
          this.meeting.page += 1
        }
        this.meeting.loading = false
      },
      failFetch () {
        this.$snotifyWrapper.error('Se produjo un error al buscar las reuniones')
        this.meeting.loading = false
      },
      notUpdate (dataModel) {
        return dataModel.loading || dataModel.lastOne
      },
      empty (dataModel) {
        return dataModel.list.length === 0 && !dataModel.loading
      }
    },
    computed: {
      notUpdateList () {
        return this.notUpdate(this.meeting)
      },
      emptyList () {
        return this.empty(this.meeting)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/_variables.scss";
  @import "~@/assets/styles/_mixins.scss";

  .cards-container {
    position: relative;
    width: 90%;
    margin: 20px auto;
  }

  .spinner-container {
    margin: 25px 0;
  }

  .empty {
    font-size: 20px;
    text-align: center;
    margin-top: 20px;
  }

  .separator {
    height: 0;
    border-top: 3px solid $primary-color;
  }
</style>
