<template>
  <div class="catalog-view">
    <navigation :title="title"></navigation>
    <div class="container-fluid">
      <section>
        <h3>Elementos de Protección Personal (EPP)</h3>
        <h5>Presione un EPP para editarlo</h5>
        <div class="row">
          <div class="col-xs-6 col-sm-4 col-md-3" v-for="element in filterByCategory('SEGURIDAD')">
            <catalog-element
              :element="element.type"
              @click.native="editElement(element)">
            </catalog-element>
          </div>
        </div>
        <h3>Vestimenta</h3>
        <h5>Presione un Elemento de Vestimenta para editarlo</h5>
        <div class="row">
          <div class="col-xs-6 col-sm-4 col-md-3" v-for="element in filterByCategory('VESTIMENTA')">
            <catalog-element
              :element="element.type"
              @click.native="editElement(element)">
            </catalog-element>
          </div>
        </div>
      </section>
      <catalog-edit-element></catalog-edit-element>
    </div>
  </div>
</template>

<script>
  import Navigation from '@/components/Navigation.vue'
  import CatalogElement from './CatalogElement'
  import { mapState, mapGetters } from 'vuex'
  import CatalogEditElement from './CatalogEditElement.vue'

  export default {
    name: 'CatalogView',
    components: {
      CatalogEditElement,
      CatalogElement,
      Navigation
    },
    data () {
      return {
        title: 'Catálogo EPP'
      }
    },
    created: function () {
      this.$store.dispatch('catalog/fetch')
    },
    methods: {
      editElement (e) {
        this.$store.commit('catalog/editElement', {element: e})
      }
    },
    computed: {
      ...mapGetters('catalog', [
        'filterByCategory'
      ]),
      ...mapState('catalog', [
        'data',
        'toForm',
        'catalog'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/variables";

  h3 {
    color: $secondary-color;
    font-weight: bold;
    padding: 5px 0;
    border-bottom: 4px solid $primary-color;
  }

  .catalog-element {
    cursor: pointer;
  }

  .container-fluid {
    width: 80%;
  }

  @media (max-width: 599px)  {
    .container-fluid {
      width: 100%;
    }
  }
</style>
