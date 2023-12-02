<template>
  <div class="catalog-element">
    <div class="element">
      <div class="element-image">
        <img :src="url" alt="">
      </div>
      <h4>{{typeCapitalize}}</h4>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CatalogElement',
    props: {
      element: String
    },
    data: function () {
      return {
        myElement: Object
      }
    },
    computed: {
      url: function () {
        return '/static/img/vestimenta/' + this.element + '.svg'
      },
      typeCapitalize: function () {
        return this.element.charAt(0).toUpperCase() + this.element.slice(1)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/variables";

  .element {
    margin: 15px 0;
    padding: 10px;
    text-align: center;
    background-color: rgb(45, 50, 144);
    box-shadow: 0px 0px 8px 0px rgba(45, 50, 144, 0.5);
    color: white;

    > h4 {
      margin: 2px 0 4px 0;
      font-weight: bold;
    }

    > .element-image {
      position: relative;
      margin-bottom: 10px;

      > img {
        width: 100%;
        height: 8vh;
      }
    }
  }

</style>
