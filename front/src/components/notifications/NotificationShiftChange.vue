<template>
  <div class="notification-epp">
    <notification-wrapper
      :icon="icon"
      paddingIcon="0"
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
    name: 'NotificationShiftChange',
    components: {NotificationWrapper},
    props: {
      notification: {
        type: Object,
        required: true
      }
    },
    computed: {
      headerBackground: function () {
        const state = (this.notification.data.state) ? this.notification.data.state : 0
        if (state === 0) return '#0556af'
        if (state === 1) return '#60d558'
        if (state === 2) return '#f73c39'
      },
      headerText: function () {
        const state = (this.notification.data.state) ? this.notification.data.state : 0
        return `SOLICITUD DE CAMBIO DE TURNO ${this.$constants.STAFF_REQUEST_STATE_READABLE[state]}`
      },
      secondaryHeaderShow: function () {
        const state = (this.notification.data.state) ? this.notification.data.state : 0
        return (state === 1) || (state === 2)
      },
      secondaryHeaderText: function () {
        const aproved = this.notification.data.hasOwnProperty('approvedBy') ? this.notification.data.approvedBy.lastname : 'Jefe'
        return `Por ${aproved}`
      },
      icon: function () {
        return 'SHIFT_CHANGE'
      },
      secondaryHeaderBackground: function () {
        return ''
      },
      detailtText: function () {
        if (this.notification.data.hasOwnProperty('collaborators')) {
          if (this.notification.data.collaborators.length === 1) {
            return `para ${this.notification.data.collaborators[0].lastname}`
          } else {
            return 'varios colaboradores'
          }
        }
        return `Nueva solicitud`
      }
    }
  }
</script>
