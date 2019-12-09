<template>
  <div class="report-news-generic">
    <navigation :title="title"></navigation>
    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-xs-12">
            <h3>Selección del colaborador</h3>
            <collaborator-selector></collaborator-selector>
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
  import {mapState, mapGetters} from 'vuex'

  export default {
    name: 'ReportNewsGeneric',
    components: {
      BottomNavbar,
      Navigation,
      CollaboratorSelector
    },
    data () {
      return {
        title: 'Reportar observación',
        observation: ''
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

        if (this.observation === '') {
          this.$modal.show('dialog', {
            title: 'Información',
            text: 'Por favor ingrese una observación para continuar',
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
                  type: Constants.news_types.OBSERVATION
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

  .container-fluid {
    width: 80%;
  }

  @media (max-width: 599px)  {
    .container-fluid {
      width: 100%;
    }
  }
</style>
