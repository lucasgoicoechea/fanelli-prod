<template>
  <div>
    <div>
      Solicitud para <span class="time"> {{ days }} </span>
    </div>
    <div>
      Requerido por {{ requestByFabricOrCollaborator }}
    </div>
    <div>
      {{ temporalOrPermanent }}
    </div>
    <div>
      Cambio a turno {{ request.data.toShift.value }} ({{ request.data.toShift.description }})
    </div>
    <div>
      Motivo {{ request.data.reason }}
    </div>
  </div>
</template>

<script>
  import dateAndTime from '@/utils/dateAndTime.js'

  export default {
    name: 'StaffRequestShiftChangeFields',
    props: {
      request: {
        type: Object,
        required: true
      }
    },
    computed: {
      days () {
        if (this.request.data.temporary) {
          return `${dateAndTime.dateDayAndMonth(this.request.data.days.from)} hasta ${dateAndTime.dateDayAndMonth(this.request.data.days.to)}`
        } else {
          return `${dateAndTime.dateDayAndMonth(this.request.data.days.from)}`
        }
      },
      temporalOrPermanent () {
        return this.request.data.temporary ? 'Temporal' : 'Permanente'
      },
      requestByFabricOrCollaborator () {
        return this.request.data.byFabric ? 'fábrica' : 'colaborador'
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
