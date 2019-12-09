<template>
  <div class="tab-content collaborator-edition">
    <h3>Editar</h3>
    <div class="container-fluid">
      <profile-form
        :loading="$loading.isLoading('users update')"
        :collaborator="collaborator"
        @userFill="edit"
      ></profile-form>
    </div>
    <v-dialog></v-dialog>
  </div>
</template>

<script>
  import Spinner from '@/components/Spinner.vue'
  import ProfileForm from '@/components/profile/ProfileForm'
  import { mapState } from 'vuex'

  export default {
    name: 'collaborator-edition',
    components: {Spinner, ProfileForm},
    data () {
      return {
        collaborator: {}
      }
    },
    created: function () {
      this.$store.dispatch('users/fetchById', {id: this.$route.params.id})
        .then(
          () => {
            this.collaborator = this.user
            delete this.collaborator.notifications
          },
          () => {
            this.throwError()
          }
        )
    },
    methods: {
      edit (userData) {
        this.$modal.show('dialog', {
          text: `¿Esta seguro de guardar los cambios?`,
          buttons: [
            {
              title: 'Si',
              handler: () => {
                this.update(userData)
                this.$modal.hide('dialog')
              }
            },
            {
              title: 'No'
            }
          ]
        })
      },
      update (userData) {
        this.$store.dispatch('users/update', {user: userData.user})
          .then(
            (res) => {
              if (res.success) {
                this.$router.push({name: 'control-personal'})
                this.$snotifyWrapper.success('La actualización fue efectuada correctamente')
              } else {
                this.throwErrorValidation(res.message)
              }
            },
            () => {
              this.$snotifyWrapper.error('No hay conexión para procesar la operación')
            })
      },
      throwErrorValidation (msg) {
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
      },
      throwError () {
        this.$snotifyWrapper.error('No se encontro el colaborador')
      }
    },
    computed: {
      ...mapState('users', [
        'user'
      ])
    }
  }
</script>


<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .tab-content {
    position: relative;
  }

  h3 {
    background-color: #72ee55;
    color: #FFF;
    margin: 0;
    padding: 10px;
    font-weight: bold;
    font-size: 18px;
  }

</style>
