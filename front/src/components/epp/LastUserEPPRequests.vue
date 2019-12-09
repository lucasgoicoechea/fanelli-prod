<template>
  <div class="last-user-requests">
    <request-matching-card v-for="(requestData, i) in collaboratorEPPRequests" :key="i" :request="requestData" :currentRequest="request">
    </request-matching-card>
    <p class="text-center" v-show="collaboratorEPPRequests.length === 0">
      Aún no se han recibido solicitudes
    </p>
  </div>
</template>

<script>
  import RequestMatchingCard from './RequestMatchingCard.vue'
  import { mapState, mapGetters } from 'vuex'

  export default {
    name: 'LastUserEPPRequests',
    components: {
      RequestMatchingCard
    },
    props: {
      request: {
        type: Object,
        required: false
      }
    },
    destroyed () {
      this.$store.commit('requests/reset')
    },
    computed: {
      ...mapState('collaborators', [
        'collaboratorSelected',
        'userSelectedRequests',
        'showList'
      ]),
      ...mapState('requests', [
        'collaboratorEPPRequests'
      ]),
      ...mapGetters('collaborators', [
        'hasSelected'
      ])
    },
    created: function () {
      if (this.request) {
        this.$store.dispatch('requests/fetchLastUserEPPRequests', {id: this.request.collaborator._id})
      }
    },
    watch: {
      collaboratorSelected (newVal, oldVal) {
        this.$store.dispatch('requests/fetchLastUserEPPRequests', {id: newVal._id})
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .last-user-requests {
    padding: 10px;
    background-color: $grey;
  }
</style>
