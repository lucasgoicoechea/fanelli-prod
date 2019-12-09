<template>
  <div class="meeting-form">
    <div class="container-fluid">

      <div class="row">
        <div class="col-xs-12">
          <h3>Selección de participante/s</h3>
          <collaborator-selector
            :multipleSelection="true"
            :preSelection="editable.collaborators"></collaborator-selector>
        </div>

        <div class="col-xs-12">
          <h3>Tipo de Reunión</h3>
          <div class="row">
            <div
              class="col-md-6"
              v-for="(label, value) in $constants.MEETING_TYPE_READABLE"
              :key="value">
              <check-box
                class="margin"
                type="radio"
                v-model="meeting.type"
                :val="value"
                :label="label"></check-box>
            </div>
          </div>
        </div>

        <div class="col-xs-12">
          <h3>Objetivos</h3>
          <div class="row">
            <div
              class="col-md-6"
              v-for="(label, value) in $constants.RECOMMENDATION_MEETING_READABLE"
              :key="value">
              <check-box
                class="margin"
                v-model="meeting.recommendations"
                :val="value"
                :label="label"></check-box>
            </div>
          </div>
        </div>

        <div class="col-xs-12">
          <h3>Desde</h3>
          <div class="calendar">
            <div class="picker">
              <flat-pickr
                v-model="meeting.date"
                :config="confPicker"
                ref="_flatpickr"
                placeholder="Seleccione una fecha"></flat-pickr>
            </div>
            <button class="button" @click="clearDatePicker('_flatpickr')">Borrar</button>
          </div>
        </div>

        <div class="col-xs-12">
          <h3>Resumen/Temas</h3>
          <textarea
            class="textarea"
            v-model="meeting.description"
            placeholder="Escriba aquí el resumen de la reunión"></textarea>
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
  import { Spanish } from 'flatpickr/dist/l10n/es'

  export default {
    name: 'MeetingForm',
    components: {
      CollaboratorSelector,
      CheckBox
    },
    props: {
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
        meeting: this.generateData(),
        confPicker: {
          inline: true,
          locale: Spanish,
          dateFormat: 'd-m-Y',
          disableMobile: true
        },
        datePicker: null
      }
    },
    mounted () {
      this.datePicker = this.$refs._flatpickr.fp
      this.$emit('update', {
        validation: this.validate(),
        form: this.meeting
      })
    },
    methods: {
      generateData () {
        return {
          collaborators: this.editable.collaborators || [],
          type: this.editable.type || [],
          recommendations: this.editable.recommendations || [],
          description: this.editable.description || '',
          date: this.editable.date || ''
        }
      },
      clearDatePicker (picker) {
        this.$refs[picker].fp.clear()
      },
      initPickers () {
        this.datePicker.setDate(this.editable.date)
      },
      validate () {
        if (!this.hasSelected) {
          return {valid: false, msg: 'Seleccione un/unos colaborador/es'}
        }
        if (this.meeting.type.length === 0) {
          return {valid: false, msg: 'Seleccione un tipo de reunión'}
        }
        if (this.meeting.recommendations.length === 0) {
          return {valid: false, msg: 'Seleccione al menos un objetivo'}
        }
        if (this.meeting.description.length === 0) {
          return {valid: false, msg: 'Ingrese un resumen de la reunión'}
        }
        return {valid: true, msg: 'OK'}
      },
      setCollaborators () {
        this.meeting.collaborators = this.getSelectedIds
      },
      setDateRange () {
        this.meeting.date =
          (this.datePicker.latestSelectedDateObj)
            ? this.datePicker.latestSelectedDateObj.getTime()
            : ''
      },
      prepareMeeting () {
        this.setCollaborators()
        this.setDateRange()
      }
    },
    watch: {
      meeting: {
        handler: function () {
          this.prepareMeeting()
          this.$emit('update', {
            validation: this.validate(),
            form: this.meeting
          })
        },
        deep: true
      },
      getSelectedIds: {
        handler: function () {
          this.prepareMeeting()
          this.$emit('update', {
            validation: this.validate(),
            form: this.meeting
          })
        },
        deep: true
      },
      editable: {
        handler: function () {
          this.meeting = this.generateData()
          this.initPickers()
        },
        deep: true
      }
    },
    computed: {
      ...mapGetters('collaborators', [
        'hasSelected',
        'getSelectedIds'
      ]),
      ...mapState('collaborators', [
        'collaboratorSelected',
        'showList'
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
