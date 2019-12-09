<template>
  <div class="login">
    <header>
      <div id="logo" class="menuUp">
        <img src="/static/img/logo-fanelli.svg" alt="Fanelli">
      </div>
      <nav></nav>
    </header>
    <section>
      <form v-on:submit.prevent="login">
        <h2>Bienvenido</h2>
        <input v-model="username" name="username" placeholder="Nombre de Usuario">
        <password v-model="password" placeholder="Contraseña"></password>
        <div class="msg-error" v-show="errorLogin">
          <p>{{ errorMessage }}</p>
        </div>
        <button-spinner :isLoading="loading" :disabled="loading">
          <span>Iniciar Sesión</span>
        </button-spinner>
      </form>
    </section>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import pushNotification from '@/push-notification'
  import ButtonSpinner from '@/components/ButtonSpinner.vue'
  import Password from '@/components/Password.vue'

  export default {
    name: 'login',
    components: {
      Password,
      ButtonSpinner
    },
    created () {
      this.$store.dispatch('auth/logout')
    },
    data () {
      return {
        username: '',
        password: ''
      }
    },
    methods: {
      login () {
        this.$store.dispatch('auth/login', {username: this.username, password: this.password})
          .then(() => {
            this.$access(this.user.user_type + '&any')
            pushNotification.initPushNotification()
            this.$router.push({name: 'home'})
          })
      }
    },
    computed: {
      ...mapState('auth', [
        'errorLogin',
        'errorMessage',
        'loading',
        'user'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  header {
    background: url("/static/img/ladrillos.svg");
    background-color: rgb(236, 110, 37);
    background-repeat: repeat-x;
    background-size: 180px;
    border-bottom: 5px solid rgba(241, 199, 184, 0.58);
    display: flex;
    flex-direction: column;
    text-align: center;
    height: 60px;
    margin-bottom: 40px;
  }

  #logo {
    position: relative;
  }

  #logo > img {
    width: 25rem;
  }

  section {
    background: white;
    padding: 10px 20px;
    margin: 20px auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    text-align: center;
    align-content: center;
    form {

      > h2 {
        font-weight: bold;
        color: #003667;
        text-align: left;
        margin: 30px 0 10px 0;
      }

      > input {
        font-weight: 500;
        padding: 6px 2px;
        margin: 15px 0;
        font-size: 16px;
        width: 100%;
        border: none;
        border-bottom: 2px solid #ec6e25;
      }

      > input:focus {
        outline-color: #EC6E25;
      }

      > p {
        text-align: left;
        padding: 5px 0;
        color: #003667;

        > a {
          cursor: pointer;
          text-decoration: underline;
          font-weight: bold;
        }
      }
    }
  }

  p {
    text-align: left;
    font-weight: 500;
  }

  button {
    background-color: #003667;
    border: none;
    color: white;
    padding: 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 15px auto;
    cursor: pointer;
    border-radius: 25px;
    width: 60%;
    font-weight: bold;
  }

  button:hover {
    background-color: rgb(35, 96, 152);
  }

  button:focus {
    outline: none;
  }

  .checkbox {
    text-align: left;
  }

  .msg-error {
    margin: 10px 0;
    background-color: #ff6163;
    border-radius: 15px;
    padding: 5px 10px;
    font-size: smaller;
    color: white;

    > p {
      margin: 0;

      > a {
        color: white;
        cursor: pointer;
      }
    }
  }

  @media (min-width: 770px) {
    section {
      width: 40%;
      margin: 75px auto;
      padding: 10px 30px;
      border-radius: 4px;
      box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);

      > input {
        margin: 15px 0;
        font-size: 18px;
        border: none;
        border-bottom: 2px solid #ec6e25;
      }
    }
  }
</style>
