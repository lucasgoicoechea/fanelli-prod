<template>
  <div>
    <slot name="file"></slot>
    <div class="dropbox">
      <input type="file" class="file-input" @change="processFile($event)">
      <div class="filename">
        <div v-if="filename === ''">Haga click aquí para seleccionar un archivo o arrástrelo aquí</div>
        <div v-else>{{ filename }}</div>
      </div>
    </div>

    <slot name="action"></slot>
    <ul>
      <li>
        <input type="radio" id="license-option" name="medicalDischarge" :value="false" v-model="medicalDischarge"
               @change="updateField">
        <label for="license-option">Licencia</label>
        <div class="check"></div>
      </li>
      <li>
        <input type="radio" id="discharged-option" name="medicalDischarge" :value="true" v-model="medicalDischarge"
               @change="updateField">
        <label for="discharged-option">Alta</label>
        <div class="check"></div>
      </li>
    </ul>

    <h3>
      {{ actionTitleText }}
    </h3>
    <input type="date"
           name="date"
           class="date-input"
           :min="minDate"
           @input="updateField">

    <slot name="observations"></slot>
    <div class="news-observations-input">
        <textarea name="observation"
                  class="observations-input"
                  placeholder="Escriba aquí una observación"
                  @input="updateField"></textarea>
    </div>

  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: 'MedicInformBase',
    components: {},
    data () {
      return {
        filename: '',
        medicalDischarge: '',
        dateHeaderText: ''
      }
    },
    methods: {
      updateField (e) {
        this.$store.commit('events/updateToSubmitField', {field: e.target.name, value: e.target.value})
      },
      processFile (e) {
        if (e.target.files.length === 1) {
          this.filename = `Archivo seleccionado: "${e.target.files[0].name}"`
          this.$store.commit('events/updateToSubmitField', {field: 'file', value: e.target.files[0]})
        }
      }
    },
    computed: {
      ...mapState('events', [
        'medicInformTypes',
        'dataToSubmit'
      ]),
      minDate () {
        const today = new Date()
        return this.$moment(today).format('YYYY-MM-DD')
      },
      actionTitleText () {
        return this.medicalDischarge ? 'Fecha de alta médica' : 'Fecha del próximo turno médico'
      }
    }
  }
</script>

<style lang="scss" scoped>

  @import "/../../assets/styles/variables";

  h3 {
    width: 100%;
    font-weight: bold;
    border-bottom: 3px solid $primary-color;
    margin: 18px 0;
  }

  .date-input {
    margin-top: 3px;
    width: 170px;
    color: #232323;
  }

  .observations-input {
    margin-top: 5px;
    border: 2px solid orangered;
    width: 100%;
    display: block;
    min-height: 100px;
    resize: none;
  }

  .file-input {
    position: absolute;
    opacity: 0;
    height: 100%;
    width: 100%;
    left: 0;
    margin: 0;
    top: 0;
    cursor: pointer;
  }

  .filename {
    display: flex;
    justify-content: center;
    align-content: center;
  }

  .dropbox:hover {
    background: #a8a8a8;
  }

  .dropbox {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70px;
    margin: 20px 0;
    border: 3px dashed #b8b8b8;
    background: #ebebeb;
    color: dimgray;
    min-height: 50px;
    cursor: pointer;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    overflow: auto;
  }

  ul li {
    display: block;
    position: relative;
    float: left;
    width: 100%;
  }

  ul li input[type=radio] {
    position: absolute;
    visibility: hidden;
  }

  ul li label {
    display: block;
    position: relative;
    font-weight: 300;
    font-size: 1.35em;
    padding: 10px 5px 10px 60px;
    margin: 10px auto;
    height: 30px;
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

</style>
