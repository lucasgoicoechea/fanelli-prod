<template>
  <div
    class="treefails-input">
    <input
      class="items"
      type="text"
      v-model="itemEditable.text"
      :disabled="loader"
      @keyup.enter="confirmUpdate"
      @focusout="confirmUpdate"
      ref="inlineInput">

    <div class="actions">
      <img
        @click.stop="confirmRemove"
        v-show="!loader"
        src="/static/img/trash-icon.svg"
        alt="eliminar">
      <img
        @click="buttonUpdate"
        v-show="!loader"
        src="/static/img/pencilgrey.svg"
        alt="editar">
      <spinner
        class="loader"
        :show="loader"></spinner>
    </div>
  </div>
</template>

<script>
  import Spinner from '@/components/SpinnerWrapper'

  export default {
    components: {Spinner},
    name: 'treeFailsInput',
    props: {
      item: {
        type: Object
      },
      attribute: {
        type: String
      },
      father_id: {
        type: String
      }
    },
    data () {
      return {
        itemEditable: {},
        loader: false
      }
    },
    watch: {
      item: {
        immediate: true,
        deep: true,
        handler () {
          this.init()
        }
      }
    },
    methods: {
      init () {
        this.itemEditable = JSON.parse(JSON.stringify(this.item))
      },
      update () {
        this.loader = true
        if (!this.isUpdated) {
          return
        }
        console.log(this.itemEditable)
        let data = this.itemEditable
        this.$store.dispatch('bugReport/updateFail', data)
            .then((response) => {
              // const index = this.items.findIndex(e => e._id === data._id)
              // this.items.splice(index, 1)
              this.$emit('update', response.data)
              this.$snotifyWrapper.success('cambios guardados')
              this.loader = false
            })
            .catch(() => this.$snotifyWrapper.error('No se pudo actualizar la falla'))
      },
      remove () {
        let vfather = (this.itemEditable !== null) ? this.itemEditable._id : null
        this.$store.dispatch('bugReport/removeFail', {_id: vfather})
            .then((response) => {
              const index = this.$parent.items.findIndex(e => e._id === vfather)
              this.$parent.items.splice(index, 1)
            })
            .catch(() => this.$snotifyWrapper.error('No se pudo eliminar el hijo'))
      },
      confirmRemove () {
        this.$modal.show('dialog', {
          title: 'Eliminación',
          text: '¿Desea eliminar este campo?',
          buttons: [
            {
              title: 'Aceptar',
              handler: () => {
                this.remove()
                this.$modal.hide('dialog')
              }
            },
            {
              title: 'Cancelar',
              handler: () => {
                this.$modal.hide('dialog')
              }
            }
          ]
        })
      },
      confirmUpdate () {
        if (!this.isUpdated) {
          return
        }
        this.$modal.show('dialog', {
          title: 'Modificación',
          text: '¿Desea modificar este campo?',
          buttons: [
            {
              title: 'Aceptar',
              handler: () => {
                this.update()
                this.$modal.hide('dialog')
              }
            },
            {
              title: 'Cancelar',
              handler: () => {
                this.init()
                this.$modal.hide('dialog')
              }
            }
          ]
        })
      },
      buttonUpdate () {
        this.$nextTick(() => this.$refs.inlineInput.focus())
        this.confirmUpdate()
      }
    },
    computed: {
      isUpdated () {
        return this.item.value !== this.itemEditable.value
      }
    }
  }
</script>
<style lang="scss" scoped>

  .treefails-input {
    position: relative;
    margin: 10px 0;
    display: flex;
    flex-direction: row;
  }

  input {
    position: relative;
    border-bottom: 1px solid #707070;
    font-size: 18px;
    color: #3B3B3B;
    margin: 0;
    width: 100%;
    padding: 10px 4px;
    background-color: transparent;
  }

  input:focus {
    outline-color: transparent;
    background-color: #FAFAFA;
    border-radius: 4px;
    border-bottom: 1px solid transparent;
    box-shadow: 0 4px 15px -4px rgba(0, 0, 0, 0.15);
  }

  .actions {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;

    img {
      margin: 0 4px;
      height: 25px;
      width: 25px;
      cursor: pointer;
    }
  }

  .loader {
    margin: 0 12px;
    position: relative;
    bottom: 5px;
  }

</style>
