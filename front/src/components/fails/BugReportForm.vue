<template>
  <div class="bug-report-form">
    <div class="container-fluid">

      <div class="row">
      
       <div>
        <div class="col-xs-12">
          <h3>Selección de Linea</h3>
          <select v-model="bugReport.line" id="line">
                <option v-for="p in lineList" :key="p._id" :value="p._id" > {{p.text}}</option>
          </select>
        </div>
        </div>

        <div>
        <div class="col-xs-12">
          <h3>Selección de Sector</h3>
          <!--<sector-selector
            :multipleSelection="true"
             typeList="full"
            :preSelection="editable.collaborators"></sector-selector>-->
            <select v-model="bugReport.sector" id="sector">
              <option v-for="(label, value) in sectorList" :key="value" :value="value"> {{label}}</option>
          </select>
        </div>
        </div>

        <div>
        <div class="col-xs-12">
          <h3>Selección de Sub-Sector</h3>
          <!--<sub-sector-selector
            :multipleSelection="true"
             typeList="full"
            :preSelection="editable.collaborators"></sub-sector-selector>-->
            <select v-model="bugReport.sub_sector" id="sub_sector">
              <option v-for="(label, value) in subSectorList"  :key="value" :value="value"> {{label}}</option>
          </select>
        </div>
        </div>
        
        <div>
        <div class="col-xs-12">
          <h3>Selección de Equipo</h3>
          <!--<equipo-selector
            :multipleSelection="true"
             typeList="full"
            :preSelection="editable.collaborators"></equipo-selector>-->
            <select v-model="bugReport.equipo" id="equipo">
              <option v-for="(label, value) in equipoList"  :key="value" :value="value"> {{label}}</option>
          </select>
        </div>
        </div>
        
        <div>
        <div class="col-xs-12">
          <h3>Selección de Grupos</h3>
          <!--<part-selector
            :multipleSelection="true"
             typeList="full"
            :preSelection="editable.collaborators"></part-selector>-->
            <select v-model="bugReport.group" id="group">
              <option v-for="(label, value) in groupList"  :key="value" :value="value"> {{label}}</option>
          </select>
        </div>
        </div>

        <div>
        <div class="col-xs-12">
          <h3>Selección de Partes</h3>
          <!--<sub-part-selector
            :multipleSelection="true"
             typeList="full"
            :preSelection="editable.collaborators"></sub-part-selector>-->
            <select v-model="bugReport.part" id="part">
              <option v-for="(label, value) in partList"  :key="value" :value="value"> {{label}}</option>
          </select>
        </div>
        </div>
        
        <div>
        <div class="col-xs-12">
          <h3>Estado de Falla</h3>
          <!--<sub-part-selector
            :multipleSelection="true"
             typeList="full"
            :preSelection="editable.collaborators"></sub-part-selector>-->
            <select v-model="bugReport.estado" id="estado" @change="cambiarEstado()">
              <option v-for="(label, value) in $constants.BUG_REPORT_ESTADO"  :key="value" :value="value"> {{label}}</option>
          </select>
        </div>
        </div>
        
        <div>
        <div class="col-xs-12">
          <h3>Selección de Prioridad</h3>
          <!--<sub-part-selector
            :multipleSelection="true"
             typeList="full"
            :preSelection="editable.collaborators"></sub-part-selector>-->
            <select v-model="bugReport.prioridad" id="prioridad">
              <option v-for="(label, value) in $constants.BUG_REPORT_PRIORIDAD2"  :key="value" :value="value"> {{label}}</option>
          </select>
        </div>
        </div>
        
        <div>
        <div class="col-xs-12">
          <h3>Inconveniente</h3>
          <!--<sub-part-selector
            :multipleSelection="true"
             typeList="full"
            :preSelection="editable.collaborators"></sub-part-selector>-->
            <select v-model="bugReport.inconveniente" id="inconveniente">
              <option v-for="(label, value) in inconvenienteList"  :key="value" :value="value"> {{label}}</option>
          </select>
        </div>
        </div>

       <div class="col-xs-12">
          <h3>Detectado por</h3>
            {{bugReport.detectado}}  
       </div>
        
       <div class="col-xs-12">
          <h3>Resuelto por</h3>
            {{bugReport.resuelto}}
        </div>

        <div class="col-xs-12">
          <h3>Resumen/Fallas</h3>
          <vue-editor
          v-model="bugReport.resume"
          placeholder="Escriba aquí el resumen de la falla"
          :editorToolbar="defaultToolbar"></vue-editor>
        </div>
      </div>

      <div class="separator"></div>

    </div>
  </div>
</template>

<script>
  import auth from '@/auth'
  import { mapState, mapGetters } from 'vuex'
  import LineSelector from '@/components/fails/line/LineSelector'
  import SectorSelector from '@/components/fails/sector/SectorSelector'
  import SubSectorSelector from '@/components/fails/subsector/SubSectorSelector'
  import EquipoSelector from '@/components/fails/equipo/EquipoSelector'
  import PartSelector from '@/components/fails/part/PartSelector'
  import SubPartSelector from '@/components/fails/subpart/SubPartSelector'
  import CheckBox from '@/components/CheckBoxInput'
  import { VueEditor } from 'vue2-editor'

  export default {
    name: 'BugReportForm',
    components: {
      VueEditor,
      LineSelector,
      SectorSelector,
      SubSectorSelector,
      EquipoSelector,
      PartSelector,
      SubPartSelector,
      CheckBox
    },
    props: {
      preSelection: {
        type: Array,
        default: () => ([])
      },
      editable: {
        type: Object,
        default: () => ({})
      },
      mode: {
        type: String,
        default: 'creation',
        validator: function (value) {
          return ['creation', 'edition'].indexOf(value) !== -1
        }
      }
    },
    data () {
      return {
        bugReport: this.generateData(),
        lineList: this.getFailsForFather(null),
        customToolbar: [
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['image', 'code-block']
        ],
        defaultToolbar: [
          [{ header: [false, 1, 2, 3, 4, 5, 6] }],
          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          [
            { align: '' },
            { align: 'center' },
            { align: 'right' },
            { align: 'justify' }
          ],
          ['blockquote', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ color: [] }, { background: [] }],
          ['link'],
          ['clean']
        ]
      }
    },
    mounted () {
      this.$emit('update', {
        validation: this.validate(),
        form: this.bugReport
      })
    },
    methods: {
      generateData () {
        return {
          line: this.editable.line || '',
          sector: this.editable.sector || '',
          sub_sector: this.editable.sub_sector || '',
          equipo: this.editable.equipo || '',
          group: this.editable.group || '',
          part: this.editable.part || '',
          estado: this.editable.estado || '',
          prioridad: this.editable.prioridad || '',
          inconveniente: this.editable.inconveniente || '',
          detectado: this.editable.detectado || auth.getUser().lastname + ',' + auth.getUser().name,
          resuelto: this.editable.resuelto || '',
          resume: this.editable.resume || ''
        }
      },
      cambiarEstado () {
        if (this.bugReport.estado === 'SOLUCIONADO') {
          this.bugReport.resuelto = auth.getUser().lastname + ',' + auth.getUser().name
        } else {
          this.bugReport.resuelto = ''
        }
      },
      validate () {
        /* if (!this.hasSelected) {
          return {valid: false, msg: 'Seleccione un/unos colaborador/es'}
        }
        if (this.bugReport.type.length === 0) {
          return {valid: false, msg: 'Seleccione un tipo de reunión'}
        }
        if (this.bugReport.recommendations.length === 0) {
          return {valid: false, msg: 'Seleccione al menos un objetivo'}
        }
        if (this.bugReport.description.length === 0) {
          return {valid: false, msg: 'Ingrese un resumen de la reunión'}
        } */
        return {valid: true, msg: 'OK'}
      },
      getFailsForFather: function (id) {
        this.$store.dispatch('bugReport/getFailsForFather', {father: id})
          .then(() => {
            console.log('ohla')
          })
      }
    },
    watch: {
      bugReport: {
        handler: function () {
          this.$emit('update', {
            validation: this.validate(),
            form: this.bugReport
          })
        },
        deep: true
      },
      getSelectedIds: {
        handler: function () {
          this.prepareMeeting()
          this.$emit('update', {
            validation: this.validate(),
            form: this.bugReport
          })
        },
        deep: true
      },
      /* getSelectedEditorsIds: {
        handler: function () {
          this.prepareMeeting()
          this.$emit('update', {
            validation: this.validate(),
            form: this.bugReport
          })
        },
        deep: true
      }, */
      editable: {
        handler: function () {
          this.bugReport = this.generateData()
          this.initPickers()
        },
        deep: true
      }
    },
    computed: {
      frecuency () {
        return this.isFrecuency
      },
      sectorList () { // Lista de Sectores, Linea 0
        return this.getFailsForFather(this.bugReport.line)
      },
      subSectorList () {
        return this.getFailsForFather(this.bugReport.sector)
      },
      equipoList () { // Lista de Equipos, Sector Produccion
        return this.getFailsForFather(this.bugReport.sub_sector)
      },
      groupList () {
        return this.getFailsForFather(this.bugReport.equipo)
      },
      partList () { // Lista de Partes, Sector Produccion
        return this.getFailsForFather(this.bugReport.group)
      },
      inconvenienteList () {
        if (this.bugReport.estado === 'SOLUCIONADO') {
          return '-'
        } else {
          if (this.bugReport.estado === 'SOLUCION_TEMPORAL') {
            return '-'
          } else {
            if (this.bugReport.estado === 'NO_SOLUCIONADO') {
              return this.$constants.BUG_REPORT_ESTADO_NO_SOLUCIONADO
            }
          }
        }
      },
      ...mapGetters('collaborators', [
        'hasSelected',
        'getSelectedIds'
      ]),
      ...mapState('collaborators', [
        'collaboratorSelected',
        'showList',
        'listCollaboratorsSelected'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/_variables.scss";
  @import "~@/assets/styles/_mixins.scss";
  @import "~@/assets/styles/_animations.scss";

  h3 {
    flex-grow: 1;
    width: 100%;
    font-weight: bold;
    border-bottom: 3px solid $primary-color;
    margin: 18px 0;
    display: flex;
    justify-content: space-between;

    img {
      padding: 0 5px 2px 0;
      margin: 0 8px;
      height: 35px;
      width: 35px;

      &:hover {
        @include wobble-hor-bottom();
      }
    }
  }

  .textarea {
    border: 2px solid $primary-light;
    width: 100%;
    padding: 10px;
    display: block;
    resize: none;
    min-height: 100px;
    height: 250px;

    &:focus {
      outline: none;
    }
  }

  .container-fluid {
    width: 80%;
  }

  .disabled {
    opacity: 0.5;
  }

  .separator {
    height: 0;
    margin-bottom: 100px;
  }

  @media (max-width: 599px) {
    .container-fluid {
      width: 100%;
    }
  }

  .recommendation-text {
    font-size: large;
    color: #5d5d5d;
    margin: 5px 10px;
  }

  .text-bold {
    font-weight: bold;
    color: #2f2f2f;
  }

  .calendar {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .button {
    background-color: #fb8964;
    border: none;
    border-radius: 100px;
    color: white;
    padding: 8px 16px;
    box-shadow: 0px 1px 4px 0 rgba(0, 0, 0, 0.3);
    text-align: center;
    text-decoration: none;
    outline: none;
    display: inline-block;
    margin: 15px 0;

    &:hover {
      background-color: #dc725c;
    }
  }

  .margin {
    margin: 0 0 0 10px !important;
  }
</style>