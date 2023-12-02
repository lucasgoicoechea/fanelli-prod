<template>
  <div class="productivity-history">
    <navigation
      :title="title">
    </navigation>
    <tabs :history="false" @changeTab="getTab">
      <!-- <tab name="Nuevas">
        <productivity-history-list-active type="active"></productivity-history-list-active>
      </tab> -->
      <tab name="Historial">
        <productivity-history-list-passed :current="currentTab === 'Historial'"></productivity-history-list-passed>
      </tab>
    </tabs>
  </div>
</template>

<script>
  import Tabs from '@/components/tabs/Tabs.vue'
  import Tab from '@/components/tabs/Tab.vue'
  import ProductivityHistoryListActive from '@/components/productivity/ProductivityHistoryListActive.vue'
  import ProductivityHistoryListPassed from '@/components/productivity/ProductivityHistoryListPassed.vue'
  import Navigation from '@/components/Navigation.vue'

  export default {
    name: 'ProductivityHistory',
    components: {
      Tabs,
      Tab,
      ProductivityHistoryListActive,
      ProductivityHistoryListPassed,
      Navigation
    },
    data () {
      return {
        title: 'Listado de desempeños',
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
