<template>
  <div class="tab-content profile-credentials">
    <h3>Credenciales de acceso</h3>
    <v-dialog></v-dialog>
    <div class="container-fluid">
      <div class="row" >
         <div v-if="!hasCredentials">
            <div class="col-xs-12 col-md-6 col-md-push-3 col-lg-4 col-lg-push-4" style="position : unset">
              <p>
                <button class="btn btn-block btn-lg btn-primary" @click="grantAccess()">Agregar</button>
              </p>
              <p class="text-muted text-center">
                Este usuario no tiene permisos de acceso, presione "AGREGAR" para proporcionarle nombre de usuario y contraseña
              </p>
           </div>
          </div>
          <div v-else>
            <form class="form-credentials">
            <div class="col-xs-12 col-md-6 col-md-push-3 col-lg-4 col-lg-push-4" style="position : unset">
              
                <p v-if="error" class="error">
                  <b>{{ error }}</b>
                </p>
                <div class="input-group">
                  <label>Rol</label>
                  <div class="select-style">
                    <select
                      v-model="user_type"
                      :class="{ 'has-error': $v.user_type.$error }">
                      <option v-for="value, key in $constants.USER_TYPE_READABLE" :value="key">{{ value }}</option>
                    </select>
                  </div>
                  <div class="validations" v-show="$v.user_type.$error">
                    <p class="has-error">Se debe llenar este campo</p>
                  </div>
                </div>
                <div class="input-group">
                  <label for="username">Nombre de usuario</label>
                  <input id="username" v-model="username"
                        autocomplete="off"
                        :class="{ 'has-error': $v.username.$error }"
                        @input="$v.username.$touch()"/>
                  <div class="validations" v-show="$v.username.$error">
                    <p class="has-error">No se puede utilizar espacios ni caracteres especiales </p>
                  </div>
                </div>
                <div class="input-group">
                  <label>Nueva contraseña</label>
                  <password v-model="password"></password>
                </div>
                <p>
                  <blockable-button
                                    title="guardar"
                                    :clickMethod="changeAuth"
                                    :isLoading="loading"
                                    buttonRadius="30px"
                                    buttonWidth="100%"
                                    buttonHeight="auto"
                                    buttonBackgroundColor="#6f99ee"
                                    color="white"
                                    class="print-button-resolved">Guardar</blockable-button>
                </p>
                <p>
                  <a class="btn btn-block text-center remove-button" @click="revokeAccess">
                    <img src="/static/img/trashwht.svg" alt="Tacho de basura"/>
                    Revocar acceso
                  </a>
                </p>
                <p class="text-muted text-center">
                  Para mantener la contraseña actual, debe dejar el campo sin completar
                </p>
            </div>
            <div class="col-xs-12 col-md-6 col-md-push-3 col-lg-4 col-lg-push-4" style="position : unset">
                  <p class = "perms">PERMISOS </p>
                  <div v-if="permsRol == null || permsRol.lenght == 0" >
                    SIN PERMISOS PARA ESE ROL
                  </div>
                  <div v-for="item in permsRol"   :key="item._id" > 
                    <span class="checkmark"><input
                      type="checkbox"
                      :checked="item.checked"
                      >
                   </span>
                    <span class="   ">{{ item.perm.description }}</span>
                  </div>
             </div> 
              </form>
           </div>
        </div>
      
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Password from '@/components/Password'
  import { SnotifyPosition } from 'vue-snotify'
  import BlockableButton from '@/components/buttons/blockableButton'
  import empty from '@/utils/empty'
  import Vue from 'vue'

  export default {
    name: 'ProfileCredentials',
    components: { Password, BlockableButton },
    data () {
      return {
        repeatPassword: '',
        showPassword: false,
        dirtyData: false,
        backup: null,
        permsRol: []
      }
    },
    methods: {
      resetData () {
        this.repeatPassword = ''
        this.showPassword = false
        this.dirtyData = false
        this.backup = null
      },
      updateItem (id) {

      },
      permss (value) {
        Vue.http.get('permissions/listPermsForRole?id=' + value)
        .then((response) => {
          this.permsRol = response.body.perrmissions
        })
      },
      revokeAccess () {
        this.dirtyData = false
        this.$modal.show('dialog', {
          text: '¿Desea quitar los privilegios de acceso para el usuario?',
          buttons: [
            {
              title: 'Si',
              handler: () => {
                this.$store.dispatch('users/revokeAuth', {id: this.user._id})
                this.$modal.hide('dialog')
              }
            },
            {
              title: 'No'
            }
          ]
        })
      },
      onChange () {
        if (!this.backup) {
          this.backup = {
            username: this.user.auth.username,
            password: this.user.auth.password,
            user_type: this.user.user_type
          }
        }
        this.backup = {
          user_type: this.user.user_type
        }
        console.log('No')
        this.dirtyData = true
      },
      grantAccess () {
        this.dirtyData = true
        this.$store.commit('users/setAuth', {username: '', password: '', user_type: null})
      },
      trowError () {
        this.$v.$touch()
        this.$modal.show('dialog', {
          text: 'No se puede utilizar espacios ni caracteres especiales.',
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
      changeAuth () {
        if (this.$v.$invalid) {
          this.trowError()
        } else {
          this.$modal.show('dialog', {
            text: '¿Desea guardar los nuevos datos de acceso para el usuario?',
            buttons: [
              {
                title: 'Si',
                handler: () => {
                  this.dirtyData = false
                  this.$store.dispatch('users/changeAuth', {
                    id: this.user._id,
                    auth: {
                      username: this.user.auth.username,
                      password: this.user.auth.password,
                      user_type: this.user.user_type,
                      perms: this.permsRol
                    }
                  }).then(
                    () => this.$snotify.success('Se actualizaron las credenciales exitosamente', {position: SnotifyPosition.centerTop}),
                    () => this.$snotify.error('Se produjo un error, intente nuevamente')
                  )
                  this.$modal.hide('dialog')
                }
              },
              {
                title: 'No'
              }
            ]
          })
        }
      }
    },
    computed: {
      ...mapState('users', [
        'user',
        'loading',
        'error'
      ]),
      hasCredentials: function () {
        return this.user !== undefined && this.user.auth !== undefined &&
          ((this.user.auth.username !== null && this.user.auth.username !== undefined) ||
            (this.user.auth.password !== null && this.user.auth.password !== undefined))
      },
      username: {
        get () {
          return this.$store.state.users.user.auth.username || ''
        },
        set (value) {
          this.onChange()
          this.$store.commit('users/setAuthUsername', value)
        }
      },
      password: {
        get () {
          return this.$store.state.users.user.auth.password || ''
        },
        set (value) {
          this.onChange()
          this.$store.commit('users/setAuthPassword', value)
        }
      },
      user_type: {
        get () {
          return this.$store.state.users.user.user_type || ''
        },
        set (value) {
          this.onChange()
          this.$store.commit('users/setUserType', value)
          this.permss(value)
        }
      }
    },
    beforeRouteLeave (to, from, next) {
      if (this.dirtyData) {
        this.$modal.show('dialog', {
          text: 'Los cambios no han sido guardados, ¿desea salir?',
          buttons: [
            {
              title: 'Volver',
              handler: () => {
                this.$modal.hide('dialog')
                next(false)
              }
            },
            {
              title: 'Salir sin guardar',
              handler: () => {
                this.resetData()
                this.$store.commit('users/resetCredentials')
                this.$modal.hide('dialog')
                next()
              }
            }
          ]
        })
      } else {
        next()
      }
    },
    validations: {
      username: {
        password (value) {
          const regex = /^[\w-]*$/
          return regex.test(value)
        },
        empty: empty.string
      },
      user_type: {
        empty: empty.string
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .save-button {
    background-color: #ee6f79;
    color: #FFF;
    border-radius: 30px;
    padding: 10px;
    font-weight: bold;
  }

  .perms {
    background-color: white;
    display : flex;
    margin-right: 40%;
    margin-top: 3%;
    margin-left: 35%;
    color: #909090;
  }

  .check {
    position: relative;
    display: block;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: #dadada;
    border-radius: 3px;
  }

  .remove-button {
    background-color: #ee4642;
    color: #FFF;
    border-radius: 30px;
    padding: 10px;
    font-weight: bold;
    img {
      width: 16px;
      height: 16px;
    }
  }

  h3 {
    background-color: #6f99ee;
    color: #FFF;
    margin: 0;
    padding: 10px;
    font-weight: bold;
    font-size: 18px;
  }

  p {
    margin-top: 10px;
  }

  .form-credentials {
    margin-top: 15px;
  }

  .help-text {
    img {
      width: 16px;
      height: 16px;
    }
  }

  .error {
    color: #FFFFFF;
    background-color: #ff716e;
    border-radius: 20px;
    padding: 10px;
    margin-top: 10px;
    text-align: center;
    font-weight: normal;
  }

  .input-group {
    padding: 10px;
    display: block;

    &:last-child {
    }

    label {
      text-transform: uppercase;
      color: #888;
    }

    /deep/ input {
      margin: 0;
      padding: 0;
    }

    input.has-error {
      color: red;
      margin-bottom: 2px;
      border-bottom: 3px solid red;
    }

    /deep/ .password-container {
      &.has-error {
        input {
          color: red;
          margin-bottom: 2px;
          border-bottom: 3px solid red;
        }

        &:focus {
          input {
            border-bottom: 3px solid #dd0000;
          }
        }
      }
    }

    .validations {
      .has-error {
        color: red;
        margin: 2px 0;
      }
    }

    /deep/ .password-container span {
      padding: 0 10px;
    }
  }

  /deep/ .vue-btn {
    border-radius: 100px;
    padding: 10px !important;
    font-weight: bold;
  }

  @media (min-width: 481px) {
    h3 {
      display: none;
    }
  }

</style>
