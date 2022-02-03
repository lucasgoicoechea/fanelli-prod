<template>
  <div class="form-element">
    <div class="element-image">
      <div class="image-wrapper">
        <img class="lazyload" :data-src="url" alt="">
      </div>
      <transition name="fade">
        <div class="overlay" v-show="hasElement">
          <h1>{{ getByType(element).quantity }}</h1>
        </div>
      </transition>
    </div>
    <h4>{{typeCapitalize}}</h4>
    <div class="counters">
      <div class="count count-less" @click="descElement">
        <img class="lazyload" data-src="/static/img/Menos.svg" alt="">
      </div>
      <div class="count count-add" @click="incElement">
        <img class="lazyload" data-src="/static/img/Mas.svg" alt="">
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import 'lazysizes'

  export default {
    name: 'form-element',
    props: {
      element: String
    },
    data: function () {
      return {
        count: 0,
        myElement: Object
      }
    },
    created: function () {
      this.myElement = this.element
    },
    methods: {
      incElement () {
        this.$store.commit('catalog/incrementQuantity', {type: this.element})
      },
      descElement () {
        this.$store.commit('catalog/decrementQuantity', {type: this.element})
      }
    },
    computed: {
      hasElement: function () {
        return this.getByType(this.element).quantity !== 0
      },
      url: function () {
        return '/static/img/vestimenta/' + this.element + '.svg'
      },
      typeCapitalize: function () {
        return this.element.charAt(0).toUpperCase() + this.element.slice(1)
      },
      ...mapGetters('catalog', [
        'getByType'
      ])
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  section {
    margin-top: $navigation-height + 30;
  }

  .form-element {
    margin: 15px 0;
    text-align: center;
    background-color: rgb(45, 50, 144);
    box-shadow: 0px 0px 8px 0px rgba(45, 50, 144, 0.5);
    color: white;
  }

  .element-image {
    position: relative;
  }

  h4 {
    margin: 5px;
    padding: 0;
  }

  .image-wrapper {
    position: relative;
    padding-bottom: 100%;
    height: 0;

    img {
      height: 100%;
      display: block;
      position: absolute;
      width: 100%;
    }
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .counters {
    display: flex;
  }

  .count {
    flex-grow: 0;
    flex-basis: 50%;
    cursor: pointer;
    position: relative;
    padding-bottom: 20%;
    height: 0;
    max-height: 2vh;

    img {
      width: 100%;
      height: 100%;
      display: block;
      position: absolute;
    }

    &.count-less {
      color: rgb(255, 12, 30);
      background-color: rgb(38, 23, 116);
    }

    &.count-add {
      color: rgb(35, 255, 108);
    }
  }

  .fade-enter-active, .fade-leave-active{
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0
  }

  .fade-enter h1,
  .fade-leave-active h1 {
    -webkit-transform: scale(3);
    transform: scale(3);
  }

  .overlay h1 {
    margin: 0;
    padding: 0;
    transition: all .4s;
  }

</style>
