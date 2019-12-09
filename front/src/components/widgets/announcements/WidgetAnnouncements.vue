<template>
  <div class="widget-announcements">

    <div class="widget-header">
      <h3 class="widget-title">
        Avisos
        <span v-show="!empty">
          {{ currentIndex + 1 }} / {{ announcements.length }}
        </span>
      </h3>

      <button
        class="new-announcement"
        v-show="permission"
        @click="openModal">Crear
      </button>
    </div>

    <div class="widget-container">
      <p
        class="clarification"
        v-show="empty">
        No hay avisos por el momento
      </p>

      <div
        class="pointer up"
        v-show="showPointer"
        @click="prev">
        <img src="/static/img/up-chevron.svg" alt="">
      </div>

      <transition name="component-fade" mode="out-in">
        <widget-announcements-card
          v-if="!empty"
          :key="currentIndex"
          :announcement="announcements[currentIndex]"
          @delete-announcement="deleteAnnouncement"></widget-announcements-card>
      </transition>

      <div
        class="pointer bottom"
        v-show="showPointer"
        @click="next">
        <img src="/static/img/down-chevron.svg" alt="">
      </div>

    </div>
    <widget-announcements-modal @post="post"></widget-announcements-modal>
  </div>
</template>

<script>
  import WidgetAnnouncementsCard from '@/components/widgets/announcements/WidgetAnnouncementsCard'
  import WidgetAnnouncementsModal from '@/components/widgets/announcements/WidgetAnnouncementsModal'

  export default {
    name: 'WidgetAnnouncements',
    components: {
      WidgetAnnouncementsCard,
      WidgetAnnouncementsModal
    },
    data () {
      return {
        announcements: [],
        currentIndex: 0
      }
    },
    created () {
      this.fetch()
    },
    methods: {
      fetch () {
        return this.$store.dispatch('widgets/fetchAnnouncements')
          .then(response => { this.announcements = response.announcements.reverse() })
          .catch(() => this.$snotifyWrapper.warning('No se pudieron recuperar los avisos.'))
      },
      openModal () {
        this.$modal.show('widget-announcements-modal')
      },
      post (announcement) {
        this.announcements.push(announcement)
        this.$modal.hide('widget-announcements-modal')
        this.currentIndex = this.announcements.length - 1
      },
      deleteAnnouncement (id) {
        this.currentIndex = (this.currentIndex === 0)
          ? 0
          : this.currentIndex - 1
        let index = this.announcements.findIndex(e => e._id === id)
        this.announcements.splice(index, 1)
      },
      next () {
        this.currentIndex = (this.currentIndex + 1) % this.announcements.length
      },
      prev () {
        this.currentIndex = (this.currentIndex !== 0)
          ? this.currentIndex - 1
          : this.announcements.length - 1
      }
    },
    computed: {
      empty () {
        return this.announcements.length === 0
      },
      showPointer () {
        return this.announcements.length > 1
      },
      permission () {
        return this.$can(this.$constants.ROLES.ADMINISTRACION) ||
          this.$can(this.$constants.ROLES.JEFE_PLANTA)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .widget-announcements {
    position: relative;
    width: 100%;
    margin: 10px 0;
    background-color: #d9d9d9;
    overflow: hidden;
    border-radius: 5px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
  }

  .widget-header {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: center;
    background-color: #777;
  }

  .widget-title {
    color: white;
    margin: 8px;
    padding: 0;
  }

  .new-announcement {
    position: absolute;
    right: 5px;
    top: 6px;
    color: white;
    text-decoration: none;
    border: 2px solid white;
    border-radius: 4px;
    padding: 2px 10px;
    font-size: medium;
    background-color: transparent;
  }

  .widget-container {
    position: relative;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .pointer {
    cursor: pointer;
    transition: all 0.2s ease;

    &.up {
      margin-bottom: -8px;

      &:hover {
        transform: translateY(-5px);
      }
    }

    &.bottom {
      margin-top: -8px;

      &:hover {
        transform: translateY(5px);
      }
    }

    img {
      width: 15px;
      height: 15px;
    }
  }

  .clarification {
    margin: 0;
    padding: 10px 0;
    text-align: center;
    color: black;
  }

  .component-fade-enter-active {
    animation: animation-enter .2s;
  }

  .component-fade-leave-active {
    animation: animation-leave .2s;
  }

  @keyframes animation-enter {
    0% {
      transform: translateY(-40px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes animation-leave {
    0% {
      transform: translateY(0);
      opacity: 1;
    }
    100% {
      transform: translateY(40px);
      opacity: 0;
    }
  }

</style>
