<template>
  <div class="checklist-summary-view">
    <div class="container-fluid">
      <div class="row">
        <div v-if="isSummaryLoading" class="spinner-container">
          <spinner :show="isSummaryLoading" loadingMessage="Cargando checklist..."></spinner>
        </div>
        <div v-else class="col-xs-12">
          <checklist-summary
            v-for="summary in checklistOrder"
            :key="filterChecklistsSummary(summary)._id"
            :summary="filterChecklistsSummary(summary)"></checklist-summary>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ChecklistSummary from '@/components/checklists/ChecklistSummary.vue'
  import Spinner from '@/components/SpinnerWrapper.vue'
  import {mapState, mapGetters} from 'vuex'

  export default {
    name: 'ChecklistSummaryView',
    components: {ChecklistSummary, Spinner},
    props: {
      date: {
        type: String,
        required: false
      }
    },
    data () {
      return {}
    },
    methods: {
      init () {
        if (this.validateDate(this.date)) {
          const formatDate = (this.isCurrentDate)
            ? this.date
            : this.$moment(this.date, 'DD-MM-YYYY').utc().format('YYYY-MM-DD')
          this.$store.dispatch('checklists/summaries', {date: formatDate})
        }
      },
      validateDate (date) {
        if (this.isCurrentDate) {
          return true
        }

        return this.$moment(date, 'DD-MM-YYYY', true).isValid()
      }
    },
    created () {
      this.init()
    },
    watch: {
      date () {
        this.init()
      }
    },
    computed: {
      ...mapState('checklists', [
        'summaries',
        'checklistOrder'
      ]),
      ...mapGetters('checklists', [
        'filterChecklistsSummary'
      ]),
      isCurrentDate () {
        return !this.date
      },
      isSummaryLoading () {
        return this.$loading.isLoading('checklist summaries')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .spinner-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .container-fluid {
    width: 70%;
  }

  @media (min-width: 600px) and (max-width: 1200px) {
    .container-fluid {
      width: 80%;
    }
  }

  @media (max-width: 599px) {
    .container-fluid {
      width: 100%;
    }
  }

</style>

