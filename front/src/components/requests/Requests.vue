<template>
  <section>
    <ul class="item-list">
      <request v-for="request in getSortedTasks" :key="request.id" :request="request"></request>
    </ul>
  </section>
</template>

<script>
  import Request from '@/components/requests/Request.vue'
  import { mapGetters } from 'vuex'

  export default {
    name: 'Requests',
    components: {
      Request
    },
    methods: {
      replayRequests: function () {
        const replayChannel = new BroadcastChannel('replay-requests')  // eslint-disable-line
        replayChannel.postMessage('replay')
      }
    },
    computed: {
      ...mapGetters(
        'tasksQueue', [
          'getSortedTasks'
        ]),
      haveRequests: function () {
        return this.getSortedTasks.length > 0
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .item-list {
    list-style: none;
    padding: 0 10px;
  }

  .loading {
    text-align: center;
    margin: 20px
  }

  .glyphicon-refresh-animate {
    animation: spin .7s infinite linear;
  }

  @keyframes spin2 {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes spin {
    from {
      transform: scale(1) rotate(0deg);
    }
    to {
      transform: scale(1) rotate(360deg);
    }
  }

  .noequests {
    text-align: center;
    font-weight: bold;

    i {
      font-size: xx-large;
      margin: 15px 0;
    }
  }

  .refresh-button {
    text-align: center;
    font-weight: bold;

    i {
      font-size: medium;
      margin: 15px 0;
    }
  }
</style>
