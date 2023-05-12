<template>
  <div class="widget-availability">
    <div class="selector">
      <div class="actual" @click="forceUpdate">Ir a Hoy</div>
      <select v-model="currentMode">
        <option value="today">Diario</option>
        <option value="week">Semanal</option>
      </select>
      <span class="chevron glyphicon glyphicon-chevron-down" aria-hidden="true"></span>
    </div>
    <component v-bind:is="currentMode" :key="forceUpdateView"></component>
  </div>
</template>

<script>
  import WidgetAvailabilityToday from '@/components/widgets/availability/WidgetAvailabilityToday'
  import WidgetAvailabilityWeek from '@/components/widgets/availability/WidgetAvailabilityWeek'

  export default {
    name: 'WidgetAvailability',
    components: {
      today: WidgetAvailabilityToday,
      week: WidgetAvailabilityWeek
    },
    props: {
      mode: {
        type: String,
        required: false,
        default: 'today',
        validator: function (value) {
          return ['today', 'week'].indexOf(value) !== -1
        }
      }
    },
    data () {
      return {
        currentMode: '',
        forceUpdateView: 0
      }
    },
    created () {
      this.currentMode = this.mode
    },
    methods: {
      forceUpdate () {
        this.forceUpdateView += 1
      }
    }
  }
</script>

<style lang="scss" scoped>
  .widget-availability {
    display: flex;
    flex-direction: column;
    position: relative;
    margin: 10px;
    width: 400px;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0px 2px 4px 2px rgba(0, 0, 0, 0.3);
    height: 480px;
  }

  @media (max-width: 480px) {
    .widget-availability {
      margin: 10px;
      width: calc(100% - 20px);
    }
  }

  @media (min-width: 700px) and (orientation: landscape) {
    .widget-availability {
       width: 70%;
    }
  }

  .selector {
    position: relative;
    background-color: #777;
    width: 100%;

    .actual {
      position: absolute;
      cursor: pointer;
      right: 5px;
      top: 8px;
      padding: 4px;
      background-color: transparent;
      color: white;
      border-radius: 4px;
      border: 2px solid white;
    }

    .chevron {
      color: white;
      position: absolute;
      left: calc(50% + 45px);
      top: 16px;
    }

    select {
      cursor: pointer;
      width: 100%;
      text-align: center;
      text-align-last: center;
      text-decoration: none;
      font-size: large;
      background-color: #777;
      border: none;
      color: white;
      font-weight: bold;
      outline: none;
      padding: 10px 5px;
      text-align: center;
      appearance: none;
    }
    select::-ms-expand {	display: none; }
  }
</style>
