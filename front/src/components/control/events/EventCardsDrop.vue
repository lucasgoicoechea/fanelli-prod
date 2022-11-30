<template>
  <div class="container">
    <div class="date-line-container">
      <figure class="circle"></figure>
      <figure class="line"></figure>
    </div>
    
    <div class="event-card" @click="showCards(timeline)">
      <img class="plus-icon" src="../../../../static/img/icons-events/flecha.jpg">
    </div>

    
  </div>
</template>

<script>
  export default {
    name: 'EventCardsDrop',
    components: {},
    data () {
      return {}
    },
    props: {
      timeline: {
        type: Object,
        required: true
      },
      collaborator: {
        type: String,
        required: true
      }
    },
    methods: {
      showCards: function (timeline) {
        this.$modal.show('list-event', {timeline})
      }
    }
  }

</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/variables";

  .container {
    height: 140px;
    width: 280px;
    min-width: 280px;
    padding: 0;
    margin-right: 0;
    margin-left: 30px;
    margin-top: 20px;
  }

  .plus-icon {
    width: 40px;
    height: 40px;
    fill: red;
    filter: brightness(1.1);
    mix-blend-mode: multiply;
  }

  .date-line-container {
    position: relative;
  }

  .circle {
    background-color: #ffffff;
    border-radius: 100%;
    height: 30px;
    width: 30px;
    left: -45px;
    bottom: 15px;
    position: absolute;
  }

  .line {
    display: inline-block;
    margin-bottom: 20px;
    bottom: 20px;
    width: 250px;
    height: 6px;
    background: rgba(255, 255, 255, 0.5)
  }

  .event-card {
    width: 250px;
    height: 86px;
    background-color: rgba(1, 1, 1, 0.2);
    padding: 0 7px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: $card-border-radius;
  }
</style>
