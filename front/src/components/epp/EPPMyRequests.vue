<template>
  <div class="epp-my-requests">
    <navigation :title="title"></navigation>
    <tabs :history="false" @changeTab="getTab">
      <tab name="Activas">
        <epp-my-active-request-list
          :current="currentTab === 'Activas'"></epp-my-active-request-list>
      </tab>
      <tab name="Historial">
        <epp-my-history-request-list
          :current="currentTab === 'Historial'"></epp-my-history-request-list>
      </tab>
    </tabs>
  </div>
</template>

<script>
  import Navigation from '@/components/Navigation.vue'
  import Tabs from '@/components/tabs/Tabs.vue'
  import Tab from '@/components/tabs/Tab.vue'
  import EppMyActiveRequestList from '@/components/epp/EPPMyActiveRequestList.vue'
  import EppMyHistoryRequestList from '@/components/epp/EPPMyHistoryRequestList.vue'

  export default {
    name: 'EPPMyRequests',
    components: {
      Navigation,
      Tabs,
      Tab,
      EppMyActiveRequestList,
      EppMyHistoryRequestList
    },
    data () {
      return {
        title: 'Mis solicitudes de EPP',
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
