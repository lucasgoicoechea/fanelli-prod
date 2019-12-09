<template>
  <div>
    <div>
      Solicitud para <span class="time"> {{ days }} </span>
    </div>
    <div>
      Desde <span class="time"> {{ this.request.data.time.from | formatToAMPM }} </span> hasta <span class="time"> {{ this.request.data.time.to | formatToAMPM }} </span>
    </div>
    <div>
      Motivo {{ request.data.reason }}
    </div>
  </div>
</template>

<script>
  import dateAndTime from '@/utils/dateAndTime.js'

  export default {
    name: 'StaffRequestLeaveFields',
    props: {
      request: {
        type: Object,
        required: true
      }
    },
    computed: {
      days () {
        return this.request.data.days.map(e => `${dateAndTime.dateWithTimeLong(e)}`).join(', ')
      }
    },
    filters: {
      formatDate (val) {
        return dateAndTime.dateWithTimeLong(val)
      },
      formatToAMPM (val) {
        return dateAndTime.time24ToAMPM(val)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/variables";

  .time {
    font-family: monospace;
    color: $time-date;
  }

</style>
