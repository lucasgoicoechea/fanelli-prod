<template>
  <button class="vue-btn" :class="getBackgroundClass">

    <transition name="fade" mode="out-in">
      <div :class="getSpinnerClass"></div>
    </transition>

    <slot v-if="showSlot"></slot>
  </button>
</template>

<script>
  export default {
    name: 'button-spinner',
    props: {
      isLoading: {
        type: Boolean,
        default: false
      },
      status: {
        type: String | Boolean,
        default: ''
      }
    },
    computed: {
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

  @import "../assets/styles/variables";

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
    align-items: center;
    box-shadow: none;
    line-height: 1.5;
    position: relative;
    vertical-align: top;
    user-select: none;
    text-align: center;
    white-space: nowrap;
    transition: .3s all ease;
    background-color: $secondary-darker;
    border: none;
    color: white;
    padding: 10px;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 15px auto;
    cursor: pointer;
    border-radius: 25px;
    font-weight: bold;
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

  button:hover {
    background-color: rgb(35, 96, 152);
  }

  button:focus {
    outline: none;
  }

  /**
        Spinner Icon
    **/

  .spinner {
    height: 10px;
    width: 10px;
    margin-right: 8px;
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
