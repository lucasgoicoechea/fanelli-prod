<!--
  Notification component works like Strategy pattern
  using 'Dynamic Components' feature (<component/> and :is prop).

  Dynamic Components allow switch between components when Vue's
  <component/> element change the 'is' attribute to new string
  that represent the name of a registered component.
  -->
<template>
  <div class="notification-base">
    <component v-bind:is="notification.type" :notification="notification"
               @click.native="goNotification(notification)"></component>
  </div>
</template>

<script>
  import NotificationEpp from '@/components/notifications/NotificationEPP.vue'
  import NotificationCumple from '@/components/notifications/NotificationCumple.vue'
  import NotificationNewRequest from '@/components/notifications/NotificationNewRequest.vue'
  import NotificationShiftChange from '@/components/notifications/NotificationShiftChange.vue'
  import NotificationExtraHours from '@/components/notifications/NotificationExtraHours.vue'
  import NotificationLeave from '@/components/notifications/NotificationLeave.vue'
  import NotificationOccurrence from '@/components/notifications/NotificationOccurrence.vue'

  export default {
    name: 'NotificationBase',
    components: {
      EPP: NotificationEpp,
      CUMPLE: NotificationCumple,
      NOVEDAD: NotificationNewRequest,
      'SHIFT_CHANGE': NotificationShiftChange,
      'EXTRA_HOURS': NotificationExtraHours,
      LEAVE: NotificationLeave,
      OCCURRENCE: NotificationOccurrence
    },
    props: {
      notification: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        notificationType: 'epp'
      }
    },
    methods: {
      goNotification (notification) {
        if (!notification.seen) {
          this.$store.dispatch('notifications/markAsRead', notification._id)
        }
        this.$router.push(notification.url)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";
</style>
