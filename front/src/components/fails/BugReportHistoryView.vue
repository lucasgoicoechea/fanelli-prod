<template>
  <div class="bugReport-history-view">
    <navigation :title="title"></navigation>
    <epp-history></epp-history>
  </div>
</template>

<script>
  import BugReportHistory from '@/components/fails/BugReportHistory.vue'
  import Navigation from '@/components/Navigation.vue'

  export default {
    name: 'BugReportHistoryView',
    components: {
      BugReportHistory,
      Navigation
    },
    data () {
      return {
        title: 'Historial EPP'
      }
    },
    created: function () {},
    destroyed: function () {},
    methods: {
    },
    computed: {}
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .epp-history {
    margin-top: 30px;
  }
</style>
