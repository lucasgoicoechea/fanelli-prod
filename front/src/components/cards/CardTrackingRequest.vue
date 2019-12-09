<template>
  <article
    class="card-tracking-request"
    :class="{ canceled: isCanceled }"
    @click="goToDetails">
    <header @click.stop="goToPerfil">
      <figure>
        <img :src="collaboratorsPicture" :class="{ manyCollaborator: hasManyCollaborators }" alt="">
      </figure>
      <div class="personal-information">
        <h3>{{ collaboratorsName }}</h3>
        <h4 v-show="!hasManyCollaborators">Ver Perfil</h4>
      </div>
    </header>

    <section>
      <div class="request-data">
        <h4 class="title">
          <span>{{ staffRequestType }}</span>
          <span class="log-text text-fine">{{ staffRequestTimeCreation }}</span>
        </h4>
        <p class="text-bold">{{ stateInformation }}</p>
        <p class="log-text">{{ staffRequestContent }}</p>
      </div>
      <div class="timeline">
        <div class="separator"></div>
        <div class="state">
          <img :src="imageStep1" alt="">
          <span>Generada</span>
        </div>
        <div class="state">
          <img :src="imageStep2" alt="">
          <span>{{ textStep2 }}</span>
        </div>
        <div class="state">
          <img :src="imageStep3" alt="">
          <span>{{ textStep3 }}</span>
        </div>
      </div>
    </section>

    <footer @click.stop>
      <button v-show="!loading" class="button" :disabled="!validToArchive" @click.stop="confirm">ARCHIVAR</button>
      <spinner :show="loading"></spinner>
    </footer>
    <modal-confirmation
      @click.stop
      :name="'modal' + staffRequest.request._id"
      @reject="reject"
      @acept="acept">
      <p slot="title">¿Esta seguro de archivar esta solicitud?</p>
    </modal-confirmation>
  </article>
</template>

<script>
  import Spinner from '@/components/SpinnerWrapper'
  import ModalConfirmation from '@/components/modals/ModalConfirmation'

  export default {
    name: 'CardTrackingRequest',
    components: {Spinner, ModalConfirmation},
    props: {
      staffRequest: {
        type: Object,
        required: true
      }
    },
    data: function () {
      return {
        state: [
          'Generada',
          'Aprobada',
          'Rechazada'
        ]
      }
    },
    methods: {
      goToDetails () {
        const type = this.$constants.staff_requests_types_uri[this.staffRequest.type]
        this.$router.push({name: 'staff-request-visualization', params: {type: type, id: this.staffRequest.request._id}})
      },
      goToPerfil () {
        if (this.hasManyCollaborators) {
          this.goToDetails()
        } else {
          this.$router.push({name: 'profile', params: {id: this.staffRequest.request.collaborators[0]._id}})
        }
      },
      daysToString (dates) {
        return dates.map(date => this.$moment(date).format(this.$constants.FORMAT_DATE)).join(', ')
      },
      confirm (event) {
        event.preventDefault()
        event.stopPropagation()
        this.$modal.show('modal' + this.staffRequest.request._id)
      },
      reject () {
        this.$modal.hide('modal' + this.staffRequest.request._id)
      },
      acept () {
        this.$modal.hide('modal' + this.staffRequest.request._id)
        this.toArchive()
      },
      toArchive () {
        if (this.validToArchive) {
          this.$store.dispatch('staffRequests/toArchive', this.staffRequest)
            .then(() => {
              this.$snotifyWrapper.success('La solicitud se ha archivado con exito')
            })
            .catch(() => {
              this.$snotifyWrapper.error('Ha ocurrido un error intentelo nuevamente')
            })
        }
      }
    },
    computed: {
      collaboratorsPicture () {
        if (!this.hasManyCollaborators) {
          if (this.staffRequest.request.collaborators[0].picture !== null) {
            return this.staffRequest.request.collaborators[0].picture
          }
          return '/static/img/icon-navigation/nofoto.svg'
        } else {
          if (this.staffRequest.type === this.$constants.staff_requests_types.SHIFT_CHANGE) {
            return '/static/img/icons-staff-request/cambio_hora.svg'
          } else if (this.staffRequest.type === this.$constants.staff_requests_types.EXTRA_HOURS) {
            return '/static/img/icons-staff-request/horas_extras.svg'
          } else {
            return '/static/img/icons-staff-request/permisos.svg'
          }
        }
      },
      collaboratorsName () {
        if (!this.hasManyCollaborators) {
          return this.staffRequest.request.collaborators[0].name + ' ' + this.staffRequest.request.collaborators[0].lastname
        }
        return 'VARIOS COLABORADORES'
      },
      staffRequestType () {
        let string = this.$constants.staff_requests_types_readable[this.staffRequest.type]
        if (this.staffRequest.type === 'LEAVE') {
          string += ' ' + this.$constants.LEAVE_REQUEST_TYPE_READABLE[this.staffRequest.request.type]
        }
        return string
      },
      staffRequestTimeCreation () {
        return this.$moment(this.staffRequest.request.created_at).format(this.$constants.FORMAT_DATE)
      },
      stateInformation () {
        return this.state[this.staffRequest.request.state] + ' por ' + this.staffRequest.request.approvedBy.lastname
      },
      staffRequestContent () {
        const shiftChange = () => {
          let string = this.$constants.staff_requests_types_readable[this.staffRequest.type] + ' '
          string += (this.staffRequest.request.temporary) ? 'temporal ' : 'permanente '
          string += 'al turno: ' + this.staffRequest.request.toShift.value
          string += 'a partir del dia: ' + this.$moment(this.staffRequest.request.days.from).format(this.$constants.FORMAT_DATE) + ' '
          string += (this.staffRequest.request.temporary) ? 'hasta el ' + this.$moment(this.staffRequest.request.days.to).format(this.$constants.FORMAT_DATE) : ''
          return string
        }
        const extraHours = () => {
          let string = this.$constants.staff_requests_types_readable[this.staffRequest.type] + ' '
          string += 'desde: ' + this.staffRequest.request.time.from + ' hasta: ' + this.staffRequest.request.time.to + ' '
          string += (this.staffRequest.request.days.length === 1) ? 'para el día: ' : 'para los días: '
          string += this.daysToString(this.staffRequest.request.days)
          return string
        }
        const leave = () => {
          let string = this.$constants.LEAVE_REQUEST_TYPE_READABLE[this.staffRequest.request.type] + ' '
          if (this.staffRequest.request.days.length > 1) {
            string += 'para los dias '
          } else {
            string += 'el dia '
          }
          string += this.daysToString(this.staffRequest.request.days) + ' '
          if (this.staffRequest.request.hasOwnProperty('daysToCompensate')) {
            string += (this.staffRequest.request.daysToCompensate.length > 0) ? ' - compensa ' : ' - no compensa '
          }
          string += '- Motivo: ' + this.staffRequest.request.reason
          return string
        }

        if (this.staffRequest.type === this.$constants.staff_requests_types.SHIFT_CHANGE) {
          return shiftChange()
        } else if (this.staffRequest.type === this.$constants.staff_requests_types.EXTRA_HOURS) {
          return extraHours()
        } else {
          return leave()
        }
      },
      isCanceled () {
        return this.staffRequest.request.hasOwnProperty('canceled') && this.staffRequest.request.canceled
      },
      imageStep1 () {
        return '/static/img/icons-staff-request/generada-naranja.svg'
      },
      imageStep2 () {
        if (this.isCanceled) {
          return '/static/img/icons-staff-request/canceled-orange.svg'
        } else if (this.staffRequest.request.state === 0) {
          return '/static/img/icons-staff-request/pendiente.svg'
        } else if (this.staffRequest.request.state === 1) {
          return '/static/img/icons-staff-request/aprobada-verde.svg'
        } else if (this.staffRequest.request.state === 2) {
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
        } else if (this.staffRequest.request.state === 0) {
          return 'Estado'
        } else if (this.staffRequest.request.state === 1) {
          return 'Aprobada'
        } else if (this.staffRequest.request.state === 2) {
          return 'Denegada'
        }
        return 'Estado'
      },
      textStep3 () {
        return 'Archivar'
      },
      validToArchive () {
        return this.staffRequest.request.state > 0
      },
      hasManyCollaborators () {
        return this.staffRequest.request.collaborators.length > 1
      },
      loading () {
        return this.$loading.isLoading('staffRequests toArchive' + this.staffRequest.request._id)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

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

  .request-data {
    .title {
      color: $secondary-color;
      font-weight: bold;
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
