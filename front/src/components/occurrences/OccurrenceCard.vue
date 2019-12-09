<template>
  <div class="occurrence-card" @click="toRedirect">
    <card-container>
      <card-header :headerBackground="headerBackground">
        <p slot="header">Acontecimiento</p>
      </card-header>
      <card-section>
        <div class="card-section" slot="content">
          <p class="resolved-by" v-if="!isPendingResolution">{{ resolvedBy }}</p>
          <p class="time">{{ createdDate }}</p>
          <p>{{ description }}</p>
        </div>
        <div
          class="actions"
          slot="actions"
          v-show="isPendingResolution && permission">
          <button
            class="reject"
            @click.stop="rejectButton"
            :disabled="loadingReject || loadingAccept"
            title="Rechazar solicitud">
            <img v-if="!loadingReject" src="/static/img/checklists/cross.svg" alt="">
            <spinner v-else size="small"></spinner>
          </button>
          <button
            class="accept"
            @click.stop="acceptButton"
            :disabled="loadingReject || loadingAccept"
            title="Aceptar solicitud">
            <img v-if="!loadingAccept" src="/static/img/checklists/tick.svg" alt="">
            <spinner v-else size="small"></spinner>
          </button>
        </div>
      </card-section>
    </card-container>
  </div>
</template>

<script>
  import CardContainer from '@/components/cards/CardContainer.vue'
  import CardHeader from '@/components/cards/CardHeader.vue'
  import CardSection from '@/components/cards/CardSection.vue'
  import CardFooter from '@/components/cards/CardFooter.vue'
  import dateAndTime from '@/utils/dateAndTime.js'
  import Spinner from 'vue-simple-spinner'
  import confirmationHelper from '@/utils/confirmationHelper'

  export default {
    name: 'occurrenceCard',
    components: {
      CardContainer,
      CardHeader,
      CardSection,
      CardFooter,
      Spinner
    },
    props: {
      occurrence: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        stateColor: {
          PENDING_RESOLUTION: '#475b8b',
          APPROVED: '#20e279',
          REJECTED: '#ff5d54',
          CANCELED: '#ff5d54'
        },
        redirect: {
          name: 'occurrence-detail',
          params: {id: this.occurrence._id}
        },
        loadingAccept: false,
        loadingReject: false
      }
    },
    methods: {
      toRedirect () {
        this.$router.push(this.redirect)
      },
      accept () {
        this.loadingAccept = true
        const payload = {
          id: this.occurrence._id,
          approved: true
        }
        this.$store.dispatch('occurrences/resolve', payload)
          .then((res) => {
            this.loadingAccept = false
            this.$snotifyWrapper.success('Se aprobó exitosamente el acontecimiento')
            this.updateOccurrence(res.occurrence)
          })
          .catch(() => {
            this.loadingAccept = false
            this.$snotifyWrapper.error('No se pudo aprobar el acontecimiento')
          })
      },
      reject () {
        this.loadingReject = true
        const payload = {
          id: this.occurrence._id,
          approved: false
        }
        this.$store.dispatch('occurrences/resolve', payload)
          .then((res) => {
            this.loadingReject = false
            this.$snotifyWrapper.success('Se aprobó exitosamente el acontecimiento')
            this.updateOccurrence(res.occurrence)
          })
          .catch(() => {
            this.loadingReject = false
            this.$snotifyWrapper.error('No se pudo aprobar el acontecimiento')
          })
      },
      acceptButton () {
        confirmationHelper.modalConfirm(this, {
          title: 'Confirmación',
          text: '¿Desea aceptar este acontecimiento?',
          actions: {accept: this.accept}
        })
      },
      rejectButton () {
        confirmationHelper.modalConfirm(this, {
          title: 'Confirmación',
          text: '¿Desea rechazar este acontecimiento?',
          actions: {accept: this.reject}
        })
      },
      updateOccurrence (occurrence) {
        this.$emit('update-pending', occurrence)
      }
    },
    computed: {
      headerBackground () {
        return this.stateColor[this.occurrence.state]
      },
      createdDate () {
        return dateAndTime.dateWithTimeLong(this.occurrence.created_at)
      },
      applyCollaborators () {
        return this.occurrence.collaborators
          .map(collaborator => collaborator.lastname)
          .join(', ')
      },
      description () {
        return `
          de ${this.occurrence.creator.lastname} para ${this.applyCollaborators}`
      },
      isPendingResolution () {
        return this.occurrence.state === this.$constants.OCCURRENCE_STATE.PENDING_RESOLUTION
      },
      resolvedBy () {
        return (this.occurrence.resolvedBy.lastname)
          ? `${this.$constants.OCCURRENCE_STATE_READABLE[this.occurrence.state]}
              por
              ${this.occurrence.resolvedBy.lastname.toUpperCase()}`
          : ''
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

  p {
    margin: 0;
    font-weight: 300;
  }

  .time {
    font-family: monospace;
    color: #3d3d3d;
  }

  button {
    margin: 2px 5px;
    padding: 4px 16px;
    width: 52px;
    height: 28px;
    text-decoration: none;
    border: none;
    border-radius: 50px;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      height: 20px;
      width: 20px;
    }

    &.accept {
      background-color: #65c25a;
    }
    &.reject {
      background-color: #f86567;
    }

    &:disabled {
      cursor: not-allowed;
    }
  }

</style>
