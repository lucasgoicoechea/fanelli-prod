<template>
  <div class="archive-staffRequests">
    <div v-if="$loading.isLoading('staffRequests fetchArchive') " class="container-fluid">
      <div class="spinner-container">
        <spinner class="spinner" :show="$loading.isLoading('staffRequests fetchArchive')"
                 loadingMessage="Cargando archivo..."></spinner>
      </div>
    </div>
    <div v-else>
      <card-staff-request
        v-for="request in requests"
        :key="request.request._id"
        :request="request"></card-staff-request>
      <div class="empty horizontal-center" v-if="!requests.length">
        <span> No hay solicitudes archivadas para este colaborador </span>
      </div>
    </div>

  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import CardStaffRequest from '@/components/cards/CardStaffRequest.vue'
  import Spinner from '@/components/SpinnerWrapper.vue'

  export default {
    name: 'ProfileArchiveStaffRequests',
    components: {
      Spinner,
      CardStaffRequest
    },
    data () {
      return {
        requests: []
      }
    },
    methods: {
      fetch () {
        this.$store.dispatch('staffRequests/getArchive', this.user.id)
          .then((res) => { this.requests = res.requests })
          .catch(() => { this.$snotifyWrapper.error('Se produjo un error al buscar las solicitudes') })
      }
    },
    computed: {
      ...mapState('users', [
        'user'
      ])
    },
    created () {
      if (this.user.hasOwnProperty('id')) {
        this.fetch()
      }
    },
    watch: {
      user () {
        if (this.user.hasOwnProperty('id')) {
          this.fetch()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .archive-staffRequests {
    position: relative;
    width: 90%;
    margin: 20px auto;
  }

  .spinner-container {
    margin: 25px 0;
  }

  .horizontal-center {
    display: flex;
    justify-content: center;
  }

  .empty {
    font-size: 20px;
    text-align: center;
    margin-top: 20px;
  }
</style>
