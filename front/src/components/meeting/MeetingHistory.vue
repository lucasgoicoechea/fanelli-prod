<template>
  <div class="meeting-history">
    <navigation
      :title="title">
    </navigation>
    <tabs :history="false" @changeTab="getTab">
      <!-- <tab name="Nuevas">
        <meeting-history-list-active type="active"></meeting-history-list-active>
      </tab> -->
      <tab name="Historial">
        <meeting-history-list-passed :current="currentTab === 'Historial'"></meeting-history-list-passed>
      </tab>
    </tabs>
  </div>
</template>

<script>
  import Tabs from '@/components/tabs/Tabs.vue'
  import Tab from '@/components/tabs/Tab.vue'
  import MeetingHistoryListActive from '@/components/meeting/MeetingHistoryListActive.vue'
  import MeetingHistoryListPassed from '@/components/meeting/MeetingHistoryListPassed.vue'
  import Navigation from '@/components/Navigation.vue'

  export default {
    name: 'MeetingHistory',
    components: {
      Tabs,
      Tab,
      MeetingHistoryListActive,
      MeetingHistoryListPassed,
      Navigation
    },
    data () {
      return {
        title: 'Listado de reuniones',
        currentTab: 'Historial'
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
