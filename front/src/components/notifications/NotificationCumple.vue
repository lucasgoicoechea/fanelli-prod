<template>
  <div class="notification-cumple">
    <notification-wrapper
      :icon="notification.type"
      :headerBackground="headerBackground"
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
    name: 'NotificationCumple',
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
        return '#7178C2'
      },
      headerText: function () {
        return `Hoy cumple años ${this.notification.data}`
      },
      secondaryHeaderShow: function () {
        return false
      },
      secondaryHeaderText: function () {
        return `${this.notification.data}`
      },
      secondaryHeaderBackground: function () {
        return '#ffffff'
      },
      detailtText: function () {
        return `${this.notification.data}`
      }
    }
  }
</script>
