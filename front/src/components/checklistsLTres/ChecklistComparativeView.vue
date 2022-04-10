<template>
  <div class="checklist-comparative-view">
    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-xs-12 loading" v-show="loading">
            <spinner :show="loading"></spinner>
          </div>
          <div class="col-xs-12 detail" v-for="history in checklistOrder" v-show="!loading">
            <div class="title">
              <h2>{{ history | pretty }}</h2>
              <div class="shifts">
                <span
                  :class="currentStyle(header)"
                  v-for="header in getHistoryBySector(history).headers">
                  {{header.redeable}}
                </span>
              </div>
            </div>
            <check-history-item
              v-for="check in getHistoryBySector(history).checks"
              :key="check._id"
              :comparative="check"></check-history-item>
            <div class="observations">
              <h3>Observaciones Generales</h3>
              <div class="shifts" v-for="(observation, index) in getHistoryBySector(history).observations">
                <h4>{{ getComparativeHeaders[index].redeable }}</h4>
                <p v-if="observation.length === 0">
                  No hay observaciones generales.
                </p>
                <div v-else v-for="o in observation" :key="o._id" class="itemObservations">
                  <p>
                    <span class="date">{{o.date | moment('DD/MM/YY HH:mm')}}</span>
                    - {{ o.observation }}
                  </p>
                  <p class="informer">{{ o.supervisor.lastname }}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import CheckHistoryItem from '@/components/checklistsLTres/CheckHistoryItem'
  import Spinner from '@/components/Spinner'
  import {mapState, mapGetters} from 'vuex'
  import Const from '@/const'

  export default {
    name: 'ChecklistComparativeView',
    components: {CheckHistoryItem, Spinner},
    props: {
      date: {
        type: String,
        required: false
      }
    },
    data () {
      return {
        current: '',
        loading: true
      }
    },
    methods: {
      currentStyle (header) {
        return {
          current: header.schedule === this.current && !this.date
        }
      },
      init () {
        if (this.validateDate) {
          this.loading = true
          this.$store.commit('checklistsLTres/cleanHistories')
          this.$store.dispatch('checklistsLTres/addHistory', {sector: 'EXTRUSORA', date: this.convertedDate})
            .then(() => {
              this.loading = false
            }, this.catchError)
          this.$store.dispatch('checklistsLTres/addHistory', {sector: 'APILADORA', date: this.convertedDate})
            .catch(this.catchError)
          this.$store.dispatch('checklistsLTres/addHistory', {sector: 'DESAPILADORA', date: this.convertedDate})
            .catch(this.catchError)
          this.current = Const.currentSchedule().value
        }
      },
      catchError () {
        return Promise.reject()
      }
    },
    created () {
      this.init()
    },
    watch: {
      date () {
        this.init()
      }
    },
    computed: {
      ...mapState(
        'checklistsLTres', [
          'histories',
          'checklistOrder'
        ]),
      ...mapGetters(
        'checklistsLTres', [
          'getComparativeHeaders',
          'getHistoryBySector'
        ]
      ),
      validateDate () {
        if (this.isCurrentDate) {
          return true
        }

        return this.$moment(this.date, 'DD-MM-YYYY', true).isValid()
      },
      isCurrentDate () {
        return !this.date
      },
      convertedDate () {
        if (this.isCurrentDate) {
          return undefined
        }

        return this.$moment(this.date, 'DD-MM-YYYY').utc().format('YYYY-MM-DD') // Date format for the backend
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .checklist-history-view {
    margin: 20px 0;
  }

  .title {
    border-bottom: 3px solid $secondary-darker;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 8px 0;

    > h2 {
      display: inline-block;
      margin: 2px 0;
      padding: 0;
      color: $primary-color;
      font-weight: bold;
    }

    .shifts {
      display: flex;
      justify-content: space-between;
      flex-wrap: nowrap;

      > span {
        min-width: 55px;
        text-align: center;
        font-size: x-large;
        margin: 4px 8px;
        font-weight: bold;
        padding: 2px;

      }
    }
  }

  .current {
    background-color: $primary-color;
    color: white;
  }

  .detail {
    margin: 15px 0;
  }

  .loading {
    text-align: center;
    margin: 20px;

    .spinner {
      font-size: xx-large;
    }
  }

  .observations {
    h3 {
      font-weight: bold;
    }

    h4 {
      color: $primary-color;
      font-weight: bold;
      border-bottom: 2px solid $secondary-color;
    }

    .itemObservations {
      display: flex;
      justify-content: space-between;
      margin: 2px 0;

      span {
        font-weight: bold;
        font-family: monospace;
      }

      .informer {
        color: $primary-color;
        font-weight: bold;
      }
    }
  }

  .container-fluid {
    width: 70%;
  }

  @media (min-width: 600px) and (max-width: 1200px) {
    .container-fluid {
      width: 80%;
    }
  }

  @media (max-width: 599px) {
    .container-fluid {
      width: 100%;
    }
  }
</style>
