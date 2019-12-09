<template>
  <div class="notification-epp">
    <notification-wrapper
      :icon="icon"
      paddingIcon="10px"
      :headerBackground="headerBackground"
      :headerText="headerText"
      :secondaryHeaderShow="secondaryHeaderShow"
      :secondaryHeaderBackground="secondaryHeaderBackground"
      :secondaryHeaderText="secondaryHeaderText"
      secondaryHeaderTextColor="#841037"
      :detailtText="detailtText"
      :detailtDate="notification.date"
      :isSeen="notification.seen"></notification-wrapper>
  </div>
</template>

<script>
  import NotificationWrapper from '@/components/notifications/NotificationWrapper.vue'

  export default {
    name: 'NotificationOccurrence',
    components: {NotificationWrapper},
    props: {
      notification: {
        type: Object,
        required: true
      }
    },
    computed: {
      headerBackground: function () {
        const state = this.notification.data.state
        if (state === this.$constants.OCCURRENCE_STATE.PENDING_RESOLUTION) return '#0556af'
        if (state === this.$constants.OCCURRENCE_STATE.APPROVED) return '#60d558'
        if (state === this.$constants.OCCURRENCE_STATE.REJECTED) return '#f73c39'
      },
      headerText: function () {
        const state = this.notification.data.state
        return `Acontecimiento  ${this.$constants.OCCURRENCE_STATE_READABLE[state]}`
      },
      secondaryHeaderShow: function () {
        const state = this.notification.data.state
        return state !== this.$constants.OCCURRENCE_STATE.PENDING_RESOLUTION
      },
      secondaryHeaderText: function () {
        return this.notification.data.hasOwnProperty('resolvedBy')
          ? `Por ${this.notification.data.resolvedBy.lastname}`
          : ''
      },
      icon: function () {
        return 'ACONTECIMIENTO'
      },
      secondaryHeaderBackground: function () {
        return ''
      },
      detailtText: function () {
        if (this.notification.data.collaborators.length === 1) {
          return `para ${this.notification.data.collaborators[0].lastname}`
        } else {
          return 'varios colaboradores'
        }
      }
    }
  }
</script>
