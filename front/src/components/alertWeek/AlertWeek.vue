<template>
  <div class="alert-week">
    <img class="icon-test" src="/static/img/test/test.svg" alt="">
    {{ msg }}
  </div>
</template>

<script>
  export default {
    name: 'AlertWeek',
    props: {
      msg: {
        type: String,
        default: 'Esta sección está siendo probada.'
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/animations";

  .alert-week {
    font-family: monospace;
    width: 80%;
    margin: 15px auto;
    padding: 8px 15px;
    border: 2px dashed #232323;
    text-align: center;
    font-weight: bold;
    font-size: large;
    color: #444444;
    background-color: #fbffa0;
  }

  .icon-test {
    height: 40px;
    width: 40px;
    @include shake-lr();

    &:hover {
      animation: shake-lr-h 0.7s cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
    }
  }

  @-webkit-keyframes shake-lr-h {
    0%,
    100% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
      -webkit-transform-origin: 50% 50%;
      transform-origin: 50% 50%;
    }
    10% {
      -webkit-transform: rotate(8deg);
      transform: rotate(8deg);
    }
    20%,
    40%,
    60% {
      -webkit-transform: rotate(-10deg);
      transform: rotate(-10deg);
    }
    30%,
    50%,
    70% {
      -webkit-transform: rotate(10deg);
      transform: rotate(10deg);
    }
    80% {
      -webkit-transform: rotate(-8deg);
      transform: rotate(-8deg);
    }
    90% {
      -webkit-transform: rotate(8deg);
      transform: rotate(8deg);
    }
  }
  @keyframes shake-lr {
    0%,
    100% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
      -webkit-transform-origin: 50% 50%;
      transform-origin: 50% 50%;
    }
    10% {
      -webkit-transform: rotate(8deg);
      transform: rotate(8deg);
    }
    20%,
    40%,
    60% {
      -webkit-transform: rotate(-10deg);
      transform: rotate(-10deg);
    }
    30%,
    50%,
    70% {
      -webkit-transform: rotate(10deg);
      transform: rotate(10deg);
    }
    80% {
      -webkit-transform: rotate(-8deg);
      transform: rotate(-8deg);
    }
    90% {
      -webkit-transform: rotate(8deg);
      transform: rotate(8deg);
    }
  }
</style>
