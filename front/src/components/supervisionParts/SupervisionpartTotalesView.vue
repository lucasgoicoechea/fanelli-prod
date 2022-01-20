<template>
  <div class="supervisionpart-totales-view">
    <section>
      <div class="container-fluid">
        <div class="row" >
            <button class="redirect" @click="generateReport">
              <div>
                <span class="glyphicon glyphicon-download-alt"></span>
                <span class="text">Generar reporte</span>
              </div>
            </button>
        </div>
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
        </div>  

              <div class="title">
               <div class="shifts">
                 TOTAL TURNOS
                </div>
              </div>
      <div class="row">      
          <div class="col-xs-12 detail"  >   
            <div  >
                <div>
               <vuetable 
                  ref="vuetableTurnosTotales"
                  :api-mode="false"
                  :fields="camposExtrusora"
                  :data="this.supervisionpartExtrusora"
                  pagination-path=""
                  :css="css.table"
                ></vuetable>
              </div>  
            </div>
          </div>
        </div>
        <div class="row">      
          <div class="col-xs-12 detail"  >   
            <div  >
                <div>
               <vuetable 
                  ref="vuetableTurnosTotales"
                  :api-mode="false"
                  :fields="camposDesapiladora"
                  :data="this.supervisionpartDesapiladora"
                  pagination-path=""
                  :css="css.table"
                ></vuetable>
              </div>  
            </div>
          </div>
        </div>
        <div class="row">      
          <div class="col-xs-12 detail"  >   
            <div>
                <div>
               <vuetable 
                  ref="vuetableTurnosTotales"
                  :api-mode="false"
                  :fields="camposApiladora"
                  :data="this.supervisionpartApiladora"
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
  import pdf from '@/utils/pdf'
  import Const from '@/const'
  import dateAndTime from '@/utils/dateAndTime.js'

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
        supervisionpartExtrusora: [],
        supervisionpartDesapiladora: [],
        supervisionpartApiladora: [],
        campos: [
          {
            name: 'material',
            title: 'Tipo Ladrillo',
            callback: function (value) {
              return '<b>' + value + ' </b>'
            }
          },
          {
            name: 'unidades',
            title: 'Pallets'
          },
          {
            name: 'toneladas',
            title: 'Toneladas'
          }
        ],
        camposExtrusora: [
          {
            name: 'fecha',
            title: 'Fecha',
            callback: function (value) {
              return dateAndTime.dateDayAndMonth(new Date(value))
            }
          },
          {
            name: 'turno',
            title: 'Turno'
          },
          {
            name: 'schedule',
            title: 'Turno Dia'
          },
          {
            name: 'sectorExtrusora',
            title: 'Sector',
            callback: function (value) {
              return '<b>Extrusora</b>'
            }
          },
          {
            name: 'unidades',
            title: 'Carros'
          },
          {
            name: 'material',
            title: 'Material',
            callback: function (value) {
              return '<b>' + value + ' </b>'
            }
          },
          {
            name: 'machine',
            title: 'Extrusora'
          },
          {
            name: 'tiempoMarcha',
            title: 'Tiempo Trabajo'
          },
          /* {
            name: 'pesoLadrillo',
            title: 'Peso Ladrillo'
          }, */
          {
            name: 'toneladas',
            title: 'Toneladas',
            callback: function (value) {
              value = (value === 0) ? 0 : ((value / 1000).toFixed(2))
              return '<b>' + value + ' </b>'
            }
          }
        ],
        camposDesapiladora: [
          {
            name: 'fecha',
            title: 'Fecha',
            callback: function (value) {
              return dateAndTime.dateDayAndMonth(new Date(value))
            }
          },
          {
            name: 'turno',
            title: 'Turno'
          },
          {
            name: 'schedule',
            title: 'Turno Dia'
          },
          {
            name: 'sectorDesapiladora',
            title: 'Sector',
            callback: function (value) {
              return '<b>Desapiladora</b>'
            }
          },
          {
            name: 'unidades',
            title: 'Pallets'
          },
          {
            name: 'material',
            title: 'Material'
          },
          {
            name: 'tiempoMarcha',
            title: 'Tiempo Trabajo'
          },
          /* {
            name: 'ladrilloPorPallet',
            title: 'Ladrillo Por Pallet'
          },
          {
            name: 'pesoLadrillo',
            title: 'Peso Del Ladrillo'
          }, */
          {
            name: 'toneladas',
            title: 'Toneladas',
            callback: function (value) {
              value = (value === 0) ? 0 : ((value / 1000).toFixed(2))
              return '<b>' + value + ' </b>'
            }
          }
          /* ,
          {
            name: 'palletReposicion',
            title: 'Pallet Repos'
          } */
        ],
        camposApiladora: [
          {
            name: 'fecha',
            title: 'Fecha',
            callback: function (value) {
              return dateAndTime.dateDayAndMonth(new Date(value))
            }
          },
          {
            name: 'turno',
            title: 'Turno'
          },
          {
            name: 'schedule',
            title: 'Turno Dia'
          },
          {
            name: 'sectorApiladora',
            title: 'Sector',
            callback: function (value) {
              return '<b>Apiladora</b>'
            }
          },
          {
            name: 'unidades',
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
            name: 'tiempoMarcha',
            title: 'Tiempo Trabajo'
          },
          {
            name: 'toneladas',
            title: 'Toneladas',
            callback: function (value) {
              value = (value === 0) ? 0 : ((value / 1000).toFixed(2))
              return '<b>' + value + ' </b>'
            }
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
      successfulPrint (blob) {
        pdf.download(blob, 'report.xlsx')
      },
      errorPrint () {
        this.$snotifyWrapper.warning('Error de impresión. Intente nuevamente')
      },
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
        this.supervisionpartTotales = []
        if (this.validateDate) {
          this.loading = true
          this.$store.dispatch('supervisionparts/totales', {date: this.convertedDate})
            .then(this.successFetch)
            .catch(this.catchError)
          this.$store.dispatch('supervisionparts/totalesApiladora', {date: this.convertedDate})
            .then(this.successApiladoraFetch)
            .catch(this.catchError)
          this.$store.dispatch('supervisionparts/totalesDesapiladora', {date: this.convertedDate})
            .then(this.successDesapiladoraFetch)
            .catch(this.catchError)
          this.$store.dispatch('supervisionparts/totalesExtrusora', {date: this.convertedDate})
            .then(this.successExtrusoraFetch)
            .catch(this.catchError)
          this.current = Const.currentSchedule().value
        }
      },
      successFetch (response) {
        if (response.totales.length === 0) {
          this.supervisionpartTotales = []
        } else {
          response.totales.forEach(e => {
            this.supervisionpartTotales.push(e)
          })
        }
        this.loading = false
      },
      successDesapiladoraFetch (response) {
        this.supervisionpartDesapiladora = response.totales
      },
      successApiladoraFetch (response) {
        this.supervisionpartApiladora = response.totales
      },
      successExtrusoraFetch (response) {
        this.supervisionpartExtrusora = response.totales
      },
      catchError () {
        console.dir('entro')
        return Promise.reject()
      },
      generateReport () {
        this.$store.dispatch('supervisionparts/getAllReportDay', this.convertedDate)
          .then(this.successfulPrint)
          .catch(this.errorPrint)
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
    border: 6px solid rgb(211, 54, 216);
  }

  .container-fluid {
    --width: 70%;
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
