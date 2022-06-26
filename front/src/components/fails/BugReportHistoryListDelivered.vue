<template>
  <div class="bugReport-history-list-delivered container-fluid">
   <div class="spinner-container">
      <spinner
        class="spinner"
        :show="loadingActiveRequest"
        loadingMessage="Cargando fallas pendientes..."></spinner>
    </div>
    <div class="row" >
            <button class="redirect" @click="generateReport">
              <div>
                <span class="glyphicon glyphicon-download-alt"></span>
                <span class="text">Generar reporte</span>
              </div>
            </button>
    </div>
    <div class="empty" v-show="!loadingActiveRequest && bugReportListDelivered.length === 0">
      <p>No hay fallas reparadas para mostrar</p>
    </div>

    <bugReport-card
      v-for="request in bugReportListDelivered"
      :key="request._id"
      :request="request">
    </bugReport-card>
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
  import BugReportCard from '@/components/fails/BugReportCard'
  import pdf from '@/utils/pdf'

  export default {
    name: 'BugReportHistoryListDelivered',
    components: {CardContainer, CardHeader, CardSection, CardFooter, Spinner, CollaboratorSelector, BugReportCard},
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
        loadingDelivered: false,
        bugReportListDelivered: []
      }
    },
    created: function () {
      this.fetch()
    },
    destroyed: function () {},
    methods: {
      successfulPrint (blob) {
        pdf.download(blob, 'report.xlsx')
      },
      errorPrint () {
        this.$snotifyWrapper.warning('Error de impresión. Intente nuevamente')
      },
      fetch () {
        // this.bugReport.loading = true
        const action = 'bugReport/fetchNoActive'
        this.$store.dispatch(action, {})
          .then(this.successFetch)
          .catch(this.failFetch)
      },
      successFetch (response) {
        if (response.bugReports.length === 0) {
          // this.bugReport.lastOne = true
          console.log('vacio')
        } else {
          response.bugReports.forEach(e => {
            this.bugReportListDelivered.push(e)
          })
          // this.bugReport.page += 1
        }
        // this.bugReport.loading = false
      },
      failFetch (error) {
        this.$snotifyWrapper.error(error)
        // this.bugReport.loading = false
      },
      goToRequest (req) {
        this.$router.push({name: 'bugReport-request', params: {id: req._id}})
      },
      delivered (req) {
        return req.hasOwnProperty('delivered') && req.delivered
      },
      bugReportType (request) {
        if (this.delivered(request)) return 'Entregada'
        else return 'Estado'
      },
      bugReportTypeColor (request) {
        if (this.delivered(request)) return '#e28c44'
        else return '#e28c44'
      },
      bugReportTypeSubColor (request) {
        if (this.delivered(request)) return '#fbc697'
        else return '#e2cea4'
      },
      generateReport () {
        this.$store.dispatch('bugReport/getAllReportDelivered')
          .then(this.successfulPrint)
          .catch(this.errorPrint)
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
      loadingActiveRequest () {
        return this.$loading.isLoading('requests fetchActive')
      },
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

  .bugReport-history-list-delivered {
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

    .bugReport-history-list-delivered {
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