<template>
  <section @click="show">
    <img class="user-option" :src="profilePicture" alt="user">
    <div v-show="isShow" class="tooltip-container">
      <div class="tooltip-wrapper">
        <div class="user-image">
          <img :src="profilePicture" alt="user">
        </div>
        <div class="user-info">
          <h4>{{ user.lastname }} {{ user.name }}</h4>
          <h5>{{ user.user_type | userType }}</h5>
        </div>
      </div>
      <hr>
      <div class="toltip-action" @click="logout">
        Cerrar sesión
        <img src="/static/img/icon-navigation/logout.svg" alt="Cerrar sesión">
      </div>
    </div>
  </section>
</template>

<script>
  import pushNotification from '../push-notification'
  import auth from '../auth'

  export default {
    name: 'NavigationDropdown',
    data () {
      return {
        isShow: false,
        user: {}
      }
    },
    created: function () {
      this.user = auth.getUser()
    },
    methods: {
      show () {
        this.isShow = !this.isShow
      },
      logout () {
        pushNotification.unsubscribeUser()
          .then(() => {
            this.$store.dispatch('auth/logout')
            this.$store.dispatch('reset')
            this.$router.push({name: 'login'})
            this.$access('any')
          })
      }
    },
    computed: {
      profilePicture: function () {
        if (this.user.hasOwnProperty('picture') && this.user.picture) {
          return this.user.picture
        } else {
          return '/static/img/icon-navigation/nofoto.svg'
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/styles/variables";

  section {
    position: relative;
    display: inline-block;
  }

  .tooltip-container {
    width: 320px;
    background-color: #f2f2f2;
    color: black;
    padding: 10px;
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

  .user-option {
    background-color: #c7e9ff;
    border-radius: 25px;
    width: 35px;
    height: 35px !important;
  }

  .user-image {
    width: 30%;

    img {
      width: 100%;
      background-color: #c7e9ff;
      border-radius: 100px;
    }
  }

  .user-info {
    padding: 15px 0 0 15px;
    width: 70%;

    h4 {
      color: $secondary-darker;
      font-weight: bold;
    }

    h5 {
      color: gray;
      font-weight: bold;
    }
  }

  .tooltip-wrapper {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: row;
  }

  .toltip-action {
    float: right;

    img {
      height: 30px;
    }
  }

  hr {
    margin: 8px 0;
    border: 1px solid $primary-color;
  }

</style>
