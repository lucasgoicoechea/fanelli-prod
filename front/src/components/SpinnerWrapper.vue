<template>
  <div v-if="show" class="spinner-wrapper">
    <spinner :speed="$constants.spinner.speed" :message="loadingMessage" :size="size"></spinner>
  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'

  export default {
    name: 'SpinnerWrapper',
    components: {
      Spinner
    },
    props: {
      show: {
        type: Boolean,
        required: true
      },
      loadingMessage: {
        type: String,
        required: false
      },
      size: {
        type: String,
        default: 'medium',
        required: false
      }
    }
  }
</script>
<style lang="scss" scoped>
</style>
