<template>
  <div class="form-element-preferences">
    <h4>{{ element | capitalize }}</h4>
    <div class="options">
      <a
        v-for="option in getByType(element).models"
        @click="onSelectedModel(option)"
        :class="isSelected(option)">{{ option.model | capitalize }}</a>
    </div>
    <div class="suboption" v-if="elementHasOptionSize(element)">
      <h5>Tamaño</h5>
      <div class="options">
        <a
          class="square"
          v-for="option in getByType(element).modelSelected.sizes"
          @click="onSelectedOption(option, getByType(element).colourSelected)"
          :class="{selected: getByType(element).sizeSelected === option }">{{ option | capitalize }}</a>
      </div>
    </div>
    <div class="suboption" v-if="elementHasOptionColour(element)">
      <h5>Color</h5>
      <div class="options">
        <a
          v-for="option in getByType(element).modelSelected.colours"
          @click="onSelectedOption(getByType(element).sizeSelected, option)"
          :class="{selected: getByType(element).colourSelected === option}">{{ option | capitalize }}</a>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'form-element-preferences',
    props: {
      element: {
        type: String
      }
    },
    data () {
      return {
        options: {}
      }
    },
    methods: {
      onSelectedModel (option) {
        this.$store.commit('catalog/selectModel', {type: this.getByType(this.element).type, modelSelected: option})
      },
      onSelectedOption (size, colour) {
        this.$store.commit('catalog/selectOption', {type: this.getByType(this.element).type, size, colour})
      },
      isSelected (option) {
        return {selected: this.getByType(this.element).modelSelected === option}
      }
    },
    computed: {
      ...mapGetters('catalog', [
        'getByType',
        'elementHasOptionColour',
        'elementHasOptionSize'
      ])
    }
  }
</script>

<style lang="scss" scoped>

  h4 {
    margin: 10px 4px;
    font-weight: bold;
    color: rgb(38, 23, 116);
  }

  .options {
    font-weight: bold;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: flex-start;
  }

  a {
    color: rgb(236, 110, 37);
    text-align: center;
    padding: 10px;
    margin: 5px;
    min-width: 15vw;
    border: solid 2px rgb(236, 110, 37);
    border-radius: 25px;
    text-decoration: none;
    cursor: pointer;

    &.selected {
      color: white;
      background-color: rgb(236, 110, 37);
    }

    &.square {
      border-radius: 0;
      min-width: 5vh;
    }
  }
</style>
