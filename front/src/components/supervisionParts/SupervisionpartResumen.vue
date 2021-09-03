<template>
  <div class="checklists-control">
    <tabs :history="true">
      <!--<tab name="Resumen">
        <summary-view></summary-view>
      </tab> -->
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
  // import ChecklistSummaryView from '@/components/checklists/ChecklistSummaryView.vue'
  import SupervisionpartResumeView from '@/components/supervisionParts/SupervisionpartResumeView.vue'
  import SupervisionpartsResumeFullList from '@/components/supervisionParts/SupervisionpartsResumeFullList.vue'
  import Tabs from '@/components/tabs/Tabs.vue'
  import Tab from '@/components/tabs/Tab.vue'
  import { mapState } from 'vuex'

  export default {
    name: 'SupervisionpartControl',
    components: {
      // summaryView: ChecklistSummaryView,
      detailView: SupervisionpartResumeView,
      historialView: SupervisionpartsResumeFullList,
      Tabs,
      Tab
    },
    data () {
      return {
        currentView: 'detailView'
      }
    },
    methods: {},
    computed: {
      ...mapState('supervisionparts', []) //, [ 'summaries' ])
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .noMargin {
    margin-top: 5px;
  }
</style>
