<template>
  <div class="collaborator-form">
    <form v-on:submit.prevent="save">
      <div class="row">
        <div class="col-md-6">
          <div class="row">
            <div class="col-xs-12 picture">
              <div class="edition" v-if="creation">
                <croppa v-model="croppa"
                        :width="250"
                        :height="250"
                        :quality="2"
                        :prevent-white-space="true"
                        :zoom-speed="7"
                        placeholder="Seleccione una Foto"
                        placeholder-color="white"
                        :placeholder-font-size="16"
                        canvas-color="transparent"
                        :show-remove-button="true"
                        remove-button-color="#0d0a62"
                        :show-loading="true"
                        :loading-size="50"
                        loading-color="#606060">
                </croppa>
                <div class="btns">
                  <a @click="croppa.rotate()"><span class="glyphicon glyphicon-repeat mirror"></span></a>
                  <a @click="croppa.rotate(-1)"><span class="glyphicon glyphicon-repeat"></span></a>
                </div>
              </div>

              <div class="basic-information">
                <div>
                  <label for="name">Nombres</label>
                  <input
                    v-model="user.name"
                    id="name"
                    :class="{ 'has-error': $v.user.name.$error }"
                    @input="$v.user.name.$touch()"
                    placeholder="Juan Agusto"
                    autocomplete="off">
                  <div class="validations" v-show="$v.user.name.$error">
                    <p class="has-error"
                       v-for="(params, validation) in $v.user.name.$params"
                       v-show="!$v.user.name[validation]">
                      {{ formErrorMsg[validation](params) }}
                    </p>
                  </div>
                </div>

                <div>
                  <label for="lastname">Apellidos</label>
                  <input
                    v-model="user.lastname"
                    id="lastname"
                    :class="{ 'has-error': $v.user.lastname.$error }"
                    @input="$v.user.lastname.$touch()"
                    placeholder="Perez Sanz"
                    autocomplete="off">
                  <div class="validations" v-show="$v.user.lastname.$error">
                    <p class="has-error"
                       v-for="(params, validation) in $v.user.lastname.$params"
                       v-show="!$v.user.lastname[validation]">
                      {{ formErrorMsg[validation](params) }}
                    </p>
                  </div>
                </div>

                <div>
                  <label for="legajo">Legajo</label>
                  <input
                    type="number"
                    v-model="user.legajo"
                    id="legajo"
                    placeholder="0000"
                    :class="{ 'has-error': $v.user.legajo.$error }"
                    @input="$v.user.legajo.$touch()"
                    autocomplete="off">
                  <div class="validations" v-show="$v.user.legajo.$error">
                    <p class="has-error"
                       v-for="(params, validation) in $v.user.legajo.$params"
                       v-show="!$v.user.legajo[validation]">
                      {{ formErrorMsg[validation](params) }}
                    </p>
                  </div>
                </div>

                <div>
                  <label for="birthdate">Fecha de Nacimiento</label>
                  <input-date
                    v-model="user.birthdate"
                    id="birthdate"
                    placeholder="02-03-1980"
                    :error="$v.user.birthdate.$error"
                    @input="$v.user.birthdate.$touch()">
                  </input-date>
                  <div class="validations" v-show="$v.user.birthdate.$error">
                    <p class="has-error"
                       v-for="(params, validation) in $v.user.birthdate.$params"
                       v-show="!$v.user.birthdate[validation]">
                      {{ formErrorMsg[validation](params) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-xs-12">
              <div>
                <label for="dni" class="text-uppercase">Documento</label>
                <input
                  type="number"
                  v-model="user.dni"
                  id="dni"
                  :class="{ 'has-error': $v.user.dni.$error }"
                  @input="$v.user.dni.$touch()"
                  placeholder="87654321"
                  autocomplete="off">
                <div class="validations" v-show="$v.user.dni.$error">
                  <p class="has-error"
                     v-for="(params, validation) in $v.user.dni.$params"
                     v-show="!$v.user.dni[validation]">
                    {{ formErrorMsg[validation](params) }}
                  </p>
                </div>
              </div>

              <div>
                <label for="cuil">CUIL</label>
                <input
                  v-model="user.cuil"
                  id="cuil"
                  placeholder="20-20202303-7"
                  :class="{ 'has-error': $v.user.cuil.$error }"
                  v-mask="'##-########-#'"
                  @input="$v.user.cuil.$touch()"
                  autocomplete="off">
                <div class="validations" v-show="$v.user.cuil.$error">
                  <p class="has-error"
                     v-for="(params, validation) in $v.user.cuil.$params"
                     v-show="!$v.user.cuil[validation]">
                    {{ formErrorMsg[validation](params) }}
                  </p>
                </div>
              </div>

              <div>
                <label for="address">Dirección</label>
                <input
                  v-model="user.address"
                  id="address"
                  placeholder="Av 160, La Plata"
                  :class="{ 'has-error': $v.user.address.$error }"
                  @input="$v.user.address.$touch()"
                  autocomplete="off">
                <div class="validations" v-show="$v.user.address.$error">
                  <p class="has-error"
                     v-for="(params, validation) in $v.user.address.$params"
                     v-show="!$v.user.address[validation]">
                    {{ formErrorMsg[validation](params) }}
                  </p>
                </div>
              </div>

              <div>
                <label for="phone">Telefono móvil</label>
                <input
                  v-model="user.phone"
                  id="phone"
                  placeholder="221 6543210"
                  :class="{ 'has-error': $v.user.phone.$error }"
                  @input="$v.user.phone.$touch()"
                  autocomplete="off">
                <div class="validations" v-show="$v.user.phone.$error">
                  <p class="has-error"
                     v-for="(params, validation) in $v.user.phone.$params"
                     v-show="!$v.user.phone[validation]">
                    {{ formErrorMsg[validation](params) }}
                  </p>
                </div>
              </div>
              <div>
                <label for="landlinePhone">Telefono fijo</label>
                <input
                  v-model="user.landlinePhone"
                  id="landlinePhone"
                  placeholder="0221 4445555"
                  :class="{ 'has-error': $v.user.landlinePhone.$error }"
                  @input="$v.user.landlinePhone.$touch()"
                  autocomplete="off">
                <div class="validations" v-show="$v.user.landlinePhone.$error">
                  <p clas="has-error"
                     v-for="(params, validation) in $v.user.landlinePhone.$params"
                     v-show="!$v.user.landlinePhone[validation]">
                    {{ formErrorMsg[validation](params) }}
                  </p>
                </div>
              </div>
              <div>
                <label for="email">Correo electrónico</label>
                <input
                  v-model="user.email"
                  id="email"
                  type="email"
                  placeholder="ejemplo@ejemplo.com"
                  :class="{ 'has-error': $v.user.email.$error }"
                  @input="$v.user.email.$touch()"
                  autocomplete="off">
                <div class="validations" v-show="$v.user.email.$error">
                  <p clas="has-error"
                     v-for="(params, validation) in $v.user.email.$params"
                     v-show="!$v.user.email[validation]">
                    {{ formErrorMsg[validation](params) }}
                  </p>
                </div>
              </div>

              <div>
                <label for="nationality">Nacionalidad</label>
                <input
                  v-model="user.nationality"
                  id="nationality"
                  :class="{ 'has-error': $v.user.nationality.$error }"
                  @input="$v.user.nationality.$touch()"
                  autocomplete="off">
                <div class="validations" v-show="$v.user.nationality.$error">
                  <p class="has-error"
                     v-for="(params, validation) in $v.user.nationality.$params"
                     v-show="!$v.user.nationality[validation]">
                    {{ formErrorMsg[validation](params) }}
                  </p>
                </div>
              </div>

              <div>
                <label for="civil_status">Estado civil</label>
                <input
                  v-model="user.civil_status"
                  id="civil_status"
                  :class="{ 'has-error': $v.user.civil_status.$error }"
                  @input="$v.user.civil_status.$touch()"
                  autocomplete="off">
                <div class="validations" v-show="$v.user.civil_status.$error">
                  <p class="has-error"
                     v-for="(params, validation) in $v.user.civil_status.$params"
                     v-show="!$v.user.civil_status[validation]">
                    {{ formErrorMsg[validation](params) }}
                  </p>
                </div>
              </div>

              <div>
                <label for="incorporation_date">Fecha de Incorporación</label>
                <input-date
                  v-model="user.incorporation_date"
                  id="incorporation_date"
                  placeholder="02-03-1980"
                  :error="$v.user.incorporation_date.$error"
                  @input="$v.user.incorporation_date.$touch()">
                </input-date>
                <div class="validations" v-show="$v.user.incorporation_date.$error">
                  <p class="has-error"
                     v-for="(params, validation) in $v.user.incorporation_date.$params"
                     v-show="!$v.user.incorporation_date[validation]">
                    {{ formErrorMsg[validation](params) }}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div><!-- v-if="creation"> -->
            <div>
              <label for="area">Área</label>
              <select v-model="user.area._id" id="area">
                <option :value="null">Seleccione un área</option>
                <option v-for="a in areas" :key="a._id" :value="a._id">{{a.value}}</option>
              </select>
              <div class="validations" v-show="$v.user.area.$error">
                <p class="has-error"
                   v-for="(params, validation) in $v.user.area.$params"
                   v-show="!$v.user.area[validation]">
                  {{ formErrorMsg[validation](params) }}
                </p>
              </div>
            </div>
            <div>
              <label for="sector">Sector</label>
              <select v-model="user.sector._id" id="sector">
                <option :value="null">Seleccione un sector</option>
                <option v-for="s in sectors" :key="s._id" :value="s._id"> {{s.value}}</option>
              </select>
              <div class="validations" v-show="$v.user.sector.$error">
                <p class="has-error"
                   v-for="(params, validation) in $v.user.sector.$params"
                   v-show="!$v.user.sector[validation]">
                  {{ formErrorMsg[validation](params) }}
                </p>
              </div>
            </div>
            <div>
              <label for="position">Puesto</label>
              <select v-model="user.position._id" id="position">
                <option :value="null">Seleccione un puesto</option>
                <option v-for="p in positions" :key="p._id" :value="p._id"> {{p.value}}</option>
              </select>
              <div class="validations" v-show="$v.user.position.$error">
                <p class="has-error"
                   v-for="(params, validation) in $v.user.position.$params"
                   v-show="!$v.user.position[validation]">
                  {{ formErrorMsg[validation](params) }}
                </p>
              </div>
            </div>
            <div>
              <label for="shift">Turno</label>
              <select
                v-model="user.shift._id"
                id="shift">
                <option :value="null">Seleccione un turno</option>
                <option v-for="shift in shifts" :key="shift._id" :value="shift._id">
                  {{shift.value}} - {{ shift.description}}
                </option>
              </select>
              <div class="validations" v-show="$v.user.shift.$error">
                <p class="has-error"
                   v-for="(params, validation) in $v.user.shift.$params"
                   v-show="!$v.user.shift[validation]">
                  {{ formErrorMsg[validation](params) }}
                </p>
              </div>
            </div>
            <div>
              <label for="line">Línea</label>
              <select
                v-model="user.line._id"
                id="line">
                <option :value="null">Seleccione una línea</option>
                <option v-for="line in lines" :key="line._id" :value="line._id">{{line.value}}</option>
              </select>
              <div class="validations" v-show="$v.user.line.$error">
                <p class="has-error"
                   v-for="(params, validation) in $v.user.line.$params"
                   v-show="!$v.user.line[validation]">
                  {{ formErrorMsg[validation](params) }}
                </p>
              </div>
            </div>
          </div>
          <div class="form-buttons">
            <button type="button" @click="reset">Descartar</button>
            <button class="active" :disabled="loading">
              <spinner :show="loading"></spinner>
              <span v-show="!loading">Guardar</span>
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
  import Const from '@/const'
  import { required, numeric, maxLength, minLength, alpha, email } from 'vuelidate/lib/validators'
  import InputDate from '@/components/InputDate'
  import Spinner from '@/components/SpinnerWrapper'

  export default {
    name: 'collaborator-form',
    components: {Spinner, InputDate},
    props: {
      collaborator: {
        type: Object,
        default: () => ({
          _id: null,
          ord: null,
          legajo: null,
          name: null,
          lastname: null,
          address: null,
          phone: null,
          birthdate: null,
          cuil: null,
          nationality: null,
          civil_status: null,
          area: {_id: null},
          sector: {_id: null},
          position: {_id: null},
          shift: {_id: null},
          category: null,
          union: null,
          incorporation_date: null,
          dni: null,
          line: {_id: null},
          email: null,
          landlinePhone: null
        })
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        title: '',
        user: {},
        userLastEdit: {},
        hasChange: false,
        croppa: {},
        creation: true,
        formErrorMsg: Const.formErrorMsg,
        shifts: [],
        positions: [],
        sectors: [],
        areas: [],
        lines: []
      }
    },
    validations: {
      user: {
        name: {
          required,
          maxLength: maxLength(25),
          minLength: minLength(3)
        },
        lastname: {
          required,
          maxLength: maxLength(25),
          minLength: minLength(2)
        },
        legajo: {
          numeric,
          required,
          isUnique (value) {
            if (value === '') return true
            if (this.edition && this.userLastEdit.legajo === value) {
              return true
            }
            return this.$store.dispatch('users/existLegajo', {legajo: value})
              .then(
                (payload) => { return payload },
                () => { return Promise.resolve(true) }
              )
          }
        },
        dni: {
          required,
          numeric,
          isUnique (value) {
            if (value === '') return true
            if (this.edition && this.userLastEdit.dni === value) {
              return true
            }
            return this.$store.dispatch('users/existDni', {dni: value})
              .then(
                (payload) => { return payload },
                () => { return Promise.resolve(true) }
              )
          }
        },
        cuil: {
          required,
          fixedLength (value) {
            return value !== null &&
              value !== undefined &&
              value.hasOwnProperty('length') &&
              value.length === 13
          }
        },
        birthdate: {
          required
        },
        address: {
          required,
          maxLength: maxLength(40)
        },
        phone: {
          required,
          maxLength: maxLength(40)
        },
        landlinePhone: {
          maxLength: maxLength(40)
        },
        email: {
          email
        },
        nationality: {
          required,
          alpha,
          maxLength: maxLength(30)
        },
        civil_status: {
          required,
          alpha,
          maxLength: maxLength(30)
        },
        incorporation_date: {
          required
        },
        area: {},
        sector: {},
        position: {},
        shift: {},
        line: {}
      }
    },
    created: function () {
      Object.keys(this.$constants.FABRIC_ATTRIBUTE)
        .forEach((k) => {
          this.$store.dispatch('fabric/fetch', {attribute: k})
            .then(response => { this[`${k}s`] = response.data })
            .catch(() => this.$snotifyWrapper.error('Error al recuperar la información de los turnos'))
        })
      this.reset()
    },
    methods: {
      test12 (event) {
        console.log('event', event.target.value)
        this.user.shift = event.target.value
      },
      /**
       * delete attribute that not changed, to not submit to edition
       */
      clear (obj) {
        const o = JSON.parse(JSON.stringify(obj))
        Object.keys(o).forEach((key) => {
          if (o[key] === null) {
            delete o[key]
          }
          if (o[key] !== undefined && o[key].hasOwnProperty('_id') && o[key]._id === null) {
            delete o[key]
          }
          if (o[key] !== undefined && o[key].hasOwnProperty('_id')) {
            o[key] = o[key]._id
          }
        })
        return o
      },
      save () {
        this.$v.$touch()
        if (this.$v.$invalid) {
          this.$modal.show('dialog', {
            text: `Hay campos con valores incompletos, corrija e intente de nuevo`,
            buttons: [
              {
                title: 'Aceptar',
                handler: () => {
                  this.$modal.hide('dialog')
                }
              }
            ]
          })
        } else {
          const vm = this
          if (this.creation) {
            this.croppa.promisedBlob('image/jpeg', 0.8).then(function (blob) {
              vm.$emit('userFill', {user: vm.clear(vm.user), image: blob})
            })
          } else {
            vm.$emit('userFill', {user: vm.clear(vm.user)})
          }
        }
      },
      reset () {
        let initProps = {
          area: {_id: null},
          sector: {_id: null},
          position: {_id: null},
          line: {_id: null},
          shift: {_id: null}
        }
        this.user = JSON.parse(JSON.stringify(this.collaborator))
        this.userLastEdit = JSON.parse(JSON.stringify(this.collaborator))
        this.user = Object.assign(initProps, this.user)
        this.creation = this.collaborator._id === null
      }
    },
    watch: {
      user: {
        handler: function () {
          this.hasChange = JSON.stringify(this.user) !== JSON.stringify(this.userLastEdit)
        },
        deep: true
      },
      collaborator: function () {
        this.reset()
      }
    },
    computed: {
      edition: function () {
        return !this.creation
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .col-md-6 {
    padding: 1% 5%;
  }

  input, /deep/ .input-date input {
    margin: 0 0 15px 0;
    padding: 1px 0;
    font-size: large;
    border-bottom: 3px solid $secondary-color;
    color: #000;

    &::placeholder {
      color: #cccccc;
    }

    &:focus {
      outline: none;
      border-color: $secondary-darker;
    }

    &[type=number], &[type=date] {
      font-family: monospace;
    }

    &[readonly] {
      opacity: 0.3;
    }

    &.has-error {
      margin-bottom: 2px;
      border-bottom: 3px solid red;

      &:focus {
        border-bottom: 3px solid #dd0000;
      }
    }
  }

  label {
    margin: 0;
    color: #989898;
    text-transform: uppercase;
  }

  select {
    width: 100%;
    padding: 4px 8px;
    border: 3px solid $secondary-color;
    border-radius: 6px;
    background-color: white;
    outline: none;
    cursor: pointer;
    margin: 2px 0 15px 0;
    font-size: large;
    color: #000;
  }

  select[disabled] {
    opacity: 0.3;
  }

  button {
    margin: 16px;
    padding: 6px 16px;
    text-decoration: none;
    border: none;
    border-radius: 50px;
    color: white;
    background-color: #aaaaaa;
    font-weight: bold;
    font-size: large;
    outline: none;
  }

  .active {
    background-color: $secondary-color;
  }

  hr {
    margin: 10px;
    border: 2px solid $secondary-color;
  }

  .picture {
    display: flex;
    flex-direction: row;
  }

  .basic-information {
    flex-grow: 1;
  }

  .edition {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 20px;

    a {
      border-radius: 0;
      margin: 5px;
      color: white;
      cursor: pointer;
      padding: 2px 14px;
      background-color: $secondary-darker;
      box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.3);
    }
  }

  .validations {
    margin: 0 0 10px 0;
    p {
      color: red;
      margin: 2px 0;
    }
  }

  @media (max-width: 550px) {
    .picture {
      flex-direction: column;
    }
  }

  .form-buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .btns {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 5px;
  }

  .croppa-container {
    align-self: center;
    position: relative;
    background-color: #c3c3c3;
  }

  .croppa-container:hover {
    opacity: 1;
    background-color: #909090;
  }

  .mirror {
    transform: scale(-1, 1);
  }

  .container {
    margin: 20px auto;
  }

  .modal-save {
    margin: 0;
    padding: 20px;
    color: $secondary-color;

    h3 {
      font-weight: bold;
      margin: 0;
    }

    h4 {
      margin: 20px 0;
    }

    .modal-buttons {
      display: flex;
      flex-direction: row;
      justify-content: center;

      a {
        outline: none;
        text-decoration: none;
        cursor: pointer;
        color: white;
        background-color: $secondary-color;
        font-size: large;
        font-weight: bold;
        padding: 5px 10px;
        border-radius: 50px;
        min-width: 20%;
        margin: 0 16px;
        text-align: center;
      }
    }
  }

  /deep/ .spinner-wrraper {
    width: auto;
    padding: 2px 10px;
  }

</style>
