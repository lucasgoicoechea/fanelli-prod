<template>
  <div class="tab-content profile-information">
    <h3>Datos personales</h3>
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-6">
          <p><b>Estado civil: </b>{{ user.civil_status }}</p>
          <p><b>Teléfono móvil: </b>{{ user.phone }}</p>
          <p><b>Teléfono fijo: </b>{{ user.landlinePhone }}</p>
          <p><b>Correo electrónico: </b>{{ user.email }}</p>
          <p><b>Nacionalidad: </b>{{ user.nationality }}</p>
          <p><b>Fecha de nacimiento: </b>{{ user.birthdate | moment('DD-MM-YYYY') }}</p>
          <p><b>Fecha de incorporación: </b>{{ user.incorporation_date | moment('DD-MM-YYYY') }}</p>
          <p><b>Estado: </b>{{ userState }}</p>
          <br>
        </div>
        <div class="col-sm-6">
          <!--<button class="btn btn-block text-center btn-danger">Dar de baja del sistema</button>-->
          <p v-if="user.area"><b>Área: </b>{{ user.area.value }}</p>
          <p v-if="user.sector"><b>Sector: </b>{{ user.sector.value }}</p>
          <p v-if="user.position"><b>Puesto: </b>{{ user.position.value }}</p>
          <p v-if="user.shift"><b>Turno: </b>{{ user.shift.value }}</p>
          <p v-if="user.line"><b>Línea: </b>{{ user.line.value }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'ProfileInformation',
    computed: {
      ...mapState('users', [
        'user'
      ]),
      userState () {
        return this.user.deactivated
          ? 'Inactivo'
          : 'Activo'
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  h3 {
    background-color: #EE5D6B;
    color: #FFF;
    margin: 0;
    padding: 10px;
    font-weight: bold;
    font-size: 18px;
  }

  @media (min-width: 481px) {
    h3 {
      display: none;
    }
  }

  .container-fluid {
    margin-top: 20px;
  }

  p {
    color: black;
    font-size: large;
    margin: 2px 0;
  }
</style>
