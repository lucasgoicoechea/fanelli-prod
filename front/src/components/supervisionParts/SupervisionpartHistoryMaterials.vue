<template>
  <article class="supervisionpart-history-materials">
    <header>
       <h3> </h3>
      <div  style="margin-right: 20px;" >Materiales</div>
    </header>
 <section style=" background-color: #F0AC83;" >
    <div v-if="!materials || materials.length == 0" >
          <span>No hay proceso de materiales para esta hora.</span>
    </div>
  <div v-for="m in materials" v-bind:key="m._id">
    {{showLoadingObservationVagon(m._id)?'':''}}
    <div  class="row" > 
        <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3"   v-show="sector &&  sector === 'EXTRUSORA'" ><span  class="negro"  >Maquina: </span><span>{{m.machine}}</span></div>
        <div class="col-xs-8 col-sm-4 col-md-3 col-lg-2"><span  class="negro"  >Molde: </span><span>{{m.material}}</span></div> 
        <!--<div class="col-xs-8 col-sm-4 col-md-3 col-lg-2">+ {{unidades}}-></div>-->
    </div> 
      <div v-for="(v,idenx) in m.vagons" v-bind:key="v._id" >
     <div  class="row"> 
         <div class="col-xs-8 col-sm-4 col-md-3 col-lg-2" v-show="sector && sector !== 'EXTRUSORA'">#{{idenx+1}} --></div>
       <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3">Unidad: <span>{{v.unit}}</span></div>
       <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3"  v-show="  sector &&  sector !== 'EXTRUSORA'" >Numero: <span>{{v.number}}</span></div>
       <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3"  v-show="sector &&  sector !== 'APILADORA'" >Cantidad: <span>{{v.count}}</span></div>
        <div class="col-xs-8 col-sm-4 col-md-3 col-lg-2"  v-show="sector &&  sector == 'APILADORA'" >Pisos: <span>{{v.count}}</span></div>
         <div class="col-xs-8 col-sm-4 col-md-3 col-lg-2" >
          <button 
           @click="delVagon(m._id, v.number)" 
           v-show="$can($constants.ROLES.JEFE_PLANTA + '|' + $constants.ROLES.JEFE_LINEA ) "   
           >
                <span  class="action "><img src="/static/img/checklists/sumary/mal.svg"></span>
          </button>
       </div> 
     </div> 
      </div> 
     <hr> 
    </div>
  </section>


  </article>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import Const from '@/const'

  export default {
    name: 'SupervisionpartHistoryMaterials',
    props: {
      materials: Array,
      supervisionpart_id: String,
      sector: String,
      date: {
        type: String,
        required: false
      }
    },
    data () {
      return {
        current: '',
        material: 'MOLDE_18',
        machine: 'M750',
        value: 0,
        prod: 0,
        selected: -1,
        mobileView: false,
        loadObservation: false,
        loadingObservation: false,
        editados: false,
        loadingObservationVagon: [],
        editadosVagon: []
      }
    },
    methods: {
      currentStyle (header) {
        return header.schedule === this.current && !this.date ? 'title' : ''
      },
      init () {
        this.materials.forEach(element => {
          // this.loadingObservationVagon[element._id] = false
          this.editadosVagon[element._id] = false
        })
        this.current = Const.currentSchedule().value
      },
      currentSchedule (header) {
        return header.schedule === this.current && !this.date
      },
      showMobile () {
        this.mobileView = !this.mobileView
      },
      showLoadingObservationVagon (id) {
        this.loadingObservationVagon[id] = false
        return this.loadingObservationVagon[id]
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
      showLoadObservation: function () {
        this.loadObservation = !this.loadObservation
      },
      delVagon: function (id, nm) {
        const observation = {
          material_id: id,
          vagon_number: nm,
          supervisionpart_id: this.supervisionpart_id
        }
        this.$store.dispatch('supervisionparts/delVagon', {sector: this.sector, observation})
          .then(() => {
            this.loadingObservationVagon[id] = false
            this.editadosVagon[id] = false
            location.reload()
          })
        this.editadosVagon[id] = false
      },
      arrow: function (id) {
        return {
          arrow: this.show(id)
        }
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
        return this.$constants.SUPERVISION_PART_UNIT_SECTOR[this.sector]
      },
      ...mapState('supervisionparts', [
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";
  .negro {
    color: black;
    text-decoration: underline;
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
