<template>
  <div class="meeting-edition">
    <navigation :title="title"></navigation>

    <section>
      <form-component
        mode="edition"
        :editable="fetched"
        @update="update"></form-component>
    </section>

    <bottom-navbar>
      <div class="submit">
        <div
          v-if="!loading"
          class="msg pointer"
          @click="confirm">
          <h5 class="items">Editar reunión</h5>
          <span class="glyphicon glyphicon-send items icon-action"></span>
        </div>

        <div class="msg" v-else>
          <h5 class="items">Editando reunión</h5>
          <spinner
            class="items"
            :show="loading"></spinner>
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
  import FormComponent from '@/components/meeting/MeetingForm'

  export default {
    name: 'MeetingEdition',
    components: {
      BottomNavbar,
      Navigation,
      CollaboratorSelector,
      Spinner,
      FormComponent
    },
    data () {
      return {
        title: 'Reuniones',
        fetched: {},
        form: {},
        validation: {},
        loading: false,
        fetchStoreAction: 'meetings/getDetail',
        editStoreAction: 'meetings/edit'
      }
    },
    created () {
      this.getDetails()
    },
    methods: {
      getDetails () {
        return this.$store.dispatch(this.fetchStoreAction, {
          id: this.$route.params.id
        })
          .then((res) => {
            this.fetched = res.meeting
            this.form = res.meeting
          })
          .catch(() => { this.$snotifyWrapper.error('Se produjo un error al obtener la reunión') })
      },
      update (data) {
        this.form = data.form
        this.validation = data.validation
      },
      showModal ({title, msg}) {
        this.$modal.show('dialog', {
          title: title,
          text: msg,
          buttons: [{title: 'Aceptar'}]
        })
      },
      successfulEdition (res) {
        this.loading = false
        if (res.success) {
          this.$snotifyWrapper.success('La reunión se ha editado con exito')
          this.$router.push({name: 'meeting-detail', params: {id: this.form._id}})
        } else {
          this.$snotifyWrapper.error(res.message)
        }
      },
      failedEdition () {
        this.loading = false
        this.$snotifyWrapper.warning('Se produjo un error. Intente nuevamente')
      },
      edit () {
        this.loading = true
        this.$modal.hide('dialog')
        this.form._id = this.fetched._id
        this.form.state = this.fetched.state
        this.$store.dispatch(this.editStoreAction, this.form)
          .then(this.successfulEdition)
          .catch(this.failedEdition)
      },
      confirm () {
        if (this.loading) {
          return
        }

        if (!this.validation.valid) {
          this.showModal({title: 'Completar', msg: this.validation.msg})
          return
        }

        this.$modal.show('dialog', {
          title: 'Confirmación',
          text: '¿Esta seguro de actualizar esta reunion?',
          buttons: [
            {
              title: 'Aceptar',
              handler: this.edit
            },
            {
              title: 'Cancelar',
              handler: this.$modal.hide('dialog')
            }
          ]
        })
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
