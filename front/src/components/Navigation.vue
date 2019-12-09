<template>
  <header class="navigation">
    <div v-show="!isHome" class="action" @click="goBack">
      <img src="/static/img/icon-navigation/back.svg" alt="Volver atras">
    </div>
    <div v-show="isHome" class="action noClick">
      <img src="/static/img/marca-blanca.svg" class="brand-icon" alt="Fanelli">
    </div>

    <nav>
      <h2>{{title}}</h2>
    </nav>
    <div v-if="hasAction">
      <div class="action" @click="action.func">
        <img :src="action.icon">
      </div>
    </div>
    <div class="action" @click="goNotification">
      <img src="/static/img/icon-navigation/campana.svg" alt="Notificaciones">
      <span class="counter" v-show="notRead !== 0">{{ notRead }}</span>
    </div>
    <requests-dropdown class="action"></requests-dropdown>
    <div class="action toggle-sidebar"
         title="Mostrar/ocultar barra lateral"
         @click="toggleSidebar()">
      <img src="/static/img/icons-sidebar/hamburger.svg" class="hamburger-icon">
    </div>
  </header>
</template>

<script>
  import { mapState } from 'vuex'
  import NavigationDropdown from './NavigationDropdown.vue'
  import RequestsDropdown from './requests/RequestsDropdown.vue'

  export default {
    components: {
      RequestsDropdown,
      NavigationDropdown
    },
    name: 'Navigation',
    component: [NavigationDropdown],
    props: {
      title: '',
      action: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    methods: {
      goBack () {
        if (this.$router.prev === 'login') {
          this.$router.push({name: 'home'})
        } else {
          this.$router.go(-1)
        }
      },
      goNotification () {
        this.$router.push({name: 'notifications'})
      },
      toggleSidebar () {
        this.$Sidebar.toggle('sidebar')
      }
    },
    computed: {
      hasAction: function () {
        return !(Object.keys(this.action).length === 0)
      },
      isHome: function () {
        return this.$route.name === 'home'
      },
      ...mapState('notifications', [
        'notRead'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/styles/variables";

  header {
    position: sticky;
    top: 0;
    left: 0;
    background-color: $primary-color;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.26);
    width: 100%;
    height: $navigation-height;
    z-index: $navbar-z-index;
    display: flex;
    align-items: center;
  }

  nav {
    position: relative;
    flex-grow: 1;
    flex-shrink: 1;
    padding: 0;
    text-align: left;
    display: flex;
    align-items: center;

    h2 {
      font-size: 2.5vh;
      font-weight: bold;
      color: white;
      padding: 0;
      margin: 0;
      display: inline;
    }
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

  @media (max-width: 560px) {
    nav {
      h2 {
        font-size: 2vh;
        font-weight: bold;
        color: white;
        padding: 0;
        margin: 0;
        display: inline;
      }
    }
  }

  .nav-tooltip {
    position: relative;
    display: inline-block;
  }

  .nav-tooltip .nav-tooltip-container {
    visibility: hidden;
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

  .noClick {
    cursor: default;
  }

  .toggle-sidebar {
    display: none;
  }

  .hamburger-icon {
    height: 35px;
    width: 35px;
    cursor: pointer;
  }

  .brand-icon {
    display: block;
    height: 40px;
    width: 40px;
    cursor: pointer;
  }

  @media (min-width: 768px) and (max-width: 992px) {
    nav {
      justify-content: center;
    }
  }

  @media (max-width: 768px) {
    .toggle-sidebar {
      display: block;
    }

    .brand-icon {
      display: none;
    }
  }

</style>
