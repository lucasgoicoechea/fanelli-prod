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
        <tr>
            <span v-if="bugReports.line">Linea: {{bugReports.line}}</span>
            <span v-if="bugReports.sector"><br>Sector: {{bugReports.sector}}</span>
            <span v-if="bugReports.sub_sector"><br>Sub Sector: {{bugReports.sub_sector}}</span>
            <span v-if="bugReports.equipo"><br>Equipo: {{bugReports.equipo}}</span>
            <span v-if="bugReports.group"><br>Grupo: {{bugReports.group}}</span>
            <span v-if="bugReports.part"><br>Parte: {{bugReports.part}}</span>
            <span v-if="bugReports.prioridad"><br>Prioridad: {{$constants.BUG_REPORT_PRIORIDAD[bugReports.prioridad]}}</span>
            <span v-if="bugReports.inconveniente"><br>Inconveniente: {{bugReports.inconveniente}}</span>
            <span v-if="bugReports.resume"><br>Resumen: {{bugReports.resume}}</span>
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
