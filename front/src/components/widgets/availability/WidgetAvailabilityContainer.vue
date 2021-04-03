<template>
  <div class="widget-availability-container">

    <spinner
      class="loading"
      :show="loading"></spinner>

    <div class="error" v-show="isEmpty && !loading">
      No hay elementos de disponibilidad para
      {{ (isAWeek) ? 'estos días' : 'este día' }}
    </div>

    <div v-show="!altasEmpty && !isAWeek" class="temporals">
      <h4 class="title">Altas</h4>
      <div
        class="collaborators"
        v-for="(availability, index) in altas">
        <widget-availability-card
          :key="index"
          :class="loadingStyle"
          :mode="cardMode"
          :availability="availability"></widget-availability-card>
      </div>
    </div>
    <button
          class="report-button"
          @click="getReportForDay">
          <span class="glyphicon glyphicon-download-alt" aria-hidden="true"></span>
          Generar reporte
     </button>
    <div v-show="!isAWeek && !todayEmpty">
      <h4 class="title">Diarias</h4>
      <!--<button
          class="report-button"
          @click="getReportForDay">
          <span class="glyphicon glyphicon-download-alt" aria-hidden="true"></span>
          Generar reporte
      </button> -->
      <div
        class="collaborators"
        v-for="(availability, index) in availabilities">
        <widget-availability-card
          :key="index"
          :class="loadingStyle"
          :mode="cardMode"
          :availability="availability"></widget-availability-card>
      </div>
    </div>


    <div
      v-show="isAWeek"
      v-for="(items, day) in groupByDays" :key="day">
      <h4 class="title">{{ day | capitalize }}</h4>
      <widget-availability-card
        v-for="(i, index) in items"
        :key="index"
        :class="loadingStyle"
        :mode="cardMode"
        :availability="i"></widget-availability-card>
    </div>

    <div v-show="!temporalsEmpty" class="temporals">
      <h4 class="title">Temporales</h4>
      <div
        class="collaborators"
        v-for="(availability, index) in temporals">
        <widget-availability-card
          :key="index"
          :class="loadingStyle"
          :mode="cardMode"
          :availability="availability"></widget-availability-card>
      </div>
    </div>

    <div v-show="!holidaysEmpty" class="temporals">
      <h4 class="title">Vacaciones </h4>
      <div
        class="collaborators"
        v-for="(availability, index) in holidays">
        <widget-availability-card
          :key="index"
          :class="loadingStyle"
          :mode="cardMode"
          :availability="availability"></widget-availability-card>
      </div>
    </div>
  </div>

</template>

<script>
  import Spinner from '@/components/SpinnerWrapper'
  import WidgetAvailabilityCard from '@/components/widgets/availability/WidgetAvailabilityCard'
  import pdf from '@/utils/pdf'

  export default {
    name: 'WidgetAvailabilityContainer',
    components: {
      Spinner,
      WidgetAvailabilityCard
    },
    props: {
      dateRange: {
        type: Object,
        default: () => {
          return {
            from: new Date(),
            to: new Date()
          }
        }
      },
      cardMode: {
        type: String,
        default: 'full'
      }
    },
    data () {
      return {
        availabilities: [],
        temporals: [],
        altas: [],
        holidays: [],
        temporalTypes: [
          'MEDICAL_ORDER',
          'MEDICAL_REPORT',
          'SHIFT_CHANGE',
          'SINDICAL_LICENSE',
          'DEATH_LICENSE',
          'UNION_LICENSE',
          'BIRTH_LICENSE'
        ],
        queuedRequests: 0
      }
    },
    created () {
      this.fetch()
    },
    methods: {
      successfulPrint (blob) {
        pdf.download(blob, 'report.xlsx')
      },
      errorPrint () {
        this.$snotifyWrapper.warning('Error de impresión. Intente nuevamente')
      },
      getReportForDay () {
        this.$store.dispatch('users/getAllReportDay', this.dateRangeBackendFormat.from)
          .then(this.successfulPrint)
          .catch(this.errorPrint)
      },
      fetch () {
        this.queuedRequests += 1
        this.$store.dispatch('widgets/fetchAvailability', this.dateRangeBackendFormat)
          .then((res) => {
            this.availabilities.length = 0
            this.availabilities = res.availability
            this.queuedRequests -= 1
            this.separate()
          })
          .catch(() => {
            this.queuedRequests -= 1
            if (this.queuedRequests === 0) {
              this.$snotifyWrapper.error(this.$t('error_fetch_backend'))
            }
          })
      },
      sameDay (d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
          d1.getMonth() === d2.getMonth() &&
          d1.getDate() === d2.getDate()
      },
      separate () {
        if (this.isAWeek) return

        this.temporals =
          this.availabilities.filter(a => this.temporalTypes.includes(a.type))

        this.holidays =
          this.availabilities.filter(a => a.type === 'HOLIDAYS')

        this.availabilities =
          this.availabilities.filter(a => !this.temporals.includes(a) && a.type !== 'HOLIDAYS')

        this.altas =
          this.temporals.filter(a => {
            return a.type !== 'SHIFT_CHANGE' && a.request.medicalDischarge &&
              this.sameDay(new Date(a.to), this.dateRange.from)
          })
        this.availabilities = this.availabilities.sort((a, b) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })
        this.temporals =
          this.temporals.filter(a => !this.altas.includes(a))
      }
    },
    watch: {
      dateRange: {
        handler () {
          this.fetch()
        },
        deep: true
      }
    },
    computed: {
      isEmpty () {
        return this.availabilities.length === 0 && this.temporals.length === 0
      },
      todayEmpty () {
        return this.availabilities.length === 0
      },
      temporalsEmpty () {
        return this.temporals.length === 0
      },
      holidaysEmpty () {
        return this.holidays.length === 0
      },
      altasEmpty () {
        return this.altas.length === 0
      },
      loading () {
        return this.queuedRequests !== 0
      },
      loadingStyle () {
        return {
          change: this.loading
        }
      },
      isAWeek () {
        let counter = this.dateRange.to.getTime() - this.dateRange.from.getTime()
        counter = counter / 1000 / 60 / 60 / 24
        return counter > 1
      },
      groupByDays () {
        this.availabilities = this.availabilities.sort((a, b) => {
          return new Date(a.from).getTime() > new Date(b.from).getTime()
        })
        const group = this.availabilities.reduce((total, item) => {
          const fromDate = new Date(item.from)
          const date = this.$moment(fromDate).format('dddd')
          const dateNumber = this.$moment(fromDate).format('DD-MM')
          const key = `${date} ${dateNumber}`
          total[key] = total[key] || []
          total[key].push(item)
          return total
        }, {})

        return group
      },
      dateRangeBackendFormat () {
        return {
          from: this.$moment(this.dateRange.from).utc().format('YYYY-MM-DD'),
          to: this.$moment(this.dateRange.to).utc().format('YYYY-MM-DD')
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

  .widget-availability-container {
    position: relative;
    padding: 5px;
    background-color: #dadada;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;

    div {
      position: relative;
    }
  }

  .error {
    padding: 20px;
    color: #000;
    text-align: center;
    transition: transform 0.2s ease;
  }

  .title {
    color: #404040;
    font-weight: bolder;
    margin: 15px 5px;
  }

  .loading {
    margin: 20px 0;
  }

  .change {
    opacity: 0.40;
  }

  .temporals {
    padding: 10px 0 40px 0;
  }
</style>
