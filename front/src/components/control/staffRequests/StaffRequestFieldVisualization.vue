<template>
  <component :is="request.type" :request="request"></component>
</template>

<script>
  import StaffRequestLeaveFields from '@/components/control/staffRequests/StaffRequestLeaveFields.vue'
  import StaffRequestShiftChangeFields from '@/components/control/staffRequests/StaffRequestShiftChangeFields.vue'
  import StaffRequestExtraHoursFields from '@/components/control/staffRequests/StaffRequestExtraHoursFields.vue'

  export default {
    name: 'StaffRequestFieldVisualization',
    components: {
      LEAVE: StaffRequestLeaveFields,
      SHIFT_CHANGE: StaffRequestShiftChangeFields,
      EXTRA_HOURS: StaffRequestExtraHoursFields
    },
    props: {
      request: {
        type: Object,
        required: true
      }
    }
  }
</script>

<style scoped>

</style>
