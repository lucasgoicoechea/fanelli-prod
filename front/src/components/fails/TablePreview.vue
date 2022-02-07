<template>
  <div class="table-preview">
    <section>
      <table>
        <thead>
        <tr>
          <th>Descripción</th>
          <th>Cantidad</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="element in elements" :key="element._id">
          <td>
            <span>{{element.type | capitalize}} ({{element.model}})</span>
            <span v-if="element.colour"><br>Color: {{element.colour}}</span>
            <span v-if="element.size"><br>Tamaño: {{element.size}}</span>
          </td>
          <td>{{element.cant}}</td>
        </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script>
  export default {
    name: 'TablePreview',
    props: {
      elements: {
        type: Array
      }
    },
    methods: {},
    computed: {}

  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  table {
    width: 100%;
    margin: 10px 0;
    border-collapse: collapse;
    border-radius: $border-radius;
  }

  th, td {
    padding: 4px 8px;
  }

  table > thead > tr > th {
    background: lighten($primary-color, 40);
  }

  table, th, td {
    border: 2px solid $primary-color;
  }

  table tr:last-child td:first-child {
    border-bottom-left-radius: $border-radius;
  }

  table tr:last-child td:last-child {
    border-bottom-right-radius: $border-radius;
  }

  table tr:first-child td:first-child {
    border-top-left-radius: $border-radius;
  }

  table tr:first-child td:last-child {
    border-top-right-radius: $border-radius;
  }
</style>
