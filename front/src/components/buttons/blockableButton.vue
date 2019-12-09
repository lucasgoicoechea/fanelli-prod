<template>
  <button @click.stop="clickMethod"
          :disabled="loading"
          :style="[getButtonStyle]"
          class="vue-btn"
          :type="buttonType">
    <img v-if="icon && !loading" :src="icon" :style="getIconStyle">

    <transition name="fade" mode="out-in">
      <div class="spinner-container">
        <div :class="getSpinnerClass"></div>
      </div>
    </transition>

    <slot v-if="showSlot"></slot>
  </button>
</template>

<script>
  import generateGuid from '../../utils/guidGenerator'

  export default {
    name: 'blockableButton',
    props: {
      isLoading: {
        type: Boolean,
        default: false,
        required: false
      },
      status: {
        type: String | Boolean,
        default: '',
        required: false
      },
      buttonType: {
        type: String,
        default: 'button',
        required: false
      },
      clickMethod: {
        type: Function,
        default: () => { },
        required: false
      },
      icon: {
        type: String,
        default: null,
        required: false
      },
      iconWidth: {
        type: String,
        default: '50px',
        required: false
      },
      iconHeight: {
        type: String,
        default: '50px',
        required: false
      },
      iconPadding: {
        type: String,
        default: 'auto',
        required: false
      },
      buttonWidth: {
        type: String,
        default: '50px',
        required: false
      },
      buttonHeight: {
        type: String,
        default: '50px',
        required: false
      },
      buttonRadius: {
        type: String,
        default: '50%',
        required: false
      },
      buttonBackgroundColor: {
        type: String,
        default: '#e8e8e8',
        required: false
      },
      buttonBackgroundHoverColor: {
        type: String,
        default: '#236098',
        required: false
      },
      color: {
        type: String,
        default: 'black',
        required: false
      }
    },
    methods: {
      mouseOver: function (e) {
        const element = document.getElementById(e.target.id)
        element.style.backgroundColor = this.buttonBackgroundHoverColor
      },
      mouseLeave: function (e) {
        const element = document.getElementById(e.target.id)
        element.style.backgroundColor = this.buttonBackgroundColor
      },
      generateButtonId: function () {
        return generateGuid()
      }
    },
    computed: {
      getButtonStyle () {
        return {
          'width': this.buttonWidth,
          'height': this.buttonHeight,
          'backgroundColor': this.buttonBackgroundColor,
          'color': this.color,
          'border-radius': this.buttonRadius
        }
      },
      getIconStyle () {
        return {
          'width': this.iconWidth,
          'height': this.iconHeight,
          'pointer-events': 'none',
          'padding': this.iconPadding
        }
      },
      getSpinnerClass () {
        return {
          'spinner': this.loading,
          'check': !this.emptyStatus && this.isSuccess && !this.loading,
          'cross': !this.emptyStatus && !this.isSuccess && !this.loading
        }
      },
      getBackgroundClass () {
        return {
          'vue-btn-loader-error': !this.emptyStatus && !this.isSuccess,
          'vue-btn-loader-success': this.isSuccess,
          'is-loading': this.loading
        }
      },
      loading () {
        return this.isLoading
      },
      isSuccess () {
        return this.status === 'success' || this.status === true
      },
      emptyStatus () {
        return this.status === ''
      },
      showSlot () {
        return !this.loading
      }
    }
  }

</script>

<style lang="scss" scoped>

  @import "../../assets/styles/variables";

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 1s;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
    will-change: opacity;
  }

  @keyframes rotation {
    from {
      transform: rotate(0deg)
    }

    to {
      transform: rotate(359deg)
    }
  }

  .vue-btn {
    box-shadow: none;
    user-select: none;
    transition: .3s all ease;
    text-decoration: none;
    display: inline-block;
    cursor: pointer;
    border: 0;
    padding: 0;
  }

  button.vue-btn-loader-error:not(.is-loading) {
    width: 48px;
    background-color: $danger-color;
    color: #fff;
  }

  button.vue-btn-loader-success:not(.is-loading) {
    width: 48px;
    background-color: $success-color;
    color: #fff;
  }

  button.vue-btn:disabled {
    cursor: not-allowed;
  }

  button:focus {
    outline: none;
  }

  /**
        Spinner Icon
    **/

  .spinner-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .spinner {
    height: 20px;
    width: 20px;
    opacity: 1;
    filter: alpha(opacity=100);
    animation: rotation .7s infinite linear;
    border: 4px solid rgba(0, 0, 0, 0.2);
    border-top-color: #9E9E9E;
    border-radius: 100%;
    transition: .3s all ease;
    display: inline-block;
  }

  /**
        Check Icon
    **/

  .check {
    display: inline-block;
    width: 23px;
    height: 24px;
    border-radius: 50%;
    transform: rotate(45deg);
    color: white;
    will-change: transform;
  }

  .check:before {
    content: "";
    position: absolute;
    width: 3px;
    height: 9px;
    background-color: #fff;
    left: 11px;
    top: 6px;
  }

  .check:after {
    content: "";
    position: absolute;
    width: 3px;
    height: 3px;
    background-color: #fff;
    left: 8px;
    top: 12px;
  }

  /**
        Cross Icon
    **/

  .cross {
    display: inline-block;
    width: 17px;
    height: 16px;
    position: relative;
  }

  .cross:before,
  .cross:after {
    position: absolute;
    left: 8px;
    content: ' ';
    height: 16px;
    width: 2px;
    background-color: #fff;
  }

  .cross:before {
    transform: rotate(45deg);
    will-change: transform;
  }

  .cross:after {
    transform: rotate(-45deg);
    will-change: transform;
  }

</style>
