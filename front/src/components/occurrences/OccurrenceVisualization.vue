<template>
  <div class="occurrence-visualization">
    <navigation
      :title="title"></navigation>

    <section class="box-section occurrence-detail">
      <figure class="icon-container">
        <img :src="iconOccurrence" alt="acontecimiento">
      </figure>

      <div class="info-container">
        <h2>{{ titleOccurrence }}</h2>
        <p class="created">
          Realizada el
          <span class="monospace">{{ createdAt }}</span>
        </p>
        <p class="state" :style="stateStyle">{{ occurrenceState }}</p>

        <div v-if="recommendations !== null" class="recommendations">
          <h4>Recomendaciones anuales:</h4>
          <p
            class="recommendation-text"
            v-for="(counter, recommendation) in recommendations">
            <span class="text-bold">{{ counter }}</span>
            {{ readableRecommendation(recommendation) }}
          </p>
        </div>

        <div class="recommendations">
          <h4>{{ recommendationTypes }}</h4>
        </div>

        <div class="reason">
          <h4>Observación</h4>
          <p>{{ occurrence.observation }}</p>
        </div>

        <div class="reason">
          <h4>Plan de Acción</h4>
          <p>{{ occurrence.actionPlan}}</p>
        </div>
      </div>
    </section>

    <div class="box-section collaborator-list">
      <h4 class="collaborator-title">Involucrados: </h4>
      <router-link
        v-for="(c, index) in occurrence.collaborators"
        :key="index"
        class="collaborator"
        :to="{ name: 'profile-information', params: {id: c._id} }">
        <card-collaborator-full
          :collaborator="c"></card-collaborator-full>
      </router-link>
    </div>

    <div
      class="box-section buttons-container"
      v-if="isPendingResolution && permission">
      <button
        class="reject fix-width"
        @click.stop="rejectButton"
        :disabled="loaderAccept || loaderReject">
        <span v-show="!loaderReject">RECHAZAR</span>
        <spinner :show="loaderReject"></spinner>
      </button>
      <button
        class="accept fix-width"
        @click.stop="acceptButton"
        :disabled="loaderAccept || loaderReject">
        <span v-show="!loaderAccept">APROBAR</span>
        <spinner :show="loaderAccept"></spinner>
      </button>
    </div>

    <div class="box-section buttons-container" v-show="!isCancelled">
      <blockable-button
        class="margin"
        v-show="isApproved"
        icon="/static/img/icons-kanban/print.svg"
        title="Imprimir"
        :clickMethod="askPrint"
        :isLoading="loaderPrint"
        buttonBackgroundColor="#4257b3"
        buttonRadius="50px"
        buttonWidth="100px"
        buttonHeight="50px"></blockable-button>

      <blockable-button
        class="margin"
        icon="/static/img/pencilwhite.svg"
        title="editar"
        v-show="$can($constants.ROLES.JEFES + '|' + this.$constants.ROLES.RRHH)"
        :clickMethod="edit"
        :isLoading="false"
        buttonBackgroundColor="#4CAF50"
        iconPadding="10px"
        buttonRadius="50px"
        buttonWidth="100px"
        buttonHeight="50px"></blockable-button>

      <blockable-button
        v-show="possibleCancel && $can($constants.ROLES.JEFES + '|' + this.$constants.ROLES.RRHH)"
        class="margin"
        icon="/static/img/checklists/cross.svg"
        title="anular"
        :clickMethod="cancelModal"
        :isLoading="loaderCancel"
        buttonBackgroundColor="#F44336"
        iconPadding="10px"
        buttonRadius="50px"
        buttonWidth="100px"
        buttonHeight="50px"></blockable-button>
    </div>

  </div>
</template>

<script>
  import Navigation from '@/components/Navigation.vue'
  import dateAndTime from '@/utils/dateAndTime'
  import BlockableButton from '@/components/buttons/blockableButton'
  import CardCollaboratorFull from '@/components/cards/CardCollaboratorFull'
  import Spinner from '@/components/SpinnerWrapper'
  import pdf from '@/utils/pdf'
  import confirmationHelper from '@/utils/confirmationHelper'

  export default {
    name: 'OccurrenceVisualization',
    components: {
      Navigation,
      BlockableButton,
      CardCollaboratorFull,
      Spinner
    },
    data () {
      return {
        title: 'Acontecimiento detalle',
        occurrence: {},
        recommendations: null,
        loaderPrint: false,
        stateColor: {
          PENDING_RESOLUTION: '#1a1a1a',
          APPROVED: '#19b05e',
          REJECTED: '#96141b',
          CANCELED: '#d25736'
        },
        loaderAccept: false,
        loaderReject: false,
        loaderCancel: false
      }
    },
    created () {
      this.getDetails()
    },
    methods: {
      getDetails () {
        return this.$store.dispatch('occurrences/getDetail', {
          id: this.$route.params.id
        })
          .then((res) => { this.occurrence = res.occurrence })
          .catch(() => { this.$snotifyWrapper.error('Se produjo un error al obtener el detalle de acontecimiento') })
      },
      accept () {
        this.loaderAccept = true
        const payload = {
          id: this.occurrence._id,
          approved: true
        }
        return this.$store.dispatch('occurrences/resolve', payload)
          .then((res) => {
            this.occurrence = res.occurrence
            this.loaderAccept = false
          })
          .catch(() => {
            this.$snotifyWrapper.error('Se produjo un error al aprobar un acontecimiento')
            this.loaderReject = true
          })
      },
      reject () {
        const payload = {
          id: this.occurrence._id,
          approved: false
        }
        return this.$store.dispatch('occurrences/resolve', payload)
          .then((res) => { this.occurrence = res.occurrence })
          .catch(() => { this.$snotifyWrapper.error('Se produjo un error al rechazar un acontecimiento') })
      },
      acceptButton () {
        confirmationHelper.modalConfirm(this, {
          title: 'Confirmación',
          text: '¿Desea aceptar este acontecimiento?',
          actions: { accept: this.accept }
        })
      },
      rejectButton () {
        confirmationHelper.modalConfirm(this, {
          title: 'Confirmación',
          text: '¿Desea rechazar este acontecimiento?',
          actions: { accept: this.reject }
        })
      },
      edit () {
        this.$router.push({
          name: 'occurrence-edition',
          params: {id: this.occurrence._id}
        })
      },
      successfulPrint (blob) {
        pdf.download(blob, 'acontecimiento.pdf')
        this.loaderPrint = false
      },
      errorPrint () {
        this.loaderPrint = false
        this.$snotifyWrapper.warning('Error de impresión. Intente nuevamente')
      },
      print () {
        this.loaderPrint = true
        this.$store.dispatch('occurrences/printOccurrence', this.occurrence)
          .then(this.successfulPrint)
          .catch(this.errorPrint)
      },
      askPrint () {
        this.$modal.show('dialog', {
          title: 'Confirmación',
          text: '¿Desea imprimir el acontecimiento?',
          buttons: [
            {
              title: 'Aceptar',
              handler: () => {
                this.$modal.hide('dialog')
                this.print()
              }
            },
            {
              title: 'Cancelar',
              handler: () => {
                this.$modal.hide('dialog')
              }
            }
          ]
        })
      },
      successfulCancellation (res) {
        this.occurrence = res.occurrence
        this.loaderCancel = false
        this.$snotifyWrapper.success('Se a anulado correctamente el acontecimiento')
      },
      failedCancellation () {
        this.loaderCancel = false
        this.$snotifyWrapper.error('No se pudo anular el acontecimiento')
      },
      cancel () {
        this.loaderCancel = true
        return this.$store.dispatch('occurrences/cancel', {id: this.occurrence._id})
          .then(this.successfulCancellation)
          .catch(this.failedCancellation)
      },
      cancelModal () {
        this.$modal.show('dialog', {
          title: 'Anulación',
          text: '¿Esta seguro de anular este acontecimiento?',
          buttons: [
            {
              title: 'Aceptar',
              handler: () => {
                this.$modal.hide('dialog')
                this.cancel()
              }
            },
            {
              title: 'Cancelar',
              handler: () => {
                this.$modal.hide('dialog')
              }
            }
          ]
        })
      },
      getCollaboratorRecommendations () {
        this.$store.dispatch('occurrences/getCollaboratorRecommendations', this.occurrence.collaborators[0]._id)
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
          if (this.occurrence.collaborators.length === 1) {
            this.getCollaboratorRecommendations()
          }
        },
        deep: true
      }
    },
    computed: {
      titleOccurrence () {
        return 'Acontecimiento'
      },
      iconOccurrence () {
        return '/static/img/icon-occurrence/acontecimiento.svg'
      },
      createdAt () {
        return this.occurrence.hasOwnProperty('created_at')
          ? dateAndTime.dateWithTimeLong(new Date(this.occurrence.created_at))
          : ''
      },
      occurrenceState () {
        return this.occurrence.hasOwnProperty('state')
          ? this.$constants.OCCURRENCE_STATE_READABLE[this.occurrence.state]
          : 'sin estado'
      },
      resolvedBy () {
        return this.occurrence.hasOwnProperty('resolvedBy')
          ? `${this.occurrence.resolvedBy.lastname} ${this.occurrence.resolvedBy.name}`
          : 'Apellido'
      },
      isPendingResolution () {
        return this.occurrence.state === this.$constants.OCCURRENCE_STATE.PENDING_RESOLUTION
      },
      stateStyle () {
        return {
          color: this.stateColor[this.occurrence.state]
        }
      },
      isCancelled () {
        return this.occurrence.state === this.$constants.OCCURRENCE_STATE.CANCELED
      },
      isApproved () {
        return this.occurrence.state === this.$constants.OCCURRENCE_STATE.APPROVED
      },
      recommendationTypes () {
        if (!this.occurrence.hasOwnProperty('recommendations')) {
          return ''
        }
        let recommendations = (this.occurrence.recommendations.length > 1)
          ? 'Recomendaciones'
          : 'Recomendación'
        recommendations = `${recommendations} ${this.occurrence.recommendations.map(e => this.$constants.OCCURRENCE_TYPE_READABLE[e]).join(', ')}`
        return recommendations
      },
      possibleCancel () {
        return this.occurrence.state === this.$constants.OCCURRENCE_STATE.APPROVED
      },
      permission () {
        return this.$can(this.$constants.ROLES.JEFES) || this.$can(this.$constants.ROLES.RRHH)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/_variables.scss";
  @import "~@/assets/styles/_mixins.scss";

  .occurrence-detail {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }

  .box-section {
    width: 100%;
    padding: 20px;
  }

  .icon-container {
    flex-shrink: 0;
    width: 80px;
    height: 80px;
    border-radius: 100%;
    background-color: $secondary-color;
    padding: 8px;
  }

  .info-container {
    margin: 0 15px;
    flex-grow: 1;

    p {
      margin: 0;
      padding: 0;
      color: #212121;
      font-size: medium;
    }

    span {
      font-size: large;
      color: #555555;
    }

    h2 {
      margin: 0 0 8px 0;
      padding: 0;
      font-size: x-large;
      font-weight: bold;
      color: $primary-color;
    }

    .range {
      margin-top: 8px;
      color: #555555;
    }

    .reason {
      margin: 6px 0;

      h4 {
        margin: 4px 0;
        font-weight: bold;
        font-size: medium;
        color: #555555;
      }

      p {
        font-size: medium;
        color: #555555;
      }
    }
  }

  .monospace {
    font-family: monospace;
  }

  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .collaborator-list {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .collaborator {
    margin: 10px 20px 10px 0 !important;
  }

  .collaborator-title {
    width: 100%;
    padding: 0;
    font-weight: bold;
  }

  .buttons-container {
    display: flex;
    justify-content: center;
  }

  button {
    margin: 2px 0;
    padding: 4px 16px;
    text-decoration: none;
    border: none;
    border-radius: 50px;
    color: white;
    height: 50px;
    font-size: large;

    &.accept {
      background-color: #65c25a;
      margin-left: 25px;
    }
    &.reject {
      background-color: #f86567;
    }

    &:disabled {
      cursor: not-allowed;
    }
  }

  .margin {
    margin: 0 5px;
  }

  .fix-width {
    width: 125px;
  }

  .recommendations {
    margin: 20px 0;

    h4 {
      margin: 4px 0;
      font-weight: bold;
      color: #4a4a4a;
    }
  }

  @media screen and (min-width: 980px) {
    .box-section {
      width: 80%;
      margin: 0 auto;
    }

    .collaborator {
      width: calc(50% - 30px) !important;
    }
  }

  @media screen and (max-width: 321px) {
    .icon-container {
      display: none;
    }
  }

  a {
    color: inherit;
  }

</style>
