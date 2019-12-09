<template>
  <div class="container">
    <div class="date-line-container">
      <figure class="circle"></figure>
      <figure class="line"></figure>
    </div>

    <div class="event-card" @click="showEventSelector()">
      <img class="plus-icon" src="../../../../static/img/icons-events/plus.svg" title="Agregar evento">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'EventCardAddItem',
    components: {},
    data () {
      return {}
    },
    props: {
      timeline: {
        type: String,
        required: true
      },
      collaborator: {
        type: String,
        required: true
      }
    },
    methods: {
      showEventSelector: function () {
        this.$store.commit('events/updateSelectedTimeline', {timeline: this.timeline})
        this.$store.commit('events/updateSelectedCollaborator', {collaborator: this.collaborator})
        this.$modal.show('new-timeline-event')
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
