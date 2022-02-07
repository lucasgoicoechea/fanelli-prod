<template>
  <div class="form-view">
    <navigation :title="title"></navigation>
    <navigation-steps :step="step"></navigation-steps>
    <section>
      <transition name="slide-fade">
        <form-step-1 v-show="step === 1"></form-step-1>
      </transition>
      <form-step-2 v-show="step >= 2"></form-step-2>
      <transition name="fade">
        <form-confirm @confirm="confirmRequest" v-show="step === 3"></form-confirm>
      </transition>
      <transition name="fade">
        <form-edit @confirm="confirmEdit" v-show="step === 4"></form-edit>
      </transition>
    </section>
    <form-footer :step="step" @nextStep="onNextStep" v-show="!isCatalogEmpty"></form-footer>
  </div>
</template>

<script>
  import Navigation from '../Navigation.vue'
  import FormFooter from './FormFooter.vue'
  import FormElement from './FormElement.vue'
  import NavigationSteps from './NavigationSteps.vue'
  import FormStep1 from './FormStep1.vue'
  import FormStep2 from './FormStep2.vue'
  import FormConfirm from './FormConfirm.vue'
  import FormEdit from './FormEdit.vue'
  import { mapState, mapGetters } from 'vuex'

  export default {
    name: 'BugReportView',
    components: {
      Navigation,
      FormFooter,
      FormElement,
      NavigationSteps,
      FormStep1,
      FormStep2,
      FormConfirm,
      FormEdit
    },
    props: {
      edition: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        title: 'Listado de Fallas',
        step: 1
      }
    },
    created: function () {
      const fetchPromise = this.$store.dispatch('catalog/fetch')
      if (this.edition) {
        fetchPromise.then(() => {
          this.$store.dispatch('catalog/EPPEdition', {_id: this.$route.params.id})
            .catch(() => { this.notEditable() })
        })
      }
    },
    destroyed: function () {
      this.$store.commit('catalog/reset')
    },
    methods: {
      onNextStep (value) {
        this.step = value
      },
      confirmRequest (status) {
        if (status === 'cancel') {
          this.step = 2
        } else {
          this.step = 4
        }
      },
      confirmEdit (status) {
        if (status === 'edit') {
          this.step = 2
        } else {
          this.$store.commit('catalog/reset')
          this.$router.push({name: 'home'})
        }
      },
      notEditable () {
        this.$modal.show('dialog', {
          text: `El tiempo de edición de este pedido de EPP ha pasado.`,
          buttons: [
            {
              title: 'Aceptar',
              handler: () => {
                this.$modal.hide('dialog')
                this.$router.push({name: 'home'})
              }
            }
          ]
        })
      }
    },
    computed: {
      ...mapState('catalog', [
        'data',
        'toForm',
        'catalog'
      ]),
      ...mapGetters('catalog', [
        'isCatalogEmpty'
      ])
    }

  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  section {
    margin: 20px 0 80px 0;
  }

  /* Enter and leave animations can use different */
  /* durations and timing functions.              */
  .slide-fade-enter-active {
    transition: all .3s ease;
  }

  .slide-fade-leave-active {
    transition: all .3s ease;
  }

  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */
  {
    transform: translateX(10px);
    opacity: 0;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0
  }

</style>