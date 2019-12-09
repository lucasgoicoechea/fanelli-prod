<template>
  <div class="sanction-visualization">
    <navigation :title="title"></navigation>

    <section class="sanction-detail">
      <figure class="icon-container">
        <img :src="iconSanction" alt="sanción">
      </figure>

      <div class="info-container">
        <h2>{{ typeSanction }}</h2>
        <p class="created">
          Realizada el
          <span class="monospace">{{ createdAt }}</span>
        </p>
        <p class="by">por {{ creator }}</p>
        <p class="range" v-if="isSuspension">{{ dateRange }}</p>
        <p class="range" v-if="isSuspension && hasIncoporation">{{ IncoporationText }}</p>
        <p class="reason">{{ sanction.reason }}</p>
      </div>
    </section>

    <div class="buttons">
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
        :clickMethod="edit"
        :isLoading="false"
        buttonBackgroundColor="#4CAF50"
        iconPadding="10px"
        buttonRadius="50px"
        buttonWidth="100px"
        buttonHeight="50px"></blockable-button>

      <blockable-button
        class="margin"
        icon="/static/img/checklists/cross.svg"
        title="anular"
        :clickMethod="cancelModal"
        :isLoading="false"
        buttonBackgroundColor="#F44336"
        iconPadding="10px"
        buttonRadius="50px"
        buttonWidth="100px"
        buttonHeight="50px"></blockable-button>
    </div>

    <div class="collaborator-list">
      <h4 class="collaborator-title">Involucrados: </h4>
      <router-link
        class="collaborator"
        v-for="(c, index) in sanction.collaborators"
        :key="index"
        :to="{ name: 'profile-information', params: {id: c._id} }">
        <card-collaborator-full
          class="collaborator"
          :collaborator="c"></card-collaborator-full>
      </router-link>
    </div>
  </div>
</template>
<script>
  import Navigation from '@/components/Navigation'
  import dateAndTime from '@/utils/dateAndTime'
  import BlockableButton from '@/components/buttons/blockableButton'
  import pdf from '@/utils/pdf'
  import CardCollaboratorFull from '@/components/cards/CardCollaboratorFull.vue'

  export default {
    name: 'SanctionVisualization',
    components: {
      CardCollaboratorFull,
      Navigation,
      BlockableButton
    },
    data () {
      return {
        title: 'Disciplina',
        sanction: {},
        loaderPrint: false
      }
    },
    created () {
      this.getDetails()
    },
    methods: {
      getDetails () {
        return this.$store.dispatch('sanctions/getDetail', {
          id: this.$route.params.id
        })
          .then((res) => { this.sanction = res.sanction })
          .catch(() => { this.$snotifyWrapper.error('Se produjo un error al obtener la sanción') })
      },
      edit () {
        this.$router.push({
          name: 'sanction-edition',
          params: {id: this.sanction._id}
        })
      },
      print () {
        this.loaderPrint = true
        return this.$store.dispatch('sanctions/printSanction', this.sanction)
          .then(this.successfulPrint)
          .catch(this.errorPrint)
      },
      successfulPrint (blob) {
        pdf.download(blob, 'sancion.pdf')
        this.loaderPrint = false
      },
      errorPrint () {
        this.loaderPrint = false
        this.$snotifyWrapper.warning('Error de impresión. Intente nuevamente')
      },
      askPrint () {
        this.$modal.show('dialog', {
          title: 'Confirmación',
          text: '¿Desea imprimir la sancion?',
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
      cancel () {
        return this.$store.dispatch('sanctions/cancelSanction', this.sanction)
          .then(this.successfulCancelation)
          .catch(this.failedCancelation)
      },
      successfulCancelation () {
        this.$router.push({name: 'report-news'})
        this.$snotifyWrapper.success('Se a anulado correctamente la sanción')
      },
      failedCancelation () {
        this.$snotifyWrapper.error('No se pudo anular la sanción')
      },
      cancelModal () {
        this.$modal.show('dialog', {
          title: 'Anulación',
          text: '¿Esta seguro de anular esta sanción?',
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
      isSuspension () {
        return this.sanction.type === this.$constants.SANCTION_TYPE.SUSPENSION
      },
      iconSanction () {
        return '/static/img/icon-control-panel/sanction.svg'
      },
      typeSanction () {
        return this.$constants.SANCTION_TYPE_READABLE[this.sanction.type]
      },
      createdAt () {
        return dateAndTime.dateWithTimeLong(new Date(this.sanction.created_at))
      },
      creator () {
        return (this.sanction.hasOwnProperty('creator'))
          ? this.sanction.creator.lastname
          : ''
      },
      collaborators () {
        return this.sanction.hasOwnProperty('collaborators')
          ? this.sanction.collaborators.map(c => `${c.lastname} ${c.name}`).join(', ')
          : ''
      },
      dateRange () {
        return `
          Desde el ${dateAndTime.dateDayAndMonth(this.sanction.dateRange.from)}
          hasta el ${dateAndTime.dateDayAndMonth(this.sanction.dateRange.to)}`
      },
      hasIncoporation () {
        return this.sanction.hasOwnProperty('incorporationDate')
      },
      IncoporationText () {
        return `
          Fecha de incoporación:
          ${dateAndTime.dateWithTimeLong(this.sanction.incorporationDate)}.`
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .sanction-detail {
    width: 100%;
    padding: 40px 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }

  .icon-container {
    flex-shrink: 0;
    width: 80px;
    height: 80px;
    border-radius: 100%;
    background-color: $secondary-color;
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
      margin-top: 8px;
      font-size: small;
      color: #555555;
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

  .margin {
    margin: 0 5px;
  }


  .collaborator-list {
    position: relative;
    width: 100%;
    padding: 40px 20px;
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

  @media screen and (min-width: 980px) {
    .sanction-detail {
      width: 80%;
      margin: 0 auto;
    }

    .collaborator-list {
      width: 80%;
      margin: 0 auto;
    }

    .collaborator {
      width: calc(50% - 30px) !important;
    }
  }

  a {
    color: inherit;
  }

</style>
