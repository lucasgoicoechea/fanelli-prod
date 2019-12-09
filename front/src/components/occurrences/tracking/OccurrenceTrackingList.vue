<template>
  <section class="occurrence-tracking-list">

    <navigation
      :title="title"></navigation>

    <div class="container-fluid">

      <div class="scroll"
           v-infinite-scroll="loadMore"
           infinite-scroll-disabled="notUpdate"
           infinite-scroll-distance="0">

        <transition-group
          class="box"
          name="list-complete"
          tag="article">

          <occurrence-tracking-card
            v-for="occurrence in occurrences"
            :key="occurrence._id"
            :occurrence="occurrence"
            @update-occurrence="updateOccurrence"
            class="list-complete-item"></occurrence-tracking-card>

        </transition-group>
      </div>

      <p class="clarification" v-show="empty">
        Aún no se han recibido acontecimientos
      </p>

      <spinner
        class="loading"
        :show="loading"></spinner>
    </div>
  </section>
</template>

<script>
  import Navigation from '@/components/Navigation'
  import Spinner from '@/components/SpinnerWrapper'
  import OccurrenceTrackingCard from '@/components/occurrences/tracking/OccurrenceTrackingCard'

  export default {
    name: 'OccurrenceTrackingList',
    components: {
      Navigation,
      OccurrenceTrackingCard,
      Spinner
    },
    data: function () {
      return {
        title: 'Acontecimiento',
        occurrences: [],
        loading: false,
        lastOne: false,
        page: 1
      }
    },
    methods: {
      loadMore () {
        this.loader = true
        this.$store.dispatch('occurrences/fetchNotArchivedOccurrences', {page: this.page})
          .then(this.successFetch)
          .catch(this.failFetch)
      },
      successFetch (response) {
        if (response.occurrences.length === 0) {
          this.lastOne = true
        } else {
          response.occurrences.forEach(e => {
            this.occurrences.push(e)
          })
          this.page += 1
        }
        this.loading = false
      },
      failFetch () {
        this.$snotifyWrapper.error('Se produjo un error al buscar los acontecimientos')
        this.loading = false
      },
      updateOccurrence (occurrence) {
        const index = this.occurrences.findIndex(o => o._id === occurrence._id)
        this.occurrences.splice(index, 1)
      }
    },
    computed: {
      notUpdate () {
        return this.lastOne || this.loading
      },
      empty () {
        return this.occurrences.length === 0
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/_variables.scss";

  .personal-staff-request {
    position: relative;
    height: 100vh;
    overflow: auto;
  }

  .container-fluid {
    position: relative;
  }

  .loading {
    margin: 20px 0;
  }

  .box {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .list-complete-item {
    transition: all 0.5s;
    display: inline-block;
  }

  .list-complete-enter, .list-complete-leave-to
    /* .list-complete-leave-active below version 2.1.8 */
  {
    opacity: 0;
    transform: translateY(-50px);
  }

  .list-complete-leave-active {
    position: absolute;
  }

  .clarification {
    text-align: center;
  }

</style>
