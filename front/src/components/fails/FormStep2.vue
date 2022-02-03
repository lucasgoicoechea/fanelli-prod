<template>
  <div class="form-step-2">
    <div class="container-fluid">
      <div class="row">
        <div class="col-xs-12">
          <h3>Selección del colaborador</h3>
          <collaborator-selector></collaborator-selector>
        </div>
      </div>

      <div class="row" v-show="hasSelected">
        <div class="col-xs-12">
          <h3>Últimas solicitudes para {{ collaboratorSelected.lastname }}</h3>
          <last-user-e-p-p-requests></last-user-e-p-p-requests>
        </div>
      </div>

      <div class="row">
        <div class="col-xs-12">
          <h3>Preferencias</h3>
          <div v-for="element in getWithQuantity">
            <form-element-preferences :element="element.type"></form-element-preferences>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import FormElementPreferences from '@/components/epp/FormElementPreferences.vue'
  import CollaboratorSelector from '@/components/selectors/collaborator/CollaboratorSelector.vue'
  import LastUserEPPRequests from '@/components/epp/LastUserEPPRequests.vue'
  import { mapState, mapGetters } from 'vuex'

  export default {
    name: 'form-step-2',
    components: {
      FormElementPreferences,
      CollaboratorSelector,
      LastUserEPPRequests
    },
    data () {
      return {}
    },
    computed: {
      ...mapGetters('catalog', [
        'getWithQuantity'
      ]),
      ...mapGetters('collaborators', [
        'hasSelected'
      ]),
      ...mapState('collaborators', [
        'collaboratorSelected'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  h3 {
    flex-grow: 1;
    width: 100%;
    font-weight: bold;
    border-bottom: 3px solid $primary-color;
    margin: 18px 0;
  }

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
