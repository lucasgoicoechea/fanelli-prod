<template>
  <div class="last-user-staff-requests">
    <card-staff-request v-for="(requestData, i) in collaboratorStaffRequests" :key="i"
                        :request="requestData"></card-staff-request>
    <p class="text-center" v-show="collaboratorStaffRequests.length === 0">
      El colaborador no ha realizado solicitudes</p>
  </div>
</template>

<script>
  import CardStaffRequest from '../cards/CardStaffRequest.vue'
  import { mapState } from 'vuex'

  export default {
    name: 'LastUserStaffRequests',
    components: {
      CardStaffRequest
    },
    props: {
      request: {
        type: Object,
        required: true
      }
    },
    computed: {
      ...mapState('staffRequests', [
        'collaboratorStaffRequests'
      ])
    },
    created () {
      this.$store.dispatch('staffRequests/fetchLastUserStaffRequests', {id: this.request.data.collaborators[0].id}) // #TODO CHECK MULTIPLE
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .last-user-staff-requests {
    padding: 10px;
   // background-color: $grey;
  }
</style>
