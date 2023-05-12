<template>
  <div class="checklists-form">
    <navigation :title="title"></navigation>
    <section class="container-fluid">
      <div class="spinner-container">
        <spinner :show="$loading.isLoading('checklist fetch')" loadingMessage="Cargando checklist..."></spinner>
      </div>
      <div v-if="!$loading.isLoading('checklist fetch')">
        <check-item
          v-for="check in getSector(sector).checklist.checks"
          :key="check.check._id"
          :item="check"></check-item>

        <h5>Observaciones generales</h5>
        <p v-show="!checklistHasObservation(this.sector)">
          No hay observaciones generales por el momento.
        </p>
        <p v-for="observation in getSector(sector).checklist.observations" :key="observation._id">
          <span class="date">{{observation.date | moment('HH:mm')}}</span> {{ observation.observation }}
        </p>
        <p v-show="loadingObservation">Cargando ...</p>
        <div class="textarea">
        <textarea
          v-model="observation"
          placeholder="Escriba aquí una observación general del proceso"></textarea>
          <button @click="createObservation" :disabled="loadingObservation">
            <span v-if="!loadingObservation">Agregar</span>
            <spinner-little :show="loadingObservation"></spinner-little>
          </button>
        </div>
      </div>
    </section>
    <form-footer v-show="!$loading.isLoading('checklist fetch') && showFooter"></form-footer>
  </div>
</template>

<script>
  import Navigation from '../Navigation.vue'
  import CheckItem from './CheckItem.vue'
  import FormFooter from './FormFooter.vue'
  import SpinnerLittle from '../Spinner.vue'
  import Spinner from '@/components/SpinnerWrapper.vue'
  import { mapState, mapGetters } from 'vuex'

  export default {
    name: 'ChecklistForm',
    components: {
      Spinner,
      SpinnerLittle,
      Navigation,
      CheckItem,
      FormFooter
    },
    data () {
      return {
        title: 'Checklist ' + this.$route.params.sector,
        observation: '',
        loadingObservation: false,
        showFooter: true
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
        this.$store.dispatch('checklistsLTres/fetch', {sector})
        this.title = `Checklist ${this.$options.filters.capitalize(sector)}`
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
            checklist_id: this.getSector(this.sector).checklist._id
          }
          this.$store.dispatch('checklistsLTres/createObservation', {sector: this.sector, observation})
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
        'checklistsLTres', [
          'data',
          'loading'
        ]),
      ...mapGetters('checklistsLTres', [
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
