<template>
  <div class="epp-history-view">
    <navigation :title="title"></navigation>
    <epp-history></epp-history>
  </div>
</template>

<script>
  import EppHistory from '@/components/epp/EPPHistory.vue'
  import Navigation from '@/components/Navigation.vue'

  export default {
    name: 'EPPHistoryView',
    components: {
      EppHistory,
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
