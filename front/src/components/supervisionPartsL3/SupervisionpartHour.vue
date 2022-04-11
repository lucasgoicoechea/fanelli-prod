<template>
  <article class="supervisionpart-hour" v-if="hour!=null" >
  <header v-show="hour && hour.sector && hour.sector == 'EXTRUSORA'">
    <div  class="container-fluid"> 
      <div  class="row">
        <div  style="width: 60px"  class="col-xs-8 col-sm-4 col-md-3 col-lg-2" v-show="hour && hour.sector && hour.sector === 'EXTRUSORA'" >
          Dureza <span v-show="!this.collapse" ><input style="width: 55px"   @input="update" type="number" class="active" v-mask="'##.#'" v-model.number="hour.durity" @keypress="isNumber($event)" autofocus>
          </span>
          <span   v-show="this.collapse" >{{hour.durity}}</span>
        </div>
        <div  style="width: 60px"  class="col-xs-8 col-sm-4 col-md-3 col-lg-2" v-show="hour && hour.sector && hour.sector === 'EXTRUSORA'" >
          Vacio<span v-show="!this.collapse" ><input style="width: 55px"  @input="update" type="number"  v-mask="'##'" v-model="hour.vacuum" @keypress="isNumber($event)" autofocus>
          </span>
          <span v-show="this.collapse" >{{hour.vacuum}}</span>
        </div>   
        <!-- <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3" v-show="hour && hour.sector && hour.sector === 'DESAPILADORA'" >Pallets Camara<span><input @input="update" type="number" class="active" v-model="hour.palletsCamara" autofocus></span></div>
        <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3" v-show="hour && hour.sector && hour.sector === 'DESAPILADORA'" >Pallets Contador<span><input @input="update" type="number" v-model="hour.palletsContador" autofocus></span></div>   -->
        <div class="col-xs-8 col-sm-4 col-md-3 col-lg-2" v-show="!this.collapse">
          <button @click="updateTotals" :disabled="loadingObservation">
                <span v-if="!loadingObservation && !editados" class="action "><img src="/static/img/checklists/tick.svg"></span>
                <span v-if="!loadingObservation && editados" class="action true"><img src="/static/img/checklists/tick.svg"></span>
                <spinner-little :show="loadingObservation"></spinner-little>
          </button>
      </div>
      </div>
    </div>
  </header>     
  <section v-show="hour" >
    <supervisionpart-stoppings           
          :stoppings=hour.stoppings
          :hour=hour       
          :supervisionpart_id=supervisionpart_id
          :date=date
      ></supervisionpart-stoppings> 
    <supervisionpart-observations
          :hour=hour       
          :supervisionpart_id=supervisionpart_id
          :observations=hour.comments
          :date=date
      ></supervisionpart-observations> 
   
  </section> 
  </article>
</template>

<script>
  import SupervisionpartMaterials from '@/components/supervisionPartsL3/SupervisionpartMaterials.vue'
  import SupervisionpartStoppings from '@/components/supervisionPartsL3/SupervisionpartStoppings.vue'
  import SupervisionpartObservations from '@/components/supervisionPartsL3/SupervisionpartObservations.vue'
  import SpinnerLittle from '../Spinner.vue'
  import Spinner from '@/components/SpinnerWrapper.vue'
  import { mapState, mapGetters } from 'vuex'
  import Const from '@/const'

  export default {
    name: 'SupervisionpartHour',
    components: {SupervisionpartMaterials, SupervisionpartObservations, SupervisionpartStoppings, SpinnerLittle, Spinner},
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
        loadingObservation: false,
        editados: false
      }
    },
    methods: {
      orderArrayStoppings (arraystops) {
        return arraystops.sort((a, b) => a.date - b.date)
      },
      currentStyle (header) {
        return header.schedule === this.current && !this.date ? 'title' : ''
      },
      update (e) {
        this.editados = true
      },
      isNumber (evt) {
        var eevt = evt
        if (!evt) {
          eevt = window.event
        }
        var charCode = (eevt.which) ? eevt.which : eevt.keyCode
        if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
          eevt.preventDefault()
        } else {
          return true
        }
      },
      init () {
        this.current = Const.currentSchedule().value
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
      },
      hayDatos: function () {
        return true
      },
      updateTotals: function () {
        if (this.hayDatos) {
          this.loadingObservation = true
          const totals = {
            durity: this.hour.durity,
            vacuum: this.hour.vacuum,
            palletsCamara: this.hour.palletsCamara,
            palletsContador: this.hour.palletsContador,
            supervisionpart_id: this.supervisionpart_id,
            hour_id: this.hour.hour._id,
            sector: this.hour.sector
          }
          this.$store.dispatch('supervisionpartsLTres/updateHour', {totals})
            .then(() => {
              this.editados = false
              this.loadingObservation = false
            })
          // this.observation = ''
        }
      }
    },
    created () {
      this.init()
    },
    computed: {
      isExtrusora () {
        return this.hour.sector && this.hour.sector === 'EXTRUSORA'
      },
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

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

  .action {
    cursor: pointer;
    display: inline-block;
    font-size: 9px;
    color: white;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.3);
    img {
      width: 25px;
      height: 25px;
    }

    &.true {
      background: $success-color;
    }

    &.false {
      background: $danger-color;
    }
  }
  .loading {
    font-size: x-large;
    text-align: center;
  }

</style>
