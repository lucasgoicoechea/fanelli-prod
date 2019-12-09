<template>
  <div class="panol-requests">
    <navigation :title="title"></navigation>
    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-xs-12">
            <collaborator-selector typeList="full"></collaborator-selector>
            <h3> Últimas solicitudes {{ getCollaboratorName() }}</h3>
            <div class="cards-container"
                 v-infinite-scroll="fetchDeliveredWithCollaborator"
                 infinite-scroll-disabled="deliveredNotUpdate"
                 infinite-scroll-distance="0">
              <transition-group name="list-complete" tag="request-card">
                <request-card v-for="request in delivered.requests"
                              :key="request._id"
                              :request="request"
                              :showPrintButton="false"
                              class="list-complete-item">
                </request-card>
              </transition-group>
              <p class="clarification" v-show="delivered.requests.length === 0">Aún no se han recibido solicitudes </p>
              <div class="loading" v-show="delivered.loading">
                <spinner></spinner>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import Navigation from '../Navigation.vue'
  import CollaboratorSelector from '../selectors/collaborator/CollaboratorSelector.vue'
  import RequestCard from './RequestCard.vue'
  import { mapState, mapGetters, mapActions } from 'vuex'
  import Spinner from 'vue-simple-spinner'

  export default {
    name: 'PanolRequestsHistory',
    components: {
      RequestCard,
      Navigation,
      Spinner,
      CollaboratorSelector
    },
    data () {
      return {
        title: 'Historial de Solicitud'
      }
    },
    methods: {
      getCollaboratorName () {
        return this.hasSelected ? `para ${this.collaboratorSelected.lastname}` : ''
      },
      ...mapActions('requests', [
        'fetchDelivered'
      ]),
      fetchDeliveredWithCollaborator () {
        const filterUser = (this.hasSelected) ? {collaborator: this.collaboratorSelected._id} : {}
        this.fetchDelivered(filterUser)
      }
    },
    computed: {
      ...mapState('requests', [
        'delivered'
      ]),
      ...mapState('collaborators', [
        'collaboratorSelected'
      ]),
      ...mapGetters('collaborators', [
        'hasSelected'
      ]),
      deliveredNotUpdate () {
        return this.delivered.lastOne || this.delivered.loading
      }
    },
    watch: {
      collaboratorSelected () {
        this.$store.commit('requests/clear', 'delivered')
        this.fetchDeliveredWithCollaborator()
      }
    },

    destroyed: function () {
      this.$store.commit('requests/clear', 'delivered')
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .cards-container {
    background: #EEEEEE;
    padding: 10px;
    min-height: 10vh;
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

  .container-fluid {
    width: 90%;
  }

  @media (max-width: 599px)  {
    .container-fluid {
      width: 100%;
    }
  }

  .list-complete-item {
    transition: all 0.5s;
  }
  .list-complete-enter, .list-complete-leave-to
    /* .list-complete-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateX(-100px);
  }
  .list-complete-leave-active {
    position: absolute;
  }
</style>
