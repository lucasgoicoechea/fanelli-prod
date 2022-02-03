<template>
  <div class="epp-history-list container-fluid">

    <div class="spinner-container">
      <spinner
        class="spinner"
        :show="loadingActiveRequest"
        loadingMessage="Cargando solicitudes pendientes..."></spinner>
    </div>

    <div class="empty" v-show="!loadingActiveRequest && getActivedAndReceivedRequests.length === 0">
      <p>No hay solicitudes Pendiente de aprobación</p>
    </div>

    <epp-card
      v-for="request in getActivedAndReceivedRequests"
      :key="request._id"
      :request="request"></epp-card>

    <hr>

    <div class="empty" v-show="!loadingActiveRequest && getOnlyActivedRequest.length === 0">
      <p>No hay solicitudes Activas</p>
    </div>

    <epp-card
      v-for="request in getOnlyActivedRequest"
      :key="request._id"
      :request="request">
    </epp-card>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import CardContainer from '@/components/cards/CardContainer.vue'
  import CardHeader from '@/components/cards/CardHeader.vue'
  import CardSection from '@/components/cards/CardSection.vue'
  import CardFooter from '@/components/cards/CardFooter.vue'
  import auth from '@/auth'
  import CollaboratorSelector from '@/components/selectors/collaborator/CollaboratorSelector.vue'
  import Spinner from '@/components/SpinnerWrapper.vue'
  import SpinnerLittle from '@/components/Spinner.vue'
  import EppCard from '@/components/epp/EPPCard'

  export default {
    name: 'EPPHistoryList',
    components: {CardContainer, CardHeader, CardSection, CardFooter, Spinner, SpinnerLittle, CollaboratorSelector, EppCard},
    props: {
      type: {
        type: String,
        default: 'active',
        current: {
          type: Boolean,
          default: false
        }
      }
    },
    data () {
      return {
        date: ''
      }
    },
    created: function () {
      this.$store.dispatch('requests/fetchActiveRequest')
    },
    destroyed: function () {},
    methods: {
      goToRequest (req) {
        this.$router.push({name: 'epp-request', params: {id: req._id}})
      },
      received (req) {
        return !req.hasOwnProperty('approved')
      },
      denied (req) {
        return req.hasOwnProperty('approved') && !req.approved
      },
      approved (req) {
        return req.hasOwnProperty('approved') &&
          req.approved &&
          req.hasOwnProperty('delivered') &&
          !req.delivered
      },
      pending (req) {
        return req.hasOwnProperty('resolved') &&
          req.resolved &&
          !req.hasOwnProperty('delivered')
      },
      delivered (req) {
        return req.hasOwnProperty('delivered') && req.delivered
      },
      eppType (request) {
        if (this.received(request)) return 'Recibida'
        if (this.denied(request)) return 'Denegada'
        if (this.approved(request)) return 'Aprobada'
        if (this.pending(request)) return 'Pendiente'
        if (this.delivered(request)) return 'Entregada'
        else return 'Estado'
      },
      eppTypeColor (request) {
        if (this.received(request)) return '#1e3773'
        if (this.denied(request)) return '#f86567'
        if (this.approved(request)) return '#65c25a'
        if (this.pending(request)) return '#3063ac'
        if (this.delivered(request)) return '#e28c44'
        else return '#e28c44'
      },
      eppTypeSubColor (request) {
        if (this.received(request)) return '#2b4a9f'
        if (this.denied(request)) return '#f78384'
        if (this.approved(request)) return '#a2da9b'
        if (this.pending(request)) return '#3c7ed9'
        if (this.delivered(request)) return '#fbc697'
        else return '#e2cea4'
      },
      reject (req) {
        this.$store.dispatch('requests/approvalById', {id: req._id, approved: false, user: auth.getUser()})
      },
      accept (req) {
        this.$store.dispatch('requests/approvalById', {id: req._id, approved: true, user: auth.getUser()})
      }
    },
    computed: {
      loadingActiveRequest () {
        return this.$loading.isLoading('requests fetchActive')
      },
      isActiveList: function () {
        return this.type === 'active'
      },
      ...mapState('requests', [
        'activeRequests',
        'deliveredRequests'
      ]),
      ...mapGetters('requests', [
        'getActivedAndReceivedRequests',
        'getOnlyActivedRequest',
        'deliveredRequestsFilter'
      ]),
      ...mapState('collaborators', [
        'collaboratorSelected'
      ]),
      ...mapGetters('collaborators', [
        'hasSelected'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .epp-history-list {
    width: 80%;
  }

  p {
    margin: 0;
  }

  button {
    margin: 2px 0;
    padding: 4px 16px;
    text-decoration: none;
    border: none;
    border-radius: 50px;
    color: white;

    img {
      height: 20px;
      width: 20px;
    }

    &.accept {
      background-color: #65c25a;
    }
    &.reject {
      background-color: #f86567;
    }

    &:disabled {
      cursor: not-allowed;
    }
  }

  hr {
    border: 3px solid $primary-color;
    margin: 15px 0;
  }

  .empty {
    text-align: center;
    margin: 20px;
  }

  @media (max-width: 500px) {
    .filters {
      display: flex;
      flex-direction: column;
      margin: 20px 0;

      .filter {
        max-width: 100%;
      }
    }

    .epp-history-list {
      width: 100%;
    }
  }

  h3 {
    margin: 15px 0 0 0;
  }

  .time {
    font-family: monospace;
  }

  .cards-container {
    height: 100%;
  }

  .spinner-container {
    display: flex;
    justify-content: center;
  }

  .spinner {
    margin: 15px 0;
  }

</style>
