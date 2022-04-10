<template>
  <div class="checklists-control">
    <tabs :history="true">
      <tab name="Resumen">
        <summary-view></summary-view>
      </tab>
      <tab name="Detalle">
        <detail-view></detail-view>
      </tab>
      <tab name="Historial">
        <historial-view></historial-view>
      </tab>
    </tabs>
  </div>
</template>

<script>
  import ChecklistSummaryView from '@/components/checklistsLTres/ChecklistSummaryView.vue'
  import ChecklistComparativeView from '@/components/checklistsLTres/ChecklistComparativeView.vue'
  import ChecklistsFullList from '@/components/checklistsLTres/ChecklistsFullList.vue'
  import Tabs from '@/components/tabs/Tabs.vue'
  import Tab from '@/components/tabs/Tab.vue'
  import { mapState } from 'vuex'

  export default {
    name: 'ChecklistsControl',
    components: {
      summaryView: ChecklistSummaryView,
      detailView: ChecklistComparativeView,
      historialView: ChecklistsFullList,
      Tabs,
      Tab
    },
    data () {
      return {
        currentView: 'summaryView'
      }
    },
    methods: {},
    computed: {
      ...mapState('checklistsLTres', [
        'summaries'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .noMargin {
    margin-top: 5px;
  }
</style>
