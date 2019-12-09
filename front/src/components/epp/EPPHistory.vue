<template>
  <div class="epp-history">
    <tabs :history="false" @changeTab="getTab">
      <tab name="Nuevas">
        <epp-history-list type="active"></epp-history-list>
      </tab>
      <tab name="Historial">
        <epp-history-list-delivered :current="currentTab === 'Historial'"></epp-history-list-delivered>
      </tab>
    </tabs>
  </div>
</template>

<script>
  import Tabs from '@/components/tabs/Tabs.vue'
  import Tab from '@/components/tabs/Tab.vue'
  import EppHistoryList from '@/components/epp/EPPHistoryList.vue'
  import EppHistoryListDelivered from '@/components/epp/EPPHistoryListDelivered.vue'

  export default {
    name: 'EPPHistory',
    components: {
      Tabs,
      Tab,
      EppHistoryList,
      EppHistoryListDelivered
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
