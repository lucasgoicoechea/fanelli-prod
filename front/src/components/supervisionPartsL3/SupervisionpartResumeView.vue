<template>
  <div class="supervisionpart-resume-view">
    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-xs-12 loading" v-show="loading">
            <spinner :show="loading"></spinner>
          </div>
          <div class="col-xs-12 detail" v-for="history in supervisionpartOrder" v-show="!loading" v-bind:key="history._id" >
      
         
            <div   v-for="(sp,index) in getHistoryBySector(history)" v-bind:key="index" >
              <div class="title">
                <h2>{{ history | pretty }}</h2>
                <div class="shifts">
                  <span
                    :class="currentStyle(header)"
                    v-for="(header,ii) in sp.headers"
                    v-bind:key="ii" >
                    {{header.redeable}}
                  </span>
                </div>
              </div>
          
                <div>
                <!-- v-show="sp.totals" -->
                <supervisionpart-resume-history-total 
                  :supervisionPart="sp"
                  >
                </supervisionpart-resume-history-total>
              </div>  
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import SupervisionpartResumeHistoryTotal from '@/components/supervisionPartsL3/SupervisionpartResumeHistoryTotal.vue'
  import Spinner from '@/components/Spinner'
  import {mapState, mapGetters} from 'vuex'
  import Const from '@/const'

  export default {
    name: 'SupervisionpartComparativeView',
    components: {SupervisionpartResumeHistoryTotal, Spinner},
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
      isNotLast (order, countHour) {
        // console.log(order + '-' + countHour)
        return order < countHour
      },
      currentStyle (header) {
        return {
          current: header.schedule === this.current && !this.date
        }
      },
      init () {
        if (this.validateDate) {
          this.loading = true
          this.$store.commit('supervisionpartsLTres/cleanHistories')
          this.$store.dispatch('supervisionpartsLTres/addHistory', {sector: 'EXTRUSORA', date: this.convertedDate})
            .then(() => {
              this.loading = false
            }, this.catchError)
          this.$store.dispatch('supervisionpartsLTres/addHistory', {sector: 'APILADORA', date: this.convertedDate})
            .catch(this.catchError)
          this.$store.dispatch('supervisionpartsLTres/addHistory', {sector: 'DESAPILADORA', date: this.convertedDate})
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
        'supervisionpartsLTres', [
          'histories',
          'supervisionpartOrder'
        ]),
      ...mapGetters(
        'supervisionpartsLTres', [
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

  .observaciones {
    position: relative;
    margin-top: 10px;
    border: 6px solid blueviolet;
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
