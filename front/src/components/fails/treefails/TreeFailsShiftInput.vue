<template>
  <div
    class="treefails-shift-input">
    <div class="inputs">
      <input
        class="items"
        type="text"
        v-model="itemEditable.value"
        :disabled="loader || isProtected"
        @keyup.enter="confirmUpdate"
        placeholder="Turno"
        ref="inlineInput">
      <input
        class="items"
        type="text"
        v-model="itemEditable.description"
        :disabled="loader || isProtected"
        placeholder="Ingrese una Descripción"
        @keyup.enter="confirmUpdate">
    </div>

    <div class="actions">
      <img
        @click.stop="confirmRemove"
        v-show="!loader && !isProtected"
        src="/static/img/trash-icon.svg"
        alt="eliminar">
      <img
        @click="buttonUpdate"
        v-show="!loader && !isProtected"
        src="/static/img/pencilgrey.svg"
        alt="editar">
      <spinner
        class="loader"
        :show="loader"></spinner>
      <img
        v-show="isProtected"
        src="/static/img/lock.svg"
        alt="candado">
    </div>
  </div>
</template>

<script>
  import Spinner from '@/components/SpinnerWrapper'

  export default {
    components: {Spinner},
    name: 'treeFailsShiftInput',
    props: {
      item: {
        type: Object
      },
      attribute: {
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
        const payload = {
          data: this.itemEditable
        }
        this.$store.dispatch('bugReport/updateFailed', {
          attribute: this.attribute,
          payload: payload
        })
          .then((response) => {
            this.$emit('update', response.data)
            this.loader = false
          })
          .catch((error) => {
            this.$snotifyWrapper.error(error)
            this.loader = false
          })
      },
      remove () {
        this.$store.dispatch('bugReport/removeFail', {
          attribute: this.attribute,
          payload: this.itemEditable
        })
          .then(() => {
            this.$emit('remove', this.itemEditable)
          })
          .catch((error) => this.$snotifyWrapper.error(error))
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
        return this.item.value !== this.itemEditable.value ||
          this.item.description !== this.itemEditable.description
      },
      isProtected () {
        return Object.keys(this.$constants.PROTECTED_SHIFT)
          .map(t => this.$constants.PROTECTED_SHIFT[t])
          .includes(this.item.value)
      }
    }
  }
</script>
<style lang="scss" scoped>

  .treefails-shift-input {
    position: relative;
    margin: 16px 0;
    display: flex;
    flex-direction: row;
    background-color: #f1f1f1;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0px 2px 4px -2px rgba(0,0,0,0.3);
  }

  input {
    position: relative;
    border-bottom: 1px solid #707070;
    font-size: 18px;
    color: #3B3B3B;
    margin: 4px 0;
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
      margin: 0 12px;
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
