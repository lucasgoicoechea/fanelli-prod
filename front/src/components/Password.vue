<template>
  <div class="password-container">
    <span :class="showPasswordClass" @click="togglePassword"></span>
    <input :value="value"
           :class="classes"
           :type="showPassword ? 'text' : 'password'"
           :placeholder="placeholder"
           @input="updatePassword($event.target.value)">
  </div>
</template>

<script>
  export default {
    name: 'Password',
    data () {
      return {
        showPassword: false
      }
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: ''
      },
      classes: {
        type: [String, Array],
        default: ''
      }
    },
    methods: {
      togglePassword () {
        this.showPassword = !this.showPassword
      },
      updatePassword (password) {
        this.$emit('input', password)
      }
    },
    computed: {
      showPasswordClass () {
        return 'glyphicon glyphicon-eye-' + ((this.showPassword) ? 'open' : 'close')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .password-container {
    position: relative;
    > span {
      position: absolute;
      right: 0;
      padding: 25px 10px;
      z-index: 1;
    }
  }
</style>
