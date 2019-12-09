<template>
  <div class="occurrence-edition">
    <navigation :title="title"></navigation>

    <section>
      <occurrence-form
        mode="edition"
        :editableOccurrence="fetchedOccurrence"
        @occurrence-update="occurrenceUpdate"></occurrence-form>
    </section>

    <bottom-navbar>
      <div class="submit">
        <div class="msg pointer" :class="notAllow" @click="confirm"
             v-if="!$loading.isLoading('occurrences editOccurrence')">
          <h5 class="items">Editar acontecimiento</h5>
          <span class="glyphicon glyphicon-send items icon-action"></span>
        </div>
        <div class="msg" v-else>
          <h5 class="items">Actualizando sanción</h5>
          <spinner class="items" :show="$loading.isLoading('occurrences editOccurrence')"></spinner>
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
  import OccurrenceForm from '@/components/occurrences/OccurrenceForm'

  export default {
    name: 'OccurrenceEdition',
    components: {
      BottomNavbar,
      Navigation,
      CollaboratorSelector,
      Spinner,
      OccurrenceForm
    },
    data () {
      return {
        title: 'Edición de acontecimiento',
        fetchedOccurrence: {},
        occurrence: {},
        validation: {},
        occurrenceResult: null
      }
    },
    created () {
      this.getDetails()
    },
    methods: {
      getDetails () {
        return this.$store.dispatch('occurrences/getDetail', {
          id: this.$route.params.id
        })
          .then((res) => {
            this.fetchedOccurrence = res.occurrence
            this.occurrence = res.occurrence
          })
          .catch(() => { this.$snotifyWrapper.error('Se produjo un error al obtener el acontecimiento') })
      },
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
      successfulEdition (res) {
        if (res.success) {
          this.occurrenceResult = res.occurrence
          this.$snotifyWrapper.success('El acontecimiento se ha editado con exito')
          this.$router.push({name: 'occurrence-detail', params: {id: this.occurrence._id}})
        } else {
          this.$snotifyWrapper.error(res.message)
        }
      },
      failedEdition () {
        this.$snotifyWrapper.warning('Se produjo un error. Intente nuevamente')
      },
      editOccurrence () {
        this.$modal.hide('dialog')
        this.occurrence._id = this.fetchedOccurrence._id
        this.$store.dispatch('occurrences/editOccurrence', this.occurrence)
          .then(this.successfulEdition)
          .catch(this.failedEdition)
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
          text: '¿Esta seguro de actualizar este acontecimiento?',
          buttons: [
            {
              title: 'Aceptar',
              handler: this.editOccurrence
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

</style>
