<template>
  <div class="archive-occurrences">
    <div class="cards-container"
         v-infinite-scroll="fetch"
         infinite-scroll-disabled="notUpdate"
         infinite-scroll-distance="200">

      <div class="empty" v-show="empty">
        no hay acontecimientos para mostrar
      </div>

      <card-occurrence
        v-for="occurrence in occurrences"
        :key="occurrence._id"
        :occurrence="occurrence"></card-occurrence>
    </div>

    <div v-show="loading">
      <div class="spinner-container">
        <spinner class="spinner" :show="loading"
                 loadingMessage="Cargando acontecimientos..."></spinner>
      </div>
    </div>

  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import CardOccurrence from '@/components/cards/CardOccurrence'
  import Spinner from '@/components/SpinnerWrapper'

  export default {
    name: 'ProfileArchiveOccurrences',
    components: {
      Spinner,
      CardOccurrence
    },
    data () {
      return {
        occurrences: [],
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
        this.$store.dispatch('occurrences/getUserOccurrences', this.payload)
          .then(this.successfulFetch)
          .catch(this.failFetch)
      },
      successfulFetch (response) {
        if (response.occurrences.length === 0) {
          this.lastOne = true
        } else {
          response.occurrences.forEach(e => {
            this.occurrences.push(e)
          })
          this.payload.page += 1
        }
        this.loading = false
      },
      failFetch () {
        this.$snotifyWrapper.error('Se produjo un error al buscar los acontecimientos')
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
        return this.occurrences.length === 0 && !this.loading
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

  .archive-occurrences {
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
