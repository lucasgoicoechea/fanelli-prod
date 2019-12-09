<template>
  <article v-show="show" @click="onClose">
    <section @click.stop>
      <div class="edition">
        <croppa v-model="croppa"
                :width="300"
                :height="300"
                :quality="2"
                :prevent-white-space="true"
                :zoom-speed="7"
                placeholder="Seleccione una imagen"
                placeholder-color="gray"
                :placeholder-font-size="16"
                canvas-color="transparent"
                :show-remove-button="true"
                remove-button-color="#0d0a62"
                :show-loading="true"
                :loading-size="50"
                loading-color="#606060">
          <img slot="initial" :src="user.picture" crossorigin="anonymous" />
        </croppa>
        <div class="btns">
          <button @click="croppa.rotate()"><span class="glyphicon glyphicon-repeat mirror"></span></button>
          <button @click="croppa.rotate(-1)"><span class="glyphicon glyphicon-repeat"></span></button>
        </div>
      </div>
      <footer>
        <button @click="onClose">Cancelar</button>
        <button @click="saveImage" class="save">Guardar imagen</button>
      </footer>
    </section>
  </article>
</template>

<script>
  export default {
    name: 'ProfileEditImage',
    props: {
      user: {
        type: Object
      },
      show: {
        type: Boolean,
        default: false
      }
    },
    data: function () {
      return {
        croppa: {},
        dataUrl: ''
      }
    },
    methods: {
      saveImage () {
        this.dataUrl = this.croppa.generateDataUrl('image/jpeg')
        const vm = this
        this.croppa.promisedBlob('image/jpeg', 0.8).then(function (blob) {
          vm.$store.dispatch('users/updateImage', {userId: vm.user._id, image: blob})
          vm.$emit('close')
        })
      },
      onClose () {
        this.$emit('close')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  article {
    position: fixed;
    z-index: 10;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  section {
    min-width: 30%;
    min-height: 50%;
    background-color: white;
    border-radius: 2px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  footer {
    padding: 8px 20px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    border-top: 2px solid $primary-color;
  }

  .edition {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 20px;
  }

  .btns {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 15px;
  }

  .save{
    background-color: $secondary-darker;
  }

  .save:hover{
    background-color: $secondary-color;
  }

  button {
    background-color: #bdbdbd;
    color: white;
    font-weight: bolder;
    border: none;
    border-radius: 1px;
    padding: 4px 8px;
    margin: 4px;
    box-shadow: 0 1px 4px rgba(171, 171, 171, 0.8);
    outline: none;

    &:hover {
      background-color: rgba(101, 101, 101, 0.8);
    }
  }

  .croppa-container {
    align-self: center;
    background-color: rgba(44, 113, 82, 0.2);
    border: 2px solid rgba(44, 113, 82, 0.2);
    border-radius: 2px;
  }

  .croppa-container:hover {
    opacity: 1;
    background-color: rgba(44, 113, 82, 0.4);
  }

  .mirror {
    transform: scale(-1, 1);
  }

</style>
