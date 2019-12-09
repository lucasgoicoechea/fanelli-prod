<template>
  <div>
    <div>
      Solicitud para <span class="time"> {{ days }} </span>
    </div>
    <div v-if="request.data.time !== null">
      {{ text }} <span class="time"> {{ request.data.time | formatToAMPM }} </span>
    </div>
    <div v-if="request.data.returns">
      Regresa <span class="time"> {{ request.data.returnsTime | formatToAMPM}} </span>
    </div>
    <div v-if="!request.data.returns && request.data.type === 'EARLY'">
      No regresa
    </div>
    <div>
      {{ resolution }}
      <ul v-if="request.data.daysToCompensate.length > 0" class="compensate-date-list">
        <li v-for="data in request.data.daysToCompensate">
          Desde <span class="time"> {{ data.from | formatDate }} </span> hasta <span
          class="time"> {{ data.to | formatDate }} </span>
        </li>
      </ul>
      <div
        v-if="request.data.resolution === $constants.LEAVE_RESOLUTION.COMPENSATE && request.data.daysToCompensate.length === 0">
        No se cargaron dias para compensar
      </div>
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
        return this.request !== null ? this.request.data.days.map(e => dateAndTime.dateDayAndMonth(e)).join(', ') : ''
      },
      resolution () {
        if (!this.request.data.hasOwnProperty('resolution') && this.request.data.daysToCompensate.length > 0) {
          return 'Puede compensar '
        }
        switch (this.request.data.resolution) {
          case this.$constants.LEAVE_RESOLUTION.COMPENSATE:
            return 'Compensa'
          case this.$constants.LEAVE_RESOLUTION.NO_COMPENSATE:
            return `No compensa `
          case this.$constants.LEAVE_RESOLUTION.DAY_OFF:
            return `Franco `
          case this.$constants.LEAVE_RESOLUTION.NO_DEDUCT:
            return `No descuenta `
        }
      },
      compensateDays () {
        return this.request.data.daysToCompensate.map(e => `${dateAndTime.dateDayAndMonth(e)}`).join(', ')
      },
      deduct () {
        return this.request.data.deduct ? 'Descuenta' : 'No descuenta'
      },
      approvedNoCompensate () {
        return !this.request.data.compensate && this.request.data.state !== this.$constants.STAFF_REQUEST_STATE.PENDING_APPROVAL
      },
      text () {
        switch (this.request.data.type) {
          case this.$constants.staff_requests_types.LATE:
            return ' Ingresa a las '
          case this.$constants.staff_requests_types.EARLY:
            return 'Se retira a las'
        }
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
    margin: 2px 0;

    span {
      font-weight: bold;
      color: #7a7a7a;
    }
  }

  .underlined {
    text-decoration: line-through;
  }

  .compensate-date-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

</style>
