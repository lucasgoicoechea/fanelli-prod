<template>
  <div class="Check-history">
    <navigation :title="title"></navigation>

    <div v-if="!validateDate" class="container-fluid">
      <section class="error">
        <h2>La fecha ingresada en la URL no es válida</h2>
        <h3>Por favor use el formato 'DD-MM-AAAA'</h3>
      </section>
    </div>

    <div v-else class="container-fluid">
      <header>
        <div class="day">
          <router-link :to="{ name: 'checklistsHistory', params: { date: prevDate}}">
            {{ prevDate | formatDate }}
          </router-link>
        </div>
        <div class="current">{{ date | formatDate }}</div>
        <div class="day">
          <router-link :to="{ name: 'checklistsHistory', params: { date: nextDate}}">
            {{ nextDate | formatDate }}
          </router-link>
        </div>
      </header>

      <tabs>
        <tab name="Resumen">
          <summary-view :date="date"></summary-view>
        </tab>
        <tab name="Detalle">
          <detail-view :date="date"></detail-view>
        </tab>
      </tabs>
    </div>
  </div>

</template>

<script>
  import Navigation from '@/components/Navigation.vue'
  import ChecklistSummaryView from '@/components/checklistsLTres/ChecklistSummaryView.vue'
  import ChecklistComparativeView from '@/components/checklistsLTres/ChecklistComparativeView.vue'
  import Tabs from '@/components/tabs/Tabs.vue'
  import Tab from '@/components/tabs/Tab.vue'
  import { mapGetters } from 'vuex'

  export default {
    name: 'CheckHistory',
    components: {
      Navigation,
      Tabs,
      Tab,
      summaryView: ChecklistSummaryView,
      detailView: ChecklistComparativeView
    },
    data () {
      return {
        title: 'Historial'
      }
    },
    methods: {},
    created () {
      this.title = `Historial ${this.formatedCurrentDate}`
    },
    updated () {
      this.title = `Historial ${this.formatedCurrentDate}`
    },
    computed: {
      date () {
        return this.$route.params.date
      },
      formatedCurrentDate () {
        return this.$moment(this.date, 'DD-MM-YYYY').format('DD-MM-YYYY')
      },
      prevDate () {
        return this.$moment(this.date, 'DD-MM-YYYY').subtract(1, 'days').format('DD-MM-YYYY')
      },
      nextDate () {
        return this.$moment(this.date, 'DD-MM-YYYY').add(1, 'days').format('DD-MM-YYYY')
      },
      validateDate () {
        return this.$moment(this.date, 'DD-MM-YYYY', true).isValid()
      },
      ...mapGetters(
        'checklistsLTres', [
          'getComparativeHeaders'
        ]
      )
    },
    filters: {
      formatDate (value) {
        if (!value) return ''
        return value.toString().substring(0, 5)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  header {
    display: flex;
    flex-direction: row;
    justify-content: center;

    .day {
      text-align: center;
      padding: 20px;
      cursor: pointer;
    }

    .current {
      text-align: center;
      margin: 10px 20px;
      font-size: x-large;
      font-weight: bold;
    }
  }

  .error {
    margin-top: 7rem;
    color: #696969;
    text-align: center;
  }

</style>

