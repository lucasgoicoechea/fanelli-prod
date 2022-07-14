<template>
  <div class="treefails-form">
    <div class="inputs">
      <component
        :is="typeInput"
        v-for="(item, index) in items"
        :key="item._id"
        :item="item"
        :attribute="attribute"
        @update="update"
        @remove="remove"></component>
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
  import treefailsInput from '@/components/treefails/treeFailsInput'
  import treefailsShiftInput from '@/components/treefails/treeFailsShiftInput'
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
      }
    },
    data () {
      return {
        items: [],
        form: {
          value: '',
          description: ''
        },
        loader: false
      }
    },
    methods: {
      add () {
        const payload = {data: this.form}
        this.loader = true
        this.$store.dispatch('treefails/create', {
          attribute: this.attribute,
          payload: payload
        })
          .then((response) => {
            this.items.push(response.data)
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
      update (data) {
        const index = this.items.findIndex(e => e._id === data._id)
        this.items.splice(index, 1, data)
      },
      remove (data) {
        const index = this.items.findIndex(e => e._id === data._id)
        this.items.splice(index, 1)
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
          this.$store.dispatch('treefails/fetch', {attribute: this.attribute})
            .then((response) => { this.items = response.data })
            .catch(() => this.$snotifyWrapper.error('No se pudo recuperar la información'))
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
