<template>
  <footer class="form-footer">
    <div class="action" v-show="step === 1" @click="cambiar(2)">
      <div class="text-action ta-right">
        <h4>Siguiente</h4>
        <h5>Seleccionar un Colaborador</h5>
      </div>
      <div class="icon-action">
        <span class="glyphicon glyphicon-arrow-right"></span>
      </div>
    </div>
    <div class="action" v-show="step === 2" @click="cambiar(3)">
      <div class="text-action ta-right">
        <h4>Siguiente</h4>
        <h5>Confirmar selección</h5>
      </div>
      <div class="icon-action">
        <span class="glyphicon glyphicon-arrow-right"></span>
      </div>
    </div>
    <div class="action" v-show="step === 2" @click="cambiar(1)">
      <div class="icon-action">
        <span class="glyphicon glyphicon-arrow-left"></span>
      </div>
      <div class="text-action ta-left back-text">
        <h4>Olvidaste algo?</h4>
        <h5>Volver a Selección</h5>
      </div>
    </div>
  </footer>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    name: 'FormFooter',
    props: {
      step: {
        type: Number,
        default: 1
      }
    },
    data: function () {
      return {
        localStep: 1
      }
    },
    methods: {
      cambiar (value) {
        if (value === 3 && !this.valid) {
          this.$modal.show('dialog', {
            title: 'Información',
            text: 'Falta llenar datos de los elementos seleccionados previamente',
            buttons: [
              {
                title: 'Aceptar'
              }
            ]
          })
          return
        }
        if (value === 3 && !this.hasSelected) {
          this.$modal.show('dialog', {
            title: 'Información',
            text: 'Por favor seleccione un colaborador para continuar',
            buttons: [
              {
                title: 'Aceptar'
              }
            ]
          })
          return
        }
        this.localStep = value
        this.$emit('nextStep', this.localStep)
      }
    },
    computed: {
      ...mapGetters('catalog', [
        'valid'
      ]),
      ...mapGetters('collaborators', [
        'hasSelected'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  footer {
    position: fixed;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-between;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: $primary-color;
    color: white;
    text-align: center;
    box-shadow: 0 -1px 1px rgba(0, 0, 0, 0.26);
  }

  .action {
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
        color: rgba(255, 255, 255, 0.6);
      }

      > h4, h5 {
        font-weight: bold;
        margin: 4px;
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

  @media (max-width: 560px) {
    .back-text {
      display: none !important;
    }
  }

</style>
