<template>
  <div class="supervisionpart-value-boolean" v-bind:class="[bgColor, current]">
    <spinner v-if="hasLoading" class="loading" :show="loadingUpdate"></spinner>
    <div v-show="!loadingUpdate">
      <div v-if="!itemHasValue">
        <img src="/static/img/checklists/sumary/inc.svg" alt="">
        <span v-show="itemHasComments" class="countObservations">{{itemCountComments}}</span>
      </div>
      <div v-else>
        <img v-show="itemCurrentValue" src="/static/img/checklists/tick.svg" alt="">
        <img v-show="!itemCurrentValue" src="/static/img/checklists/cross.svg" alt="">
        <span v-show="itemHasComments" class="countObservations">{{itemCountComments}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  import Spinner from '@/components/Spinner.vue'

  export default {
    name: 'SupervisionpartValueBoolean',
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
    methods: {},
    computed: {
      current: function () {
        return {
          active: this.isCurrent
        }
      },
      bgColor: function () {
        return {
          success: this.itemHasValue && this.itemCurrentValue && !this.loadingUpdate,
          error: this.itemHasValue && !this.itemCurrentValue && !this.loadingUpdate
        }
      },
      itemHasValue: function () {
        return this.item.hasOwnProperty('last') &&
          this.item.last !== null &&
          this.item.last !== undefined
      },
      itemCurrentValue: function () {
        return (this.item.last) ? this.item.last.value : null
      },
      itemHasComments: function () {
        return this.itemCountComments > 1
      },
      itemCountComments: function () {
        return this.item.comments.length + this.item.values.length
      },
      loadingUpdate: function () {
        return this.item.loading
      },
      hasLoading: function () {
        return this.item.hasOwnProperty('loading')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";
  @import "../../assets/styles/mixins";

  .supervisionpart-value-boolean {
    position: relative;
    background: #c9c9c9;
    padding: 8px 12px;
    font-size: 18px;
    color: #ffffff;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;
    align-self: flex-start;

    .countObservations {
      position: absolute;
      font-size: small;
      top: 18px;
      left: 30px;
      background-color: blue;
      padding: 0px 6px;
      border-radius: 25px;
    }

    img {
      height: 30px;
    }

    &.active {
      font-size: 28px;
      padding: 12px 20px;
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

</style>
