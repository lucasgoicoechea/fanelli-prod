<template>
  <div class="treefails-form">
    <div class="action" v-show="attribute !== 'linea' || father_id !== 'null'" @click="cambiar()">
      <div class="icon-action">
        <span class="glyphicon glyphicon-arrow-left"> Volver al padre</span>
      </div>
    </div>
    <div class="inputs">
      <div v-for="(item, index) in items" :key="item._id">
      <component
        :is="typeInput"
        :item="item"
        :attribute="attribute"
        :father_id="father_id">
        </component>
      <button @click="selectFather(item)" v-show="fattribute!='partes'">
        <span v-show="!loader">HIJOS</span>
        <spinner :show="loader" size="small"></spinner>
      </button>
       </div>
    </div>

    <div class="create">
      <h3>Agregar otra</h3>
      <input
        type="text"
        v-model="form.value"
        placeholder="Escriba una nueva"
        @keyup.enter="add">

      <input
        type="text"
        v-show="isShift"
        v-model="form.description"
        placeholder="Escriba una descripción"
        @keyup.enter="add">

      <button @click="add">
        <span v-show="!loader">AGREGAR</span>
        <spinner :show="loader" size="small"></spinner>
      </button>
    </div>
  </div>
</template>

<script>
  import treeFailsInput from '@/components/fails/treefails/TreeFailsInput'
  import treeFailsShiftInput from '@/components/fails/treefails/TreeFailsShiftInput'
  import Spinner from '@/components/SpinnerWrapper'
  export default {
    name: 'treeFailsForm',
    components: {
      treefailsInput: treeFailsInput,
      shiftInput: treeFailsShiftInput,
      Spinner
    },
    props: {
      attribute: {
        type: String,
        required: true
      },
      father: {
        type: String,
        required: true
      },
      father_id: {
        type: String,
        required: false
      },
      prefather_id: {
        type: String,
        required: false
      },
      isAttributteSelect: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        items: [],
        form: {
          value: '',
          description: ''
        },
        loader: false,
        fatherSelected: {
          type: String,
          required: true
        },
        hasAttributteSelect: {
          type: Boolean,
          default: false
        },
        fattribute: {
          type: String,
          required: true
        }
      }
    },
    created () {
      this.hasAttributteSelect = this.isAttributteSelect
      this.selectFather(null)
    },
    methods: {
      add () {
        const payload = {data: this.form}
        payload.data.father_id = this.$parent.father_id
        payload.data.attribute = this.$parent.attribute
        // this.items[0].father_id
        this.loader = true
        this.$store.dispatch('bugReport/createFails', {
          attribute: this.attribute,
          payload: payload
        })
          .then((response) => {
            this.items.push(response.failed)
            this.form.value = ''
            this.form.description = ''
            this.loader = false
            this.$snotifyWrapper.success('Se ha agregado exitosamente')
          })
          .catch((error) => {
            this.loader = false
            this.$snotifyWrapper.error(error)
          })
      },
      selectFather (data) {
        this.hasAttributteSelect = false
        let vfather = (data !== null) ? data._id : null
        this.$parent.prefather_id = this.$parent.father_id
        this.$parent.father_id = vfather
        this.$parent.arrPrefather[this.$parent.indexPrefather + 1] = vfather
        this.$parent.indexPrefather = this.$parent.indexPrefather + 1
        this.$store.dispatch('bugReport/getFailsForFather', {father: vfather})
            .then((response) => {
              this.items = response.faileds
              this.$parent.attribute = this.items[0].attribute
              this.fattribute = this.$parent.attribute
            })
            .catch(() => this.$snotifyWrapper.error('No se pudo recuperar la información'))
      },
      cambiar () {
        this.hasAttributteSelect = false
        this.$parent.father_id = this.$parent.arrPrefather[this.$parent.indexPrefather - 1]
        this.$parent.prefather_id = this.$parent.arrPrefather[this.$parent.indexPrefather - 2]
        this.$parent.indexPrefather = this.$parent.indexPrefather - 1
        this.$store.dispatch('bugReport/getFailsForFather', {father: this.$parent.father_id})
            .then((response) => {
              this.items = response.faileds
              this.$parent.attribute = this.items[0].attribute
              this.fattribute = this.$parent.attribute
            })
            .catch(() => this.$snotifyWrapper.error('No se pudo recuperar la información'))
      }
    },
    computed: {
      typeInput () {
        return this.attribute !== 'shift'
          ? 'treefailsInput'
          : 'shiftInput'
      },
      isShift () {
        return this.attribute === 'shift'
      }
    },
    watch: {
      attribute: {
        immediate: true,
        handler () {
          // console.log(this.father_id)
          if (this.hasAttributteSelect) {
            this.$store.dispatch('bugReport/getFailsForFather', {father: null})
              .then((response) => { this.items = response.faileds })
              .catch(() => this.$snotifyWrapper.error('No encuentra hijos para ese padre'))
          }
          this.hasAttributteSelect = true
        }
      },
      father_id: {
        immediate: true,
        handler () {
          // console.log(this.father_id)
          this.$store.dispatch('bugReport/getFailsForFather', {father: this.father_id})
              .then((response) => { this.items = response.faileds })
              .catch(() => this.$snotifyWrapper.error('No encuentra hijos para ese padre'))
        }
      }
    }
  }
</script>
<style lang="scss" scoped>

  .treefails-form {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
  }

  .create {
    margin: 40px 0 0 0;

    h3 {
      font-weight: bold;
      color: #5D5C5C;
      margin: 20px 0;
    }

    input {
      position: relative;
      border-bottom: 1px solid #707070;
      color: #3B3B3B;
      margin: 10px 0;
      width: 100%;
      padding: 4px;
      background-color: transparent;

      &:focus {
        outline-color: transparent;
      }
    }

    button {
      display: inline-block;
      position: relative;
      margin: 20px 5px 10px 5px;
      float: right;
      color: white;
      font-size: large;
      font-weight: bold;
      padding: 10px 20px;
      border: none;
      min-width: 120px;
      background-color: #0DD428;
      border-radius: 33px;
    }
  }

</style>
