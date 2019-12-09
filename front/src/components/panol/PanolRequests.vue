<template>
  <div class="panol-requests">
    <navigation :title="title"></navigation>
    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-xs-6">
            <h3>Recibidas</h3>
            <div class="cards-container">
              <uby-infinite-scroll :onScroll="fetchPending" :disable="pendingNotUpdate"
                                   :loading="pendingResolution.loading">
                <transition-group name="list-complete">
                  <request-card v-for="request in pendingResolution.requests" :key="request._id"
                                :request="request"
                                :showPrintButton="true"
                                class="list-complete-item"></request-card>
                </transition-group>
                <p class="clarification" v-show="pendingResolution.requests.length === 0">
                  Aún no se han recibido solicitudes
                </p>
                <p class="clarification" v-show="pendingResolution.lastOne && pendingResolution.requests.length > 0">
                  No hay mas solicitudes para cargar
                </p>
              </uby-infinite-scroll>
            </div>
          </div>

          <div class="col-xs-6">
            <h3>Pendientes de entrega</h3>
            <div class="cards-container">
              <uby-infinite-scroll :onScroll="fetchSolved" :disable="solvedNotUpdate" :loading="solved.loading">
                <transition-group name="list-complete">
                  <request-card v-for="request in solved.requests"
                                :key="request._id" :request="request"
                                :showPrintButton="true"
                                class="list-complete-item">
                  </request-card>
                </transition-group>
                <p class="clarification" v-show="solved.requests.length === 0">
                  No hay solicitudes pendientes de entrega
                </p>

                <p class="clarification" v-show="solved.lastOne && solved.requests.length > 0">
                  No hay mas solicitudes para cargar
                </p>
              </uby-infinite-scroll>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import Navigation from '../Navigation.vue'
  import RequestCard from './RequestCard.vue'
  import {mapState, mapActions} from 'vuex'
  import Spinner from 'vue-simple-spinner'
  import UbyInfiniteScroll from '../UbyInfiniteScroll.vue'

  export default {
    name: 'PanolRequests',
    components: {
      UbyInfiniteScroll,
      Spinner,
      RequestCard,
      Navigation
    },
    data () {
      return {
        title: 'Solicitudes'
      }
    },
    methods: {
      ...mapActions('requests', [
        'fetchPending',
        'fetchSolved'
      ])
    },
    computed: {
      ...mapState('requests', [
        'pendingResolution',
        'solved'
      ]),
      pendingNotUpdate () {
        return this.pendingResolution.lastOne || this.pendingResolution.loading
      },
      solvedNotUpdate () {
        return this.solved.lastOne || this.solved.loading
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .cards-container {
    background: #EEEEEE;
    padding: 10px;
    min-height: 50vh;
  }

  h3 {
    text-align: center;
    font-weight: bold;
    color: $secondary-darker;
  }

  section {
    margin: 20px auto;
    width: 90%;
  }

  .clarification {
    text-align: center;
  }

  .form {
    cursor: pointer;
    position: relative;
    padding: 15px 0;
    display: block;
    margin: 5px 0;
    text-align: center;
    border-radius: 5px;
    background-color: rgb(42, 61, 107);
    box-shadow: 0 0 8px 0 rgba(45, 50, 144, 0.5);
    color: white;

    h4 {
      position: relative;
      padding: 0 0 5px 0;
      margin: 2px 0;
    }

    > .form-image {
      position: relative;

      > img {
        width: 50%;
        height: auto;
      }
    }
  }

  .container-fluid {
    width: 90%;
  }

  @media (max-width: 599px) {
    .container-fluid {
      width: 100%;
    }
  }

  .list-complete-item {
    transition: all 0.5s;
  }

  .list-complete-enter, .list-complete-leave-to
    /* .list-complete-leave-active below version 2.1.8 */
  {
    opacity: 0;
    transform: translateX(100px);
  }

  .list-complete-leave-active {
    position: absolute;
  }
</style>
