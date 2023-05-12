<template>
  <article class="supervisionpart-reposition-pallets">
    <header>
       <h3> </h3>
      <div  >Reposición de Pallets</div>
       <div class="check-action"
           @click.stop
           @click="showLoadObservation"
           >   
        <img src="/static/img/checklists/comment.svg" alt="">
      </div>
    </header>
     
  <section >
    <div v-if="!repositionPallets || repositionPallets.length == 0">
          <span>No hay proceso de reposicion de pallets aún.</span>
    </div>
        <div  v-show="loadObservation" style="border: solid 1px; padding: 3px 1px 1px 2px; background-color: bisque;" >
       <div v-if="!$loading.isLoading('supervisionpart fetch')" class="observaciones">
        <p v-show="loadingObservation">Cargando ...</p>
        <div  class="row"> 
        <div class="col-xs-8 col-sm-4 col-md-3 col-lg-2">Material <span>
         <select v-model="material" id="material">
                <!--<option :value="null">Seleccione una maquina</option>-->
              <option v-for="(label, value) in $constants.SUPERVISION_PART_MATERIAL"  :key="value" :value="value"> {{label}}</option>
          </select>
          </span></div>  
         <div class="col-xs-12 col-sm-4 col-md-3 col-lg-2"   >Cantidad<span>
                <input  type="number"  v-mask="'###'"  class="active" v-model="value" autofocus></span>
          </div> 
         <div class="col-xs-12 col-sm-4 col-md-3 col-lg-2"> 
          <button @click="createRepositionPallet" :disabled="loadingObservation">
            <span v-if="!loadingObservation">Agregar</span>
            <spinner-little :show="loadingObservation"></spinner-little>
          </button>
         </div> 
        </div>
       </div>
      </div> 
  <div v-for="m in repositionPallets" v-bind:key="m._id">
    {{showLoadingObservationVagon(m._id)?'':''}}
    <div  class="row" > 
        <div class="col-xs-8 col-sm-4 col-md-3 col-lg-2">Material: <span>{{m.material}}</span></div> 
        <div class="col-xs-8 col-sm-4 col-md-3 col-lg-2" >Cantidad: <span>{{m.count}}</span></div> 
        <div class="col-xs-8 col-sm-4 col-md-3 col-lg-2">
          <button @click="delRepositionPallet(m._id)" :disabled="loadingObservationVagon[m._id]">
                <span v-if="!loadingObservationVagon[m._id]" class="action "><img src="/static/img/checklists/sumary/mal.svg"></span>
                <spinner-little :show="loadingObservationVagon[m._id]"></spinner-little>
          </button>
        </div>
</div> 
      <hr> 
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
    name: 'SupervisionpartRepositionPallets',
    components: {SpinnerLittle, Spinner},
    props: {
      repositionPallets: Array,
      supervisionpart: Object,
      supervisionpart_id: String
    },
    data () {
      return {
        current: '',
        material: 'MOLDE_18',
        machine: 'M750',
        value: 0,
        count_reposition_id: [],
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
      update (id) {
        this.editadosVagon[id] = true
      },
      /* currentStyle (header) {
        return header.schedule === this.current && !this.date ? 'title' : ''
      }, */
      init () {
        if (this.repositionPallets) {
          this.repositionPallets.forEach(element => {
            // this.loadingObservationVagon[element._id] = false
            this.editadosVagon[element._id] = false
          })
        }
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
      createRepositionPallet: function () {
        if (this.material !== '') {
          this.loadingObservation = true
          const observation = {
            value: this.value,
            machine: this.machine,
            material: this.material,
            supervisionpart_id: this.supervisionpart_id
          }
          this.$store.dispatch('supervisionpartsLTres/createRepositionPallet', {sector: this.supervisionpart.sector, observation})
            .then(() => {
              this.loadingObservation = false
              this.showLoadObservation()
            })
        }
      },
      delRepositionPallet: function (id) {
        const observation = {
          reposition_pallet_id: id,
          supervisionpart_id: this.supervisionpart_id
        }
        this.$store.dispatch('supervisionpartsLTres/delRepositionPallet', {sector: this.supervisionpart.sector, observation})
            .then(() => {
              this.loadingObservationVagon[id] = false
              this.editadosVagon[id] = false
            })
      },
      arrow: function (id) {
        return {
          arrow: this.show(id)
        }
      },
      index: function (e) {
        return this.supervisionpart.comparative.indexOf(e)
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
        return this.$constants.SUPERVISION_PART_UNIT_SECTOR[this.supervisionpart.sector]
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
.check-action {
    display: block;
    text-align: right;
    padding: 8px;
    margin: 10px;
    flex-grow: 0;
    flex-shrink: 0;
    flex-basis: auto;
    align-self: flex-start;

    &.active {
      background: #da9d77;
      border-radius: 25px;
    }

 
    img {
      height: 40px;
      width: 40px;
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
