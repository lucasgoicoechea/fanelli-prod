<template>
  <div class="collaborator-create">
    <navigation title="Crear colaborador"></navigation>
    <div class="container-fluid">
      <profile-form
        :loading="$loading.isLoading('users create')"
        @userFill="confirm"></profile-form>
    </div>
    <v-dialog></v-dialog>
  </div>
</template>

<script>
  import Spinner from '@/components/Spinner.vue'
  import ProfileForm from '@/components/profile/ProfileForm'
  import Navigation from '@/components/Navigation.vue'

  export default {
    name: 'collaborator-create',
    components: {
      Navigation,
      Spinner,
      ProfileForm
    },
    data () {
      return {}
    },
    methods: {
      create (userData) {
        this.$store.dispatch('users/create', {user: userData.user, image: userData.image})
          .then(
            (res) => {
              if (res.success) {
                this.$router.push({name: 'control-personal'})
                this.$snotifyWrapper.success('El usuario fue agregado exitosamente.')
              } else {
                this.throwError(res.message)
              }
            },
            () => {
              this.$snotifyWrapper.error('No hay conexión para procesar la operación')
            })
      },
      confirm (userData) {
        this.$modal.show('dialog', {
          text: `¿Esta seguro de agregar a este nuevo colaborador?`,
          buttons: [
            {
              title: 'Si',
              handler: () => {
                this.create(userData)
                this.$modal.hide('dialog')
              }
            },
            {
              title: 'No'
            }
          ]
        })
      },
      throwError (msg) {
        this.$modal.show('dialog', {
          text: msg,
          buttons: [
            {
              title: 'Aceptar',
              handler: () => {
                this.$modal.hide('dialog')
              }
            }
          ]
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

</style>
