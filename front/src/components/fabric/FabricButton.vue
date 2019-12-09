<template>
  <div class="fabric-button" @click="update" :class="classOptions">
    <img class="fabric-icon" :src="icon" :alt="text">
    <h3 class="fabric-text">{{ text }}</h3>
  </div>
</template>

<script>
  export default {
    name: 'FabricButton',
    props: {
      attribute: {
        type: String,
        required: true
      },
      icon: {
        type: String,
        required: true
      },
      current: {
        type: String,
        default: ''
      }
    },
    methods: {
      update () {
        this.$emit('update', this.attribute)
      }
    },
    computed: {
      text () {
        return this.$constants.FABRIC_ATTRIBUTE[this.attribute]
      },
      isCurrent () {
        return this.current === this.attribute
      },
      classOptions () {
        return {
          active: this.isCurrent
        }
      }
    }
  }
</script>
<style lang="scss" scoped>

  .fabric-button {
    margin: 0 20px 20px 20px;
    position: relative;
    height: 17vh;
    width: 17vh;
    border-radius: 8px;
    background-color: #3E87D9;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    align-self: center;
    cursor: pointer;

    &.active {
      background-color: #074C8B;
    }
  }

  .fabric-icon {
    position: absolute;
    margin: auto;
    top: 20%;
    width: 8vh;
    height: 8vh;
  }

  .fabric-text {
    color: white;
    font-size: larger;
    font-weight: bold;
    position: absolute;
    bottom: 0;
    margin: 1.5vh 0;
  }

</style>
