<template>
  <article class="supervisionpart-materials">
    <header>
       <h3> </h3>
      <div  >Materiales</div>
       <div class="check-action"
           @click.stop
           @click="showLoadObservation"
           >   
        <img src="/static/img/checklists/comment.svg" alt="">
      </div>
    </header>
     
  <section style=" background-color: #F0AC83;" >
    <div v-if="!materials || materials.length == 0" >
          <span>No hay proceso de materiales para esta hora.</span>
    </div>
        <div  v-show="loadObservation" style="border: solid 1px; padding: 3px 1px 1px 2px; background-color: bisque;" >
       <div v-if="!$loading.isLoading('supervisionpart fetch')" class="observaciones">
        <p v-show="loadingObservation">Cargando ...</p>
        <div  class="row"> 
        <div class="col-xs-8 col-sm-4 col-md-3 col-lg-2"  v-show="sector && sector === 'EXTRUSORA'" >Maquina <span>
        <select v-model="machine" id="position">
                <!--<option :value="null">Seleccione una maquina</option>-->
                <option v-for="(label, value) in $constants.SUPERVISION_PART_MACHINE"  :key="value" :value="value"> {{label}}</option>
              </select>
          </span></div>
        <div class="col-xs-8 col-sm-4 col-md-3 col-lg-2">Material <span>
         <select v-model="material" id="material">
                <!--<option :value="null">Seleccione una maquina</option>-->
              <option v-for="(label, value) in $constants.SUPERVISION_PART_MATERIAL"  :key="value" :value="value"> {{label}}</option>
          </select>
          </span></div>  
          <div class="col-xs-12 col-sm-4 col-md-3 col-lg-2"  v-show="sector && sector !== 'EXTRUSORA'" >Nro. {{unidades}}<span>
                <input  type="number"   v-mask="'###'" class="active" v-model="value" autofocus></span>
          </div> 
          <div class="col-xs-12 col-sm-4 col-md-3 col-lg-2"  v-show="sector && sector == 'EXTRUSORA'" >Cantidad<span>
                <input  type="number"  v-mask="'###'"  class="active" v-model="prod" autofocus></span>
          </div> 
         <div class="col-xs-12 col-sm-4 col-md-3 col-lg-2"  v-show="sector && sector == 'DESAPILADORA'" >Cantidad
           <span>
              <select v-model="prod" >
                <option v-for="(label, value) in $constants.SUPERVISION_PART_COUNT_DESAPILADORA"  :key="value" :value="value"> {{label}}</option>
              </select>
              </span>
          </div>  
         <div class="col-xs-8 col-sm-4 col-md-3 col-lg-2"  v-show="sector && sector == 'APILADORA'" >Pisos
           <span>
              <select v-model="prod" >
                <option v-for="(label, value) in $constants.SUPERVISION_PART_COUNT_APILADORA"  :key="value" :value="value"> {{label}}</option>
              </select>
              </span>
          </div>  
         <div class="col-xs-8 col-sm-4 col-md-3 col-lg-2"> 
          <button @click="createMaterial" :disabled="loadingObservation">
            <span v-if="!loadingObservation">Agregar</span>
            <spinner-little :show="loadingObservation"></spinner-little>
          </button>
         </div> 
        </div>
       </div>
      </div> 
  <div v-for="m in materials" v-bind:key="m._id">
    {{showLoadingObservationVagon(m._id)?'':''}}
    <div  class="row titulo"  > 
        <div class="col-xs-2 col-sm-2 col-md-3 col-lg-3"   v-show="sector && sector === 'EXTRUSORA'" >Maquina: <span>{{m.machine}}</span></div>
        <div class="col-xs-2 col-sm-2 col-md-3 col-lg-2">Molde: <span>{{m.material}}</span></div> 
        <div class="col-xs-2 col-sm-2  col-md-3 col-lg-2" v-show="sector && sector !== 'EXTRUSORA'" >+ {{unidades}}-></div>
        <div class="col-xs-2 col-sm-2  col-md-3 col-lg-2" v-show="sector && sector !== 'EXTRUSORA'" >Nro.<input @input="update(m._id)"  type="number"  v-mask="'###'" class="active" v-model="unit_vagon_id[m._id]" autofocus></div>
        <div class="col-xs-2 col-sm-2  col-md-3 col-lg-2" v-show="sector && sector == 'DESAPILADORA'" >Cant.<input @input="update(m._id)"  type="number"  v-mask="'###'" class="active" v-model="count_vagon_id[m._id]" autofocus></div>
        <div class="col-xs-2 col-sm-2  col-md-3 col-lg-2" v-show="sector && sector == 'APILADORA'" >Pisos
          <span>
              <select v-model="count_vagon_id[m._id]"   @change="update(m._id)" >
                <option v-for="(label, value) in $constants.SUPERVISION_PART_COUNT_APILADORA"  :key="value" :value="value"> {{label}}</option>
              </select>
              </span>
        </div>
        <div class="col-xs-2 col-sm-2 col-md-3 col-lg-2" v-show="sector && sector !== 'EXTRUSORA'">
          <!--<button @click="delMaterial(m._id)" :disabled="loadingObservationVagon[m._id]">
                <span v-if="!loadingObservationVagon[m._id] && !editadosVagon[m._id]" class="action "><img src="/static/img/checklists/sumary/mal.svg"></span>
                <span v-if="!loadingObservationVagon[m._id] && editadosVagon[m._id]" class="action true"><img src="/static/img/checklists/sumary/mal.svg"></span>
                <spinner-little :show="loadingObservationVagon[m._id]"></spinner-little>
          </button> //borrar -->
          <button @click="addVagon(m._id)" :disabled="loadingObservationVagon[m._id]">
                <span v-if="!loadingObservationVagon[m._id] && !editadosVagon[m._id]" class="action "><img src="/static/img/checklists/tick.svg"></span>
                <span v-if="!loadingObservationVagon[m._id] && editadosVagon[m._id]" class="action true"><img src="/static/img/checklists/tick.svg"></span>
                <spinner-little :show="loadingObservationVagon[m._id]"></spinner-little>
          </button>
        </div>
</div> 
      <div v-for="(v,idenx) in m.vagons" v-bind:key="v._id" >
     <div  class="row"> 
        <div class="col-xs-8 col-sm-4 col-md-3 col-lg-2"  v-show="sector && sector === 'EXTRUSORA'" >------  <span>-----</span></div>
        <div class="col-xs-8 col-sm-4 col-md-3 col-lg-2"  v-show="sector && sector !== 'EXTRUSORA'">#{{idenx+1}}<span>---</span></div>
       <div class="col-xs-8 col-sm-4 col-md-3 col-lg-3">Unidad: <span>{{v.unit}}</span></div>
       <div class="col-xs-8 col-sm-4 col-md-3 col-lg-2"  v-show="sector && sector !== 'EXTRUSORA'" >Numero: <span>{{v.number}}</span></div>
       <div class="col-xs-8 col-sm-4 col-md-3 col-lg-2"  v-show="sector && sector !== 'APILADORA'" >Cantidad: <span>{{v.count}}</span></div>
       <div class="col-xs-8 col-sm-4 col-md-3 col-lg-2"  v-show="sector && sector == 'APILADORA'" >Pisos: <span>{{v.count}}</span></div>
       <div class="col-xs-8 col-sm-4 col-md-3 col-lg-2" >
          <button @click="delVagon(m._id, v.number)" >
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
  import SpinnerLittle from '../Spinner.vue'
  import Spinner from '@/components/SpinnerWrapper.vue'
  import Const from '@/const'

  export default {
    name: 'SupervisionpartMaterials',
    components: {SpinnerLittle, Spinner},
    props: {
      materials: {
        type: Array,
        default: () => ([])
      },
      sector: String,
      supervisionpart_id: String,
      date: {
        type: String,
        required: false
      }
    },
    data () {
      return {
        current: '',
        material: this.materialLast(),
        machine: this.machineLast(),
        value: 0,
        prod: 0,
        unit_vagon_id: [],
        count_vagon_id: [],
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
      materialLast () {
        if (this.materials && this.materials.length > 0) {
          let element = this.materials[this.materials.length - 1]
          return this.$constants.SUPERVISION_PART_MATERIAL_READBLE[element.material]
        }
        return 'MOLDE_18'
      },
      machineLast () {
        if (this.materials && this.materials.length > 0) {
          let element = this.materials[this.materials.length - 1]
          return this.$constants.SUPERVISION_PART_MACHINE_READBLE[element.machine]
        }
        return 'M750'
      },
      seletecMaterials () {
        if (this.materials && this.materials.length > 0) {
          this.materials.forEach(e => {
            this.editadosVagon[e._id] = false
          })
          let element = this.materials[this.materials.length - 1]
          this.material = this.$constants.SUPERVISION_PART_MATERIAL_READBLE[element.material]
          this.machine = this.$constants.SUPERVISION_PART_MACHINE_READBLE[element.machine]
        }
        if (this.sector === 'DESAPILADORA') {
          this.prod = 16
        }
      },
      update (id) {
        this.editadosVagon[id] = true
      },
      currentStyle (header) {
        return header.schedule === this.current && !this.date ? 'title' : ''
      },
      init () {
        if (this.materials && this.materials.length > 0) {
          this.materials.forEach(e => {
            this.editadosVagon[e._id] = false
          })
          let element = this.materials[this.materials.length - 1]
          this.material = this.$constants.SUPERVISION_PART_MATERIAL_READBLE[element.material]
          this.machine = this.$constants.SUPERVISION_PART_MACHINE_READBLE[element.machine]
        }
        if (this.sector === 'DESAPILADORA') {
          this.prod = 16
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
      createMaterial: function () {
        if (this.machine !== '') {
          this.loadingObservation = true
          const observation = {
            value: this.value,
            count: this.prod,
            machine: this.machine,
            material: this.material,
            supervisionpart_id: this.supervisionpart_id
          }
          this.$store.dispatch('supervisionpartsLTres/createMaterial', {sector: this.sector, observation})
            .then(() => {
              if (this.sector === 'DESAPILADORA') {
                this.prod = 16
              }
              this.loadingObservation = false
              this.showLoadObservation()
            })
          this.comment = ''
        }
      },
      delMaterial: function (id) {
        const observation = {
          material_id: id,
          supervisionpart_id: this.supervisionpart_id
        }
        this.$store.dispatch('supervisionpartsLTres/delMaterial', {sector: this.sector, observation})
          .then(() => {
            this.loadingObservationVagon[id] = false
            this.editadosVagon[id] = false
          })
        this.editadosVagon[id] = false
      },
      addVagon: function (id) {
        if (!this.unit_vagon_id[id]) {
          this.unit_vagon_id[id] = 0
        }
        if (!this.count_vagon_id[id]) {
          this.count_vagon_id[id] = 0
        }
        if (this.unit_vagon_id[id] >= 0 || this.count_vagon_id[id] >= 0) {
          this.loadingObservationVagon[id] = true
          let materialSend = ''
          let materialMolde = this.materials.find(m => m._id === id)
          for (var key in this.$constants.SUPERVISION_PART_MATERIAL) {
            if (this.$constants.SUPERVISION_PART_MATERIAL[key] === materialMolde.material) {
              materialSend = key
              this.machine = this.$constants.SUPERVISION_PART_MACHINE_READBLE[materialMolde.machine]
            }
          }
          const observation = {
            value: this.unit_vagon_id[id],
            count: this.count_vagon_id[id],
            machine: this.machine,
            material: materialSend,
            material_id: id,
            supervisionpart_id: this.supervisionpart_id
          }
          this.$store.dispatch('supervisionpartsLTres/addVagon', {sector: this.sector, observation})
            .then(() => {
              this.loadingObservationVagon[id] = false
              this.editadosVagon[id] = false
            })
          this.unit_vagon_id[id] = 0
          this.count_vagon_id[id] = 0
          this.editadosVagon[id] = false
        }
      },
      delVagon: function (id, nm) {
        const observation = {
          material_id: id,
          vagon_number: nm,
          supervisionpart_id: this.supervisionpart_id
        }
        this.$store.dispatch('supervisionpartsLTres/delVagon', {sector: this.sector, observation})
          .then(() => {
            this.loadingObservationVagon[id] = false
            this.editadosVagon[id] = false
          })
        this.editadosVagon[id] = false
      },
      arrow: function (id) {
        return {
          arrow: this.show(id)
        }
      },
      /* index: function (e) {
        return this.hour.comparative.indexOf(e)
      }, */
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
    mounted () {
      this.seletecMaterials()
    },
    watch: {
      materials: function () {
        if (this.materials && this.materials.length > 0) {
          this.materials.forEach(e => {
            this.editadosVagon[e._id] = false
          })
          let element = this.materials[this.materials.length - 1]
          this.material = this.$constants.SUPERVISION_PART_MATERIAL_READBLE[element.material]
          this.machine = this.$constants.SUPERVISION_PART_MACHINE_READBLE[element.machine]
        }
      }
    },
    computed: {
      unidades: function () {
        return this.$constants.SUPERVISION_PART_UNIT_SECTOR[this.sector]
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

  .titulo {
    background-color: #F36E51;
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
  .negro {
    color: black;
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
