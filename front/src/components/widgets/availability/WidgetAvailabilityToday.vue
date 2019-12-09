<template>
  <div class="widget-availability-today">

    <div class="tabs">
      <div class="line"></div>
      <div class="tab prev" @click="prevDay">
        <span v-if="isMobile" class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
        <span v-else>Anterior</span>
      </div>
      <div class="tab">{{ friendlyDate }}</div>
      <div class="tab next" @click="nextDay">
        <span v-if="!isMobile">Siguiente</span>
        <span v-else class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
      </div>
    </div>

    <widget-availability-container :dateRange="dateRange"></widget-availability-container>
  </div>
</template>

<script>
  import WidgetAvailabilityContainer from '@/components/widgets/availability/WidgetAvailabilityContainer'
  import dateAndTime from '@/utils/dateAndTime'

  export default {
    name: 'WidgetAvailabilityToday',
    components: {
      WidgetAvailabilityContainer
    },
    data () {
      return {
        dateRange: {
          from: new Date(),
          to: new Date()
        }
      }
    },
    methods: {
      next (date) {
        date.setDate(date.getDate() + 1)
        return new Date(date)
      },
      prev (date) {
        date.setDate(date.getDate() - 1)
        return new Date(date)
      },
      prevDay () {
        this.dateRange.from = this.prev(this.dateRange.from)
        this.dateRange.to = this.prev(this.dateRange.to)
      },
      nextDay () {
        this.dateRange.from = this.next(this.dateRange.from)
        this.dateRange.to = this.next(this.dateRange.to)
      }
    },
    computed: {
      friendlyDate () {
        return dateAndTime.dateDayAndMonth(this.dateRange.from)
      },
      isMobile () {
        return this.$mq === 'mobile' || this.$mq === 'iphone5'
      }
    }
  }
</script>

<style lang="scss" scoped>

  .widget-availability-today {
    width: 100%;
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .tabs {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: #777;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);

    .tab {
      width: 33%;
      padding: 12px;
      text-align: center;
      color: white;
      font-weight: bold;
      cursor: pointer;
    }

    .line {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 0;
      width: 33%;
      border: 3px solid white;
      transition: all 0.2s;
      transform: translateX(100%);
    }
  }
</style>
