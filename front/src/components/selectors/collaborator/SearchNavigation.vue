<template>
  <header class="search-navigation">
    <div class="action">
      <img src="/static/img/icon-navigation/back.svg" alt="Volver atrás" @click="close">
    </div>
    <nav>
      <input ref="search" v-model="match" placeholder="Buscar" @keyup.esc="clear">
      <img src="/static/img/checklists/cross.svg" @click="clear" alt="Limpiar">
    </nav>
    <div class="action">
      <img src="/static/img/icon-selector/search-white.svg" alt="Buscar" @click="setFocus">
    </div>
  </header>
</template>

<script>
  export default {
    name: 'SearchNavigation',
    props: {},
    methods: {
      close () {
        this.$store.commit('collaborators/changeShowList')
      },
      setFocus () {
        this.$refs.search.focus()
      },
      clear () {
        this.$store.commit('collaborators/setMatch', '')
      }
    },
    computed: {
      match: {
        get () {
          return this.$store.state.collaborators.match
        },
        set (value) {
          this.$store.commit('collaborators/setMatch', value)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/variables";

  header {
    position: sticky;
    top: 0;
    left: 0;
    background-color: $primary-color;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.26);
    width: 100%;
    height: $navigation-height;
    z-index: 10;
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

    input {
      margin: 0 10px;
      background-color: $primary-color;
      color: white;
      border-bottom: 2px solid white;
      font-weight: bold;

      &::placeholder {
        color: white;
      }
    }

    img {
      cursor: pointer;
      position: absolute;
      height: 30px;
      right: 0;
      padding: 4px 10px;
    }
  }

  .action {
    cursor: pointer;
    flex-grow: 0;
    flex-shrink: 0;
    padding: 12px 10px;
    position: relative;
    color: #fff;

    > img {
      height: 30px;
    }
  }

  .noClick {
    cursor: default;
  }

  @media (max-width: 560px) {
    nav {
      input {
        font-size: 3vh;
        padding: 0;
        margin: 0;
        display: inline;

        &::placeholder {
          color: white;
          font-size: 2.5vh;
        }
      }
    }
  }

  @media (min-width: 768px) and (max-width: 1024px) {
    nav {
      justify-content: center;
    }
  }
</style>
