<template>
  <article class="supervisionpart-resume-history-total" v-if="supervisionPart!=null" >
  <!--<header v-show="supervisionPart && supervisionPart.sector && supervisionPart.sector === 'EXTRUSORA'">-->
     <header> <div data-v-832c7fbc="" class="col-lg-12">Totales</div>     </header>
    <section class="container-fluid">
   
    <div  class="row" > 
      <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3"><span  style="color: black;">Total Turno: </span> <span>{{supervisionPart.totalCountUnitMaterials}}</span></div>
      <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3"><span  style="color: black;">Tiempo Marcha: </span> <span>{{supervisionPart.totalMinutesWithoutStopping}}</span></div>
      <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3"><span  style="color: black;">Tiempo Carga:</span> <span>{{tiempoCarga}}</span></div>
      <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3"   v-show="supervisionPart && supervisionPart.sector && supervisionPart.sector === 'DESAPILADORA'" ><span style="color: black;">Peso Nylon 1: </span><span>{{supervisionPart.totalBobin}}</span> gramos</div>
      <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3"   v-show="supervisionPart && supervisionPart.sector && supervisionPart.sector === 'DESAPILADORA'" ><span style="color: black;">Peso Nylon 2: </span><span>{{supervisionPart.totalBobinTwo}}</span> gramos</div>   <!--<div class="col-xs-8 col-sm-4 col-md-3 col-lg-2"   v-show="supervisionPart && supervisionPart.sector && supervisionPart.sector === 'DESAPILADORA'" >Reposición {{unidades}} Maq.:<span>{{supervisionPart.totalUnitsMachine}}</span> </div>-->
      <!--<div class="col-xs-8 col-sm-4 col-md-3 col-lg-2"   v-show="supervisionPart && supervisionPart.sector && supervisionPart.sector === 'DESAPILADORA'" >Reposición Pallets:<span>{{supervisionPart.totalRepositionPallet}}</span> </div>-->
       <div class="col-xs-8 col-sm-4 col-md-3 col-lg-2"   v-show="supervisionPart && supervisionPart.sector && supervisionPart.sector === 'APILADORA'" ><span  style="color: black;">Cantidad Vagonetas:</span> <span>{{supervisionPart.countVagon}}</span> </div>
      
      <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3">  </div>
    </div>
    <div class="row"> 
       <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3"  v-show="supervisionPart && supervisionPart.sector && supervisionPart.sector === 'EXTRUSORA'" ><span style="color: black;">Total Vacio: </span>{{supervisionPart.totalVacuum}}</div>
       <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3"  v-show="supervisionPart && supervisionPart.sector && supervisionPart.sector === 'EXTRUSORA'" ><span style="color: black;">Total Dureza: </span> {{supervisionPart.totalDurity}}</div>
       <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3"  v-show="supervisionPart && supervisionPart.sector && supervisionPart.sector === 'DESAPILADORA'" ><span style="color: black;">Total Pallets Camara: </span> {{supervisionPart.totalPalletsCamara}}</div>
       <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3"  v-show="supervisionPart && supervisionPart.sector && supervisionPart.sector === 'DESAPILADORA'" ><span style="color: black;">Total Pallets Contador: </span> {{supervisionPart.totalPalletsContador}}</div>
       <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3"> <span  style="color: black;">Total Sistema {{unidades}}:</span>{{supervisionPart.totalUnits | decimalFormat}}</div>
       <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3"> <span  style="color: black;">Total Paradas:</span> {{supervisionPart.totalStoppings}} <span  style="color: black;">minutos</span></div>
    </div>
    <hr> 
    <div class="container-fluid">
         <div class="row" >
            <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3"  
                v-show="supervisionPart && supervisionPart.sector" >
                <span  style="color: black;">Total MOLDE_8:</span>{{supervisionPart.total_MOLDE_8}}
            </div>
            <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3"  
                v-show="supervisionPart && supervisionPart.sector" >
                <span  style="color: black;">Total MOLDE_12_6A:</span>
                  {{supervisionPart.total_MOLDE_12_6A}}
            </div> 
            <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3"  
                v-show="supervisionPart && supervisionPart.sector" >
                <span  style="color: black;">Total MOLDE_12_9A:</span>
                  {{supervisionPart.total_MOLDE_12_8A}}
            </div> 
            <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3"  
                v-show="supervisionPart && supervisionPart.sector" >
                <span  style="color: black;">Total MOLDE_18:</span>
                  {{supervisionPart.total_MOLDE_18}}
           </div>     
            <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3"  
                v-show="supervisionPart && supervisionPart.sector" >
                <span  style="color: black;">Total MOLDE_P12:</span>
                  {{supervisionPart.total_MOLDE_P12}}
           </div>  
            <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3"  
                v-show="supervisionPart && supervisionPart.sector" >
               <span  style="color: black;">Total MOLDE_P18:</span>
                  {{supervisionPart.total_MOLDE_P18}}
           </div>  
            <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3"  
                v-show="supervisionPart && supervisionPart.sector" >
               <span  style="color: black;">Total MOLDE_L11:</span>
                  {{supervisionPart.total_MOLDE_L11}}
           </div>  
            <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3"  
                v-show="supervisionPart && supervisionPart.sector" >
                <span  style="color: black;">Total MOLDE_C:</span>
                  {{supervisionPart.total_MOLDE_C}}
           </div>   
            <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3"  
                v-show="supervisionPart && supervisionPart.sector" >
              <span  style="color: black;">Total MOLDE_DM4:</span>
                  {{supervisionPart.total_MOLDE_DM4}}
           </div>  
            <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3"  
                v-show="supervisionPart && supervisionPart.sector" >
              <span  style="color: black;">Total MOLDE_DM20:</span>
                  {{supervisionPart.total_MOLDE_DM20}}
           </div>  
            <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3"  
                v-show="supervisionPart && supervisionPart.sector" >
              <span  style="color: black;">Total MOLDE_DM24:</span>
                  {{supervisionPart.total_MOLDE_DM24}}
           </div>  
            <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3"  
                v-show="supervisionPart && supervisionPart.sector" >
              <span  style="color: black;">Total MOLDE_DM27:</span>
                  {{supervisionPart.total_MOLDE_DM27}}
           </div>    
            <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3"  
                v-show="supervisionPart && supervisionPart.sector" >
              <span  style="color: black;">Total MOLDE_DIN18:</span>
                  {{supervisionPart.total_MOLDE_DIN18}}
           </div>   
            <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3"  
                v-show="supervisionPart && supervisionPart.sector" >
              <span  style="color: black;">Total MOLDE_DIN27:</span>
                  {{supervisionPart.total_MOLDE_DIN27}}
           </div>  
             <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3"  
                v-show="supervisionPart && supervisionPart.sector" >
              <span  style="color: black;">Total MOLDE_COLUMNA:</span>
                  {{supervisionPart.total_MOLDE_COLUMNA}}
           </div>                                                                                                                                          
         </div>              
    </div>  
    <hr>
    <div class="container-fluid">
       <div class="row" >
          <div class="col-xs-8 col-sm-4 col-md-4 col-lg-3" v-show="supervisionPart && supervisionPart.sector && supervisionPart.sector === 'EXTRUSORA'" >MAQUINA</div>
          <div class="col-xs-8 col-sm-4 col-md-4 col-lg-3"><span style="color: black;">MATERIAL</span></div>
          <div class="col-xs-8 col-sm-4 col-md-4 col-lg-3"><span style="color: black;">TOTAL</span></div>
          <!--<div class="col-xs-8 col-sm-4 col-md-3 col-lg-3">TOTAL PARTE</div>-->
       </div> 
        <div v-for="(total,index) in supervisionPart.totals" class="row"  :key="index" >
          <div class="col-xs-8 col-sm-4 col-md-4 col-lg-3" v-show="supervisionPart && supervisionPart.sector && supervisionPart.sector === 'EXTRUSORA'" >{{total.machine}}</div>
          <div class="col-xs-8 col-sm-4 col-md-4 col-lg-3">{{total.material}}</div>
          <div class="col-xs-8 col-sm-4 col-md-4 col-lg-3">{{total.count | decimalFormat}}</div>
          <!--<div class="col-xs-8 col-sm-4 col-md-3 col-lg-3">{{total.count}}</div>-->
        </div>  
     </div>
  </section>  
  </article>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import Const from '@/const'

  export default {
    name: 'SupervisionpartResumeHistoryTotal',
    components: {},
    props: {
      supervisionPart: {
        type: Object
      }
    },
    data () {
      return {
        current: '',
        selected: -1,
        mobileView: false
      }
    },
    methods: {
      currentStyle (header) {
        return header.schedule === this.current && !this.date ? 'title' : ''
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
