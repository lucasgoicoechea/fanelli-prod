<template>
  <card-container @click.native="goToRequest(request)">
    <card-header :headerBackground="eppTypeColor(request)" :subHeaderBackground="eppTypeSubColor(request)">
      <p slot="header">Solicitud de EPP {{ eppType(request) }}</p>
    </card-header>
    <card-section>
      <p slot="content">
        <span class="time">{{ request.updated_at | moment("DD/MM/YY - hh:mm a") }}</span>
        de {{ request.supervisor.lastname
        }} para {{ request.collaborator.lastname }} </p>
      <div @click.stop slot="actions" v-if="received(request)" v-show="$can(permission)">
        <button class="reject" @click="reject(request)" :disabled="request.rejectLoading || request.acceptLoading">
          <img v-if="!request.rejectLoading" src="/static/img/checklists/cross.svg" alt="">
          <spinner-little v-else :show="request.rejectLoading"></spinner-little>
        </button>
        <button class="accept" @click="accept(request)" :disabled="request.rejectLoading || request.acceptLoading">
          <img v-if="!request.acceptLoading" src="/static/img/checklists/tick.svg" alt="">
          <spinner-little v-else :show="request.acceptLoading"></spinner-little>
        </button>
      </div>
    </card-section>
  </card-container>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import auth from '@/auth'
  import CardContainer from '@/components/cards/CardContainer.vue'
  import CardHeader from '@/components/cards/CardHeader.vue'
  import CardSection from '@/components/cards/CardSection.vue'
  import CardFooter from '@/components/cards/CardFooter.vue'
  import Spinner from '@/components/SpinnerWrapper.vue'
  import SpinnerLittle from '@/components/Spinner.vue'

  import Const from '@/const.js'
  import authorize from '@/utils/authorize'
  const { ROLES } = Const

  export default {
    name: 'EPPCardPending',
    components: {CardContainer, CardHeader, CardSection, CardFooter, Spinner, SpinnerLittle},
    props: {
      request: {
        type: Object,
        required: true
      }
    },
    methods: {
      goToRequest (req) {
        this.$router.push({name: 'epp-request', params: {id: req._id}})
      },
      received (req) {
        return !req.hasOwnProperty('approved')
      },
      denied (req) {
        return req.hasOwnProperty('approved') && !req.approved
      },
      approved (req) {
        return req.hasOwnProperty('approved') &&
          req.approved &&
          req.hasOwnProperty('delivered') &&
          !req.delivered
      },
      pending (req) {
        return req.hasOwnProperty('resolved') &&
          req.resolved &&
          !req.hasOwnProperty('delivered')
      },
      delivered (req) {
        return req.hasOwnProperty('delivered') && req.delivered
      },
      eppType (request) {
        if (this.received(request)) return 'Recibida'
        if (this.denied(request)) return 'Denegada'
        if (this.approved(request)) return 'Aprobada'
        if (this.pending(request)) return 'Pendiente'
        if (this.delivered(request)) return 'Entregada'
        else return 'Estado'
      },
      eppTypeColor (request) {
        if (this.received(request)) return '#1e3773'
        if (this.denied(request)) return '#f86567'
        if (this.approved(request)) return '#65c25a'
        if (this.pending(request)) return '#3063ac'
        if (this.delivered(request)) return '#e28c44'
        else return '#e28c44'
      },
      eppTypeSubColor (request) {
        if (this.received(request)) return '#2b4a9f'
        if (this.denied(request)) return '#f78384'
        if (this.approved(request)) return '#a2da9b'
        if (this.pending(request)) return '#3c7ed9'
        if (this.delivered(request)) return '#fbc697'
        else return '#e2cea4'
      },
      reject (req) {
        this.$store.dispatch('requests/approvalById', {id: req._id, approved: false, user: auth.getUser()})
      },
      accept (req) {
        this.$store.dispatch('requests/approvalById', {id: req._id, approved: true, user: auth.getUser()})
      }
    },
    computed: {
      loadingActiveRequest () {
        return this.$loading.isLoading('requests fetchActive')
      },
      isActiveList: function () {
        return this.type === 'active'
      },
      ...mapState('requests', [
        'activeRequests',
        'deliveredRequests'
      ]),
      ...mapGetters('requests', [
        'getActivedAndReceivedRequests',
        'getOnlyActivedRequest',
        'deliveredRequestsFilter'
      ]),
      ...mapState('collaborators', [
        'collaboratorSelected'
      ]),
      ...mapGetters('collaborators', [
        'hasSelected'
      ]),
      permission: function () {
        return authorize(ROLES.JEFES)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  p {
    margin: 0;
  }

  button {
    margin: 2px 0;
    padding: 4px 16px;
    text-decoration: none;
    border: none;
    border-radius: 50px;
    color: white;

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

  .time {
    font-family: monospace;
  }

  .cards-container {
    height: 100%;
  }

</style>
