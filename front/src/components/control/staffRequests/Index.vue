<template>
  <section class="staff-requests-index">
    <div
      class="cards-container pending"
      v-infinite-scroll="fetchPending"
      infinite-scroll-disabled="notUpdatePending"
      infinite-scroll-distance="200">

      <div class="empty" v-show="emptyPending">
        No hay solicitudes pendientes.
      </div>

      <card-staff-request
        v-for="(item, index) in pending.list"
        :key="index"
        :request="item"></card-staff-request>

      <div class="spinner-container">
        <spinner
          class="spinner" :show="pending.loading"
          loadingMessage="Cargando solicitudes..."></spinner>
      </div>
    </div>

    <div
      class="cards-container resolved"
      v-infinite-scroll="fetchResolved"
      infinite-scroll-disabled="notUpdateResolved"
      infinite-scroll-distance="200">

      <div class="separator"></div>

      <div class="empty" v-show="emptyResolved">
        No hay solicitudes resueltas.
      </div>

      <card-staff-request
        v-for="(item, index) in resolved.list"
        :key="index"
        :request="item"></card-staff-request>

      <div class="spinner-container">
        <spinner
          class="spinner" :show="resolved.loading"
          loadingMessage="Cargando solicitudes..."></spinner>
      </div>
    </div>
    <staff-request-accept-modal></staff-request-accept-modal>
  </section>
</template>

<script>
  import CardStaffRequest from '@/components/cards/CardStaffRequest.vue'
  import CardContainer from '@/components/cards/CardContainer.vue'
  import CollaboratorSelector from '../../selectors/collaborator/CollaboratorSelector.vue'
  import InputDate from '@/components/InputDate.vue'
  import Constants from '@/const.js'
  import {mapState} from 'vuex'
  import Spinner from '@/components/SpinnerWrapper.vue'
  import UbyInfiniteScroll from '@/components/UbyInfiniteScroll.vue'
  import ModalConfirmation from '../../modals/ModalConfirmation.vue'
  import StaffRequestAcceptModal from './AcceptModal'

  export default {
    name: 'ControlPanelStaffRequestsIndex',
    components: {
      StaffRequestAcceptModal,
      ModalConfirmation,
      UbyInfiniteScroll,
      Spinner,
      InputDate,
      CollaboratorSelector,
      CardContainer,
      CardStaffRequest
    },
    data () {
      return {
        title: 'Solicitudes',
        pending: {
          list: [],
          page: 1,
          loading: false,
          lastOne: false
        },
        resolved: {
          list: [],
          page: 1,
          loading: false,
          lastOne: false
        },
        fullAccess: false
      }
    },
    created () {
      this.fullAccess = this.$can(this.$constants.ROLES.JEFES) || this.$can(this.$constants.ROLES.RRHH)
    },
    methods: {
      fetchPending () {
        this.pending.loading = true
        const action = (this.fullAccess)
          ? 'staffRequests/fetchPending'
          : 'staffRequests/fetchPendingByMe'

        this.$store.dispatch(action, {page: this.pending.page, per_page: 15})
          .then(this.successFetch(this.pending))
          .catch(this.failFetch)
      },
      fetchResolved () {
        this.resolved.loading = true
        const action = (this.fullAccess)
          ? 'staffRequests/fetchResolved'
          : 'staffRequests/fetchResolvedByMe'

        this.$store.dispatch(action, {page: this.resolved.page, per_page: 15})
          .then(this.successFetch(this.resolved))
          .catch(this.failFetch)
      },
      successFetch: dataModel => response => {
        if (response.requests.length === 0) {
          dataModel.lastOne = true
        } else {
          response.requests.forEach(e => {
            dataModel.list.push(e)
          })
          dataModel.page += 1
        }
        dataModel.loading = false
      },
      failFetch () {
        this.$snotifyWrapper.error('Se produjo un error al buscar los acontecimientos')
      },
      notUpdate (dataModel) {
        return dataModel.loading || dataModel.lastOne
      },
      empty (dataModel) {
        return dataModel.list.length === 0 && !dataModel.loading
      },
      getRequestType (type) {
        switch (type) {
          case Constants.staff_requests_types.LATE:
            return this.$t('staff_requests_types.late')
          case Constants.staff_requests_types.EARLY:
            return this.$t('staff_requests_types.early')
          case Constants.staff_requests_types.SHIFT_CHANGE:
            return this.$t('staff_requests_types.shift_change')
          case Constants.staff_requests_types.EXTRA_HOURS:
            return this.$t('staff_requests_types.extra_hours')
        }
      },
      getTitleBackgroundColor (status) {
        switch (status) {
          case Constants.request_status_types.APPROVED:
            return 'GREEN'
          case Constants.request_status_types.REJECTED:
            return 'PINK'
          case Constants.request_status_types.PENDING:
            return 'DEEPBLUE'
        }
      },
      getSubTitleBackgroundColor (status) {
        switch (status) {
          case Constants.request_status_types.APPROVED:
            return 'LIGHTGREEN'
          case Constants.request_status_types.REJECTED:
            return 'PINK'
          case Constants.request_status_types.PENDING:
            return ''
        }
      }
    },
    computed: {
      ...mapState('auth', [
        'user'
      ]),
      notUpdatePending () {
        return this.notUpdate(this.pending)
      },
      emptyPending () {
        return this.empty(this.pending)
      },
      notUpdateResolved () {
        return this.notUpdate(this.resolved)
      },
      emptyResolved () {
        return this.empty(this.resolved)
      }
    },
    destroyed () {
      this.$store.commit('staffRequests/reset')
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/_variables";

  .staff-requests-index {
    position: relative;
    width: 90%;
    margin: 20px auto;
  }

  .spinner-container {
    margin: 25px 0;
  }

  .empty {
    font-size: 20px;
    text-align: center;
    margin-top: 20px;
  }

  .separator {
    height: 0;
    border-top: 3px solid $primary-color;
  }
</style>
