<template>
  <div class="widget-pending-exculpatory-container">

    <spinner
      class="loading"
      :show="loading"></spinner>

    <div class="error" v-show="showEmptyMsg">
      No hay elementos disponibles!
    </div>

    <widget-pending-exculpatory-card
      v-for="news in newsWithoutExculpatory"
      :key="news._id"
      :news="news"></widget-pending-exculpatory-card>
  </div>

</template>

<script>
  import { mapState } from 'vuex'
  import Spinner from '@/components/SpinnerWrapper'
  import WidgetPendingExculpatoryCard from '@/components/widgets/pending-exculpatory/WidgetPendingExculpatoryCard'

  export default {
    name: 'WidgetPendingExculpatoryContainer',
    components: {
      WidgetPendingExculpatoryCard,
      Spinner
    },
    created () {
      this.fetch()
    },
    methods: {
      fetch () {
        this.$store.dispatch('widgets/fetchWithoutExculpatory')
          .catch(() => {
            this.$snotifyWrapper.error(this.$t('error_fetch_backend'))
          })
      }
    },
    computed: {
      ...mapState('widgets', [
        'newsWithoutExculpatory']),
      loading () {
        return this.$loading.isLoading('widgets without-exculpatory')
      },
      isEmpty () {
        return this.newsWithoutExculpatory.length === 0
      },
      showEmptyMsg () {
        return this.isEmpty && !this.loading
      }
    }
  }
</script>

<style lang="scss" scoped>

  .widget-pending-exculpatory-container {
    position: relative;
    height: 390px;
    padding: 5px;
    background-color: #dadada;
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .error {
    padding: 20px;
    color: #000;
    text-align: center;
    transition: transform 0.2s ease;
  }

  .loading {
    margin: 20px 0;
  }

  .change {
    opacity: 0.40;
  }
</style>
