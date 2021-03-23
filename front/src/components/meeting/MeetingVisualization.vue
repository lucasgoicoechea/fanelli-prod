<template>
  <div class="meeting-visualization">
    <navigation
      :title="title"></navigation>

    <section class="box-section meeting-detail">
      <figure class="icon-container">
        <img :src="icon" alt="reunión">
      </figure>

      <div class="info-container">
        <h2>{{ titleComponent }}</h2>
        <p class="created">
          Realizada el
          <span class="monospace">{{ createdAt }}</span>
        </p>
        <p>{{ creator }}</p>

        <div class="recommendations">
          <h4>
            <span>{{ meetingType }}   {{ meetingName }}</span>
          </h4>
        </div>

        <div class="recommendations">
          <h4>
            <span>Tipo:</span>
            {{ recommendationTypes }}</h4>
        </div>
        <div class="recommendations">
          <h4>
            <span>ESTADO:</span>
            <span :class="meetingStateClass"> {{ meetingState }}</span></h4>
        </div>

        <div class="reason">
          <h4>Resumen</h4>
          <div class="visor" >
            <div  v-html="meeting.description"></div>
          </div>
        </div>
      </div>
    </section>

    <div class="box-section collaborator-list">
      <h4 class="collaborator-title">Participantes: </h4>
      <!-- <router-link -->
        <div
        v-for="c in meeting.collaborators"
        :key="c._id"
        class="collaborator"
        :to="{ name: 'profile-information', params: {id: c._id} }"> 
        <card-collaborator-full
          :collaborator="c"></card-collaborator-full>
        </div> 
      <!-- </router-link> -->
    </div>

    <div class="box-section buttons-container">
      <blockable-button
        class="margin"
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
        v-show="editPermission"
        :clickMethod="edit"
        :isLoading="false"
        buttonBackgroundColor="#4CAF50"
        iconPadding="10px"
        buttonRadius="50px"
        buttonWidth="100px"
        buttonHeight="50px"></blockable-button>

      <blockable-button
        v-show="$can($constants.ROLES.PERSONAL + '|' + $constants.ROLES.JEFES + '|' + $constants.ROLES.RRHH)"
        class="margin"
        icon="/static/img/checklists/cross.svg"
        title="eliminar"
        :clickMethod="cancelModal"
        :isLoading="loaderCancel"
        buttonBackgroundColor="#F44336"
        iconPadding="10px"
        buttonRadius="50px"
        buttonWidth="100px"
        buttonHeight="50px"></blockable-button>
  
      <blockable-button
        v-show="$can($constants.ROLES.JEFE_PLANTA + '|' + $constants.ROLES.PERSONAL + '|' + $constants.ROLES.JEFES + '|' + $constants.ROLES.RRHH) &&  meeting.hasOwnProperty('_originId')"
        class="margin"
        icon="/static/img/checklists/cross-repeat.svg"
        title="eliminar con repeticiones"
        :clickMethod="cancelModalAll"
        :isLoading="loaderCancelAll"
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
  import { VueEditor } from 'vue2-editor'
  import { mapState } from 'vuex'

  export default {
    name: 'MeetingVisualization',
    components: {
      Navigation,
      VueEditor,
      BlockableButton,
      CardCollaboratorFull,
      Spinner
    },
    data () {
      return {
        title: 'Detalle de reunión',
        meeting: {
          names: []
        },
        loaderPrint: false,
        loaderCancel: false,
        loaderCancelAll: false,
        editorSettings: {
          modules: {
            toolbar: false
          }
        },
        editorConfig: [ ]
      }
    },
    created () {
      this.getDetails()
    },
    methods: {
      getDetails () {
        return this.$store.dispatch('meetings/getDetail', {
          id: this.$route.params.id
        })
          .then((res) => { this.meeting = res.meeting; this.meeting.names = res.meeting.names })
          .catch(() => { this.$snotifyWrapper.error('Se produjo un error al obtener el detalle de reunión') })
      },
      edit () {
        this.$router.push({
          name: 'meeting-edition',
          params: {id: this.meeting._id}
        })
      },
      successfulPrint (blob) {
        pdf.download(blob, 'reunión.pdf')
        this.loaderPrint = false
      },
      errorPrint () {
        this.loaderPrint = false
        this.$snotifyWrapper.warning('Error de impresión. Intente nuevamente')
      },
      print () {
        this.loaderPrint = true
        this.$store.dispatch('meetings/print', this.meeting)
          .then(this.successfulPrint)
          .catch(this.errorPrint)
      },
      askPrint () {
        this.$modal.show('dialog', {
          title: 'Confirmación',
          text: '¿Desea imprimir la reunión?',
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
        this.loaderCancel = false
        this.$snotifyWrapper.success('Se eliminó correctamente la reunión')
        this.$router.push({name: 'meeting-list'})
      },
      failedCancellation () {
        this.loaderCancel = false
        this.$snotifyWrapper.error('No se pudo eliminar la reunión')
      },
      cancel () {
        this.loaderCancel = true
        return this.$store.dispatch('meetings/cancel', this.meeting)
          .then(this.successfulCancellation)
          .catch(this.failedCancellation)
      },
      cancelAll () {
        this.loaderCancel = true
        return this.$store.dispatch('meetings/cancelAll', this.meeting)
          .then(this.successfulCancellation)
          .catch(this.failedCancellation)
      },
      cancelModalAll () {
        this.$modal.show('dialog', {
          title: 'Eliminación',
          text: '¿Esta seguro de eliminar esta reunión y sus repeticiones?',
          buttons: [
            {
              title: 'Aceptar',
              handler: () => {
                this.$modal.hide('dialog')
                this.cancelAll()
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
      cancelModal () {
        this.$modal.show('dialog', {
          title: 'Eliminación',
          text: '¿Esta seguro de eliminar esta reunión?',
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
      }
    },
    computed: {
      ...mapState('auth', [
        'user'
      ]),
      titleComponent () {
        return 'Reunión'
      },
      icon () {
        return '/static/img/meeting.svg'
      },
      createdAt () {
        return (this.meeting.hasOwnProperty('date')
          ? dateAndTime.dateDayAndMonth(new Date(this.meeting.date))
          : '') +
         (this.meeting.hasOwnProperty('time')
          ? (' HORA:' + this.meeting.time)
          : '')
      },
      creator () {
        return this.meeting.hasOwnProperty('creator')
          ? `Por ${this.meeting.creator.lastname}`
          : ''
      },
      meetingType () {
        return (this.meeting.hasOwnProperty('type')
          ? `${this.$constants.MEETING_TYPE_READABLE[this.meeting.type]}`
          : '') +
          (this.meeting.frecuency
          ? ` -  ${this.$constants.MEETING_FRECUENCY[this.meeting.frecuency]}`
          : '')
      },
      meetingState () {
        return (this.meeting.hasOwnProperty('state')
          ? `${this.$constants.MEETING_STATE_READABLE[this.meeting.state]}`
          : '')
      },
      meetingStateClass () {
        return (this.meeting.hasOwnProperty('state')
          ? this.meeting.state === 0 ? 'name-subheader-text'
          : 'visor'
          : '')
      },
      applyNames () {
        return this.meeting.names
          .join(', ')
      },
      meetingName () {
        return (this.meeting.hasOwnProperty('names') && this.meeting.type === 'FRECUENCY'
          ? `
          de  ${this.applyNames}`
          : '')
      },
      recommendationTypes () {
        if (!this.meeting.hasOwnProperty('recommendations')) {
          return ''
        }
        return this.meeting.recommendations.map(e => this.$constants.RECOMMENDATION_MEETING_READABLE[e]).join(', ')
      },
      editPermission () {
        if (!this.meeting.hasOwnProperty('creator')) {
          return false
        }
        return this.$can(this.$constants.ROLES.JEFES + '|' + this.$constants.ROLES.RRHH) ||
          this.meeting.creator.id === this.user.id ||
          this.meeting.creator.id === this.user._id ||
          this.meeting.editors.includes(this.user.id)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/_variables.scss";
  @import "~@/assets/styles/_mixins.scss";

  #editor1 .ql-toolbar .ql-snow{
    display: none;
  }

  .visor{
    position: relative;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    align-items: left;
    border-style: solid;
    border-color: gray;
  }
  .meeting-detail {
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

  .name-subheader-text {
    color: #3e09d1;
    background: #d3def7;
    float: right;
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
    color: #4a4a4a;

    span {
      margin: 4px 0;
      font-weight: bold;
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
