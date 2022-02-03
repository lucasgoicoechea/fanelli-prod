<template>
<<<<<<< HEAD
  <div class="epp-history-list-delivered container-fluid">
=======
  <div class="bugReport-history-list-delivered container-fluid">
>>>>>>> fe21cf6d0f69181d9226e7bb3c31236c8cbf2f1f
    <h3><span class="glyphicon glyphicon-filter" aria-hidden="true"></span> Filtros</h3>
    <div class="filters">
      <div class="filter">
        <span class="glyphicon glyphicon-calendar" aria-hidden="true"></span>
        <input class="date" v-model="date" type="date">
      </div>
      <collaborator-selector class="filter" :reduced="true"></collaborator-selector>
    </div>

    <div class="empty" v-show="this.deliveredRequest.requests.length === 0 && !loadingDelivered">
      <p>No hay solicitudes</p>
    </div>
    <div class="cards-container"
         v-infinite-scroll="filter"
         infinite-scroll-disabled="deliveredNotUpdate"
         infinite-scroll-distance="0">
<<<<<<< HEAD
      <epp-card
        v-for="request in this.deliveredRequest.requests"
        :key="request._id"
        :request="request">
      </epp-card>
=======
      <bugReport-card
        v-for="request in this.deliveredRequest.requests"
        :key="request._id"
        :request="request">
      </bugReport-card>
>>>>>>> fe21cf6d0f69181d9226e7bb3c31236c8cbf2f1f
      <div class="empty">
        <spinner
          class="spinner"
          :show="loadingDelivered"
          loadingMessage="Cargando solicitudes..."></spinner>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import CardContainer from '@/components/cards/CardContainer.vue'
  import CardHeader from '@/components/cards/CardHeader.vue'
  import CardSection from '@/components/cards/CardSection.vue'
  import CardFooter from '@/components/cards/CardFooter.vue'
  import CollaboratorSelector from '@/components/selectors/collaborator/CollaboratorSelector.vue'
  import Spinner from '@/components/SpinnerWrapper.vue'
<<<<<<< HEAD
  import EppCard from '@/components/epp/EPPCard'

  export default {
    name: 'EPPHistoryListDelivered',
    components: {CardContainer, CardHeader, CardSection, CardFooter, Spinner, CollaboratorSelector, EppCard},
=======
  import BugReportCard from '@/components/fails/BugReportCard'

  export default {
    name: 'BugReportHistoryListDelivered',
    components: {CardContainer, CardHeader, CardSection, CardFooter, Spinner, CollaboratorSelector, BugReportCard},
>>>>>>> fe21cf6d0f69181d9226e7bb3c31236c8cbf2f1f
    props: {
      current: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        date: '',
        callFilter: false,
        loadingDelivered: false
      }
    },
    created: function () {
      this.loadingDelivered = true
      this.$store.dispatch('requests/fetchDelivered')
        .then(() => { this.loadingDelivered = false })
    },
    destroyed: function () {},
    methods: {
      goToRequest (req) {
<<<<<<< HEAD
        this.$router.push({name: 'epp-request', params: {id: req._id}})
=======
        this.$router.push({name: 'bugReport-request', params: {id: req._id}})
>>>>>>> fe21cf6d0f69181d9226e7bb3c31236c8cbf2f1f
      },
      delivered (req) {
        return req.hasOwnProperty('delivered') && req.delivered
      },
<<<<<<< HEAD
      eppType (request) {
        if (this.delivered(request)) return 'Entregada'
        else return 'Estado'
      },
      eppTypeColor (request) {
        if (this.delivered(request)) return '#e28c44'
        else return '#e28c44'
      },
      eppTypeSubColor (request) {
=======
      bugReportType (request) {
        if (this.delivered(request)) return 'Entregada'
        else return 'Estado'
      },
      bugReportTypeColor (request) {
        if (this.delivered(request)) return '#e28c44'
        else return '#e28c44'
      },
      bugReportTypeSubColor (request) {
>>>>>>> fe21cf6d0f69181d9226e7bb3c31236c8cbf2f1f
        if (this.delivered(request)) return '#fbc697'
        else return '#e2cea4'
      },
      filter () {
        this.loadingDelivered = true
        const params = {
          ...((this.hasSelected) ? {collaborator: this.collaboratorSelected._id} : {}),
          ...((this.date !== '') ? {date: this.date} : {})
        }
        this.$store.dispatch('requests/fetchDelivered', params)
          .then(() => {
            this.loadingDelivered = false
            this.callFilter = false
          })
      }
    },
    computed: {
      ...mapGetters('requests', [
        'deliveredRequestsFilter'
      ]),
      ...mapState('requests', {
        'deliveredRequest': 'delivered'
      }),
      deliveredNotUpdate () {
        return this.deliveredRequest.lastOne || this.deliveredRequest.loading || !this.current || this.callFilter
      },
      ...mapState('collaborators', [
        'collaboratorSelected'
      ]),
      ...mapGetters('collaborators', [
        'hasSelected'
      ])
    },
    watch: {
      collaboratorSelected () {
        this.callFilter = true
        if (this.current) {
          this.$store.commit('requests/clear', 'delivered')
          this.filter()
        }
      },
      date (newValue) {
        this.callFilter = true
        if (this.current && newValue[0] !== '0') {
          this.$store.commit('requests/clear', 'delivered')
          this.filter()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

<<<<<<< HEAD
  .epp-history-list-delivered {
=======
  .bugReport-history-list-delivered {
>>>>>>> fe21cf6d0f69181d9226e7bb3c31236c8cbf2f1f
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

    .spinner {
      font-size: xx-large;
    }
  }

  .filters {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;
    border-bottom: 4px solid $secondary-color;

    .filter {
      max-width: 50%;

      .glyphicon {
        margin-left: 10px;
      }
    }

    .date {
      width: auto;
    }
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

<<<<<<< HEAD
    .epp-history-list-delivered {
=======
    .bugReport-history-list-delivered {
>>>>>>> fe21cf6d0f69181d9226e7bb3c31236c8cbf2f1f
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
    padding-bottom: 68px;
  }

<<<<<<< HEAD
</style>
=======
</style>
>>>>>>> fe21cf6d0f69181d9226e7bb3c31236c8cbf2f1f
