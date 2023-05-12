<template>
  <article class="supervisionpart-history-item" >
    <header  @click="showHour" class="hourbanner">
       <h3>{{hour.hour.text}} </h3> 
      <div class="states">Turno {{ hour.schedule | capitalize }}</div> 
      <!-- <div class="container-fluid">
       <div class="row negro"  >
          <div class="col-xs-3 col-sm-4 col-md-3 col-lg-3"  v-show="hour && hour.sector && hour.sector === 'EXTRUSORA'" >MAQUINA</div>
          <div class="col-xs-3 col-sm-4 col-md-4 col-lg-4">MATERIAL</div>
          <div class="col-xs-3 col-sm-4 col-md-5 col-lg-5">TOTAL HORA</div>
          
       </div> 
        <div v-for="(total,index) in hour.totals" class="row"  :key="index" >
          <div class="col-xs-3 col-sm-4 col-md-3 col-lg-3"  v-show="hour && hour.sector && hour.sector === 'EXTRUSORA'" >{{total.machine}}</div>
          <div class="col-xs-3 col-sm-4 col-md-4 col-lg-4">{{total.material}}</div>
          <div class="col-xs-3 col-sm-4 col-md-5 col-lg-5">{{total.count | decimalFormat}}</div>
         </div>  
     </div> -->
    </header> 
  <section >
    <supervisionpart-history-hour
          v-show="hour!=null && !isCollapse()"
          class="state"
          :hour=hour
          :supervisionpart_id=supervisionpart_id
     ></supervisionpart-history-hour>  
  </section> 
  </article>
</template>

<script>
  import SupervisionpartHistoryHour from '@/components/supervisionPartsL3/SupervisionpartHistoryHour.vue'
  import { mapState, mapGetters } from 'vuex'
  import Const from '@/const'

  export default {
    name: 'SupervisionpartHistoryItem',
    components: {SupervisionpartHistoryHour},
    props: {
      hour: {
        type: Object
      },
      collapse: Boolean,
      supervisionpart_id: String,
      date: {
        type: String,
        required: false
      }
    },
    data () {
      return {
        current: '',
        selected: -1,
        mobileView: false,
        collapsed: true
      }
    },
    methods: {
      isCollapse () {
        return this.collapsed
      },
      currentStyle (header) {
        return header.schedule === this.current && !this.date ? 'title' : ''
      },
      init () {
        this.current = Const.currentSchedule().value
      },
      showHour () {
        this.collapsed = !this.collapsed
      },
      currentSchedule (header) {
        return header.schedule === this.current && !this.date
      },
      showMobile () {
        this.mobileView = !this.mobileView
      },
      mobile () {
        return {
          mobile: this.mobileView
        }
      },
      select (id) {
        if (this.selected === id) {
          this.selected = -1
        } else {
          this.selected = id
        }
      },
      show: function (id) {
        return id === this.selected
      },
      arrow: function (id) {
        return {
          arrow: this.show(id)
        }
      },
      index: function (e) {
        return this.hour.comparative.indexOf(e)
      },
      style: function (e) {

      },
      history: function (e) {
        const history = e.materials.concat(e.values)
        return history
        /* return history.sort(function (a, b) {
          return new Date(b.date) - new Date(a.date)
        })  */
      }
    },
    created () {
      this.init()
    },
    computed: {
      ...mapState('supervisionpartsLTres', [
        'types'
      ]),
      ...mapGetters('supervisionpartsLTres', [
        'getComparativeHeaders'
      ])
    },
    filters: {
      capitalize: function (value) {
        if (!value) return ''
        if (value === 'MANIANA') value = 'MAÑANA'
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
      },
      decimalFormat: function (num) {
        if (!num) return ''
        return (Math.round(num * 100) / 100).toFixed(2)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";
  
  .hourbanner {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    background-color: #aa9130;
    padding: 4px 6px;
    font-size: 1.5rem;
    color: white;
    margin: 8px;
  }
 
  .negro{
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.5);
  }

  article {
    margin-top: 12px;
    color: $secondary-darker;
    font-weight: bold;
    transition: all 0.2s ease;
  }

  header {
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.5);
    border-radius: 2px;
    background: #bdbdbd;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    //align-items: flex-start;
    flex-wrap: wrap;

    .title {
      flex-grow: 1;
      flex-basis: auto;
      font-size: larger;
      padding: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 20%;
    }

    .states {
      flex-grow: 0;
      flex-basis: auto;
      display: flex;
      justify-content: space-between;

      .state {
        cursor: pointer;
        margin: 0 10px;

        &:first-child {
          margin-left: 0;
        }
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }

  section {
    background-color: $primary-color;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.5);
    margin-top: 10px;
    padding: 4px 0;

    h3 {
      margin: 8px 0;
      font-weight: bold;
      color: white;
      text-align: center;
    }
  }

  .information {
    display: flex;
    justify-content: space-between;
    background-color: $primary-light;
    padding: 4px 6px;
    font-size: 1.5rem;
    color: white;
    margin: 8px;

    &:last-child {
      margin-bottom: 4px;
    }

    .time {
      font-family: monospace;
      font-size: 1.5rem;
      font-weight: normal;
    }

    .separator {
      margin: 0 6px;
    }

    p {
      margin: 0;
      padding: 0;

      img {
        width: 1.5rem;
      }
    }

    .colaborator {
      min-width: 20%;
      text-align: right;
    }
  }

  .arrow:after {
    bottom: -26px;
    left: 50%;
    border: solid transparent;
    content: "";
    height: 0;
    width: 0;
    position: absolute;
    border-color: rgba(136, 183, 213, 0);
    border-bottom-color: $primary-color;
    border-width: 28px;
    margin-left: -30px;
  }

  @media (max-width: 340px) { // iphone 6plus landscape
    header {

      .title {

        &.mobile {
          width: 100%;
          white-space: normal;
        }

      }

      .states {
        .state {
          margin: 0 2px;
        }
      }
    }
  }

</style>
