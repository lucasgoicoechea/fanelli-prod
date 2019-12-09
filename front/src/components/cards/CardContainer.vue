<template>
  <article class="card-container">
    <slot></slot>
  </article>
</template>

<script>
  export default {
    name: 'CardContainer'
  }
</script>

<style lang="scss" scoped>
  article {
    margin: 20px 5px;
    box-shadow: 1px 1px 5px 0 rgba(0, 0, 0, 0.4);
    cursor: pointer;
  }

  div {
    padding: 0;
    margin: 0;
  }
</style>
