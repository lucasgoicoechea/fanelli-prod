<template>
  <div class="archive-news">
    <div v-if="$loading.isLoading('newsRequests fetchAll') " class="container-fluid">
      <div class="spinner-container">
        <spinner class="spinner" :show="$loading.isLoading('newsRequests fetchAll')"
                 loadingMessage="Cargando archivo..."></spinner>
      </div>
    </div>
    <div v-else>
      <card-staff-news
        v-for="request in requests"
        :key="request._id"
        :request="request"></card-staff-news>
      <div class="empty horizontal-center" v-if="!requests.length">
        <span> No hay novedades para este colaborador </span>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Spinner from '@/components/SpinnerWrapper.vue'
  import CardStaffNews from '@/components/cards/CardStaffNews.vue'

  export default {
    name: 'ProfileArchiveNews',
    components: {
      Spinner,
      CardStaffNews
    },
    data () {
      return {
        requests: []
      }
    },
    methods: {
      fetch () {
        this.$store.dispatch('news/getAll', this.user.id)
          .then((res) => { this.requests = res.staffNews })
          .catch(() => { this.$snotifyWrapper.error('Se produjo un error al buscar las novedades') })
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

  .archive-news {
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
