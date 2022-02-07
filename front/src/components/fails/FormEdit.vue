<template>
  <div class="form-edit">
    <div class="msg">
      <h3>Tu solicitud fue enviada exitosamente</h3>
      <p>Tendrá un plazo de 5 minutos editar su solicitud</p>
      <div class="actions">
        <a class="cancel-button" @click="accept">Editar</a>
        <a class="accept" @click="cancel">Finalizar</a>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'form-edit',
    methods: {
      cancel () {
        this.$emit('confirm', 'cancel')
      },
      accept () {
        this.$emit('confirm', 'edit')
      }
    },
    computed: mapGetters('catalog', [
      'getWithQuantity',
      'valid',
      'conMap'
    ])
  }
</script>

<style lang="scss" scoped>

  .form-edit {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.7);
    z-index: 12;
    font-weight: bold;
  }

  .msg {
    max-width: 75%;
    background-color: white;
    padding: 20px;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.3);
  }

  h3 {
    padding: 0 0 8px 0;
    margin: 0;
    color: rgb(38, 23, 116);
    font-weight: bold;
  }

  .actions {
    display: flex;
    flex-direction: row;
    margin: 10px 0;
    justify-content: space-around;
  }

  a {
    cursor: pointer;
    color: white;
    text-align: center;
    min-width: 12vh;
    padding: 15px 10px;
    border-radius: 25px;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.3);

    &:hover {
      text-decoration: none;
    }
  }

  .cancel-button {
    background-color: red;
  }

  .accept {
    background-color: #00d100;
  }

  .table {
    width: 90%;
  }

  table {
    width: 100%;
    margin: 20px 0px;
    border-collapse: separate;
    border-radius: 25px;
    border: 2px solid rgb(236, 110, 37);
  }

  th, td {
    padding: 4px 20px;
    border: 2px solid rgb(236, 110, 37);
  }

  table tr:last-child td:first-child {
    border-bottom-left-radius: 21px;
  }

  table tr:last-child td:last-child {
    border-bottom-right-radius: 21px;
  }

  table tr:first-child td:first-child {
    border-top-left-radius: 21px;
  }

  table tr:first-child td:last-child {
    border-top-right-radius: 21px;
  }
</style>
