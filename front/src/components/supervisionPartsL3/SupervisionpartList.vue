<template>
  <div class="form-list">
    <navigation :title="title"></navigation>
    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-xs-6 col-sm-4" v-for="supervisionpart in types" :key="supervisionpart.sector">         
              <!-- v-if="permission || isOficial(supervisionpart.sector)" -->
            <card-button 
              :to="{ name: 'supervisionpart-linea3', params: { sector: supervisionpart.sector } }"
              :title="supervisionpart.sector | pretty"
              :icon="`/static/img/checklists/${supervisionpart.sector}.svg`"
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
    name: 'SupervisionpartList',
    components: {Navigation, CardButton},
    data () {
      return {
        title: 'Supervisionpart'
      }
    },
    methods: {
      isOficial (sector) {
        return (sector === 'EXTRUSORA' && this.$can(this.$constants.ROLES.OFICIAL_EXTRUSORA_L3)) || (sector === 'APILADORA' && this.$can(this.$constants.ROLES.OFICIAL_APILADORA)) || (sector === 'DESAPILADORA' && this.$can(this.$constants.ROLES.OFICIAL_DESAPILADORA))
      }
    },
    computed: {
      ...mapState(
        'supervisionpartsLTres', [
          'types'
        ]),
      permission () {
        return this.$can(this.$constants.ROLES.JEFES)
      }
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

