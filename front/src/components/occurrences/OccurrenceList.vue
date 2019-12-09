<template>
  <div class="occurrence-list">
    <div
      class="cards-container pending"
      v-infinite-scroll="fetchPending"
      infinite-scroll-disabled="notUpdatePending"
      infinite-scroll-distance="200">

      <div class="empty" v-show="emptyPending">
        No hay acontecimientos pendientes.
      </div>

      <occurrence-card
        v-for="(occurrence, index) in pending.occurrences"
        :key="index"
        :occurrence="occurrence"
        @update-pending="updatePending"></occurrence-card>

      <div class="spinner-container">
        <spinner
          class="spinner" :show="pending.loading"
          loadingMessage="Cargando acontecimientos..."></spinner>
      </div>
    </div>

    <div
      class="cards-container resolved"
      v-infinite-scroll="fetchResolved"
      infinite-scroll-disabled="notUpdateResolved"
      infinite-scroll-distance="200">

      <div class="separator"></div>

      <div class="empty" v-show="emptyResolved">
        No hay acontecimientos resueltos.
      </div>

      <occurrence-card
        v-for="(occurrence, index) in resolved.occurrences"
        :key="index"
        :occurrence="occurrence"></occurrence-card>

      <div class="spinner-container">
        <spinner
          class="spinner" :show="resolved.loading"
          loadingMessage="Cargando acontecimientos..."></spinner>
      </div>
    </div>
  </div>
</template>

<script>
  import Spinner from '@/components/SpinnerWrapper.vue'
  import OccurrenceCard from '@/components/occurrences/OccurrenceCard'

  export default {
    name: 'OccurrenceList',
    components: {
      Spinner,
      OccurrenceCard
    },
    data () {
      return {
        title: 'Acontecimientos',
        pending: {
          occurrences: [],
          page: 1,
          loading: false,
          lastOne: false
        },
        resolved: {
          occurrences: [],
          page: 1,
          loading: false,
          lastOne: false
        },
        fullAccess: null
      }
    },
    created () {
      this.fullAccess = this.$can(this.$constants.ROLES.JEFES)
    },
    methods: {
      fetchPending () {
        this.pending.loading = true
        const action = (this.fullAccess)
          ? 'occurrences/fetchPendingOccurrences'
          : 'occurrences/fetchPendingOccurrencesByMe'

        this.$store.dispatch(action, {page: this.pending.page})
          .then(this.successFetch(this.pending))
          .catch(this.failFetch)
      },
      fetchResolved () {
        this.resolved.loading = true
        const action = (this.fullAccess)
          ? 'occurrences/fetchResolvedOccurrences'
          : 'occurrences/fetchResolvedOccurrencesByMe'

        this.$store.dispatch(action, {page: this.resolved.page})
          .then(this.successFetch(this.resolved))
          .catch(this.failFetch)
      },
      successFetch: dataModel => response => {
        if (response.occurrences.length === 0) {
          dataModel.lastOne = true
        } else {
          response.occurrences.forEach(e => {
            dataModel.occurrences.push(e)
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
        return dataModel.occurrences.length === 0 && !dataModel.loading
      },
      updatePending (occurrence) {
        const findIndex = this.pending.occurrences.findIndex(o => o._id === occurrence._id)
        this.pending.occurrences.splice(findIndex, 1)
        this.resolved.occurrences.unshift(occurrence)
      }
    },
    computed: {
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
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/_variables.scss";
  @import "~@/assets/styles/_mixins.scss";

  .occurrence-list {
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
