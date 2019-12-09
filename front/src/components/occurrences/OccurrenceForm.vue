<template>
  <div class="occurrence-form">
    <div class="container-fluid">

      <div class="row">
        <div class="col-xs-12">
          <h3>
            Selección del colaborador
          </h3>

          <collaborator-selector
            :multipleSelection="true"
            :preSelection="editableOccurrence.collaborators"></collaborator-selector>
        </div>

        <div class="col-xs-12">
          <h3>
            Recomendación
          </h3>
          <div class="check-box-container">
            <check-box
              v-for="(label, value) in $constants.OCCURRENCE_TYPE_READABLE"
              :key="value"
              v-model="occurrence.recommendations"
              :val="value"
              :label="label"></check-box>
          </div>
        </div>

      </div>

      <div class="row" v-show="oneCollaborator">
        <div class="col-md-12">
          <h3>Notificaciones previas en el año</h3>
          <div class="notifications">
            <p
              class="recommendation-text"
              v-for="(counter, recommendation) in recommendations">
              <span class="text-bold">{{ counter }}</span>
              {{ readableRecommendation(recommendation) }}
            </p>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-xs-12">
          <h3>Observación</h3>
          <textarea
            class="textarea"
            v-model="occurrence.observation"
            placeholder="Escriba aquí la observación"></textarea>
        </div>

        <div class="col-xs-12">
          <h3>Recomendación/Plan de acción</h3>
          <textarea
            class="textarea"
            v-model="occurrence.actionPlan"
            placeholder="Escriba aquí la observación"></textarea>
          <div class="separator"></div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import CollaboratorSelector from '@/components/selectors/collaborator/CollaboratorSelector'
  import CheckBox from '@/components/CheckBoxInput'

  export default {
    name: 'OccurrenceForm',
    components: {
      CollaboratorSelector,
      CheckBox
    },
    props: {
      editableOccurrence: {
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
        occurrence: this.generateData(),
        recommendations: []
      }
    },
    mounted () {
      this.$emit('occurrence-update', {
        validation: this.validate(),
        occurrence: this.occurrence
      })
    },
    methods: {
      generateData () {
        return {
          collaborators: this.editableOccurrence.collaborators || [],
          observation: this.editableOccurrence.observation || '',
          recommendations: this.editableOccurrence.recommendations || [],
          notifications: this.editableOccurrence.notifications || [],
          actionPlan: this.editableOccurrence.actionPlan || ''
        }
      },
      validate () {
        if (!this.hasSelected) {
          return {valid: false, msg: 'Seleccione un/unos colaborador/es'}
        }
        if (this.occurrence.recommendations.length === 0) {
          return {valid: false, msg: 'Seleccione al menos una recomendación'}
        }
        if (this.occurrence.observation.length === 0) {
          return {valid: false, msg: 'Ingrese una observación'}
        }
        return {valid: true, msg: 'OK'}
      },
      setCollaborators () {
        this.occurrence.collaborators = this.getSelectedIds
      },
      prepareOccurrence () {
        this.setCollaborators()
      },
      getCollaboratorRecommendations () {
        this.$store.dispatch('occurrences/getCollaboratorRecommendations', this.getSelectedIds[0])
          .then(res => { this.recommendations = res.statistics })
          .catch(() => this.$snotifyWrapper.error('no se pudo recuperar las recomendaciones'))
      },
      readableRecommendation (recommendation) {
        return this.$constants.OCCURRENCE_TYPE_READABLE[recommendation.toLocaleUpperCase()]
      }
    },
    watch: {
      occurrence: {
        handler: function () {
          this.prepareOccurrence()
          this.$emit('occurrence-update', {
            validation: this.validate(),
            occurrence: this.occurrence
          })
        },
        deep: true
      },
      getSelectedIds: {
        handler: function () {
          this.prepareOccurrence()
          this.$emit('occurrence-update', {
            validation: this.validate(),
            occurrence: this.occurrence
          })
          if (this.getSelectedIds.length === 1) {
            this.getCollaboratorRecommendations()
          }
        },
        deep: true
      },
      editableOccurrence: {
        handler: function () {
          this.occurrence = this.generateData()
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
      ]),
      isEdition () {
        return this.mode === 'edition'
      },
      oneCollaborator () {
        return this.getSelectedIds.length === 1
      }
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
</style>
