<template>
<<<<<<< HEAD
  <div class="epp-history-view">
=======
  <div class="bugReport-history-view">
>>>>>>> fe21cf6d0f69181d9226e7bb3c31236c8cbf2f1f
    <navigation :title="title"></navigation>
    <epp-history></epp-history>
  </div>
</template>

<script>
<<<<<<< HEAD
  import EppHistory from '@/components/epp/EPPHistory.vue'
  import Navigation from '@/components/Navigation.vue'

  export default {
    name: 'EPPHistoryView',
    components: {
      EppHistory,
=======
  import BugReportHistory from '@/components/fails/BugReportHistory.vue'
  import Navigation from '@/components/Navigation.vue'

  export default {
    name: 'BugReportHistoryView',
    components: {
      BugReportHistory,
>>>>>>> fe21cf6d0f69181d9226e7bb3c31236c8cbf2f1f
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
