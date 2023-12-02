<template>
  <div class="scheduled-news-container">
    <navigation :title="title"></navigation>
    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-xs-12">
            <h3>Selección del colaborador</h3>
            <collaborator-selector></collaborator-selector>
          </div>
          <div class="col-xs-12">
            <h3>Tipo de novedad de personal</h3>
            <ul>
              <li v-for="event in eventTypes">
                <input type="radio" :id="event.type" name="inform" :value="event.type"
                       v-model="news_type" @change="changeNewsType(event.type)">
                <label :for="event.type">{{event.name}}</label>
                <div class="check"></div>
              </li>
            </ul>
          </div>
          <div class="col-xs-12">
            <component :is="news_type"></component>
          </div>
        </div>
      </div>
    </section>
    <bottom-navbar>
      <div class="msg pointer" @click="addNews" v-if="!$loading.isLoading('events createNews')">
        <h5 class="items">Enviar novedad</h5>
        <span class="glyphicon glyphicon-send items icon-send"></span>
      </div>
      <div class="msg" v-else>
        <h5 class="items">Enviando novedad</h5>
        <spinner class="items" :show="$loading.isLoading('events createNews')"></spinner>
      </div>
    </bottom-navbar>
  </div>
</template>

<script>
  import Navigation from '@/components/Navigation.vue'
  import BottomNavbar from '@/components/BottomNavbar.vue'
  import CollaboratorSelector from '@/components/selectors/collaborator/CollaboratorSelector.vue'
  import MedicOrder from '@/components/news/NewsMedicOrderControl.vue'
  import MedicInform from '@/components/news/NewsMedicInformControl.vue'
  import GenericLicense from '@/components/news/NewsGenericLicenseControl.vue'
  import Constants from '../../const.js'
  import Spinner from '@/components/SpinnerWrapper.vue'
  import { mapGetters, mapState } from 'vuex'

  export default {
    name: 'ReportNewsScheduled',
    components: {
      BottomNavbar,
      Navigation,
      CollaboratorSelector,
      Spinner,
      MEDICAL_ORDER: MedicOrder,
      MEDICAL_REPORT: MedicInform,
      LICENSE: GenericLicense
    },
    data () {
      return {
        title: 'Novedad de Personal',
        news_type: ''
      }
    },
    methods: {
      changeNewsType (type) {
        this.$store.commit('events/resetDataToSubmit')
        this.$store.commit('events/updateSelectedEventType', {event: type})
      },
      checkEmptyFields: function () {
        if (!this.hasSelected) {
          return false
        }
        if (!this.dataToSubmit.type) {
          return false
        }
        switch (this.dataToSubmit.type) {
          case Constants.event_types.UNION_LICENSE:
          case Constants.event_types.BIRTH_LICENSE:
          case Constants.event_types.DEATH_LICENSE:
          case Constants.event_types.SINDICAL_LICENSE:
            if (this.dataToSubmit.exculpatory === undefined ||
              this.dataToSubmit.time === undefined ||
              this.dataToSubmit.type === undefined) {
              return false
            }
            break
          case Constants.event_types.MEDICAL_ORDER:
            if (this.dataToSubmit.medicalAppointment === undefined) {
              return false
            }
            break
          case Constants.event_types.MEDICAL_REPORT:
            if (this.dataToSubmit.medicalDischarge === undefined) {
              return false
            }

            if (this.dataToSubmit.date === '') {
              return false
            }
            break
          case Constants.event_types.LICENSE:
            return false
        }
        return true
      },
      addNews: function () {
        if (!this.checkEmptyFields()) {
          this.$modal.show('dialog', {
            title: 'Información',
            text: 'Por favor rellene los campos necesarios',
            buttons: [
              {
                title: 'Aceptar'
              }
            ]
          })
          return
        }

        this.$store.commit('events/updateToSubmitField', {
          field: 'collaboratorId',
          value: this.collaboratorSelected._id
        })

        this.$modal.show('dialog', {
          text: `¿Desea agregar la novedad para el colaborador "${this.collaboratorSelected.name} ${this.collaboratorSelected.lastname}"?`,
          buttons: [
            {
              title: 'Si',
              handler: () => {
                const successMessage = this.$t('news_create_success')
                const failureMessage = this.$t('news_create_failure')

                this.$store.dispatch('events/addEventToTimeline', {eventType: this.news_type})
                  .then(
                    () => {
                      this.$snotifyWrapper.success(successMessage)
                      this.$router.replace({name: 'home'})
                    },
                    () => {
                      this.$snotifyWrapper.error(failureMessage)
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
      }
    },
    computed: {
      ...mapGetters('collaborators', [
        'hasSelected'
      ]),
      ...mapState('collaborators', [
        'collaboratorSelected'
      ]),
      ...mapState('events', [
        'dataToSubmit',
        'eventTypes'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";
  @import "../../assets/styles/mixins";

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

    .icon-send {
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

  .scheduled-news-container {
    padding-bottom: 100px;
  }

  @media (max-width: 599px) {
    .container-fluid {
      width: 100%;
    }
  }
</style>
