<template>
  <section v-show="isShow">
    <slot></slot>
  </section>
</template>

<script>
  export default {
    name: 'Tab',
    props: {
      name: String
    },
    data () {
      return {
        isShow: false,
        hash: '#' + this.name.toLowerCase().replace(/ /g, '-')
      }
    },
    computed: {}
  }
</script>
