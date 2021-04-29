<template>
  <article class="supervisionpart-form-total" v-if="supervisionPart!=null" >
  <!--<header v-show="supervisionPart && supervisionPart.sector && supervisionPart.sector === 'EXTRUSORA'">-->
   <header>
     <div>
       Totales
     </div>
   </header>
    <section class="container-fluid">
   
    <div  class="row"> 
      <div class="col-xs-12 col-sm-4">Total Turno<span><input @input="update" type="number"   v-mask="'###'"  class="active" v-model="supervisionPart.totalCountUnitMaterials" autofocus></span></div>
      <div class="col-xs-12 col-sm-4">Tiempo Marcha<span><input @input="update"  style="width: 82px " type="time" v-mask="'##:##'" v-model="supervisionPart.totalMinutesWithoutStopping" min="00:00" max="10:30" autofocus></span></div>
      <div class="col-xs-12 col-sm-4">Tiempo Carga: <span>{{tiempoCarga}}</span></div>
      <div class="col-xs-12 col-sm-4"   v-show="supervisionPart && supervisionPart.sector && supervisionPart.sector === 'DESAPILADORA'" >
        Peso Nylon<span> 
        <input @input="update" type="number" v-model="supervisionPart.totalBobin"  v-mask="'###'"  autofocus>
        <!--<select v-model="supervisionPart.totalBobin"  id="position" @change="update" style="color: black;" >
                <option v-for="(label, value) in $constants.SUPERVISION_PART_UNIT_NYLON"  :key="value" :value="value">{{label}}</option>
              </select>-->
        </span>
      </div>
      <!--<div class="col-xs-8 col-sm-4 col-md-3 col-lg-2"   v-show="supervisionPart && supervisionPart.sector && supervisionPart.sector === 'DESAPILADORA'" >Reposición {{unidades}} Maquina<span><input @input="update" type="number" v-model="supervisionPart.totalUnitsMachine" autofocus></span> </div>-->
      <!--<div class="col-xs-8 col-sm-4 col-md-3 col-lg-2"   v-show="supervisionPart && supervisionPart.sector && supervisionPart.sector === 'DESAPILADORA'" >Reposición Pallets<span><input @input="update" type="number" v-model="supervisionPart.totalRepositionPallet" autofocus></span> </div>-->
      
      <div class="col-xs-12 col-sm-4">
        <button @click="updateTotals" :disabled="loadingObservation">
              <span v-if="!loadingObservation && !editados" class="action "><img src="/static/img/checklists/tick.svg"></span>
              <span v-if="!loadingObservation && editados" class="action true"><img src="/static/img/checklists/tick.svg"></span>
              <spinner-little :show="loadingObservation"></spinner-little>
        </button>
      </div>
    </div>
    <div class="row">
       <div class="col-xs-12 col-sm-3"  v-show="supervisionPart && supervisionPart.sector && supervisionPart.sector === 'EXTRUSORA'" >Total Dureza: {{supervisionPart.totalDurity}}</div>
       <div class="col-xs-12 col-sm-3"  v-show="supervisionPart && supervisionPart.sector && supervisionPart.sector === 'EXTRUSORA'" >Total Vacio: {{supervisionPart.totalVacuum}}</div>       
       <div class="col-xs-12 col-sm-3"  v-show="supervisionPart && supervisionPart.sector && supervisionPart.sector === 'DESAPILADORA'" >Total Pallets Camara:
         <input @input="update" type="number" v-model="supervisionPart.totalPalletsCamara"   v-mask="'###'"  autofocus></div>
       <div class="col-xs-12 col-sm-3"  v-show="supervisionPart && supervisionPart.sector && supervisionPart.sector === 'DESAPILADORA'" >Total Pallets Contador:
         <input @input="update" type="number" v-model="supervisionPart.totalPalletsContador"   v-mask="'###'"  autofocus></div>
       <div class="col-xs-12 col-sm-3">Total Sistema {{unidades}}: {{supervisionPart.totalUnits | decimalFormat}}</div>
       <div class="col-xs-12 col-sm-3">Total Paradas: {{supervisionPart.totalStoppings}} minutos</div>
    </div>
    <hr>
    <div class="container-fluid">
       <div class="row" >
          <div class="col-xs-12 col-sm-4" v-show="supervisionPart && supervisionPart.sector && supervisionPart.sector === 'EXTRUSORA'" >MAQUINA</div>
          <div class="col-xs-12 col-sm-4">MATERIAL</div>
          <div class="col-xs-12 col-sm-4">TOTAL</div>
          <!--<div class="col-xs-8 col-sm-4 col-md-3 col-lg-3">TOTAL PARTE</div>-->
       </div> 
        <div v-for="(total,index) in supervisionPart.totals" class="row" :key="index" >
          <div class="col-xs-12 col-sm-4" v-show="supervisionPart && supervisionPart.sector && supervisionPart.sector === 'EXTRUSORA'" >{{total.machine}}</div>
          <div class="col-xs-12 col-sm-4">{{total.material}}</div>
          <div class="col-xs-12 col-sm-4" v-show="supervisionPart && supervisionPart.sector && supervisionPart.sector === 'EXTRUSORA'" >{{total.count}}</div>
          <div class="col-xs-12 col-sm-4" v-show="supervisionPart && supervisionPart.sector && supervisionPart.sector !== 'EXTRUSORA'" >{{total.count | decimalFormat}}</div>
          <!--<div class="col-xs-8 col-sm-4 col-md-3 col-lg-3">{{total.count}}</div>-->
        </div>  
     </div>
  </section>
     
  </article>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import SpinnerLittle from '../Spinner.vue'
  import Spinner from '@/components/SpinnerWrapper.vue'
  import Const from '@/const'

  export default {
    name: 'SupervisionpartFormTotal',
    components: {SpinnerLittle, Spinner},
    props: {
      supervisionPart: {
        type: Object
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
      update (e) {
        this.editados = true
      },
      currentStyle (header) {
        return header.schedule === this.current && !this.date ? 'title' : ''
      },
      init () {
        this.current = Const.currentSchedule().value
        this.supervisionPart.totalBobin = 105
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
            totalRepositionPallet: this.supervisionPart.totalRepositionPallet,
            totalUnitsMachine: this.supervisionPart.totalUnitsMachine,
            totalDownloadedEstanterias: this.supervisionPart.totalDownloadedEstanterias,
            totalMinutesWithoutStopping: this.supervisionPart.totalMinutesWithoutStopping,
            totalCountUnitMaterials: this.supervisionPart.totalCountUnitMaterials,
            totalBobin: this.supervisionPart.totalBobin,
            totalPalletsCamara: this.supervisionPart.totalPalletsCamara,
            totalPalletsContador: this.supervisionPart.totalPalletsContador,
            supervisionpart_id: this.supervisionPart._id
          }
          this.$store.dispatch('supervisionparts/updateTotals', {sector: this.supervisionPart.sector, totals})
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
      unidades: function () {
        return this.$constants.SUPERVISION_PART_UNIT_SECTOR[this.supervisionPart.sector]
      },
      tiempoCarga () {
        let horacarga = 480 - this.supervisionPart.totalStoppings
        var hours = (horacarga / 60)
        var rhours = Math.floor(hours)
        var minutes = (hours - rhours) * 60
        var rminutes = Math.round(minutes)
        rhours = rhours < 10 ? '0' + rhours : rhours
        rminutes = rminutes < 10 ? '0' + rminutes : rminutes
        return '' + rhours + ':' + rminutes
      },
      isExtrusora () {
        return this.hour.sector && this.hour.sector === 'EXTRUSORA'
      },
      ...mapState(
        'supervisionparts', [
          'data',
          'loading',
          'types'
        ]),
      ...mapGetters('supervisionparts', [
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

 .container-fluid {
    width: 90%;
  }

  @media (min-width: 600px) and (max-width: 1200px) {
    .container-fluid {
      width: 100%;
    }
  }

  @media (max-width: 599px) {
    .container-fluid {
      width: 100%;
    }
  }

input {
    color: black;
    display: block;
    padding: 10px 0;
    margin: 5px;
    width: 60px;
}
.value-number {
    position: relative;
    min-width: 54px;
    background: #c9c9c9;
    padding: 8px 0;
    text-align: center;
    font-size: 18px;
    color: #ffffff;
    -webkit-box-flex: 0;
    -ms-flex-positive: 0;
    flex-grow: 0;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    -ms-flex-preferred-size: auto;
    flex-basis: auto;
    -ms-flex-item-align: start;
    align-self: flex-start;
}
.supervisionpart-form-total {
    position: relative;
    background: #c9c9c9;
    padding: 8px 12px;
    font-size: 18px;
    color: #ffffff;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;
    align-self: flex-start;

    .countObservations {
      position: absolute;
      font-size: small;
      top: 18px;
      left: 30px;
      background-color: blue;
      padding: 0px 6px;
      border-radius: 25px;
    }

    img {
      height: 30px;
    }

    &.active {
      font-size: 28px;
      padding: 12px 20px;
      background: #da9d77;

      .countObservations {
        position: absolute;
        font-size: small;
        top: 28px;
        left: 42px;
        background-color: blue;
        padding: 0px 6px;
        border-radius: 25px;
      }
    }

    &.success {
      background-color: #00da3c;
    }

    &.error {
      background-color: red;
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
