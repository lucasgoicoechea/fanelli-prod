<template>
  <div class="productivity-card">
    <router-link :to="redirect">
      <card-container>
        <card-header
          :headerBackground="headerBackground"
          :subHeaderBackground="subHeaderBackground">
          <div slot="header" class="header">
            <span>{{ productivityType }}  {{ productivityName }}</span>
            <span
              class="involved"
              v-show="isInvolved">PARTICIPANTE</span>
          </div>
          <p slot="subHeader" class="name-header-text"></p>
          <p slot="subHeader" class="subheader-text">{{ recommendations }}
            <blockable-button
              v-show="$can($constants.ROLES.JEFE_PLANTA + '|' + $constants.ROLES.PERSONAL + '|' + $constants.ROLES.JEFES + '|' + $constants.ROLES.RRHH) "
              class="button-done margin"
              icon="/static/img/icon-forms/checklists-form.svg"
              title="Pasar a REALIZADA"
              :click="done"
              :isLoading="loaderCancelAll"
              buttonBackgroundColor="rgb(55, 235, 92)"
              iconPadding="10px"
              buttonRadius="50px"
              buttonWidth="55px"
              buttonHeight="45px">
            </blockable-button>
            <span  class="name-subheader-text">{{productivityState}}</span>
          </p>
           
        </card-header>
        <card-section>
          <div class="card-section" slot="content">
            <p class="time">{{ createdDate }} </p>
            <p>{{ creator }}</p>
            <p>{{ involved }}</p>
          </div>
        </card-section>
      </card-container>
    </router-link>
  </div>
</template>

<script>
  import CardContainer from '@/components/cards/CardContainer.vue'
  import CardHeader from '@/components/cards/CardHeader.vue'
  import CardSection from '@/components/cards/CardSection.vue'
  import CardFooter from '@/components/cards/CardFooter.vue'
  import dateAndTime from '@/utils/dateAndTime.js'
  import BlockableButton from '@/components/buttons/blockableButton'
  import Spinner from 'vue-simple-spinner'
  import { mapState } from 'vuex'

  export default {
    name: 'productivityCard',
    components: {
      CardContainer,
      CardHeader,
      CardSection,
      CardFooter,
      Spinner,
      BlockableButton
    },
    props: {
      productivity: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        loaderCancelAll: false,
        redirect: {
          name: 'productivity-detail',
          params: {id: this.productivity._id}
        }
      }
    },
    methods: {
      doneModalAll (event) {
        event.preventDefault()
        event.stopPropagation()
        this.$modal.show('dialog', {
          title: 'Realizada',
          text: '¿Esta seguro que fue REALIZADA este desempeño?',
          buttons: [
            {
              title: 'Aceptar',
              handler: () => {
                this.$modal.hide('dialog')
                this.done()
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
      done () {
        this.loaderCancel = true
        // paso a estado REalizada
        this.productivity.state = 2
        return this.$store.dispatch('productivitys/edit', this.productivity)
          .then(this.successfulNoRealize)
          .catch(this.failedReProgramed)
      }
    },
    computed: {
      ...mapState('auth', [
        'user'
      ]),
      headerBackground () {
        if (this.productivity.hasOwnProperty('date')) {
          if (dateAndTime.compareDate(new Date(), this.productivity.date) === 0) {
            return '#1e3773'
          }
          if (dateAndTime.compareDate(new Date(), this.productivity.date) > 0) {
            return '#3ecc1a'
          }
        }
        return 'red'
      },
      subHeaderBackground () {
        return '#8090b7'
      },
      createdDate () {
        return (this.productivity.hasOwnProperty('date')
          ? dateAndTime.dateDayAndMonth(new Date(this.productivity.date))
          : '') +
         (this.productivity.hasOwnProperty('time')
          ? (' HORA:' + this.productivity.time)
          : '')
      },
      applyCollaborators () {
        return this.productivity.collaborators
          .map(collaborator => collaborator.lastname)
          .join(', ')
      },
      applyNames () {
        return this.productivity.names
          .join(', ')
      },
      involved () {
        return `
          Participantes: ${this.applyCollaborators}`
      },
      creator () {
        return `de ${this.productivity.creator.lastname}`
      },
      productivityType () {
        return (this.productivity.hasOwnProperty('type')
          ? `${this.$constants.MEETING_TYPE_READABLE[this.productivity.type]}`
          : '') +
          (this.productivity.frecuency
          ? ` -  ${this.$constants.MEETING_FRECUENCY[this.productivity.frecuency]}`
          : '')
      },
      productivityState () {
        return (this.productivity.hasOwnProperty('state')
          ? `${this.$constants.MEETING_STATE_READABLE[this.productivity.state]}`
          : '')
      },
      productivityName () {
        return (this.productivity.hasOwnProperty('names') && this.productivity.type === 'FRECUENCY'
          ? `
          de  ${this.applyNames}`
          : '')
      },
      recommendations () {
        return this.productivity.recommendations
          .map(e => this.$constants.RECOMMENDATION_MEETING_READABLE[e])
          .join(', ')
      },
      isInvolved () {
        return this.$can(this.$constants.ROLES.JEFES) &&
          (this.user.id === this.productivity.creator._id ||
          this.user._id === this.productivity.creator._id ||
          (this.productivity.collaborators.findIndex(c => c._id === this.user.id) !== -1))
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/_variables.scss";
  @import "~@/assets/styles/_mixins.scss";

  p {
    margin: 0;
  }

  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .involved {
    font-weight: 100;
  }

  .subheader-text {
    font-size: small;
  }

  .name-header-text {
    color: #1c0166;
    background: #d3def7;
  }

  .name-subheader-text {
    color: #3e09d1;
    background: #d3def7;
    float: right;
  }
  .button-done {
    float: right;
  }
  .time {
    font-family: monospace;
    color: #5d5d5d;
    margin: 4px 0;
  }
</style>
