<template>
  <section class="personal-manager">
    <div class="container-fluid">
      <div class="row">
        <div class="col-xs-12 actions">
          <div class="search">
            <img src="/static/img/icon-selector/search.svg" alt="Lupa">
            <input ref='search' v-model="match" placeholder="Buscar Colaborador" @keyup.esc="clear">
          </div>
          <div class="button-action" v-show="permission">
            <button class="redirect" @click="generateReport">
              <spinner
                size="small"
                :show="$loading.isLoading('collaborators report')"></spinner>

              <div v-show="!$loading.isLoading('collaborators report')">
                <span class="glyphicon glyphicon-download-alt"></span>
                <span class="text">Generar reporte</span>
              </div>
            </button>
            <router-link :to="{ name:'profile-new' }" class="redirect">
              <span class="glyphicon glyphicon-plus"></span>
              <span class="text">Nuevo Colaborador</span>
            </router-link>
          </div>
        </div>
      </div>
      <div class="spinner-container">
        <spinner class="spinner" :show="$loading.isLoading('collaborators fetch')"
                 loadingMessage="Cargando personal..."></spinner>
      </div>

      <div class="row" v-show="!$loading.isLoading('collaborators fetch') && filterEmpty">
        <div class="col-xs-12">
          <p class="clarification">No hay resultados</p>
        </div>
      </div>

      <div class="row" v-for="(list, area) in groupCollaboratorsFilter" v-show="list.length !== 0">
        <div class="col-xs-12">
          <h2>{{ area }}</h2>
        </div>
        <div class="col-xs-6 col-sm-4 col-md-3 col-lg-2" v-for="collaborator in list" :key="collaborator._id">
          <router-link :to="{ name: 'profile', params: { id: collaborator._id }}">
            <personal-card :collaborator="collaborator"></personal-card>
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import PersonalCard from '@/components/personal/PersonalCard.vue'
  import Spinner from '@/components/SpinnerWrapper.vue'
  import pdf from '@/utils/pdf'
  import authorize from '@/utils/authorize'

  export default {
    name: 'personal-manager',
    components: {PersonalCard, Spinner},
    data: function () {
      return {}
    },
    created: function () {
      const fullAccess = [
        this.$constants.ROLES.JEFE_PLANTA,
        this.$constants.ROLES.RRHH,
        this.$constants.ROLES.PERSONAL,
        this.$constants.ROLES.JEFE_PERSONAL
      ].join('|')

      const action = (this.$can(fullAccess))
        ? 'collaborators/fetch'
        : 'collaborators/fetchTeamStrict'
      this.$store.dispatch(action)
    },
    destroyed: function () {
      this.clear()
    },
    methods: {
      clear () {
        this.$store.commit('collaborators/setMatch', '')
      },
      successfulPrint (blob) {
        pdf.download(blob, 'report-completo.xlsx')
      },
      errorPrint () {
        this.$snotifyWrapper.warning('Error de impresión. Intente nuevamente')
      },
      generateReport () {
        this.$store.dispatch('collaborators/report')
          .then(this.successfulPrint)
          .catch(this.errorPrint)
      }
    },
    computed: {
      filterEmpty () {
        return Object.keys(this.groupCollaboratorsFilter).every(k => {
          return this.groupCollaboratorsFilter[k].length === 0
        })
      },
      permission () {
        return this.$can(authorize(this.$constants.ROLES.JEFE_PLANTA, this.$constants.ROLES.ADMINISTRACION))
      },
      ...mapState('collaborators', [
        'collaborators',
        'groupCollaborators'
      ]),
      ...mapGetters('collaborators', [
        'groupCollaboratorsFilter',
        'groupCollaboratorsIsEmpty'
      ]),
      match: {
        get () {
          return this.$store.state.collaborators.match
        },
        set (value) {
          this.$store.commit('collaborators/setMatch', value)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  h2 {
    color: grey;
    font-weight: bold;
    border-bottom: 4px solid $primary-light;
    margin: 20px 0;
    padding: 0;
  }

  .actions {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
  }

  .button-action {
    position: relative;
  }

  .redirect {
    margin: 15px 4px;
    position: relative;
    display: inline-block;
    background: $secondary-color;
    padding: 10px 20px;
    border-radius: 50px;
    color: white;
    font-weight: bold;
    cursor: pointer;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.25);
    border: none;

    span {
      font-size: medium;
      display: inline;
    }
  }

  .search {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-grow: 1;

    img {
      height: 30px;
      width: 30px;
      margin: 5px 10px 5px 0;
    }

    input {
      margin: 15px 30px 15px 0;
    }
  }

  .feedback {
    text-align: center;
  }

  .spinner-container {
    display: flex;
    justify-content: center;
    margin: 15px 0;
  }


  .clarification {
    margin: 20px;
    color: grey;
    text-align: center;
    font-size: medium;
  }

  @media (max-width: 1250px) {

    .search {
      width: 75%;
    }

    .redirect {
      margin: 5px;

      .text {
        display: none;
      }
    }
  }

</style>
