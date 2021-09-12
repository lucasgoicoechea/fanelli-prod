<template>
  <div class="supervisionpart-totales-view">
    <section>
      <div class="container-fluid">
        <div class="row">
           <div class="col-xs-12 detail"  >   
            <div  >
              <div class="title">
               <div class="shifts">
                 TOTAL DIA
                </div>
              </div>
                <div>
               <vuetable 
                  ref="vuetableTotales"
                  :api-mode="false"
                  :fields="campos"
                  :data="this.supervisionpartTotales"
                  pagination-path=""
                  :css="css.table"
                ></vuetable>
              </div>  
            </div>
          </div>         
          <div class="col-xs-12 detail"  >   
            <div  >
              <div class="title">
               <div class="shifts">
                 TOTAL TURNOS
                </div>
              </div>
                <div>
               <vuetable 
                  ref="vuetableTurnosTotales"
                  :api-mode="false"
                  :fields="camposTurnos"
                  :data="this.supervisionpartTurnosTotales"
                  pagination-path=""
                  :css="css.table"
                ></vuetable>
              </div>  
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import Spinner from '@/components/Spinner'
  import Vuetable from 'vuetable-2'
  import CssForBootstrap4 from './VuetableCssBootstrap4.js'
  import {mapState, mapGetters} from 'vuex'
  import Const from '@/const'

  export default {
    name: 'SupervisionpartTotalesView',
    components: {
      Spinner,
      Vuetable,
      CssForBootstrap4
    },
    props: {
      date: {
        type: String,
        required: false
      }
    },
    data () {
      return {
        current: '',
        loading: true,
        supervisionpartTotales: [],
        supervisionpartTurnosTotales: [],
        campos: [
          {
            name: 'material',
            title: 'Material',
            callback: function (value) {
              return '<b>' + value + ' </b>'
            }
          },
          {
            name: 'pallets',
            title: 'Pallet'
          },
          {
            name: 'toneladas',
            title: 'Toneladas'
          }
        ],
        camposTurnos: [
          {
            name: 'turno',
            title: 'Turno'
          },
          {
            name: 'sector',
            title: 'Sector',
            callback: function (value) {
              return '<b>Extrusora</b>'
            }
          },
          {
            name: 'carros',
            title: 'Carros'
          },
          {
            name: 'tiempoExtrusora',
            title: 'Tiempo'
          },
          {
            name: 'material',
            title: 'Material',
            callback: function (value) {
              return '<b>' + value + ' </b>'
            }
          },
          {
            name: 'maquina',
            title: 'Maquina'
          },
          {
            name: 'pesoLadrillo',
            title: 'Peso Ladrillo'
          },
          {
            name: 'toneladasExtrusora',
            title: 'Toneladas'
          },
          {
            name: 'sector',
            title: 'Sector',
            callback: function (value) {
              return '<b>Desapiladora</b>'
            }
          },
          {
            name: 'material',
            title: 'Material',
            callback: function (value) {
              return '<b>' + value + ' </b>'
            }
          },
          {
            name: 'pallets',
            title: 'Cantidad Pallets'
          },
          {
            name: 'ladrillosPallet',
            title: 'Ladrillos Pallet'
          },
          {
            name: 'pesoLadrillo',
            title: 'Peso Ladrillo'
          },
          {
            name: 'toneladasDesapiladora',
            title: 'Toneladas'
          },
          {
            name: 'tiempoDesapiladora',
            title: 'Tiempo'
          },
          {
            name: 'palletReposicion',
            title: 'Pallet Reposicion'
          },
          {
            name: 'sector',
            title: 'Sector',
            callback: function (value) {
              return '<b>Apiladora</b>'
            }
          },
          {
            name: 'vagonetas',
            title: 'Vagonetas'
          },
          {
            name: 'material',
            title: 'Material',
            callback: function (value) {
              return '<b>' + value + ' </b>'
            }
          },
          {
            name: 'toneladasApiladora',
            title: 'Vagonetas'
          }
        ],
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
    methods: {
      isNotLast (order, countHour) {
        // console.log(order + '-' + countHour)
        return order < countHour
      },
      currentStyle (header) {
        return {
          current: header.schedule === this.current && !this.date
        }
      },
      init () {
        if (this.validateDate) {
          this.loading = true
          this.$store.dispatch('supervisionparts/totales', {date: this.convertedDate})
            .then(this.successFetch)
            .catch(this.catchError)
          this.current = Const.currentSchedule().value
        }
      },
      successFetch (response) {
        this.supervisionpartTotales = response.totales
      },
      catchError () {
        return Promise.reject()
      }
    },
    created () {
      this.init()
    },
    watch: {
      date () {
        this.init()
      }
    },
    computed: {
      ...mapState(
        'supervisionparts', [
        ]),
      ...mapGetters(
        'supervisionparts', [
        ]
      ),
      validateDate () {
        if (this.isCurrentDate) {
          return true
        }
        return this.$moment(this.date, 'DD-MM-YYYY', true).isValid()
      },
      isCurrentDate () {
        return !this.date
      },
      convertedDate () {
        if (this.isCurrentDate) {
          return this.$moment(new Date(), 'DD-MM-YYYY').utc().format('YYYY-MM-DD')
        }
        return this.$moment(this.date, 'DD-MM-YYYY').utc().format('YYYY-MM-DD') // Date format for the backend
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .checklist-history-view {
    margin: 20px 0;
  }

  .title {
    border-bottom: 3px solid $secondary-darker;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 8px 0;

    > h2 {
      display: inline-block;
      margin: 2px 0;
      padding: 0;
      color: $primary-color;
      font-weight: bold;
    }

    .shifts {
      display: flex;
      justify-content: space-between;
      flex-wrap: nowrap;

      > span {
        min-width: 55px;
        text-align: center;
        font-size: x-large;
        margin: 4px 8px;
        font-weight: bold;
        padding: 2px;

      }
    }
  }

  .current {
    background-color: $primary-color;
    color: white;
  }

  .detail {
    margin: 15px 0;
  }

  .loading {
    text-align: center;
    margin: 20px;

    .spinner {
      font-size: xx-large;
    }
  }

  .observations {
    h3 {
      font-weight: bold;
    }

    h4 {
      color: $primary-color;
      font-weight: bold;
      border-bottom: 2px solid $secondary-color;
    }

    .itemObservations {
      display: flex;
      justify-content: space-between;
      margin: 2px 0;

      span {
        font-weight: bold;
        font-family: monospace;
      }

      .informer {
        color: $primary-color;
        font-weight: bold;
      }
    }
  }

  .observaciones {
    position: relative;
    margin-top: 10px;
    border: 6px solid blueviolet;
  }

  .container-fluid {
    width: 70%;
  }

  @media (min-width: 600px) and (max-width: 1200px) {
    .container-fluid {
      width: 80%;
    }
  }

  @media (max-width: 599px) {
    .container-fluid {
      width: 100%;
    }
  }
</style>
