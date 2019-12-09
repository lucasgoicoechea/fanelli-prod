<template>
  <transition name="slide-fade">
    <div class="collaborator-list" v-show="show" :style="pushed">
      <div class="overlay-content">
        <search-navigation></search-navigation>
        <section>
          <div class="container-fluid">
            <div class="row">
              <div class="col-xs-12" v-if="!multipleSelection">
                <h3>Seleccione un colaborador</h3>
                <p v-show="!hasMatchs">No se encontrado resultados para su búsqueda</p>
              </div>
              <div class="col-xs-12" v-else>
                <h3>Lista de colaboradores</h3>
                <p v-show="!hasMatchs">No se encontrado resultados para su búsqueda</p>
              </div>
            </div>
            <div class="row">
              <div class="col-xs-12">
                <ul>
                  <collaborator-list-item
                    v-for="collaborator in filter" :key="collaborator._id"
                    :collaborator="collaborator"
                    :multipleSelection="multipleSelection"></collaborator-list-item>
                </ul>
              </div>
            </div>
          </div>
          <transition name="slide-fade">
            <div
              class="confirmation"
              v-show="listCollaboratorsSelected.length !== 0"
              @click="close">
            <span v-show="listCollaboratorsSelected.length !== 0" class="counter">
              {{ listCollaboratorsSelected.length }}
            </span>
              <figure class="circle">
                <img src="/static/img/tickwhite.svg" alt="aceptar">
              </figure>
            </div>
          </transition>
        </section>
      </div>
    </div>
  </transition>
</template>

<script>
  import SearchNavigation from '@/components/selectors/collaborator/SearchNavigation.vue'
  import CollaboratorListItem from '@/components/selectors/collaborator/CollaboratorListItem.vue'
  import { mapGetters, mapState } from 'vuex'

  export default {
    name: 'CollaboratorList',
    components: {SearchNavigation, CollaboratorListItem},
    props: {
      show: {
        type: Boolean,
        default: false
      },
      multipleSelection: {
        type: Boolean,
        default: false
      },
      preSelection: {
        type: Array,
        default: () => ([])
      },
      typeList: {
        type: String,
        default: 'responsible',
        validator: function (value) {
          return ['responsible', 'full'].indexOf(value) !== -1
        }
      }
    },
    data () {
      return {
        selected: false
      }
    },
    created: function () {
      let action = ''
      if (this.typeList === 'full') {
        action = 'collaborators/fetch'
      } else {
        action = 'collaborators/fetchTeam'
      }
      this.$store.dispatch(action)
        .then(() => this.$store.dispatch('collaborators/preSelection', this.preSelection))
    },
    methods: {
      close () {
        this.$store.commit('collaborators/changeShowList')
      }
    },
    watch: {
      preSelection () {
        this.$store.dispatch('collaborators/preSelection', this.preSelection)
      }
    },
    destroyed: function () {
      this.$store.commit('collaborators/reset')
    },
    computed: {
      ...mapGetters('collaborators', [
        'filter'
      ]),
      ...mapState('ui', [
        'sidebarStatus'
      ]),
      ...mapState('collaborators', [
        'listCollaboratorsSelected'
      ]),
      hasMatchs () {
        return this.filter.length > 0
      },
      pushed () {
        return {
          marginLeft: (this.sidebarStatus) ? '280px' : 0
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/variables";

  .collaborator-list {
    z-index: 11;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100%;
    margin: 0;
    background-color: white;

    .overlay-content {
      height: 100%;
      overflow-y: scroll;
    }
  }

  section {
    margin-top: 10px;
  }

  h3 {
    font-weight: bold;
    color: $secondary-darker;
    border-bottom: 3px solid $primary-color;
  }

  p {
    font-weight: bold;
    color: gray;
    text-align: center;
    padding: 15px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  .slide-fade-enter-active {
    transition: all .2s ease;
  }

  .slide-fade-leave-active {
    transition: all .2s ease;
  }

  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(20px);
    opacity: 0;
  }

  .container-fluid {
    width: 80%;
  }

  .confirmation {
    position: absolute;
    right: 25px;
    bottom: 25px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .counter {
      text-align: center;
      font-weight: bold;
      font-size: medium;
      color: #00da3c;
    }

    .circle {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 150px;
      cursor: pointer;
      background-color: #00da3c;
      height: 60px;
      width: 60px;
      box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.3);

      img {
        height: 30px;
        width: 30px;
      }
    }
  }

  @media (max-width: 599px) {
    .container-fluid {
      width: 100%;
    }
  }

  /* Enter and leave animations can use different */
  /* durations and timing functions.              */
  .slide-fade-enter-active, .slide-fade-leave-active {
    transition: all .2s ease;
  }

  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(100px);
    opacity: 0;
  }
</style>
