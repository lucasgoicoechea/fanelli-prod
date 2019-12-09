<template>
  <div class="widget-announcements-card">
    <div class="announcement-container">
      <p class="date text-select">
        {{ createdAt }}
        <span>- por {{ creator }}</span>
      </p>
      <div
        class="description text-select"
        v-html="announcement.description">
      </div>
    </div>
    <figure
      v-show="permission">
      <img
        v-show="!loading"
        src="/static/img/trash-icon.svg"
        alt="eliminar"
        @click="confirmDelete">
      <spinner :show="loading"></spinner>
    </figure>
  </div>
</template>

<script>
  import dateAndTime from '@/utils/dateAndTime'
  import Spinner from '@/components/SpinnerWrapper'

  export default {
    name: 'WidgetAnnouncementsCard',
    components: {
      Spinner
    },
    props: {
      announcement: {
        type: Object
      }
    },
    methods: {
      confirmDelete () {
        this.$modal.show('dialog', {
          title: 'Confirmación',
          text: '¿Estas seguro de eliminar este aviso?',
          buttons: [
            {
              title: 'Aceptar',
              handler: () => {
                this.deleteAnnouncement()
                this.$modal.hide('dialog')
              }
            },
            {
              title: 'Cancelar',
              handler: this.$modal.hide('dialog')
            }
          ]
        })
      },
      deleteAnnouncement () {
        this.$store.dispatch('widgets/deleteAnnouncement', this.announcement)
          .then(() => this.$emit('delete-announcement', this.announcement._id))
          .catch(() => this.$snotifyWrapper.error('No se pudo eliminar el aviso.'))
      }
    },
    computed: {
      createdAt () {
        return dateAndTime.dateWithTimeLong(new Date(this.announcement.created_at))
      },
      permission () {
        return this.$can(this.$constants.ROLES.ADMINISTRACION) ||
          this.$can(this.$constants.ROLES.JEFE_PLANTA)
      },
      creator () {
        return this.announcement.creator.lastname
      },
      loading () {
        return this.$loading.isLoading('widgets deleteAnnouncement')
      }
    }
  }
</script>

<style lang="scss" scoped>

  .widget-announcements-card {
    position: relative;
    width: 100%;
    background-color: white;
    padding: 10px;
    overflow: hidden;
    margin: 10px 0;
    border-radius: 6px;
    box-shadow: 0px 5px 10px -2px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .date {
    margin: 0 0 5px 0;
    padding: 0;
    color: #2d2d2d;
    font-weight: lighter;
  }

  .description {
    color: black;
  }

  .text-select {
    user-select: text;
  }

  figure {
    margin: 0 10px;
    cursor: pointer;
  }

  img {
    height: 30px;
    width: 30px;
  }

</style>
