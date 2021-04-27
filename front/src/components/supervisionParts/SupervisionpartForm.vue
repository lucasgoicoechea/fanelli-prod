<template>
  <div class="supervisionparts-form">
    <navigation :title="title"></navigation>
    <section class="container-fluid">
      <div class="spinner-container">
        <spinner :show="$loading.isLoading('supervisionpart fetch')" loadingMessage="Cargando supervisionpart..."></spinner>
      </div>
       <supervisionpart-item
          v-for="hour in getSector(sector).supervisionpart.hours"
          :key="hour.hour._id" 
          :collapse="isNotLast(hour.hour.ordertime, getSector(sector).supervisionpart.hours.length)"
          :supervisionpart_id="getSector(sector).supervisionpart._id"
          :hour="hour"></supervisionpart-item> 
        <supervisionpart-materials     
          :materials=getSector(sector).supervisionpart.materials
          :supervisionpart_id=getSector(sector).supervisionpart._id
          :sector=sector
          :date=getSector(sector).supervisionpart.date
      ></supervisionpart-materials>     
      <div v-if="!$loading.isLoading('supervisionpart fetch')" class="observaciones">
        <h5>Observaciones generales</h5>
        <hr style="border: solid 1px;">
        <p v-if="!getSector(sector).supervisionpart.observations">
                    No hay observaciones generales.
        </p>
        <p v-for="(observationtmp,i) in getSector(sector).supervisionpart.observations" :key="i" >
          <span class="date">[{{observationtmp.date | moment('HH:mm')}}] {{ observationtmp.supervisor.lastname }} => </span> {{ observationtmp.observation }} 
        </p> 


        <p v-show="loadingObservation">Cargando ...</p>
        <div class="textarea">
        <textarea 
          style="width: 95%"
          v-model="observation"
          placeholder="Escriba aquí una observación general del proceso"></textarea>
          <button @click="createObservation" :disabled="loadingObservation">
            <span v-if="!loadingObservation">Agregar</span>
            <spinner-little :show="loadingObservation"></spinner-little>
          </button>
        </div>
      </div>
      <supervisionpart-reposition-pallets 
           v-show="sector=='DESAPILADORA'"
          :supervisionpart="getSector(sector).supervisionpart"
          :supervisionpart_id="getSector(sector).supervisionpart._id"
          :repositionPallets="getSector(sector).supervisionpart.repositionPallets"
          >
      </supervisionpart-reposition-pallets>
      <supervisionpart-form-total 
          :supervisionPart="getSector(sector).supervisionpart"
          >
      </supervisionpart-form-total>
    </section>
    <form-footer v-show="!$loading.isLoading('supervisionpart fetch') && showFooter"></form-footer>
  </div>
</template>

<script>
  import Navigation from '../Navigation.vue'
  import SupervisionpartItem from './SupervisionpartItem.vue'
  import SupervisionpartMaterials from '@/components/supervisionParts/SupervisionpartMaterials.vue'
  import SupervisionpartRepositionPallets from './SupervisionpartRepositionPallets'
  import SupervisionpartFormTotal from './SupervisionpartFormTotal.vue'
  import FormFooter from './FormFooter.vue'
  import SpinnerLittle from '../Spinner.vue'
  import Spinner from '@/components/SpinnerWrapper.vue'
  import { mapState, mapGetters } from 'vuex'

  export default {
    name: 'SupervisionpartForm',
    components: {
      Spinner,
      SpinnerLittle,
      Navigation,
      SupervisionpartFormTotal,
      SupervisionpartItem,
      SupervisionpartRepositionPallets,
      FormFooter,
      SupervisionpartMaterials
    },
    data () {
      return {
        title: 'Parte de Supervision - ' + this.$route.params.sector,
        observation: '',
        loadingObservation: false,
        showFooter: true,
        countHours: 0
      }
    },
    created () {
      this.init(this.sector)
      this.handleResizeAndInteractions()
    },
    beforeDestroy () {
      if (this.$mq === 'mobile' || this.$mq === 'iphone5' || this.$mq === 'tablet') {
        window.removeEventListener('focus', this.focusEvent)
        window.removeEventListener('blur', this.blurEvent)
      }
    },
    watch: {
      '$route.params.sector': function (sector) {
        this.init(sector)
      }
    },
    methods: {
      init (sector) {
        this.$store.dispatch('supervisionparts/fails', {sector})
        this.$store.dispatch('supervisionparts/fetch', {sector})
        this.title = `Supervisionpart ${this.$options.filters.capitalize(sector)}`
        // this.countHours = this.getSector(this.sector).supervisionpart.hours.length
      },
      loadFails: function () {
        return this.$store.dispatch('supervisionparts/fails')
      },
      isNotLast (order, countHour) {
        // console.log(order + '-' + countHour)
        return order < countHour
      },
      handleResizeAndInteractions () {
        if (/(android)/i.test(navigator.userAgent)) {
          window.addEventListener('resize', function () {
            if (document.activeElement.tagName === 'TEXTAREA') {
              window.setTimeout(function () {
                document.activeElement.scrollIntoView({behavior: 'instant', block: 'end', inline: 'nearest'})
              }, 0)
            }
          })
          if (this.$mq === 'mobile' || this.$mq === 'iphone5' || this.$mq === 'tablet') {
            window.addEventListener('focus', this.focusEventHandler, true)
            window.addEventListener('blur', this.blurEventHandler, true)
          }
        }
      },
      createObservation: function () {
        if (this.observation !== '') {
          this.loadingObservation = true
          const observation = {
            observation: this.observation,
            supervisionpart_id: this.getSector(this.sector).supervisionpart._id
          }
          this.$store.dispatch('supervisionparts/createObservation', {sector: this.sector, observation})
            .then(() => {
              this.loadingObservation = false
            })
          this.observation = ''
        }
      },
      focusEventHandler (event) {
        if (event.target.tagName === 'TEXTAREA') {
          this.showFooter = false
        }
      },
      blurEventHandler (event) {
        if (event.target.tagName !== 'TEXTAREA') {
          this.showFooter = true
        }
      }
    },
    computed: {
      sector: function () {
        return this.$route.params.sector
      },
      ...mapState(
        'supervisionparts', [
          'data',
          'loading'
        ]),
      ...mapGetters('supervisionparts', [
        'getSector',
        'checklistHasObservation'
      ])
    }

  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";
  @import "../../assets/styles/mixins";

  .loading {
    text-align: center;
    margin: 20px
  }

  h5 {
    color: $primary-color;
    font-weight: bold;
    padding: 15px 0 0 0;
  }

  .observaciones {
    position: relative;
    margin-top: 10px;
    border: 6px solid rgb(86, 123, 220);
    background-color: gainsboro;
  }

  .textarea {
    position: relative;
    border: 2px solid $secondary-darker;
    @include clearfix;
    textarea {
      width: 100%;
      border: none;
      padding: 10px;
      display: block;
      resize: vertical;
      min-height: 100px;
    }
    button {
      position: absolute;
      bottom: 5px;
      right: 5px;
      background: $primary-color;
      color: #ffffff;
      border: none;
      -webkit-border-radius: 15px;
      -moz-border-radius: 15px;
      border-radius: 15px;
      padding: 5px 15px;
      font-weight: bold;
    }
  }

  section {
    width: 80%;
  }

  @media (min-width: 600px) and (max-width: 1200px) {
    section {
      width: 90%;
    }
  }

  @media (max-width: 599px) {
    section {
      width: 100%;
    }
  }

  .date {
    font-family: monospace;
  }

  .spinner-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

</style>
