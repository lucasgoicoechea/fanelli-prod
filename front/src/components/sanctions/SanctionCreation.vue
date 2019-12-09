<template>
  <div class="sanction-creation">
    <navigation :title="title"></navigation>

    <section>
      <sanction-form
        @sanction-update="sanctionUpdate"></sanction-form>
    </section>

    <bottom-navbar>
      <div class="submit">
        <div class="msg pointer" :class="notAllow" @click="confirm"
             v-if="!$loading.isLoading('sanctions createSanctions')">
          <h5 class="items">Enviar sanción</h5>
          <span class="glyphicon glyphicon-send items icon-action"></span>
        </div>
        <div class="msg" v-else>
          <h5 class="items">Enviando sanción</h5>
          <spinner class="items" :show="$loading.isLoading('sanctions createSanctions')"></spinner>
        </div>
      </div>
      <div class="print" v-show="sanctionResult !== null">
        <div class="msg pointer" @click="modalPrint" v-show="!loaderPrint">
          <span class="glyphicon glyphicon-print items icon-action"></span>
          <h5 class="items">Imprimir sanción</h5>
        </div>
        <div class="msg pointer" v-show="loaderPrint">
          <spinner class="items" :show="loaderPrint"></spinner>
          <h5 class="items">Imprimiendo</h5>
        </div>
      </div>
    </bottom-navbar>
  </div>
</template>

<script>
  import Navigation from '@/components/Navigation.vue'
  import BottomNavbar from '@/components/BottomNavbar.vue'
  import CollaboratorSelector from '@/components/selectors/collaborator/CollaboratorSelector.vue'
  import Spinner from '@/components/SpinnerWrapper.vue'
  import pdf from '@/utils/pdf'
  import SanctionForm from '@/components/sanctions/SanctionForm'

  export default {
    name: 'SanctionCreation',
    components: {
      SanctionForm,
      BottomNavbar,
      Navigation,
      CollaboratorSelector,
      Spinner
    },
    data () {
      return {
        title: 'Sanciones',
        sanction: {},
        validation: {},
        sanctionResult: null,
        loaderPrint: false
      }
    },
    methods: {
      sanctionUpdate (form) {
        this.sanction = form.sanction
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
          this.sanctionResult = res.sanction
          this.$snotifyWrapper.success('La sanción se ha creado con exito')
        } else {
          this.$snotifyWrapper.error(res.message)
        }
      },
      failedCreation () {
        this.$snotifyWrapper.warning('Se produjo un error. Intente nuevamente')
      },
      sendSanction () {
        this.$modal.hide('dialog')
        this.$store.dispatch('sanctions/createSanction', this.sanction)
          .then(this.successfulCreation)
          .catch(this.failedCreation)
      },
      confirm () {
        if (this.sanctionResult !== null) {
          return
        }

        if (!this.validation.valid) {
          this.showModal({title: 'Completar', msg: this.validation.msg})
          return
        }

        this.$modal.show('dialog', {
          title: 'Confirmación',
          text: '¿Esta seguro de enviar esta sanción?',
          buttons: [
            {
              title: 'Aceptar',
              handler: this.sendSanction
            },
            {
              title: 'Cancelar',
              handler: this.$modal.hide('dialog')
            }
          ]
        })
      },
      modalPrint () {
        this.$modal.show('dialog', {
          text: `¿Desea imprimir este sanción?`,
          buttons: [
            {
              title: 'Si',
              handler: () => {
                this.print()
                this.$modal.hide('dialog')
              }
            },
            {
              title: 'No',
              handler: () => {
                this.$modal.hide('dialog')
                this.$router.push({name: 'report-news'})
              }
            }
          ]
        })
      },
      successfulPrint (blob) {
        pdf.download(blob, 'sancion.pdf')
        this.loaderPrint = false
        this.$router.push({name: 'report-news'})
      },
      errorPrint () {
        this.loaderPrint = false
        this.$snotifyWrapper.warning('Error de impresión. Intente nuevamente')
      },
      print () {
        this.loaderPrint = true
        this.$store.dispatch('sanctions/printSanction', this.sanctionResult)
          .then(this.successfulPrint)
          .catch(this.errorPrint)
      }
    },
    computed: {
      notAllow () {
        return {
          'not-allow': this.sanctionResult !== null
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";
  @import "../../assets/styles/mixins";

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
    cursor: not-allowed !important;
  }

  @media (max-width: 599px) {
    .container-fluid {
      width: 100%;
    }
  }
</style>
