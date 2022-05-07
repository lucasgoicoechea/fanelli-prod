<template>
  <div class="bugReport-history">
    <tabs :history="false" @changeTab="getTab">
      <tab name="Lista de Fallas">
        <bugReport-history-list type="active"></bugReport-history-list>
      </tab>
      <tab name="Fallas Reparadas">
        <bugReport-history-list-delivered :current="currentTab === 'Fallas Reparadas'"></bugReport-history-list-delivered>
      </tab>
    </tabs>
  </div>
</template>

<script>
  import Tabs from '@/components/tabs/Tabs.vue'
  import Tab from '@/components/tabs/Tab.vue'
  import BugReportHistoryList from '@/components/fails/BugReportHistoryList.vue'
  import BugReportHistoryListDelivered from '@/components/fails/BugReportHistoryListDelivered.vue'

  export default {
    name: 'BugReportHistory',
    components: {
      Tabs,
      Tab,
      BugReportHistoryList,
      BugReportHistoryListDelivered
    },
    data () {
      return {
        currentTab: ''
      }
    },
    created: function () {},
    destroyed: function () {},
    methods: {
      getTab (tab) {
        this.currentTab = tab
      }
    },
    computed: {}
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";


</style>
