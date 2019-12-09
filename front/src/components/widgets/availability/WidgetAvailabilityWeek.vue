<template>
  <div class="widget-availability-week">

    <div class="tabs">
      <div class="line" ref="line"></div>
      <div class="tab" @click="prevWeek">
        <span v-if="isMobile" class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
        <span v-else>Anterior</span>
      </div>
      <div class="tab current">
        {{ friendlyDate }}
      </div>
      <div class="tab" @click="nextWeek">
        <span v-if="!isMobile">Siguiente</span>
        <span v-else class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
      </div>
    </div>

    <widget-availability-container
      cardMode="reduced"
      :dateRange="dateRange"></widget-availability-container>
  </div>
</template>

<script>
  import WidgetAvailabilityContainer from '@/components/widgets/availability/WidgetAvailabilityContainer'
  import dateAndTime from '@/utils/dateAndTime'

  export default {
    name: 'WidgetAvailabilityWeek',
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
    created () {
      this.setRange()
    },
    methods: {
      setRange () {
        this.dateRange.from = new Date()
        const to = new Date(this.dateRange.from)
        to.setDate(to.getDate() + 6)
        this.dateRange.to = to
      },
      prevWeek () {
        this.dateRange.from = this.prev(this.dateRange.from)
        this.dateRange.to = this.prev(this.dateRange.to)
      },
      nextWeek () {
        this.dateRange.from = this.next(this.dateRange.from)
        this.dateRange.to = this.next(this.dateRange.to)
      },
      next (date) {
        date.setDate(date.getDate() + 7)
        return new Date(date)
      },
      prev (date) {
        date.setDate(date.getDate() - 7)
        return new Date(date)
      }
    },
    computed: {
      friendlyDate () {
        if (this.$mq === 'iphone5' || this.$mq === 'mobile') {
          return `
          ${dateAndTime.dateOnlyDayAndMonth(this.dateRange.from)}
          ||
          ${dateAndTime.dateOnlyDayAndMonth(this.dateRange.to)}
          `
        } else {
          return `
          ${dateAndTime.dateDayAndMonth(this.dateRange.from)}
          ||
          ${dateAndTime.dateDayAndMonth(this.dateRange.to)}
          `
        }
      },
      isMobile () {
        return this.$mq === 'mobile' || this.$mq === 'iphone5'
      }
    }
  }
</script>

<style lang="scss" scoped>
  .widget-availability-week {
    width: 100%;
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .tabs {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    background-color: #777;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);

    .tab {
      position: relative;
      width: 25%;
      padding: 12px;
      text-align: center;
      color: white;
      font-weight: bold;
      cursor: pointer;

      &.current {
        flex-grow: 1;
      }
    }

    .line {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 0;
      width: 50%;
      border: 3px solid white;
      transition: all 0.2s;
      transform: translateX(50%);
    }
  }

  @media (max-width: 450px) {
    .tabs {
      .tab {
        width: 23%;
      }
    }
  }
</style>
