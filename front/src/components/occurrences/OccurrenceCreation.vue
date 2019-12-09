<template>
  <div class="occurrence-creation">
    <navigation
      :title="title"></navigation>

    <occurrence-form
      @occurrence-update="occurrenceUpdate"></occurrence-form>

    <bottom-navbar>
      <div class="submit">
        <div
          v-if="!$loading.isLoading('occurrences createOccurrence')"
          class="msg pointer"
          :class="notAllow"
          @click="confirm">
          <h5 class="items">Enviar Acontecimiento</h5>
          <span class="glyphicon glyphicon-send items icon-action"></span>
        </div>

        <div class="msg" v-else>
          <h5 class="items">Enviando Acontecimiento</h5>
          <spinner
            class="items"
            :show="$loading.isLoading('occurrences createOccurrence')"></spinner>
        </div>
      </div>

    </bottom-navbar>
  </div>
</template>

<script>
  import Navigation from '@/components/Navigation.vue'
  import BottomNavbar from '@/components/BottomNavbar.vue'
  import OccurrenceForm from '@/components/occurrences/OccurrenceForm'
  import Spinner from '@/components/SpinnerWrapper.vue'

  export default {
    name: 'OccurrenceCreation',
    components: {
      BottomNavbar,
      Navigation,
      OccurrenceForm,
      Spinner
    },
    data () {
      return {
        title: 'Acontecimientos',
        ocurrence: {},
        validation: {},
        occurrenceResult: null
      }
    },
    methods: {
      occurrenceUpdate (form) {
        this.occurrence = form.occurrence
        this.validation = form.validation
      },
      showModal ({title, msg}) {
        this.$modal.show('dialog', {
          title: title,
          text: msg,
          buttons: [{title: 'Aceptar'}]
        })
      },
      successfulCreation (res) {
        if (res.success) {
          this.occurrenceResult = res.occurrence
          this.$snotifyWrapper.success('El acontecimiento se ha creado con exito')
          this.$router.push({name: 'home'})
        } else {
          this.$snotifyWrapper.error(res.message)
        }
      },
      failedCreation () {
        this.occurrenceResult = {}
        this.$snotifyWrapper.warning('Se produjo un error. Intente nuevamente')
      },
      sendOccurrence () {
        this.$store.dispatch('occurrences/createOccurrence', this.occurrence)
          .then(this.successfulCreation)
          .catch(this.failedCreation)
      },
      confirm () {
        if (this.occurrenceResult !== null) {
          return
        }

        if (!this.validation.valid) {
          this.showModal({title: 'Completar', msg: this.validation.msg})
          return
        }

        this.$modal.show('dialog', {
          title: 'Confirmación',
          text: '¿Esta seguro de enviar este Acontecimiento?',
          buttons: [
            {
              title: 'Aceptar',
              handler: () => {
                this.$modal.hide('dialog')
                this.sendOccurrence()
              }
            },
            {
              title: 'Cancelar',
              handler: this.$modal.hide('dialog')
            }
          ]
        })
      }
    },
    computed: {
      notAllow () {
        return {
          'not-allow': this.occurrenceResult !== null
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/_variables.scss";
  @import "~@/assets/styles/_mixins.scss";

  .msg {
    display: flex;
    flex-direction: row;
    padding: 18px;

    &.pointer {
      cursor: pointer;
    }

    .items {
      padding: 0 5px;
      font-weight: bold;
    }

    .icon-action {
      font-size: 34px;
    }
  }

  .not-allow {
    color: #b2b2b2;
    cursor: not-allowed;
  }
</style>
