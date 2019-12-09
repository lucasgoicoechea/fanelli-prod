<template>
  <modal
    @click.native.stop
    :name="name"
    height="auto"
    :width="600"
    :pivot-y="0.3"
    :clickToClose="true"
    :adaptive="true">

    <h3>
      <slot name="title"></slot>
    </h3>

    <h4>
      <slot name="subtitle"></slot>
    </h4>

    <footer>
      <button class="reject" @click="$emit('reject')">Cancelar</button>
      <button class="acept" @click="$emit('acept')">Aceptar</button>
    </footer>
  </modal>
</template>
<script>
  export default {
    name: 'ModalConfirmation',
    props: {
      name: {
        type: String,
        default: 'modal-confirmation'
      }
    },
    data () {
      return {}
    },
    computed: {},
    methods: {}
  }
</script>
<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  h3 {
    text-align: center;
    color: $secondary-color;
    font-weight: bold;
  }

  h4 {
    text-align: center;
  }

  footer {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;

    button{
      flex-grow: 1;
      background-color: inherit;
      border: 1px solid #e0e0e0;
      padding: 10px;
      font-weight: bolder;
      font-size: large;
      outline: none;

      &:hover {
        background-color: #eeeeee;
      }

      &.acept {
        color: #00ea00;
      }

      &.reject {
        color: #4b4b4b;
      }
    }
  }
</style>
