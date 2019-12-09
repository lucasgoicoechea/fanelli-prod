<template>
  <div class="archive-sanctions">
    <div class="cards-container"
         v-infinite-scroll="fetch"
         infinite-scroll-disabled="notUpdate"
         infinite-scroll-distance="200">

      <div class="empty" v-show="empty">
        no hay sanciones para mostrar
      </div>

      <card-sanction
        v-for="sanction in sanctions"
        :key="sanction._id"
        :sanction="sanction"></card-sanction>
    </div>

    <div v-show="loading">
      <div class="spinner-container">
        <spinner class="spinner" :show="loading"
                 loadingMessage="Cargando sanciones..."></spinner>
      </div>
    </div>

  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import CardSanction from '@/components/cards/CardSanction'
  import Spinner from '@/components/SpinnerWrapper'

  export default {
    name: 'ProfileArchiveSanctions',
    components: {
      Spinner,
      CardSanction
    },
    data () {
      return {
        sanctions: [],
        payload: {
          userId: null,
          page: 1
        },
        loading: false,
        lastOne: false
      }
    },
    created () {
      if (this.user !== null) {
        this.payload.userId = this.user._id
      }
    },
    methods: {
      fetch () {
        if (this.payload.userId === null) {
          return
        }
        this.loading = true
        this.$store.dispatch('sanctions/getUserSanctions', this.payload)
          .then(this.successfulFetch)
          .catch(this.failFetch)
      },
      successfulFetch (response) {
        if (response.sanctions.length === 0) {
          this.lastOne = true
        } else {
          response.sanctions.forEach(e => {
            this.sanctions.push(e)
          })
          this.payload.page += 1
        }
        this.loading = false
      },
      failFetch () {
        this.$snotifyWrapper.error('Se produjo un error al buscar las sanciones')
      }
    },
    computed: {
      ...mapState('users', [
        'user'
      ]),
      notUpdate () {
        return this.loading || this.lastOne
      },
      empty () {
        return this.sanctions.length === 0 && !this.loading
      }
    },
    watch: {
      user () {
        if (this.user) {
          this.payload.userId = this.user._id
          this.fetch()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .archive-sanctions {
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
</style>
