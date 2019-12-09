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
            <h3>Indique si fue denunciado</h3>
            <ul>
              <li>
                <input type="radio" id="informed-option" name="inform" :value="true" v-model="informed">
                <label for="informed-option">Denunciado</label>
                <div class="check"></div>
              </li>
              <li>
                <input type="radio" id="not-informed-option" name="inform" :value="false" v-model="informed">
                <label for="not-informed-option">No denunciado</label>
                <div class="check"></div>
              </li>
            </ul>
          </div>
          <div class="col-xs-12">
            <h3>Indique el lugar donde se produjo</h3>
            <ul>
              <li>
                <input type="radio" id="inplant-option" name="inplant" :value="false" v-model="inPlant">
                <label for="inplant-option">In itinere</label>
                <div class="check"></div>
              </li>
              <li>
                <input type="radio" id="not-inplant-option" name="inplant" :value="true" v-model="inPlant">
                <label for="not-inplant-option">En Planta</label>
                <div class="check"></div>
              </li>
            </ul>
          </div>
          <div class="col-xs-12">
            <h3>Indique si se ausenta o se retira antes</h3>
            <ul>
              <li>
                <input type="radio" id="left-option" name="left" :value="false" v-model="left">
                <label for="left-option">Falta</label>
                <div class="check"></div>
              </li>
              <li>
                <input type="radio" id="not-left-option" name="left" :value="true" v-model="left">
                <label class="left-label" for="not-left-option">Se retira antes</label>
                <input v-show="left" class="time" type="time" v-model="leftTime">
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
    name: 'ReportNewsAccident',
    components: {
      BottomNavbar,
      Navigation,
      CollaboratorSelector
    },
    data () {
      return {
        title: 'Reportar accidente',
        observation: '',
        informed: true,
        inPlant: false,
        left: false,
        leftTime: this.getTime()
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
                  type: Constants.news_types.ACCIDENT,
                  request_date: new Date(),
                  inPlant: this.inPlant,
                  informed: this.informed,
                  left: this.left
                }
                if (this.left) {
                  news.time = this.leftTime
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

  .left-label {
    display: inline-block;
  }

  .time {
    width: 90px;
    border: 1px solid #ebcccc;
    display: block;
    margin-left: 62px;
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
