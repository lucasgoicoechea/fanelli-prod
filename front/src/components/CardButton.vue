<template>
  <router-link
    :to="to"
    class="card-button"
    :class="isSquared"
    :style="backgroudColor"
    :replace="replace">
    <div class="image">
      <img class="lazyload" :data-src="icon" :style="padding">
    </div>
    <h4>{{ title }}</h4>
  </router-link>
</template>

<script>
  import 'lazysizes'

  export default {
    name: 'CardButton',
    props: {
      to: {
        type: Object,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      icon: {
        type: String,
        required: true
      },
      isSelected: {
        type: Boolean,
        default: false
      },
      replace: {
        type: Boolean,
        default: false
      },
      iconPadding: {
        type: String,
        default: '0'
      },
      backgroundColor: String,
      selectedBackgroundColor: {
        type: String,
        default: '#1b86e7'
      },
      squared: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      backgroudColor () {
        if (this.isSelected) {
          return {
            backgroundColor: this.selectedBackgroundColor
          }
        } else {
          return {
            backgroundColor: this.backgroundColor
          }
        }
      },
      isSquared () {
        return {
          squared: this.squared
        }
      },
      padding () {
        return {
          padding: this.iconPadding
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/styles/variables";

  .card-button {
    padding: 0 5px;
    cursor: pointer;
    position: relative;
    margin: 10px 0;
    text-align: center;
    border-radius: 5px;
    background-color: #054c8d;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // min-height: 20vh;

    h4 {
      font-size: larger;
      font-weight: bold;
      margin: 5px 0 15px 0;
    }
  }

  .card-button:hover {
    text-decoration: none;
  }

  .image {
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 10px 0 80% 0;
    height: 0;

    img {
      height: 100%;
      width: 100%;
      display: block;
      position: absolute;
    }
  }

  .squared {
    border-radius: 0;
  }

  @media (max-width: 599px)  {
    .card-button {
      min-height: 50vw;
    }
  }

  @media (min-width: 600px) and (max-width: 1080px)  {
    .card-button {
      min-height: 26vw;
    }
  }

</style>
