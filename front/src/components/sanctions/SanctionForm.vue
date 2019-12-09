<template>
  <div class="sanction-form">
    <div class="container-fluid">

      <div class="row">

        <div class="col-xs-12">
          <h3 :class="{ disabled: isEdition }">
            Selección del colaborador
            <img v-if="isEdition" src="/static/img/lock.svg" alt="">
          </h3>
          <collaborator-selector
            :multipleSelection="true"
            :disabled="isEdition"
            :preSelection="editableSanction.collaborators"></collaborator-selector>
        </div>

        <div class="col-xs-12" :class="{ disabled: isEdition }">
          <h3>
            Sanción de
            <img v-if="isEdition" src="/static/img/lock.svg" alt="">
          </h3>
          <ul>
            <li v-for="(key, value) in $constants.SANCTION_TYPE_READABLE">
              <input type="radio" :id="key" :value="value" v-model="sanction.type" :disabled="isEdition">
              <label :for="key">{{key | capitalize }}</label>
              <div class="check"></div>
            </li>
          </ul>
        </div>

      </div>

      <div class="row" v-show="isSuspension">
        <div class="col-md-6">
          <h3>Desde</h3>
          <div class="calendar">
            <div class="picker">
              <flat-pickr
                v-model="sanction.dateRange.from"
                :config="confPickerStart"
                ref="_flatpickrStart"
                @on-change="toLimit"
                placeholder="Seleccione una fecha"></flat-pickr>
            </div>
            <button class="button" @click="clearDatePicker('_flatpickrStart')">Borrar</button>
          </div>
        </div>

        <div class="col-md-6">
          <h3>Hasta</h3>
          <div class="calendar">
            <div class="picker">
              <flat-pickr
                v-model="sanction.dateRange.to"
                :config="confPickerEnd"
                ref="_flatpickrEnd"
                @on-change="limitIncorporationDate"
                placeholder="Seleccione una fecha"></flat-pickr>
            </div>
            <button class="button" @click="clearDatePicker('_flatpickrEnd')">Borrar</button>
          </div>
        </div>
      </div>

      <div class="row" v-show="isSuspension">
        <div class="col-xs-12">
          <h3>Fecha de incorporación</h3>
          <div class="calendar">
            <div class="picker">
              <flat-pickr
                v-model="sanction.incorporationDate"
                :config="confPickerIncorporation"
                ref="_flatpickrIncorporation"
                placeholder="Seleccione una fecha"></flat-pickr>
            </div>
            <button class="button" @click="clearDatePicker('_flatpickrIncorporation')">Borrar</button>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-xs-12">
          <h3>Razón</h3>
          <p class="text-content">{{ headerMsg }}</p>
          <textarea
            class="textarea"
            v-model="sanction.writtenReason"
            placeholder="Escriba aquí la razón"></textarea>
          <p class="text-content">{{ footerMsg }}</p>
          <div class="separator"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import CollaboratorSelector from '@/components/selectors/collaborator/CollaboratorSelector.vue'
  import { Spanish } from 'flatpickr/dist/l10n/es'

  export default {
    name: 'SanctionForm',
    components: {
      CollaboratorSelector
    },
    props: {
      editableSanction: {
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
        sanction: this.generateSanctionData(),
        confPickerStart: {
          inline: true,
          locale: Spanish,
          dateFormat: 'd-m-Y',
          disableMobile: true
        },
        confPickerEnd: {
          inline: true,
          locale: Spanish,
          dateFormat: 'd-m-Y',
          disableMobile: true
        },
        confPickerIncorporation: {
          inline: true,
          locale: Spanish,
          dateFormat: 'd-m-Y',
          disableMobile: true,
          enableTime: true,
          time_24hr: true
        },
        pickerStart: null,
        pickerEnd: null,
        pickerIncorporation: null
      }
    },
    mounted () {
      this.pickerStart = this.$refs._flatpickrStart.fp
      this.pickerEnd = this.$refs._flatpickrEnd.fp
      this.pickerIncorporation = this.$refs._flatpickrIncorporation.fp
      if (this.editableSanction.hasOwnProperty('dateRange')) {
        this.initPickers()
      }
      this.$emit('sanction-update', {
        validation: this.validate(),
        sanction: this.sanction
      })
    },
    methods: {
      generateSanctionData () {
        return {
          collaborators: this.editableSanction.collaborators || [],
          type: this.editableSanction.type || '',
          writtenReason: this.editableSanction.writtenReason || '',
          reason: this.editableSanction.reason || '',
          dateRange: {
            from: this.editableSanction.dateRange ? this.editableSanction.dateRange.from : '',
            to: this.editableSanction.dateRange ? this.editableSanction.dateRange.to : ''
          },
          incorporationDate: this.editableSanction.incorporationDate || ''
        }
      },
      initPickers () {
        this.pickerStart.setDate(this.editableSanction.dateRange.from)
        this.pickerEnd.setDate(this.editableSanction.dateRange.to)
        this.pickerIncorporation.setDate(this.editableSanction.incorporationDate)
      },
      clearDatePicker (picker) {
        this.$refs[picker].fp.clear()
      },
      toLimit (event) {
        if (event.length === 0) {
          this.$set(this.confPickerEnd, 'minDate', '')
        } else {
          this.$set(this.confPickerEnd, 'minDate', new Date(event[0]))
        }
      },
      limitIncorporationDate (event) {
        if (event.length === 0) {
          this.$set(this.confPickerIncorporation, 'minDate', '')
        } else {
          this.$set(this.confPickerIncorporation, 'minDate', new Date(event[0]))
        }
      },
      validate () {
        if (!this.hasSelected) {
          return {valid: false, msg: 'Seleccione un/unos colaborador/es'}
        }
        if (this.sanction.type === '') {
          return {valid: false, msg: 'Seleccione un tipo de sanción.'}
        }
        if (this.isSuspension && !this.hasSelectedRange()) {
          return {valid: false, msg: 'Seleccione un rango de fechas.'}
        }
        if (this.isSuspension && !this.hasSelectedIncorporationDate()) {
          return {valid: false, msg: 'Seleccione la fecha de incorporación'}
        }
        if (this.sanction.writtenReason === '') {
          return {valid: false, msg: 'Ingrese una razón para continuar'}
        }
        return {valid: true, msg: 'OK'}
      },
      hasSelectedRange () {
        return this.pickerStart.selectedDates.length !== 0 &&
          this.pickerEnd.selectedDates.length !== 0
      },
      hasSelectedIncorporationDate () {
        return this.pickerIncorporation.selectedDates.length !== 0
      },
      setDateRange () {
        this.sanction.dateRange.from =
          (this.pickerStart.latestSelectedDateObj)
            ? this.pickerStart.latestSelectedDateObj.getTime()
            : ''
        this.sanction.dateRange.to =
          (this.pickerEnd.latestSelectedDateObj)
            ? this.pickerEnd.latestSelectedDateObj.getTime()
            : ''
      },
      setIncorporationDate () {
        this.sanction.incorporationDate =
          (this.pickerIncorporation.latestSelectedDateObj)
            ? this.pickerIncorporation.latestSelectedDateObj.getTime()
            : ''
      },
      setCollaborators () {
        this.sanction.collaborators = this.getSelectedIds
      },
      concatRedeable (header, text, footer) {
        const last = text.length - 1
        if (text[last] === '.') {
          return `${header} ${text} ${footer}`
        } else {
          return `${header} ${text}. ${footer}`
        }
      },
      fullReason () {
        if (this.isSuspension) {
          this.sanction.reason =
            this.concatRedeable(
              this.$constants.SANCTIONS_TYPE_MSG.SUSPENSION_HEADER,
              this.sanction.writtenReason,
              this.$constants.SANCTIONS_TYPE_MSG.SUSPENSION_FOOTER
            )
        } else {
          this.sanction.reason =
            this.concatRedeable(
              this.$constants.SANCTIONS_TYPE_MSG.WARNING_HEADER,
              this.sanction.writtenReason,
              '\n' + this.$constants.SANCTIONS_TYPE_MSG.WARNING_FOOTER
            )
        }
      },
      prepareSanction () {
        this.setCollaborators()
        this.setDateRange()
        this.setIncorporationDate()
        this.fullReason()
      }
    },
    watch: {
      sanction: {
        handler: function () {
          this.prepareSanction()
          this.$emit('sanction-update', {
            validation: this.validate(),
            sanction: this.sanction
          })
        },
        deep: true
      },
      getSelectedIds: {
        handler: function () {
          this.prepareSanction()
          this.$emit('sanction-update', {
            validation: this.validate(),
            sanction: this.sanction
          })
        },
        deep: true
      },
      editableSanction: {
        handler: function () {
          this.sanction = this.generateSanctionData()
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
        'collaboratorSelected'
      ]),
      isEdition () {
        return this.mode === 'edition'
      },
      isSuspension () {
        return this.sanction.type === this.$constants.SANCTION_TYPE.SUSPENSION
      },
      headerMsg () {
        return (this.isSuspension)
          ? this.$constants.SANCTIONS_TYPE_MSG.SUSPENSION_HEADER
          : this.$constants.SANCTIONS_TYPE_MSG.WARNING_HEADER
      },
      footerMsg () {
        return (this.isSuspension)
          ? this.$constants.SANCTIONS_TYPE_MSG.SUSPENSION_FOOTER
          : this.$constants.SANCTIONS_TYPE_MSG.WARNING_FOOTER
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";
  @import "../../assets/styles/mixins";
  @import "../../assets/styles/animations";

  .left-label {
    display: inline-block;
  }

  .time {
    width: 50px;
    border: 1px solid #ebcccc;
  }

  input[type=time]::-webkit-inner-spin-button,
  input[type=time]::-webkit-clear-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }

  h3 {
    flex-grow: 1;
    width: 100%;
    font-weight: bold;
    border-bottom: 3px solid $primary-color;
    margin: 18px 0;
    display: flex;
    justify-content: space-between;

    img {
      padding: 0 5px 2px 0 ;
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

    &:focus {
      outline: none;
    }
  }

  .container-fluid {
    width: 80%;
  }

  ul {
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  ul li {
    display: block;
    position: relative;
    float: left;
  }

  ul li input[type=radio] {
    position: absolute;
    visibility: hidden;
  }

  ul li label {
    display: block;
    color: #5a5a5a;
    position: relative;
    font-weight: 300;
    font-size: 1.35em;
    padding: 10px 5px 10px 60px;
    margin: 10px auto;
    z-index: 9;
    cursor: pointer;
  }

  ul li .check {
    display: block;
    position: absolute;
    border: 5px solid $primary-light;
    border-radius: 100%;
    height: 35px;
    width: 35px;
    top: 15px;
    left: 15px;
    z-index: 5;
  }

  ul li .check::before {
    display: block;
    position: absolute;
    content: '';
    border-radius: 100%;
    height: 15px;
    width: 15px;
    top: 5px;
    left: 5px;
    margin: auto;
  }

  input[type=radio]:checked ~ .check {
    border: 5px solid $primary-light;
  }

  input[type=radio]:checked ~ .check::before {
    background: $primary-light;
  }

  input[type=radio]:checked ~ label {
    color: $primary-light;
  }

  .text-content {
    color: #525252;
    font-size: medium;
  }

  .separator {
    height: 0;
    margin-bottom: 100px;
  }

  .picker {
    display: inline-block;
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

  .disabled {
    opacity: 0.5;
  }

  @media (max-width: 599px) {
    .container-fluid {
      width: 100%;
    }
  }
</style>
