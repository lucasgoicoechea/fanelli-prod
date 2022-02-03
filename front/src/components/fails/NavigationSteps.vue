<template>
  <header class="navigation-steps">
    <div class="step" v-bind:class="stepSelect(1)">
      <h4>1. Selección de elementos</h4>
    </div>
    <div class="step" v-bind:class="stepSelect(2)">
      <h4>2. Selección de colaborador</h4>
    </div>
  </header>
</template>

<script>
  export default {
    name: 'NavigationSteps',
    props: {
      title: '',
      step: {
        type: Number,
        default: 1
      }
    },
    methods: {
      stepSelect (step) {
        return {
          selected: this.step === step
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  header {
    position: sticky;
    top: $navigation-height;
    left: 0;
    background-color: rgb(38, 23, 116);
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.26);
    width: 100%;
    display: flex;
    z-index: 9;
    color: white;
    justify-content: center;
    align-items: center;
  }

  .step {
    text-align: center;
    flex-grow: 0;
    flex-basis: 50%;
    padding: 15px 10px;

    h4 {
      margin: 0;
    }
  }

  .selected {
    background-color: rgb(58, 35, 179);
    color: rgba(255, 255, 255, 0.7);
  }


</style>
