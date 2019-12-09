<template>
  <div class="notification-epp">
    <notification-wrapper
      :icon="notification.type"
      :headerBackground="headerBackground"
      paddingIcon="10"
      :headerText="headerText"
      :secondaryHeaderShow="secondaryHeaderShow"
      :secondaryHeaderBackground="secondaryHeaderBackground"
      :secondaryHeaderText="secondaryHeaderText"
      :detailtText="detailtText"
      :detailtDate="notification.date"
      :isSeen="notification.seen"></notification-wrapper>
  </div>
</template>

<script>
  import NotificationWrapper from '@/components/notifications/NotificationWrapper.vue'

  export default {
    name: 'NotificationEpp',
    components: {NotificationWrapper},
    props: {
      notification: {
        type: Object,
        required: true
      }
    },
    methods: {},
    computed: {
      headerBackground: function () {
        switch (this.notification.data.subType) {
          case 'APPROVED':
            return '#61c159'
          case 'REJECTED':
            return '#ff6666'
          case 'RESOLVED':
            return '#003772'
          case 'DELIVERED':
            return '#ea8c3e'
          case 'PENDING':
            return '#0556af'
          default:
            return '#ea8c3e'
        }
      },
      headerText: function () {
        let type = ''
        switch (this.notification.data.subType) {
          case 'APPROVED':
            type = 'aprobada'
            break
          case 'REJECTED':
            type = 'denegada'
            break
          case 'RESOLVED':
            type = 'recibida'
            break
          case 'DELIVERED':
            type = 'entregada'
            break
          case 'PENDING':
            type = 'pendiente'
            break
          default:
            type = ''
        }
        return `SOLICITUD DE EPP ${type.toUpperCase()}`
      },
      secondaryHeaderShow: function () {
        return this.notification.data.subType === 'APPROVED' ||
          this.notification.data.subType === 'REJECTED'
      },
      secondaryHeaderText: function () {
        if (this.notification.data.approvedBy) {
          return `por ${this.notification.data.approvedBy.lastname}`
        } else {
          return ''
        }
      },
      secondaryHeaderBackground: function () {
        switch (this.notification.data.subType) {
          case 'APPROVED':
            return '#a0da9b'
          case 'REJECTED':
            return '#ff8585'
          default:
            return '#a0da9b'
        }
      },
      detailtText: function () {
        return `para ${this.notification.data.collaborator.lastname}`
      }
    }
  }
</script>
