<template>
  <div class="report-news-tarde">
    <navigation :title="title"></navigation>
    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-xs-12">
            <h3>Selección del colaborador</h3>
            <collaborator-selector></collaborator-selector>
          </div>
          <div class="col-xs-12">
            <h3>Hora de salida</h3>
            <input type="time" v-model="enterTime">
          </div>
          <div class="col-xs-12">
            <h3>Indique si avisó</h3>
            <ul>
              <li>
                <input type="radio" id="sin-aviso-option" name="aviso" :value="true" v-model="withNotice">
                <label for="sin-aviso-option">Con aviso</label>
                <div class="check"></div>
              </li>
              <li>
                <input type="radio" id="con-aviso-option" name="aviso" :value="false" v-model="withNotice">
                <label for="con-aviso-option">Sin aviso</label>
                <div class="check"></div>
              </li>
            </ul>
          </div>
          <div class="col-xs-12">
            <h3>Observaciones</h3>
            <textarea
              class="textarea"
              v-model="observation"
              placeholder="Escriba aquí una observación"></textarea>
          </div>
        </div>
      </div>
    </section>
    <bottom-navbar>
      <div class="submit">
        <div class="msg pointer" :class="notAllow" @click="sendReport" v-show="!loaderSubmit">
          <h5 class="items">Enviar reporte</h5>
          <span class="glyphicon glyphicon-send items icon-action"></span>
        </div>
        <div class="msg pointer" v-show="loaderSubmit">
          <h5 class="items">Enviando</h5>
          <spinner class="items" :show="loaderSubmit"></spinner>
        </div>
      </div>
      <div class="print" v-show="submitedRequest !== null">
        <div class="msg pointer" @click="modalPrint" v-show="!loaderPrint">
          <span class="glyphicon glyphicon-print items icon-action"></span>
          <h5 class="items">Imprimir reporte</h5>
        </div>
        <div class="msg pointer" v-show="loaderPrint">
          <spinner class="items" :show="loaderPrint"></spinner>
          <h5 class="items">Imprimiendo</h5>
        </div>
      </div>
    </bottom-navbar>
  </div>
</template>

<script>
  import Navigation from '@/components/Navigation.vue'
  import BottomNavbar from '@/components/BottomNavbar.vue'
  import CollaboratorSelector from '@/components/selectors/collaborator/CollaboratorSelector.vue'
  import Constants from '../../const.js'
  import { mapState, mapGetters } from 'vuex'
  import Vue from 'vue'
  import Spinner from '@/components/SpinnerWrapper.vue'

  export default {
    name: 'ReportNewsEarly',
    components: {
      BottomNavbar,
      Navigation,
      CollaboratorSelector,
      Spinner
    },
    data () {
      return {
        title: 'Reportar salida temprana',
        observation: '',
        withNotice: true,
        enterTime: this.getTime(),
        submitedRequest: null,
        loaderSubmit: false,
        loaderPrint: false
      }
    },
    methods: {
      sendReport () {
        if (this.submitedRequest !== null) {
          return
        }
        if (!this.hasSelected) {
          this.$modal.show('dialog', {
            title: 'Información',
            text: 'Por favor seleccione un colaborador para continuar',
            buttons: [
              {
                title: 'Aceptar'
              }
            ]
          })
          return
        }

        this.$modal.show('dialog', {
          text: `¿Desea agregar la novedad para el colaborador "${this.collaboratorSelected.name} ${this.collaboratorSelected.lastname}"?`,
          buttons: [
            {
              title: 'Si',
              handler: () => {
                const news = {
                  collaborator: this.collaboratorSelected,
                  observation: this.observation,
                  time: this.enterTime,
                  withNotice: this.withNotice,
                  type: Constants.news_types.EARLY,
                  request_date: new Date()
                }
                const successMessage = this.$t('news_create_success')
                this.loaderSubmit = true
                this.$store.dispatch('news/sendReport', {news})
                  .then(
                    (res) => {
                      this.$snotifyWrapper.success(successMessage)
                      this.submitedRequest = res.body.staffNews
                      this.loaderSubmit = false
                    },
                    () => {
                      this.loaderSubmit = false
                    }
                  )
                this.$modal.hide('dialog')
              }
            },
            {
              title: 'No'
            }
          ]
        })
      },
      modalPrint () {
        this.$modal.show('dialog', {
          text: `¿Desea imprimir este parte?`,
          buttons: [
            {
              title: 'Si',
              handler: () => {
                this.print()
                this.$modal.hide('dialog')
              }
            },
            {
              title: 'No',
              handler: () => {
                this.$modal.hide('dialog')
                this.$router.replace({name: 'home'})
              }
            }
          ]
        })
      },
      getTime () {
        const d = new Date()
        let h = d.getHours()
        let m = d.getMinutes()
        if (h < 10) h = '0' + h
        if (m < 10) m = '0' + m
        return h + ':' + m
      },
      print () {
        this.loaderPrint = true
        Vue.http.get('staff-news/pdf/' + this.submitedRequest._id,
          {responseType: 'arraybuffer'}
        )
          .then(
            (response) => {
              var blob = new Blob([response.data], {type: response.headers.get['content-type']})
              var link = document.createElement('a')
              link.href = window.URL.createObjectURL(blob)
              link.download = `parte-de-salida.pdf`
              link.click()
              this.loaderPrint = false
              this.$router.replace({name: 'home'})
            },
            () => { this.loaderPrint = false })
      }
    },
    computed: {
      ...mapGetters('collaborators', [
        'hasSelected'
      ]),
      ...mapState('collaborators', [
        'collaboratorSelected'
      ]),
      notAllow () {
        return {
          'not-allow': this.submitedRequest !== null
        }
      }
    },
    destroyed () {
      this.submitedRequest = null
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";
  @import "../../assets/styles/mixins";

  h3 {
    flex-grow: 1;
    width: 100%;
    font-weight: bold;
    border-bottom: 3px solid $primary-color;
    margin: 18px 0;
  }

  .textarea {
    border: 2px solid $secondary-darker;
    margin-bottom: 100px;
    width: 100%;
    padding: 10px;
    display: block;
    resize: none;
    min-height: 100px;
  }

  .ta-left {
    text-align: left;
  }

  .ta-right {
    text-align: right;
  }

  .msg {
    display: flex;
    flex-direction: row;
    padding: 18px;

    &.pointer {
      cursor: pointer;
    }

    .items {
      padding: 0 5px;
      font-weight: bold;
    }

    .icon-action {
      font-size: 34px;
    }
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

  .container-fluid {
    width: 80%;
  }

  @media (max-width: 599px) {
    .container-fluid {
      width: 100%;
    }
  }

  .not-allow {
    color: #b2b2b2;
    cursor: not-allowed !important;
  }

</style>
