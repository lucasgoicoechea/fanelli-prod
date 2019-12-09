<template>
  <div class="notifications" v-infinite-scroll="loadMore" infinite-scroll-disabled="shouldNotUpdate" infinite-scroll-distance="0">
    <navigation :title="title"></navigation>
    <section>
      <div v-show="!haveNotification && !loading" class="noNotification">
        <i class="glyphicon glyphicon-eye-close"></i>
        <p>No hay notificaciones</p>
      </div>
      <div class="buttons">
        <button v-show="haveNotification" class="clear" @click="deleteNotification">
          <img src="/static/img/trashwht.svg" alt="">
        </button>
      </div>
      <notification v-for="notification in data" :key="notification._id" :notification="notification"></notification>
      <div class="loading" v-show="loading">
        <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
      </div>
    </section>
  </div>
</template>

<script>
  import Navigation from '@/components/Navigation.vue'
  import Notification from '@/components/notifications/Notification.vue'
  import { mapState } from 'vuex'

  export default {
    name: 'Notifications',
    components: {
      Notification,
      Navigation
    },
    data () {
      return {
        title: 'Notificaciones'
      }
    },
    methods: {
      loadMore: function () {
        this.$store.dispatch('notifications/loadMore')
      },
      deleteNotification () {
        this.$modal.show('dialog', {
          text: `¿Esta seguro que desea eliminar todas las notificaciones?`,
          buttons: [
            {
              title: 'Aceptar',
              handler: () => {
                this.clearAll()
                this.$modal.hide('dialog')
              }
            },
            {
              title: 'Cancelar',
              handler: () => {
                this.$modal.hide('dialog')
              }
            }
          ]
        })
      },
      clearAll () {
        this.$store.dispatch('notifications/clearAll')
      }
    },
    computed: {
      shouldNotUpdate: function () {
        return this.lastOne || this.loading
      },
      ...mapState(
        'notifications', [
          'data',
          'loading',
          'lastOne',
          'notRead'
        ]),
      haveNotification: function () {
        return this.data.length > 0
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .notifications {
    position: relative;
    height: 100vh;
    overflow: auto;
  }

  .test {
    width: 50%;
    margin: 15px auto;
  }

  .loading {
    text-align: center;
    margin: 20px
  }

  .glyphicon-refresh-animate {
    -animation: spin .7s infinite linear;
    -webkit-animation: spin2 .7s infinite linear;
  }

  @-webkit-keyframes spin2 {
    from {
      -webkit-transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(360deg);
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

  section {
    margin: 40px auto;
    width: 90%;
  }

  .noNotification {
    text-align: center;
    font-weight: bold;

    i {
      font-size: xx-large;
      margin: 15px 0;
    }
  }

  .buttons {
    display: flex;
    flex-direction: row-reverse;
  }

  .clear {
    position: fixed;
    bottom: 25px;
    right: 25px;
    z-index: 100;
    background-color: #b0b0b0;
    border: none;
    border-radius: 100px;
    color: white;
    padding: 15px;
    box-shadow: 0px 1px 4px 0 rgba(0, 0, 0, 0.3);
    text-align: center;
    text-decoration: none;
    outline: none;
    display: inline-block;
    margin: 0 8px;
    transition: .3s background,.45s box-shadow cubic-bezier(0.25,0.8,0.25,1);

    &:hover {
      background-color: #9d9d9d;
      box-shadow: 0px 1px 2px 0 rgba(0, 0, 0, 0.2);
    }

    img {
      width: 35px;
      height: 35px;
    }
  }
</style>
