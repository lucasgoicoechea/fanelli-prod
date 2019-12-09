<template>
  <article
    class="occurrence-tracking-card"
    :class="{ canceled: isCanceled }"
    @click="goToDetails">

    <header @click.stop="goToPerfil">
      <figure>
        <img
          :src="collaboratorsPicture"
          :class="{ manyCollaborator: hasManyCollaborators }"
          alt="imagen del colaborador">
      </figure>

      <div class="personal-information">
        <h3>{{ collaboratorsName }}</h3>
        <h4 v-show="!hasManyCollaborators">Ver Perfil</h4>
      </div>
    </header>

    <section>
      <div class="information">
        <h4 class="title text-bold">Tipo de recomendación:</h4>
        <p class="recommendations orange">{{ recommendations }}</p>
        <hr>
        <h4 class="title log-text text-fine">{{ timeCreation }}</h4>
        <p class="text-bold" v-if="!isPending">{{ stateInformation }}</p>
        <p class="log-text">Observación: {{ content }}</p>
      </div>

      <div class="timeline">
        <div class="separator"></div>
        <div class="state">
          <img :src="imageStep1" alt="Generada">
          <span>Generada</span>
        </div>
        <div class="state">
          <img :src="imageStep2" :alt="textStep2">
          <span>{{ textStep2 }}</span>
        </div>
        <div class="state">
          <img :src="imageStep3" :alt="textStep3">
          <span>{{ textStep3 }}</span>
        </div>
      </div>
    </section>

    <footer @click.stop>
      <button
        v-show="!loading"
        class="button"
        :disabled="!validToArchive || loading"
        @click.stop="confirm">ARCHIVAR
      </button>
      <spinner
        :show="loading"></spinner>
    </footer>

  </article>
</template>

<script>
  import Spinner from '@/components/SpinnerWrapper'
  import ModalConfirmation from '@/components/modals/ModalConfirmation'

  export default {
    name: 'OccurrenceTrackingCard',
    components: {Spinner, ModalConfirmation},
    props: {
      occurrence: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        loading: false
      }
    },
    methods: {
      goToDetails () {
        this.$router.push({
          name: 'occurrence-detail',
          params: {
            id: this.occurrence._id
          }
        })
      },
      goToPerfil () {
        if (this.hasManyCollaborators) {
          this.goToDetails()
        } else {
          this.$router.push({name: 'profile', params: {id: this.occurrence.collaborators[0]._id}})
        }
      },
      daysToString (dates) {
        return dates.map(date => this.$moment(date).format(this.$constants.FORMAT_DATE)).join(', ')
      },
      confirm () {
        this.$modal.show('dialog', {
          title: 'Confirmación',
          text: '¿Esta seguro de archivar este acontecimiento?',
          buttons: [
            {
              title: 'Aceptar',
              handler: () => {
                this.$modal.hide('dialog')
                this.archive()
              }
            },
            {
              title: 'Cancelar',
              handler: this.$modal.hide('dialog')
            }
          ]
        })
      },
      successArchive (res) {
        this.$snotifyWrapper.success('El acontecimiento se ha archivado con exito')
        this.loading = false
        this.$emit('update-occurrence', res.occurrence)
      },
      failArchive () {
        this.$snotifyWrapper.error('Ha ocurrido un error intentelo nuevamente')
        this.loading = false
      },
      archive () {
        if (this.validToArchive) {
          this.loading = true
          this.$store.dispatch('occurrences/archive', this.occurrence)
            .then(this.successArchive)
            .catch(this.failArchive)
        }
      }
    },
    computed: {
      collaboratorsPicture () {
        if (!this.hasManyCollaborators) {
          if (this.occurrence.collaborators[0].picture !== null) {
            return this.occurrence.collaborators[0].picture
          }
          return '/static/img/icon-navigation/nofoto.svg'
        } else {
          return '/static/img/icon-occurrence/acontecimiento.svg'
        }
      },
      collaboratorsName () {
        if (!this.hasManyCollaborators) {
          return `
            ${this.occurrence.collaborators[0].name}
            ${this.occurrence.collaborators[0].lastname}
            `
        }
        return 'VARIOS COLABORADORES'
      },
      recommendations () {
        return this.occurrence.recommendations
          .map(e => this.$constants.OCCURRENCE_TYPE_READABLE[e])
          .join(', ')
      },
      timeCreation () {
        return this.$moment(this.occurrence.created_at)
          .format(this.$constants.FORMAT_DATE)
      },
      isPending () {
        return this.occurrence.state === this.$constants.OCCURRENCE_STATE.PENDING_RESOLUTION
      },
      stateInformation () {
        return `
          ${this.$constants.OCCURRENCE_STATE_READABLE[this.occurrence.state]} por
          ${this.occurrence.resolvedBy.lastname}
          `
      },
      content () {
        return this.occurrence.observation
      },
      isCanceled () {
        return this.occurrence.state === this.$constants.OCCURRENCE_STATE.CANCELED
      },
      imageStep1 () {
        return '/static/img/icons-staff-request/generada-naranja.svg'
      },
      imageStep2 () {
        if (this.isCanceled) {
          return '/static/img/icons-staff-request/canceled-orange.svg'
        } else if (this.occurrence.state === this.$constants.OCCURRENCE_STATE.PENDING_RESOLUTION) {
          return '/static/img/icons-staff-request/pendiente.svg'
        } else if (this.occurrence.state === this.$constants.OCCURRENCE_STATE.APPROVED) {
          return '/static/img/icons-staff-request/aprobada-verde.svg'
        } else if (this.occurrence.state === this.$constants.OCCURRENCE_STATE.REJECTED) {
          return '/static/img/icons-staff-request/denegada-rojo.svg'
        }
        return '/static/img/icons-staff-request/pendiente.svg'
      },
      imageStep3 () {
        return '/static/img/icons-staff-request/archivada.svg'
      },
      textStep2 () {
        if (this.isCanceled) {
          return 'Anulada'
        } else if (this.occurrence.state === this.$constants.OCCURRENCE_STATE.PENDING_RESOLUTION) {
          return 'Estado'
        } else if (this.occurrence.state === this.$constants.OCCURRENCE_STATE.APPROVED) {
          return 'Aprobado'
        } else if (this.occurrence.state === this.$constants.OCCURRENCE_STATE.REJECTED) {
          return 'Denegado'
        }
        return 'Estado'
      },
      textStep3 () {
        return 'Archivar'
      },
      validToArchive () {
        return this.occurrence.state !== this.$constants.OCCURRENCE_STATE.PENDING_RESOLUTION
      },
      hasManyCollaborators () {
        return this.occurrence.collaborators.length > 1
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/_variables.scss";

  article {
    position: relative;
    margin: 10px;
    width: calc(100% * (1 / 3) - 20px);
    background-color: $secondary-darker;
    border-radius: 30px;
    overflow: hidden;
    box-shadow: 1px 1px 8px 1px rgba(0, 0, 0, 0.3);

    &.canceled {
      background-color: #5f5f5f;
    }
  }

  header, h3, h4 {
    color: white;
  }

  p {
    margin: 0;
    padding: 0;
  }

  header {
    position: relative;
    padding: 20px 20px 30px 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    cursor: pointer;
  }

  figure {
    flex-shrink: 0;
    height: 80px;
    width: 80px;
    border-radius: 100px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  img {
    align-self: center;
    height: 85px;
    width: 85px;
    background-color: white;
    border: 1px solid white;
    display: inline-block;

    &.manyCollaborator {
      padding: 15px;
    }
  }

  .personal-information {
    margin-left: 20px;
    flex: 1 auto;
  }

  h3, h4 {
    flex-grow: 1;
    margin: 0;
    display: block;
  }

  h3 {
    display: inline-block;
    font-weight: bold;
    margin-bottom: 4px;
  }

  section {
    padding: 15px 30px;
    position: relative;
    background-color: white;
    width: 100%;
    border-radius: 30px 30px 0 0;
    border-bottom: 2px solid $secondary-color;
    cursor: pointer;
    display: flex;
    flex-direction: column;
  }

  footer {
    position: relative;
    background-color: white;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .timeline {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 20px 0;
    align-items: center;
    align-self: center;

    .separator {
      position: absolute;
      top: 40%;
      left: 0;
      right: 0;
      margin: 0 auto;
      width: 75%;
      border-bottom: 3px solid grey;
    }

    .state {
      position: relative;
      padding: 0 10px;
      display: flex;
      flex-direction: column;
      align-items: center;

      img {
        padding: 0 12px;
        background-color: white;
        width: 60px;
        height: 70px;
        border-radius: 0;
      }
    }
  }

  .button {
    display: inline-block;
    position: relative;
    text-decoration: none;
    margin: 12px;
    font-size: large;
    font-weight: bold;
    color: $secondary-color;
    border: none;
    background-color: white;
    outline: none;

    &:disabled, button:disabled {
      color: grey;
      cursor: not-allowed;
    }
  }

  .information {
    .title {
      margin: 10px 0;
      color: $secondary-color;
    }
  }

  .text-fine {
    font-weight: 400;
  }

  .text-bold {
    font-weight: bold;
  }

  .log-text {
    font-family: monospace;
  }

  .orange {
    color: $primary-light !important;
  }

  hr {
    margin: 0 0 5px 0;
    border: 1px solid #eeeeee;
  }

  .recommendations {
    font-size: medium;
    margin: 4px;
  }

  @media (max-width: 1000px) {
    article {
      width: calc(80% - 20px);
      flex: 1 auto;
    }
  }

  @media (min-width: 1000px) and (max-width: 1360px) {
    header {
      padding: 20px 15px 20px 15px;
    }

    figure {
      height: 70px;
      width: 70px;

      img {
        height: 105%;
        width: 105%;
      }
    }

    .personal-information {
      margin-left: 10px;

      h3 {
        font-size: large;
      }
    }
  }

  @media (max-width: 400px) {
    header {
      padding: 20px 15px 20px 15px;
    }

    figure {
      height: 70px;
      width: 70px;

      img {
        height: 100%;
        width: 100%;
      }
    }

    .personal-information {
      margin-left: 10px;

      h3 {
        font-size: large;
      }
    }
  }

  /deep/ .spinner-wrapper {
    margin: 12px;
  }

</style>
