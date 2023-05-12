<template>
  <div class="scrolling-wrapper">
    <slot class="card"></slot>
  </div>
</template>
<style lang="scss" scoped>

  .scrolling-wrapper {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: -ms-autohiding-scrollbar;

    &::-webkit-scrollbar {
      display: none;
    }
  }
    //::-webkit-scrollbar:vertical 

  .card {
    flex: 0 0 auto;
  }

  @media (min-width: 768px) {

    .scrolling-wrapper::-webkit-scrollbar {
      width: 10px;
      display: block;
    }

    .scrolling-wrapper::-webkit-scrollbar-track {
      background-color: #F5F5F5;
    }

    .scrolling-wrapper::-webkit-scrollbar-thumb {
      background-color: #bfbfbf;
    }

  }

</style>

