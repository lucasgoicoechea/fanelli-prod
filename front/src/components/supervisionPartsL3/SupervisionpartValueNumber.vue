<template>
  <div class="supervisionpart-value-number" v-bind:class="[bgColor, current]">
    <spinner class="loading" :show="loadingUpdate"></spinner>
    <div v-show="!loadingUpdate">
      <div v-if="isCurrent">
        <input type="number" :value="item.auxExtra" @input="updateInput" autofocus>
        <span v-if="!itemHasValue" class="defaultElement">...</span v-else>
      </div>
      <div v-else>
        <p v-if="itemHasValue"> {{itemCurrentExtra}} </p>
        <span v-show="itemHasComments" class="countObservations">{{itemCountComments}}</span>
        <span v-show="!itemHasValue" class="defaultElement">...</span>
      </div>
    </div>
  </div>
</template>

<script>
  import Spinner from '@/components/Spinner.vue'

  export default {
    name: 'SupervisionpartValueNumber',
    components: {
      Spinner
    },
    props: {
      item: {
        type: Object,
        required: true
      },
      isCurrent: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {}
    },
    created: function () {
    },
    methods: {
      updateInput (e) {
        this.$store.commit('supervisionpartsLTres/updateAuxExtra', {sector: this.item.hour.sector, value: e.target.value})
      }
    },
    computed: {
      current: function () {
        return {
          active: this.isCurrent
        }
      },
      bgColor: function () {
        return {
          success: this.itemHasValue && this.itemCurrentValue,
          error: this.itemHasValue && !this.itemCurrentValue
        }
      },
      sector: function () {
        return this.item.hour.sector
      },
      itemHasValue: function () {
        return this.item.hasOwnProperty('last') && this.item.last !== null
      },
      itemCurrentValue: function () {
        return this.item.last.value
      },
      itemCurrentExtra: function () {
        return (this.item.last.hasOwnProperty('extra')) ? this.item.last.extra : '-'
      },
      itemHasComments: function () {
        return this.itemCountComments > 1
      },
      itemCountComments: function () {
        return this.item.comments.length + this.item.values.length
      },
      loadingUpdate: function () {
        return (this.item.hasOwnProperty('loading')) ? this.item.loading : false
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";
  @import "../../assets/styles/mixins";

  .supervisionpart-value-number {
    position: relative;
    min-width: 54px;
    background: #c9c9c9;
    padding: 8px 0;
    text-align: center;
    font-size: 18px;
    color: #ffffff;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;
    align-self: flex-start;

    .countObservations {
      position: absolute;
      font-size: small;
      top: 30px;
      right: 5px;
      background-color: blue;
      padding: 0px 6px;
      border-radius: 25px;
    }

    img {
      height: 30px;
    }

    p {
      margin: 0;
      padding: 5px;
    }

    span {
      font-size: x-large;
      font-weight: bold;
      letter-spacing: 2px;
      padding: 8px;
    }

    &.active {
      font-size: 28px;
      padding: 6px 10px;
      background: #da9d77;

      .countObservations {
        position: absolute;
        font-size: small;
        top: 28px;
        left: 42px;
        background-color: blue;
        padding: 0px 6px;
        border-radius: 25px;
      }

      input {
        color: black;
        display: block;
        padding: 10px 0;
        margin: 5px;
        width: 60px;
      }
    }

    &.success {
      background-color: #00da3c;
    }

    &.error {
      background-color: red;
    }

  }

  .loading {
    font-size: x-large;
    text-align: center;
  }

  .defaultElement {
    padding: 4px 10px;
  }
</style>
