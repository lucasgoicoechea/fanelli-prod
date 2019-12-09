<template>
  <modal
    @click.native.stop
    name="modal-profile-deactivation"
    height="auto"
    :width="600"
    :pivot-y="0.3"
    :clickToClose="true"
    :adaptive="true">

    <h3>Indique la rázon de la baja</h3>

    <div class="input-reason">
      <textarea v-model="reason"></textarea>
    </div>

    <footer>
      <button class="reject" @click="reject">Cancelar</button>
      <button class="acept" @click="accept">Aceptar</button>
    </footer>
  </modal>
</template>
<script>
  export default {
    name: 'ModalProfileDeactivation',
    props: {},
    data () {
      return {
        reason: ''
      }
    },
    computed: {},
    methods: {
      reject () {
        this.$emit('reject', {reason: this.reason})
      },
      accept () {
        this.$emit('accept', {reason: this.reason})
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../../assets/styles/variables";

  h3 {
    margin: 30px 0 20px 0;
    text-align: center;
    color: #252525;
  }

  .input-reason {
    position: relative;
    width: 80%;
    margin: 10px auto;
  }

  textarea {
    width: 100%;
    height: 100px;
    color: #303030;
    padding: 10px;
    margin-bottom: 15px;
    resize: none;
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
