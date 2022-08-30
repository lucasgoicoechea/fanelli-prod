<template>
  <div class="treefails-button" @click="update" :class="classOptions">
    <img class="treefails-icon" :src="icon" :alt="text">
    <h3 class="treefails-text">{{ text }}</h3>
  </div>
</template>

<script>
  export default {
    name: 'treeFailsButton',
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
      },
      father_id: {
        type: String,
        required: false
      }
    },
    methods: {
      update () {
        this.$emit('update', this.attribute)
      }
    },
    computed: {
      text () {
        return this.$constants.treefails_ATTRIBUTE[this.attribute]
      },
      isCurrent () {
        return this.current === this.attribute
      },
      isFather () {
        return this.current === this.father_id
      },
      classOptions () {
        return {
          nactive: this.isFather,
          active: this.isCurrent
        }
      }
    }
  }
</script>
<style lang="scss" scoped>

  .treefails-button {
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

  .treefails-icon {
    position: absolute;
    margin: auto;
    top: 20%;
    width: 8vh;
    height: 8vh;
  }

  .treefails-text {
    color: white;
    font-size: larger;
    font-weight: bold;
    position: absolute;
    bottom: 0;
    margin: 1.5vh 0;
  }

</style>
