<template>
  <div class="epp-my-active-resquest-list container-fluid">
    <h3><span class="glyphicon glyphicon-filter" aria-hidden="true"></span> Filtros</h3>
    <div class="filters">
      <div class="filter">
        <span class="glyphicon glyphicon-calendar" aria-hidden="true"></span>
        <input class="date" v-model="date" type="date">
      </div>
      <collaborator-selector class="filter" :reduced="true"></collaborator-selector>
    </div>

    <div class="empty" v-show="empty">
      <p>No hay solicitudes</p>
    </div>
    <div class="cards-container"
         v-infinite-scroll="filter"
         infinite-scroll-disabled="deliveredNotUpdate"
         infinite-scroll-distance="0">
      <epp-card
        v-for="request in this.supervisorActiveEPP.requests"
        :key="request._id"
        :request="request">
      </epp-card>
      <div class="empty">
        <spinner
          class="spinner"
          :show="$loading.isLoading('requests supervisorActiveEPP')"
          loadingMessage="Cargando solicitudes..."></spinner>
      </div>
    </div>

  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import CollaboratorSelector from '@/components/selectors/collaborator/CollaboratorSelector.vue'
  import Spinner from '@/components/SpinnerWrapper.vue'
  import SpinnerLittle from '@/components/Spinner.vue'
  import EppCard from '@/components/epp/EPPCard'

  export default {
    name: 'EPPMyActiveRequestList',
    components: {Spinner, SpinnerLittle, CollaboratorSelector, EppCard},
    props: {
      current: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        date: '',
        callFilter: false
      }
    },
    destroyed: function () {},
    methods: {
      goToRequest (req) {
        this.$router.push({name: 'epp-request', params: {id: req._id}})
      },
      filter () {
        const params = {
          ...((this.hasSelected) ? {collaborator: this.collaboratorSelected._id} : {}),
          ...((this.date !== '') ? {date: this.date} : {})
        }
        this.$store.dispatch('requests/fetchSupervisorActiveRequest', params)
          .then(() => { this.callFilter = false })
      }
    },
    computed: {
      ...mapState('requests', [
        'supervisorActiveEPP'
      ]),
      deliveredNotUpdate () {
        return this.supervisorActiveEPP.lastOne || this.supervisorActiveEPP.loading || !this.current || this.callFilter
      },
      ...mapState('collaborators', [
        'collaboratorSelected'
      ]),
      ...mapGetters('collaborators', [
        'hasSelected'
      ]),
      empty () {
        return this.supervisorActiveEPP.requests.length === 0 &&
          !this.$loading.isLoading('requests supervisorActiveEPP')
      }
    },
    watch: {
      collaboratorSelected () {
        this.callFilter = true
        if (this.current) {
          this.$store.commit('requests/clear', 'supervisorActiveEPP')
          this.filter()
        }
      },
      date () {
        this.callFilter = true
        if (this.current) {
          this.$store.commit('requests/clear', 'supervisorActiveEPP')
          this.filter()
        }
      }
    }
  }
</script>


<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .epp-my-active-resquest-list {
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

    .epp-my-active-resquest-list {
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

</style>
