<template>
  <div class="form-list">
    <navigation :title="title"></navigation>
    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-xs-6 col-sm-4" v-for="checklist in types" :key="checklist.sector">
            <card-button
              :to="{ name: 'checklist', params: { sector: checklist.sector } }"
              :title="checklist.sector | pretty"
              :icon="`/static/img/checklists/${checklist.sector}.svg`"
              background-color="#ec6e25"></card-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import Navigation from '@/components/Navigation.vue'
  import CardButton from '@/components/CardButton.vue'
  import { mapState } from 'vuex'

  export default {
    name: 'ChecklistsList',
    components: {Navigation, CardButton},
    data () {
      return {
        title: 'Checklists'
      }
    },
    computed: {
      ...mapState(
        'checklistsLTres', [
          'types'
        ])
    }
  }
</script>

<style lang="scss" scoped>

  .container-fluid {
    width: 80%;
  }

  @media (min-width: 600px) and (max-width: 1200px) {
    .container-fluid {
      width: 90%;
    }
  }

  @media (max-width: 599px)  {
    .container-fluid {
      width: 100%;
    }
  }

</style>

