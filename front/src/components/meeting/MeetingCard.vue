<template>
  <div class="meeting-card">
    <router-link :to="redirect">
      <card-container>
        <card-header
          :headerBackground="headerBackground"
          :subHeaderBackground="subHeaderBackground">
          <div slot="header" class="header">
            <span>{{ meetingType }}  {{ meetingName }} </span>
            <span
              class="involved"
              v-show="isInvolved">PARTICIPANTE</span>
          </div>
          <p slot="subHeader" class="name-header-text"></p>
          <p slot="subHeader" class="subheader-text">{{ recommendations }}</p>
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
  import Spinner from 'vue-simple-spinner'
  import { mapState } from 'vuex'

  export default {
    name: 'MeetingCard',
    components: {
      CardContainer,
      CardHeader,
      CardSection,
      CardFooter,
      Spinner
    },
    props: {
      meeting: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        redirect: {
          name: 'meeting-detail',
          params: {id: this.meeting._id}
        }
      }
    },
    computed: {
      ...mapState('auth', [
        'user'
      ]),
      headerBackground () {
        if (this.meeting.hasOwnProperty('date')) {
          if (dateAndTime.compareDate(new Date(), this.meeting.date) === 0) {
            return '#1e3773'
          }
          if (dateAndTime.compareDate(new Date(), this.meeting.date) > 0) {
            return '#3ecc1a'
          }
        }
        return 'red'
      },
      subHeaderBackground () {
        return '#8090b7'
      },
      createdDate () {
        return (this.meeting.hasOwnProperty('date')
          ? dateAndTime.dateDayAndMonth(new Date(this.meeting.date))
          : '') +
         (this.meeting.hasOwnProperty('time')
          ? (' HORA:' + this.meeting.time)
          : '')
      },
      applyCollaborators () {
        return this.meeting.collaborators
          .map(collaborator => collaborator.lastname)
          .join(', ')
      },
      applyNames () {
        return this.meeting.names
          .join(', ')
      },
      involved () {
        return `
          Participantes: ${this.applyCollaborators}`
      },
      creator () {
        return `de ${this.meeting.creator.lastname}`
      },
      meetingType () {
        return (this.meeting.hasOwnProperty('type')
          ? `${this.$constants.MEETING_TYPE_READABLE[this.meeting.type]}`
          : '') +
          (this.meeting.frecuency
          ? ` -  ${this.$constants.MEETING_FRECUENCY[this.meeting.frecuency]}`
          : '')
      },
      meetingName () {
        return (this.meeting.hasOwnProperty('names') && this.meeting.type === 'FRECUENCY'
          ? `
          de  ${this.applyNames}`
          : '')
      },
      recommendations () {
        return this.meeting.recommendations
          .map(e => this.$constants.RECOMMENDATION_MEETING_READABLE[e])
          .join(', ')
      },
      isInvolved () {
        return this.$can(this.$constants.ROLES.JEFES) &&
          (this.user.id === this.meeting.creator._id ||
          this.user._id === this.meeting.creator._id ||
          (this.meeting.collaborators.findIndex(c => c._id === this.user.id) !== -1))
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


  .time {
    font-family: monospace;
    color: #5d5d5d;
    margin: 4px 0;
  }
</style>
