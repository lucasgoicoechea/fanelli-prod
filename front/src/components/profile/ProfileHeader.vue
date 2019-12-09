<template>
  <nav>
    <header class="profile-header" :class="userColor">

      <div class="image-container">
        <figure class="image">
          <spinner class="spinner" :show="loading"></spinner>
          <img class="image-rounded" v-if="!user.picture" src="/static/img/icon-navigation/nofoto.svg" @click="showEdit">
          <img class="image-rounded" :class="{ loading: loading }" v-if="user.picture" :src="user.picture" @click="showEdit">
        </figure>
        </div>

      <div class="personal-information">
        <div class="header">
          <div class="content">
            <h3> {{ user.legajo }}</h3>
            <h2> {{ user.lastname }} {{ user.name }}</h2>
            <h3 v-if="user.sector && !isDeactivated"> {{ user.sector.value }} </h3>
            <div class="deactivated" v-show="isDeactivated">
              <h3>Personal dado de baja</h3>
              <h4>{{ deactivatedReason }}</h4>
            </div>
          </div>
          <button
            v-show="!isDeactivated"
            class="report-button margin"
            @click="showModal">DAR DE BAJA</button>
        </div>

        <button
          class="report-button"
          v-show="canReport && !isDeactivated"
          @click="getReport">
          <span class="glyphicon glyphicon-download-alt" aria-hidden="true"></span>
          Generar reporte
        </button>

        <div class="sub-header" v-show="!isDeactivated">
          <div class="more">
            <p v-if="user.shift"><span >Turno:</span> {{ user.shift.value }} - {{user.shift.description}} </p>
            <p><span>DNI:</span> {{ user.dni }}</p>
            <p><span>CUIL:</span> {{ user.cuil }}</p>
            <p><span>Teléfonos:</span> {{ user.phone }}</p>
            <p><span>Dirección:</span> {{ user.address }}</p>
          </div>

          <div class="edition" v-show="canEdit">
            <router-link :to="{name: 'profile-edit', param: {id: user._id}}">
              <img src="/static/img/icons-perfil/Editar.svg" alt="editar">
            </router-link>
          </div>

        </div>

        <div class="activate" v-show="isDeactivated">
          <button
            class="report-button margin"
            @click="confirmActivate">DAR DE ALTA</button>
        </div>

      </div>

      <div class="right" :class="userColor"></div>
      <div class="left" :class="userColor"></div>
      <profile-edit-image :user="user" :show="edit" @close="showEdit"></profile-edit-image>
    </header>
    <modal-profile-deactivation
      @reject="reject"
      @accept="accept"></modal-profile-deactivation>
  </nav>

</template>

<script>
  import ProfileEditImage from '@/components/profile/ProfileEditImage'
  import Spinner from '@/components/Spinner'
  import { mapState } from 'vuex'
  import pdf from '@/utils/pdf'
  import authorize from '@/utils/authorize'
  import ModalProfileDeactivation from '@/components/profile/modal/ModalProfileDeactivation'
  import confirmationHelper from '@/utils/confirmationHelper'

  export default {
    name: 'profile-header',
    components: {
      ProfileEditImage,
      ModalProfileDeactivation,
      Spinner
    },
    props: {
      user: {
        type: Object
      }
    },
    data: function () {
      return {
        edit: false,
        title: 'Personal'
      }
    },
    methods: {
      showEdit () {
        this.edit = !this.edit
      },
      goBack () {
        if (this.$router.prev === 'login') {
          this.$router.push({name: 'home'})
        } else {
          this.$router.go(-1)
        }
      },
      successfulPrint (blob) {
        pdf.download(blob, 'report.xlsx')
      },
      errorPrint () {
        this.$snotifyWrapper.warning('Error de impresión. Intente nuevamente')
      },
      getReport () {
        this.$store.dispatch('users/getReport', this.user)
          .then(this.successfulPrint)
          .catch(this.errorPrint)
      },
      showModal () {
        this.$modal.show('modal-profile-deactivation')
      },
      accept (info) {
        this.$modal.hide('modal-profile-deactivation')
        this.$store.dispatch('users/deactivate', {
          id: this.user._id,
          deactivatedReason: info.reason
        })
      },
      reject (info) {
        this.$modal.hide('modal-profile-deactivation')
      },
      activate () {
        this.$modal.hide('modal-profile-deactivation')
        this.$store.dispatch('users/activate', {
          id: this.user._id
        })
      },
      confirmActivate () {
        confirmationHelper.modalConfirm(this, {
          title: 'Confirmación',
          text: '¿Desea dar de alta a este colaborador?',
          actions: {accept: this.activate}
        })
      }
    },
    computed: {
      userColor: function () {
        return {
          grey: !this.user.deactivated,
          deactivated: this.user.deactivated
        }
      },
      canReport () {
        return this.$can(authorize(this.$constants.ROLES.JEFES, this.$constants.ROLES.ADMINISTRACION, this.$constants.ROLES.SUPERVISORES))
      },
      canEdit () {
        return this.$can(authorize(this.$constants.ROLES.JEFE_PLANTA, this.$constants.ROLES.ADMINISTRACION))
      },
      isDeactivated () {
        return this.user.deactivated
      },
      deactivatedReason () {
        if (!this.isDeactivated) { return '' }
        return (this.user.deactivatedReason)
          ? `Razón: ${this.user.deactivatedReason}.`
          : `Sin razón.`
      },
      ...mapState('users', [
        'loading'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .profile-header {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    color: white;
    position: relative;
    width: 100%;

    &.grey {
      background-color: #cacaca;
    }

    &.deactivated {
      background-color: $seguridad-primary;
    }
  }

  .right {
    position: absolute;
    background-color: transparent;
    width: 0;
    height: 0;
    bottom: 0;
    right: 0;
    border-left: 85vw solid transparent;
    border-right: 0 solid transparent;
    border-bottom: 30vh solid #aaa;
    z-index: 2;

    &.deactivated {
      border-bottom: 30vh solid $seguridad-secondary;
    }
  }

  .left {
    position: absolute;
    background-color: rgba(129, 40, 40, 0);
    width: 0;
    height: 0;
    bottom: 0;
    left: -25vw;
    border-left: 40vw solid transparent;
    border-right: 100vh solid transparent;
    border-bottom: 20vh solid #8f8f8f;
    z-index: 1;

    &.deactivated {
      border-bottom: 20vh solid $seguridad-tertiary;
    }
  }

  .personal-information {
    position: relative;
    z-index: 3;
    padding-top: 40px;
    flex-grow: 1;

    h2 {
      font-weight: bold;
      margin: 6px 0;
    }

    h3 {
      font-weight: 500;
      margin: 0;
    }

    .header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      flex-wrap: wrap;
      align-items: center;
      padding-right: 20px;
    }

    .sub-header {
      margin: 40px 0 20px 0;
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      p {
        margin: 1px 0;
        padding: 0;
        font-size: large;
        letter-spacing: 0.5px;
      }

      span {
        font-weight: bold;
      }

      .edition {
        display: flex;
        flex-direction: column-reverse;
        padding: 5px 25px 5px 10px;
        img {
          height: 30px;
          width: 30px;
          bottom: 0;
        }
      }
    }
  }

  .image-container {
    position: relative;
    display: flex;
    flex-direction: column-reverse;
    // left: 3vw;
    // bottom: 3.5vh;
    z-index: 3;
    padding: 25px;
    padding-top: $navigation-height + 10px;
    background-color: transparent;

    .image {
      position: relative;
      background-color: white;
      border-radius: 100vw;
      z-index: 3;
      cursor: pointer;
      border: 4px solid white;

      &.loading {
        opacity: 0.70;
      }

      .image-rounded {
        position: relative;
        border-radius: 100vw;
        width: 17vh;
        height: 17vh;
      }
    }
  }

  .spinner {
    position: absolute;
    font-size: 8vh;
    z-index: 5;
    top: 24%;
    left: 27%;
  }

  .report-button {
    margin-top: 8px;
    padding: 4px 8px;
    border-radius: 8px;
    text-decoration: none;
    font-size: medium;
    border: 2px solid white;
    background-color: transparent;
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(5px);
      box-shadow: 0px 20px 15px -15px rgba(0,0,0, 0.3);
    }

    span {
      margin: 0 6px 0 3px;
    }
  }

  .margin {
    margin-top: 2px !important;
    margin-bottom: 10px !important;
  }

  @media (max-width: 600px) {

    nav {
      h3 {
        font-size: 4.75vw;
        margin: 3vw 0;
      }

      img {
        height: 4vh;
        width: 4vh;
        margin: 5px;
      }
    }

    .profile-header {
      display: block;
    }

    .image-container {
      justify-content: center;
      align-items: center;
      padding-top: 10px;
    }

    .personal-information {
      padding: 10px 20px;
    }

    .edition {
      position: relative;
      right: 50px;
    }
  }

  .activate {
    margin: 60px 0;
  }
</style>
