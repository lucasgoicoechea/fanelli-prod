<template>
  <transition name="modal">
    <div class="catalog-edit-element" v-show="haveElementEdit" @click="back">
      <div class="msg" @click.stop>
        <h2>Editar Elemento</h2>
        <div class="container-fluid">
          <div class="row" v-if="haveElementEdit">
            <div class="col-sm-5">
              <catalog-element :element="elementEdit.type"></catalog-element>
            </div>
            <div class="col-sm-7">
              <h3>Marcas Disponibles</h3>
              <p class="text-clarification">Presione la x para eliminar una marca</p>
              <div class="information">
                <ul>
                  <li v-for="e in getByType(elementEdit.type).models">
                    <div class="description">
                      <p>Marca: {{e.brand}}</p>
                      <p>Modelo: {{e.model}}</p>
                    </div>
                    <span
                      class="glyphicon glyphicon-remove-circle info-action"
                      @click="remove(e)"></span>
                  </li>
                </ul>
              </div>
              <h3 class="title-brand">Agregar Marca y Modelo</h3>
              <input v-model="brand" name="brand" placeholder="Marca">
              <input v-model="model" name="model" placeholder="Modelo">
              <input type="checkbox" id="checkbox" v-model="certified">
              <label for="checkbox">Certificado</label>
              <button @click="add">Agregar</button>
            </div>
          </div>
        </div>
        <footer>
          <div class="action" @click="back">
            <div class="icon-action">
              <span class="glyphicon glyphicon-arrow-left"></span>
            </div>
            <div class="text-action ta-left">
              <h4>Volver</h4>
            </div>
          </div>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import CatalogElement from './CatalogElement.vue'

  export default {
    components: {CatalogElement},
    name: 'CatalogEditElement',
    data () {
      return {
        brand: '',
        model: '',
        certified: false
      }
    },
    methods: {
      back () {
        this.clearInputs()
        this.$store.commit('catalog/editElement', {element: {}})
      },
      remove (obj) {
        this.$store.dispatch('catalog/deleteElement', {_id: obj._id})
      },
      add () {
        this.$store.dispatch('catalog/addElement', {
          brand: this.brand,
          model: this.model,
          certified: this.certified
        }).then(
          () => {
            this.$snotifyWrapper.success(this.$t('catalog_create_success'))
          },
          () => {
            this.$snotifyWrapper.error(this.$t('catalog_create_failure'))
          }
        )
        this.clearInputs()
      },
      clearInputs () {
        this.brand = ''
        this.model = ''
        this.certified = false
      }
    },
    computed: {
      ...mapState('catalog', [
        'elementEdit'
      ]),
      ...mapGetters('catalog', [
        'haveElementEdit',
        'getBrandsElement',
        'getByType'
      ])
    }
  }
</script>

<style lang="scss" scoped>

  @import "../../../assets/styles/variables";

  .catalog-edit-element {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 12;
    font-weight: bold;
    transition: opacity .3s ease;
  }

  .msg {
    position: relative;
    width: 90%;
    max-height: 85%;
    background-color: white;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.3);
    transition: all .3s ease;
  }

  h2 {
    text-align: center;
    margin: 20px 0 5px 0;
    color: $secondary-darker;
    font-weight: bold;
  }

  h3 {
    margin: 5px 0;
    color: $secondary-color;
    font-weight: bold;
  }

  footer {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: rgb(236, 110, 37);
    color: white;
    text-align: center;
    box-shadow: 0 -1px 1px rgba(0, 0, 0, 0.26);
  }

  input {
    position: relative;
    font-weight: 500;
    padding: 6px 2px;
    margin: 8px 0px;
    font-size: 16px;
    width: 100%;
    border: none;
    border-bottom: 2px solid #ec6e25;
  }

  input:focus {
    outline-color: #EC6E25;
  }

  input[type="checkbox"] {
    width: auto;
  }

  button {
    background-color: $primary-color;
    border: none;
    color: white;
    padding: 10px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    cursor: pointer;
    border-radius: 25px;
    min-width: 10vw;
    font-weight: bold;
    float: right;
  }

  button:hover {
    background-color: $primary-darker;
  }

  button:focus {
    outline: none;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin: 4px;
    position: relative;
    display: flex;
    justify-content: space-between;
  }

  .text-clarification {
    font-weight: normal;
    color: gray;
  }

  .title-brand {
    color: $primary-color;
  }

  .action {
    display: flex;
    justify-content: center;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    flex-grow: 0;
    flex-shrink: 0;
    padding: 10px;
    position: relative;
    font-size: 36px;
    color: #fff;
    float: left;

    > .text-action {
      display: inline-block;

      > h4 {
        color: white;
        font-weight: bold;
        margin: 10px;
      }
    }

    > .icon-action {
      display: inline;
      margin: auto 4px;
    }
  }

  .ta-left {
    text-align: left;
  }

  .ta-right {
    text-align: right;
  }

  .row {
    padding: 15px;
  }

  .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
  }

  .modal-enter .msg,
  .modal-leave-active .msg {
    -webkit-transform: scale(1.5);
    transform: scale(1.5);
  }

  .information {
    height: 150px;
    overflow-y: auto;
  }

  @media (max-width: 767px) {
    .msg {
      height: 80%;
      overflow-y: auto;
    }
  }

  .description {
    > p {
      margin: 0;
    }
  }

  .info-action {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    padding: 4px 15px;
    font-size: 20px;
  }

  .container-fluid {
    width: 80%;
  }

  @media (max-width: 599px)  {
    .container-fluid {
      width: 100%;
    }
  }

</style>
