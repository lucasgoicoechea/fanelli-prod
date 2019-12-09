<template>
  <footer class="card-footer" :style="hasBackground">
    <slot></slot>
  </footer>
</template>

<script>
  export default {
    name: 'CardFooter',
    props: {
      backgroundColor: {
        type: String,
        default: 'white'
      }
    },
    computed: {
      hasBackground () {
        return {
          backgroundColor: this.backgroundColor
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  footer {
    padding: 4px;
    margin: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  div {
    padding: 0;
    margin: 0;
  }
</style>
