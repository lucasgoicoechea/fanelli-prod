<template>
  <div class="notification-epp">
    <notification-wrapper
      :icon="icon"
      paddingIcon="12px"
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
    name: 'NotificationNewRequest',
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
        return 'red'
      },
      headerText: function () {
        return 'NUEVA NOVEDAD'
      },
      secondaryHeaderShow: function () {
        return true
      },
      secondaryHeaderText: function () {
        let type = ''
        switch (this.notification.data.subType) {
          case 'ABSENT':
            type = 'Falta'
            break
          case 'LATE':
            type = 'Llegada tarde'
            break
          case 'EARLY':
            type = 'Salida temprana'
            break
          case 'ACCIDENT':
            type = 'Accidente'
            break
          case 'OBSERVATION':
            type = 'Observación'
            break
          default:
            type = 'Notificación'
        }
        return type.toUpperCase()
      },
      icon: function () {
        let type = ''
        switch (this.notification.data.subType) {
          case 'ABSENT':
            type = 'AUSENCIA'
            break
          case 'LATE':
            type = 'TARDE'
            break
          case 'EARLY':
            type = 'SALE-ANTES'
            break
          case 'ACCIDENT':
            type = 'ACCIDENTE'
            break
          case 'OBSERVATION':
            type = 'OBSERVACION'
            break
          default:
            type = 'OBSERVACION'
        }
        return type
      },
      secondaryHeaderBackground: function () {
        return '#f98484'
      },
      detailtText: function () {
        const observation =
          (this.notification.data.hasOwnProperty('observation') &&
            this.notification.data.observation !== null)
            ? this.notification.data.observation
            : ''
        return `para ${this.notification.data.collaborator.lastname} - ${observation}`
      }
    }
  }
</script>
