<template>
  <div class="productivity-form">
    <div class="container-fluid">

      <div class="row">
      
        <div class="col-xs-12">
          <h3>Selección de participante/s</h3>
          <collaborator-selector
            :multipleSelection="true"
             typeList="full"
            :preSelection="editable.collaborators"></collaborator-selector>
        </div>
        <div class="col-xs-12">
          <h3>Selección de Editor/s</h3>
           <div class="row">
              <div
              class="col-md-6"
              v-for="collaborator in listCollaboratorsSelected"
              :key="collaborator._id">
              <check-box
                class="margin"
                v-model="productivity.editors"
                :val="collaborator._id"
                :label="'Leg.' + collaborator.legajo "></check-box>
               <span>{{collaborator.lastname + ', ' + collaborator.name}} </span>
            </div>
          </div>
        </div>

        <!--<div class="col-xs-12">
          <h3>Tipo de Reunión</h3>
          <div class="row">
            <div
              class="col-md-6"
              v-for="(label, value) in $constants.MEETING_TYPE_CREATABLE"
              :key="value">
              <check-box
                class="margin"
                type="radio"
                v-model="productivity.type"
                :val="value"
                :label="label"></check-box>
            </div>
            
          </div>
        </div>
        <div class="col-xs-12" v-if="productivity.type && productivity.type ==='FRECUENCY'">
          <h3>Frecuencia</h3>
          <div class="row">
              <div
              class="col-md-6"
              v-for="(label, value) in $constants.MEETING_FRECUENCY"
              :key="value">
              <check-box
                class="margin"
                 type="radio"
                v-model="productivity.frecuency"
                :val="value"
                :label="label"></check-box>
            </div>
             <div
              class="col-md-6" v-show="productivity.frecuency && productivity.frecuency ==='MONTHLY'">
              Se generá desempeño para el día {{datePicker.latestSelectedDateObj.getDate()}} de cada mes hasta la fecha {{datePickerFrom.latestSelectedDateObj.getDate()}}/{{datePickerFrom.latestSelectedDateObj.getMonth()+1}}/{{datePickerFrom.latestSelectedDateObj.getFullYear()}}
            </div>
          </div>
  
        </div> -->
        <div class="col-xs-12" v-show="productivity.frecuency  && productivity.type ==='FRECUENCY'">
          <h3>Nombre</h3>
          <div class="row">
              <div
              class="col-md-6"
              v-for="(label, value) in $constants.MEETING_NAME"
              :key="value">
              <check-box
                class="margin"
                v-model="productivity.names"
                :val="value"
                :label="label"></check-box>
            </div>
          </div>
        </div>
         <div class="col-xs-12" v-show="productivity.frecuency  && productivity.frecuency ==='WEEKLY'">
          <h3>Días de la Semana</h3>
          <div class="row">
              <div
              class="col-md-6"
              v-for="(label, value) in $constants.WEEKLY_MEETING_FRECUENCY"
              :key="value">
              <check-box
                class="margin"
                v-model="productivity.weeklys"
                :val="value"
                :label="label"></check-box>
            </div>
          </div>
        </div>
        <!-- <div class="col-xs-12">
          <h3>Objetivos</h3>
          <div class="row">
            <div
              class="col-md-6"
              v-for="(label, value) in $constants.RECOMMENDATION_MEETING_READABLE"
              :key="value">
              <check-box
                class="margin"
                v-model="productivity.recommendations"
                :val="value"
                :label="label"></check-box>
            </div>
          </div>
        </div> -->
        <div class="col-xs-12">
          <h3>FECHA DESEMPEÑO</h3>
         <div class="row">
          <div class="col-md-6">
            <div class="calendar">
              <div class="picker">
                <flat-pickr
                  v-model="productivity.date"
                  :config="confPicker"
                  ref="_flatpickr"
                  placeholder="Seleccione una fecha"></flat-pickr>
              </div>
              <button class="button" @click="clearDatePicker('_flatpickr')">Borrar</button>
            </div>
          </div>
          <div class="col-md-3" style="float: left" >
              <h3>Hora</h3>
              <input type="time" v-model="productivity.time">
              <label v-show="false"><span><input type="checkbox" v-model="productivity.repeatEdit"  >
                Editar repeticiones
              </span></label>
          </div>
          <div class="col-md-3" v-show="productivity.type && productivity.type ==='FRECUENCY' && productivity.frecuency !=='MONTHLY'">
            <h3>Hasta</h3>
            <div class="calendar">
              <div class="picker">
                <flat-pickr
                  v-model="productivity.dateFrom"
                  :config="confPicker"
                  ref="_flatpickrFrom"
                  placeholder="Seleccione una fecha"></flat-pickr>
              </div>
              <button class="button" @click="clearDatePicker('_flatpickrFrom')">Borrar</button>
            </div>
          </div>  
          <div class="col-md-4" v-for="nro in 11" :key="nro" v-show="productivity.type && productivity.type ==='FRECUENCY' && productivity.frecuency ==='MONTHLY'">
            <h3>Reunión {{nro}}</h3>
            <div class="calendar">
              <div class="picker">
                <flat-pickr
                  v-model="productivity.dates[nro-1]"
                  :config="confPicker"
                  ref="_flatpickrs" 
                  placeholder="Seleccione una fecha"></flat-pickr>
              </div>
              <button class="button" @click="clearDatePicker('_flatpickrs[{{nro}}]')">Borrar</button>
            </div>
          </div>          
        </div>
        </div>
        <div class="col-xs-12">
          <h3>Resumen/Temas</h3>
          <vue-editor
          v-model="productivity.description"
          placeholder="Escriba aquí el resumen de la desempeño"
          :editorToolbar="defaultToolbar"></vue-editor>
        </div>
      </div>

      <div class="separator"></div>

    </div>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import CollaboratorSelector from '@/components/selectors/collaborator/CollaboratorSelector'
  import CheckBox from '@/components/CheckBoxInput'
  import { VueEditor } from 'vue2-editor'
  import { Spanish } from 'flatpickr/dist/l10n/es'

  export default {
    name: 'productivityForm',
    components: {
      VueEditor,
      CollaboratorSelector,
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
        productivity: this.generateData(),
        confPicker: {
          inline: true,
          locale: Spanish,
          dateFormat: 'd-m-Y',
          disableMobile: true
        },
        datePicker: null,
        datePickerFrom: null,
        datesPicker: [],
        isFrecuency: false,
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
      this.datePicker = this.$refs._flatpickr.fp
      this.datePickerFrom = (this.$refs._flatpickrFrom)
      ? this.$refs._flatpickrFrom.fp
      : null
      if (this.$refs._flatpickrs) {
        for (var i = 0; i <= 10; i++) {
          var efp = this.$refs._flatpickrs[i]
          this.datesPicker[i] = (efp)
          ? efp.fp
          : null
        }
      }
      this.$emit('update', {
        validation: this.validate(),
        form: this.productivity
      })
    },
    methods: {
      generateData () {
        return {
          collaborators: this.editable.collaborators || [],
          editors: this.editable.editors || [],
          type: this.editable.type || 'INDIVIDUAL',
          frecuency: this.editable.frecuency || [],
          weeklys: this.editable.weeklys || [],
          names: this.editable.names || [],
          recommendations: this.editable.recommendations || 'DISCIPLINE',
          description: this.editable.description || '',
          date: this.editable.date || new Date(),
          dateFrom: this.editable.dateFrom || new Date(),
          dates: this.editable.dates || [],
          time: this.editable.time || this.getTime(),
          repeatEdit: false
        }
      },
      getTime () {
        const d = new Date()
        let h = d.getHours()
        let m = d.getMinutes()
        if (h < 10) h = '0' + h
        if (m < 10) m = '0' + m
        return h + ':' + m
      },
      clearDatePicker (picker) {
        this.$refs[picker].fp.clear()
      },
      initPickers () {
        this.datePicker.setDate(this.editable.date)
        if (this.datePickerFrom == null && this.$refs._flatpickrFrom) {
          this.datePickerFrom = this.$refs._flatpickrFrom.fp
        }
        if (this.datePickerFrom !== null) {
          this.datePickerFrom.setDate(this.editable.dateFrom)
        }
        for (var i = 0; i <= 10; i++) {
          var efp = this.$refs._flatpickrs[i]
          if (this.datePickers[i] == null && efp) {
            this.datePickers[i] = efp.fp
          }
          if (this.datePickers[i] !== null) {
            this.datePickers[i].setDate(this.editable.dates[i])
          }
        }
      },
      validate () {
        if (!this.hasSelected) {
          return {valid: false, msg: 'Seleccione un/unos colaborador/es'}
        }
        if (this.productivity.type.length === 0) {
          return {valid: false, msg: 'Seleccione un tipo de desempeño'}
        }
        if (this.productivity.recommendations.length === 0) {
          return {valid: false, msg: 'Seleccione al menos un objetivo'}
        }
        if (this.productivity.description.length === 0) {
          return {valid: false, msg: 'Ingrese un resumen de la desempeño'}
        }
        return {valid: true, msg: 'OK'}
      },
      /* setEditors () {
        this.productivity.editors = this.getSelectedEditorsIds
      }, */
      setCollaborators () {
        this.productivity.collaborators = this.getSelectedIds
      },
      setDateRange () {
        this.productivity.date =
          (this.datePicker.latestSelectedDateObj)
            ? this.datePicker.latestSelectedDateObj.getTime()
            : ''
        this.productivity.dateFrom =
          (this.datePickerFrom && this.datePickerFrom.latestSelectedDateObj)
            ? this.datePickerFrom.latestSelectedDateObj.getTime()
            : ''
        for (var i = 0; i <= 10; i++) {
          this.productivity.dates[i] = (this.datesPicker[i] && this.datesPicker[i].latestSelectedDateObj)
            ? this.datesPicker[i].latestSelectedDateObj.getTime()
            : ''
        }
      },
      prepareproductivity () {
        // this.setEditors()
        this.setCollaborators()
        this.setDateRange()
      }
    },
    watch: {
      productivity: {
        handler: function () {
          this.prepareproductivity()
          this.$emit('update', {
            validation: this.validate(),
            form: this.productivity
          })
        },
        deep: true
      },
      getSelectedIds: {
        handler: function () {
          this.prepareproductivity()
          this.$emit('update', {
            validation: this.validate(),
            form: this.productivity
          })
        },
        deep: true
      },
      /* getSelectedEditorsIds: {
        handler: function () {
          this.prepareproductivity()
          this.$emit('update', {
            validation: this.validate(),
            form: this.productivity
          })
        },
        deep: true
      }, */
      editable: {
        handler: function () {
          this.productivity = this.generateData()
          this.initPickers()
        },
        deep: true
      }
    },
    computed: {
      frecuency () {
        return this.isFrecuency
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
