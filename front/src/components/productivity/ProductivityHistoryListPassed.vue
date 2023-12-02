<template>
  <div class="productivity-history-list-delivered container-fluid">
    <h3><span class="glyphicon glyphicon-filter" aria-hidden="true"></span> Filtros</h3>
    <div class="filters">
      <div class="filter">
        <span class="glyphicon glyphicon-calendar" aria-hidden="true"></span>
        <input class="date" v-model="date" type="date">
      </div>
      <collaborator-selector class="filter" :reduced="true"></collaborator-selector>
      </div>
     <div class="filters">
      <div class="filter">
        <div class="col-xs-12">
            <h3>Tipo de Desempeño</h3>
            <div class="row">
              <div
                class="col-md-6"
                v-for="(label, value) in $constants.MEETING_TYPE_CREATABLE"
                :key="value">
                <check-box
                  class="margin"
                  type="radio"
                  v-model="type"
                  :val="value"
                  :label="label"></check-box>
              </div>        
            </div>
          </div>
      </div>
          <div class="filter">
            <div class="col-xs-12" v-if="type && type ==='FRECUENCY'">
              <h3>Frecuencia</h3>
              <div class="row">
                  <div
                  class="col-md-6"
                  v-for="(label, value) in $constants.MEETING_FRECUENCY"
                  :key="value">
                  <check-box
                    class="margin"
                    type="radio"
                    v-model="frecuency"
                    :val="value"
                    :label="label"></check-box>
                </div>
              </div>
            </div> 
        </div>       
      </div>  
      <div class=" " >
         <blockable-button
        class="margin"
        icon="/static/img/icon-selector/search.svg"
        title="editar"
        v-show="true"
        :clickMethod="fetch"
        :isLoading="false"
        buttonBackgroundColor="#4CAF50"
        iconPadding="10px"
        buttonRadius="50px"
        buttonWidth="100px"
        buttonHeight="50px"></blockable-button>
      </div> 
    
    <div class="empty" v-show="this.productivity.list.length === 0 && !this.productivity.loading">
      <p>Buscar {{owner}}</p>
    </div>
    <div class="cards-container"
         v-infinite-scroll="fetch"
         infinite-scroll-disabled="notUpdateList"
         infinite-scroll-distance="0">
     <productivity-card
        v-for="(item, index) in productivity.list"
        :key="index"
        :productivity="item"></productivity-card>

      <div class="spinner-container">
        <spinner
          class="spinner" :show="productivity.loading"
          loadingMessage="Cargando desempeños..."></spinner>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import CardContainer from '@/components/cards/CardContainer.vue'
  import CardHeader from '@/components/cards/CardHeader.vue'
  import CardSection from '@/components/cards/CardSection.vue'
  import CardFooter from '@/components/cards/CardFooter.vue'
  import CollaboratorSelector from '@/components/selectors/collaborator/CollaboratorSelector.vue'
  import Spinner from '@/components/SpinnerWrapper.vue'
  import ProductivityCard from '@/components/productivity/ProductivityCard.vue'
  import BlockableButton from '@/components/buttons/blockableButton'
  import CheckBox from '@/components/CheckBoxInput'

  export default {
    name: 'productivityHistoryListPassed',
    components: {CardContainer, CardHeader, CardSection, CardFooter, Spinner, BlockableButton, CollaboratorSelector, CheckBox, ProductivityCard},
    props: {
      current: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        date: '',
        callFilter: false,
        fullAccess: false,
        type: [],
        frecuency: [],
        productivity: {
          list: [],
          loading: false,
          lastOne: false,
          page: 1
        }
      }
    },
    created: function () {
      this.fullAccess = this.$can(this.$constants.ROLES.JEFES)
      // this.fetch()
    },
    destroyed: function () {},
    methods: {
      fetch () {
        this.productivity.loading = true
        const action = (this.hasSelected)
         ? 'productivitys/fetchPass'
         : 'productivitys/fetchPassMe'
        const params = {
          ...((this.hasSelected) ? {userId: this.collaboratorSelected._id} : {userId: this.user.id}),
          ...((this.date !== '') ? {date: this.date} : {}),
          ...((this.type !== '') ? {type: this.type} : {}),
          ...((this.frecuency !== '') ? {frecuency: this.frecuency} : {}),
          page: this.productivity.page
        }
        this.$store.dispatch(action, params)
        .then(this.successFetch)
        .catch(this.failFetch)
      },
      successFetch (response) {
        this.callFilter = false
        if (response.productivitys.length === 0) {
          this.productivity.lastOne = true
        } else {
          response.productivitys.forEach(e => {
            this.productivity.list.push(e)
          })
          this.productivity.page += 1
        }
        this.productivity.loading = false
      },
      failFetch () {
        this.$snotifyWrapper.error('Se produjo un error al buscar las desempeños')
        this.productivity.loading = false
      },
      notUpdate (dataModel) {
        return dataModel.loading || dataModel.lastOne || this.callFilter
      },
      empty (dataModel) {
        return dataModel.list.length === 0 && !dataModel.loading
      }
    },
    computed: {
      notUpdateList () {
        return this.notUpdate(this.productivity)
      },
      emptyList () {
        return this.empty(this.productivity)
      },
      owner () {
        return (this.hasSelected) ? (' desempeños de ' + this.collaboratorSelected.lastname) : ' mis desempeños'
      },
      ...mapState('collaborators', [
        'collaboratorSelected'
      ]),
      ...mapState('auth', [
        'user'
      ]),
      ...mapGetters('collaborators', [
        'hasSelected'
      ])
    },
    watch: {
      collaboratorSelected () {
        this.callFilter = true
        this.productivity.list = []
        this.productivity.page = 1
        /* if (this.current) {
          this.$store.commit('requests/clear', 'delivered')
          this.fetch()
        } */
      },
      date (newValue) {
        this.callFilter = true
        this.productivity.list = []
        this.productivity.page = 1
        /* if (this.current && newValue[0] !== '0') {
          this.$store.commit('requests/clear', 'delivered')
          this.fetch()
        } */
      },
      type (newValue) {
        this.callFilter = true
        this.productivity.list = []
        this.productivity.page = 1
        if (this.current && newValue) {
          this.$store.commit('requests/clear', 'delivered')
          this.fetch()
        }
      },
      frecuency (newValue) {
        this.callFilter = true
        this.productivity.list = []
        this.productivity.page = 1
        if (this.current && newValue) {
          this.$store.commit('requests/clear', 'delivered')
          this.fetch()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .productivity-history-list-delivered {
    width: 80%;
  }

  p {
    margin: 0;
  }

  button {
    margin: 2px 0;
    padding: 4px 16px;
    text-decoration: none;
    border: none;
    border-radius: 50px;
    color: white;

    img {
      height: 20px;
      width: 20px;
    }

    &.accept {
      background-color: #65c25a;
    }
    &.reject {
      background-color: #f86567;
    }

    &:disabled {
      cursor: not-allowed;
    }
  }

  hr {
    border: 3px solid $primary-color;
    margin: 15px 0;
  }

  .empty {
    text-align: center;
    margin: 20px;

    .spinner {
      font-size: xx-large;
    }
  }

  .filters {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 10px;
    border-bottom: 4px solid $secondary-color;

    .filter {
      max-width: 50%;

      .glyphicon {
        margin-left: 10px;
      }
    }

    .date {
      width: auto;
    }
  }

  @media (max-width: 500px) {
    .filters {
      display: flex;
      flex-direction: column;
      margin: 20px 0;

      .filter {
        max-width: 100%;
      }
    }

    .productivity-history-list-delivered {
      width: 100%;
    }
  }

  h3 {
    margin: 15px 0 0 0;
  }

  .time {
    font-family: monospace;
  }

  .cards-container {
    padding-bottom: 68px;
  }

</style>
