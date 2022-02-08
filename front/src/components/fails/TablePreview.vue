<template>
  <div class="table-preview">
    <section>
      <table>
        <thead>
        <tr>
          <th>Descripción</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="bugReport in bugReports" :key="bugReport._id">
            {{bugReport}}
            <!--<span v-if="bugReport.line"><br>Linea: {{bugReport.line}}</span>
            <span v-if="bugReport.sector"><br>Sector: {{bugReport.sector}}</span>
            <span v-if="bugReport.sub_sector"><br>Sub Sector: {{bugReport.sub_sector}}</span>
            <span v-if="bugReport.equipo"><br>Equipo: {{bugReport.equipo}}</span>
            <span v-if="bugReport.group"><br>Grupo: {{bugReport.group}}</span>
            <span v-if="bugReport.part"><br>Parte: {{bugReport.part}}</span>
            <span v-if="bugReport.prioridad"><br>Prioridad: {{bugReport.prioridad}}</span>
            <span v-if="bugReport.inconveniente"><br>Inconveniente: {{bugReport.inconveniente}}</span>
            <span v-if="bugReport.resume"><br>Resumen: {{bugReport.resume}}</span>-->
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
      bugReports: {
        type: Object
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
