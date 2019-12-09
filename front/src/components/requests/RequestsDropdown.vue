<template>
  <section @click="show">
    <div class="action">
      <img src="~@img/icons-actions/acciones.svg" alt="solicitudes">
      <transition name="bounce">
        <span v-show="getPendingTasks > 0" :key="getPendingTasks" class="counter">{{ getPendingTasks }}</span>
      </transition>
    </div>
    <div v-show="isShow" class="tooltip-container">
      <div class="top-section">
        <span class="title">Tareas</span>
        <!--<span v-if="getPendingTasks" class="refresh-button">-->
          <!--<i @click.stop="replayRequests" class="glyphicon glyphicon-refresh" title="Reintentar envío de tareas"></i>-->
        <!--</span>-->
        <div class="refresh-action"
             title="Reintentar envío de tareas"
             v-if="getPendingTasks"
             @click.stop="replayRequests">Reintentar envío</div>
      </div>
      <div v-if="!haveRequests" class="no-requests">
        <i class="glyphicon glyphicon-eye-close"></i>
        <p>No hay tareas para mostrar</p>
      </div>
      <requests></requests>
    </div>
  </section>
</template>
<script>
  import Requests from './Requests'
  import { mapState, mapGetters } from 'vuex'

  export default {
    components: {Requests},
    name: 'RequestsDropdown',
    data () {
      return {
        title: 'Solicitudes',
        isShow: false
      }
    },
    methods: {
      show () {
        this.isShow = !this.isShow
      },
      replayRequests: function () {
        const replayChannel = new BroadcastChannel('replay-requests')  // eslint-disable-line
        replayChannel.postMessage('replay')
      }
    },
    computed: {
      ...mapState(
        'tasksQueue', [
          'tasks'
        ]),
      ...mapGetters(
        'tasksQueue', [
          'getPendingTasks'
        ]),
      haveRequests: function () {
        return this.tasks.length > 0
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .title {
    font-size: 2rem;
  }

  .top-section {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin: 10px 0;
  }

  .action {
    cursor: pointer;
    flex-grow: 0;
    flex-shrink: 0;
    padding: 12px 10px;
    position: relative;
    color: #fff;

    > span {
      padding-top: 2px;
      font-size: 22px;
      text-align: center;

      &.counter {
        position: absolute;
        top: 25px;
        left: 25px;
        width: $badge-counter-width;
        height: $badge-counter-height;
        padding: $badge-counter-padding;
        border-radius: 50px;
        font-size: small;
        font-weight: bold;
        background-color: red;
        box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.2);
      }
    }

    > img {
      height: 30px;
    }
  }

  .no-requests {
    text-align: center;
    font-weight: bold;

    i {
      font-size: xx-large;
      margin: 15px 0;
    }
  }

  .tooltip-container {
    width: 320px;
    background-color: #ebebeb;
    color: black;
    position: absolute;
    z-index: 1;
    top: 100%;
    right: 1px;
    box-shadow: 0 0 4px rgba(0, 0, 0, .5);
  }

  .tooltip-container::after {
    content: "";
    position: absolute;
    bottom: 100%;
    right: 5%;
    border-width: 8px;
    border-style: solid;
    border-color: transparent transparent #f2f2f2 transparent;
  }

  .refresh-button {
    margin-left: 10px;
    margin-top: 5px;
    font-weight: bold;

    i {
      font-size: medium;
    }
  }

  .refresh-action {
    margin-top: 5px;
    text-decoration: underline;
  }

  .bounce-enter-active {
    animation: bounce-in .5s;
  }

  .bounce-leave-active {
    animation: bounce-in .5s reverse;
  }

  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.8);
    }
    100% {
      transform: scale(1);
    }
  }


</style>
