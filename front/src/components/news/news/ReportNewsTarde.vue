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
          <div class="col-xs-12" v-if="$can($constants.ROLES.PERSONAL + '|' + $constants.ROLES.RRHH)">
            <h3>Fecha del Evento</h3>
            <div class="calendar">
              <div class="picker">
                <flat-pickr
                  v-model="date"
                  :config="confPicker"
                  ref="_flatpickr"
                  placeholder="Seleccione una fecha"></flat-pickr>
              </div>
              <button class="button" @click="clearDatePicker('_flatpickr')">Borrar</button>
            </div>
            <h3>Hora de ingreso</h3>
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
      <div class="action" @click="sendReport">
        <div class="text-action ta-right">
          <h5>Enviar</h5>
          <h5>reporte</h5>
        </div>
        <div class="icon-action">
          <span class="glyphicon glyphicon-send"></span>
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

  export default {
    name: 'ReportNewsTarde',
    components: {
      BottomNavbar,
      Navigation,
      CollaboratorSelector
    },
    data () {
      return {
        title: 'Reportar ingreso tarde',
        observation: '',
        withNotice: false,
        date: new Date(),
        enterTime: this.getTime()
      }
    },
    methods: {
      sendReport () {
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
                this.$router.replace({name: 'home'})
                const news = {
                  collaborator: this.collaboratorSelected,
                  observation: this.observation,
                  time: this.enterTime,
                  withNotice: this.withNotice,
                  type: Constants.news_types.LATE,
                  request_date: this.date // new Date()
                }
                const successMessage = this.$t('news_create_success')

                this.$store.dispatch('news/sendReport', {news})
                  .then(
                    () => {
                      this.$snotifyWrapper.success(successMessage)
                    },
                    () => {
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
      getTime () {
        const d = new Date()
        let h = d.getHours()
        let m = d.getMinutes()
        if (h < 10) h = '0' + h
        if (m < 10) m = '0' + m
        return h + ':' + m
      }
    },
    computed: {
      ...mapGetters('collaborators', [
        'hasSelected'
      ]),
      ...mapState('collaborators', [
        'collaboratorSelected'
      ])
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

  .action {
    cursor: pointer;
    flex-grow: 0;
    flex-shrink: 0;
    padding: 10px;
    position: relative;
    font-size: 36px;
    color: #fff;
    float: left;

    > .text-action {
      display: inline-block;

      > h4 {
        color: rgba(255, 255, 255, 0.6);
      }

      > h4, h5 {
        font-weight: bold;
        margin: 4px;
      }
    }

    > .icon-action {
      display: inline;
      margin: auto 4px;
    }
  }

  .ta-left {
    text-align: left;
  }

  .ta-right {
    text-align: right;
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

</style>
