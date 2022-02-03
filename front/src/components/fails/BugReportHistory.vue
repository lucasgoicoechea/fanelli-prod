<template>
<<<<<<< HEAD
  <div class="epp-history">
    <tabs :history="false" @changeTab="getTab">
      <tab name="Nuevas">
        <epp-history-list type="active"></epp-history-list>
      </tab>
      <tab name="Historial">
        <epp-history-list-delivered :current="currentTab === 'Historial'"></epp-history-list-delivered>
=======
  <div class="bugReport-history">
    <tabs :history="false" @changeTab="getTab">
      <tab name="Nuevas">
        <bugReport-history-list type="active"></bugReport-history-list>
      </tab>
      <tab name="Historial">
        <bugReport-history-list-delivered :current="currentTab === 'Historial'"></bugReport-history-list-delivered>
>>>>>>> fe21cf6d0f69181d9226e7bb3c31236c8cbf2f1f
      </tab>
    </tabs>
  </div>
</template>

<script>
  import Tabs from '@/components/tabs/Tabs.vue'
  import Tab from '@/components/tabs/Tab.vue'
<<<<<<< HEAD
  import EppHistoryList from '@/components/epp/EPPHistoryList.vue'
  import EppHistoryListDelivered from '@/components/epp/EPPHistoryListDelivered.vue'
=======
  import BugReportHistoryList from '@/components/fails/BugReportHistoryList.vue'
  import BugReportHistoryListDelivered from '@/components/fails/BugReportHistoryListDelivered.vue'
>>>>>>> fe21cf6d0f69181d9226e7bb3c31236c8cbf2f1f

  export default {
    name: 'EPPHistory',
    components: {
      Tabs,
      Tab,
<<<<<<< HEAD
      EppHistoryList,
      EppHistoryListDelivered
=======
      BugReportHistoryList,
      BugReportHistoryListDelivered
>>>>>>> fe21cf6d0f69181d9226e7bb3c31236c8cbf2f1f
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
