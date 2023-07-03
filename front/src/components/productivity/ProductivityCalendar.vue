<template>
  <div class="productivity-calendar" >
    <navigation :title="title"></navigation>
     <div class="productivity-history-list-delivered container-fluid">
       <h3><span class="glyphicon glyphicon-filter" aria-hidden="true"></span> Filtros</h3>
       Calendario con los desempeños frecuentes: DIARIAS, MENSUALES y PERIODICAS
       <div class="filters">
          <div class="filter">
            <div class="col-xs-2">
                <h3>Mes</h3>
                <div class="row">
                  <div
                    class="col-md-6" >
                    <select v-model="month" >
                      <!--<option :value="null">Seleccione una maquina</option>-->
                      <option v-for="(label, value) in $constants.MEETING_MONTH"  :key="value" :value="value"> {{label}}</option>
                    </select>
                  </div>        
                </div>
              </div>
          </div>
          <div class="filter">
            <div class="col-xs-2" >
              <h3>Año</h3>
              <div class="row">
                <div
                  class="col-md-6" >
                  <select v-model="year" >
                    <!--<option :value="null">Seleccione una maquina</option>-->
                    <option v-for="(label, value) in $constants.MEETING_YEAR"  :key="value" :value="value"> {{label}}</option>
                  </select>
                </div>        
              </div>
            </div> 
          </div> 
          <div class="filter" >
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
              buttonHeight="50px">
              </blockable-button>
        </div>       
       </div> 
     </div>    
     <div class="empty" v-show="this.productivity.list.length === 0 && !this.productivity.loading">
      <p>Buscar ...</p>
     </div>
    <div class="container" >

      <div class="empty" v-show="emptyList" >
        No hay desempeños.
      </div>
      <div class="filter" >
           <a class="print" @click="csvExport">IMPRIMIR</a>
      </div>    
      <div class="spinner-container">
        <spinner class="spinner" :show="productivity.loading" loadingMessage="Cargando desempeños...">
        </spinner>
      </div>
       
      <div class="menu-item-container row " v-show="productivity.list.length>0" >
        <div v-for="(item, index) in productivity.list"   :key="index" >
              <div class="col-xs-3 col-sm-2 col-md-2 col-lg-2 collaborator-profile" v-if="item!=null" >
                  <header v-show="item">
                    <span>[DIA - {{ item.day }}]</span>
                  </header>
                  <div class="information" >
                  <div  v-for="(items, indexx) in item.productivitys" :key="indexx" >
                      <span  class="profile" :title="items.time + '-' + items.description" >  {{ items.time }}-{{ items.description }}</span>
                  </div>
                  </div> 
               </div>     
        </div>
      </div>

    </div>
 </div>   
</template>

<script>
  import Navigation from '@/components/Navigation.vue'
  import Spinner from '@/components/SpinnerWrapper.vue'
  import { mapState, mapGetters } from 'vuex'
  import Vuetable from 'vuetable-2'
  import CssForBootstrap4 from './VuetableCssBootstrap4.js'
  import dateAndTime from '@/utils/dateAndTime.js'
  import BlockableButton from '@/components/buttons/blockableButton'
  // import constants from '@/const.js'

  export default {
    name: 'productivityCalendar',
    components: {
      Navigation,
      Spinner,
      Vuetable,
      CssForBootstrap4,
      BlockableButton
    },
    data () {
      return {
        month: 'SEPTIEMBRE',
        year: 2021,
        title: 'Mes desempeños',
        fullAccess: false,
        productivity: {
          list: [],
          loading: false,
          lastOne: false,
          page: 1
        },
        css: {
          table: {
            tableClass: 'table table-striped table-bordered table-hovered',
            loadingClass: 'loading',
            ascendingIcon: 'glyphicon glyphicon-chevron-up',
            descendingIcon: 'glyphicon glyphicon-chevron-down',
            handleIcon: 'glyphicon glyphicon-menu-hamburger'
          },
          pagination: {
            infoClass: 'pull-left',
            wrapperClass: 'vuetable-pagination pull-right',
            activeClass: 'btn-primary',
            disabledClass: 'disabled',
            pageClass: 'btn btn-border',
            linkClass: 'btn btn-border',
            icons: {
              first: '',
              prev: '',
              next: '',
              last: ''
            }
          }
        }
      }
    },
    created () {
      this.fullAccess = this.$can(this.$constants.ROLES.JEFES)
    },
    methods: {
      csvExport: function () {
        var csvContent = 'data:text/csv;charset=utf-8,'
        csvContent += this.productivity.list.map(function (d) {
          return JSON.stringify(d)
        })
        .join('\n')
        .replace(/({^\{)|(\}$)/mg, ';')
        window.open(encodeURI(csvContent))
      },
      fetch () {
        this.productivity.loading = true
        const action = (this.fullAccess)
          ? 'productivitys/fetchCalendarSector'
          : 'productivitys/fetchCalendarSector'
        const params = {
          ...((this.hasSelected) ? {userId: this.collaboratorSelected._id} : {userId: this.user.id}),
          ...((this.month !== '') ? {month: this.month} : {}),
          ...((this.year !== '') ? {year: this.year} : {}),
          page: this.productivity.page
        }
        this.$store.dispatch(action, params)
        .then(this.successFetch)
        .catch(this.failFetch)
      },
      successFetch (response) {
        if (response.productivitys.length === 0) {
          this.productivity.lastOne = true
        } else {
          this.productivity.list = response.productivitys
        }
        this.productivity.loading = false
      },
      failFetch () {
        this.$snotifyWrapper.error('Se produjo un error al buscar las desempeños')
        this.productivity.loading = false
      },
      notUpdate (dataModel) {
        return dataModel.loading || dataModel.lastOne
      },
      empty (dataModel) {
        return dataModel.list.length === 0 && !dataModel.loading
      }
    },
    computed: {
      emptyList () {
        return this.empty(this.productivity)
      },
      ...mapState('collaborators', [
        'collaboratorSelected'
      ]),
      ...mapState('auth', [
        'user'
      ]),
      ...mapGetters('collaborators', [
        'hasSelected'
      ]),
      headerBackground () {
        if (this.productivity.hasOwnProperty('date')) {
          if (dateAndTime.compareDate(new Date(), this.productivity.date) === 0) {
            return '#1e3773'
          }
          if (dateAndTime.compareDate(new Date(), this.productivity.date) > 0) {
            return '#3ecc1a'
          }
        }
        return 'red'
      },
      productivityType () {
        return (this.productivity.hasOwnProperty('type')
          ? `${this.$constants.MEETING_TYPE_READABLE[this.productivity.type]}`
          : '') +
          (this.productivity.frecuency
          ? ` -  ${this.$constants.MEETING_FRECUENCY[this.productivity.frecuency]}`
          : '')
      },
      productivityState () {
        return (this.productivity.hasOwnProperty('state')
          ? `${this.$constants.MEETING_STATE_READABLE[this.productivity.state]}`
          : '')
      }
    }
  }
</script>

<style lang="scss">
  @import "~@/assets/styles/_variables.scss";
  @import "~@/assets/styles/_mixins.scss";
  .container {
    position: relative;
    width: 90%;
    margin: 20px auto;
  }
  .spinner-container {
    margin: 25px 0;
  }
  .empty {
    font-size: 20px;
    text-align: center;
    margin-top: 20px;
  }
  .separator {
    height: 0;
    border-top: 3px solid $primary-color;
  }

   .collaborator-profile {
    margin: 16px 0;
    box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.3);

    &:hover {
      box-shadow: 0 2px 10px 2px rgba(0, 0, 0, 0.3);
    }

    header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      height: 30px;
      padding: 2px;
      border-style: solid;
      border-width: 2px;
      border-color:  #1125da;
      background-color: #69a0e0;
    }

    .information {
      position: relative;
      padding: 4px;
      height: 150px;
     text-align: left;
      color: black;
      font-size: 8px;
      border: 1px solid rgb(224, 85, 5);

      .profile {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        width: 100%;
        display: block;
        background-color: #a6d4e1;
        border: 2px solid white;
        position: relative;
      }

      p {
        margin-top: 4px;
        position: relative;
        top: -4.5vw;
        z-index: 4;
      }
    }
  }

  .relief {
    position: absolute;
    background-color: #552ab4;
    width: 100%;
    height: 100%;
    bottom: 0;
    left: 0;
    overflow: hidden;

    &.deactivated {
      background-color: $seguridad-primary;
    }

    .triangle1 {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 0 6rem 15rem;
      border-color: transparent transparent #007bff transparent;
      z-index: 2;

      &.deactivated {
        border-color: transparent transparent $seguridad-tertiary transparent;
      }
    }

    .triangle2 {
      position: absolute;
      width: 0;
      height: 0;
      left: -5rem;
      bottom: 0;
      border-style: solid;
      border-width: 0 8rem 6rem 8rem;
      border-color: transparent transparent #94ffca transparent;
      z-index: 1;

      &.deactivated {
        border-color: transparent transparent $seguridad-secondary transparent;
      }
    }
  }

  @media (min-width: 1400px) {
    .collaborator-profile {
      .information {
        .profile {
          width: 5.5vw;
          height: 5.5vw;
          top: -3vw;
        }

        p {
          top: -2.5vw;
        }
      }
    }
  }

  @media (max-width: 850px) {
    .collaborator-profile {
      .information {
        .profile {
          width: 15vw;
          height: 15vw;
          top: -8vw;
        }

        p {
          top: -7vw;
        }
      }
    }
  }
</style>