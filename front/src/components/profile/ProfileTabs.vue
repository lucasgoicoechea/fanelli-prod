<template>
  <section class="profile-tabs">
    <router-link class="element information"
                 :to="{name: 'profile-information', params: { id: user._id } }"
                 :replace="$mq !== 'mobile'">
      <h3>Datos personales</h3>
      <img src="/static/img/icons-perfil/info.svg" alt="">
    </router-link>

    <router-link class="element credentials"
                 :to="{name:'profile-credentials', params:{id: user._id}}"
                 :replace="$mq !== 'mobile'" v-if="$can(permissionCredential)">
      <h3>Credenciales</h3>
      <img src="/static/img/icons-perfil/credenciales.svg" alt="">
    </router-link>

    <router-link class="element archive"
                 :to="{name:'profile-archive', params:{id: user._id}}"
                 :replace="$mq !== 'mobile'" v-if="$can(permissionArchive)">
      <h3>Archivo</h3>
      <img src="/static/img/icons-perfil/archivo.svg" alt="">
    </router-link>

    <router-link class="element performance"
                 :to="{name: 'profile-responsible', params: { id: user._id } }"
                 :replace="$mq !== 'mobile'" v-if="$can(permissionResponsible)">
      <h3>Responsables</h3>
      <img src="/static/img/icons-perfil/responsables.svg" alt="">
    </router-link>
  </section>
</template>

<script>
  import {mapState} from 'vuex'
  import authorize from '@/utils/authorize'
  import Const from '@/const'

  const {ROLES} = Const

  export default {
    name: 'ProfileIndex',
    computed: {
      ...mapState('users', [
        'user'
      ]),
      permissionCredential () {
        return authorize(ROLES.RRHH)
      },
      permissionArchive () {
        return authorize(ROLES.JEFES, ROLES.RRHH, ROLES.PERSONAL, ROLES.SUPERVISOR_PRODUCCION, ROLES.SUPERVISOR)
      },
      permissionResponsible () {
        return authorize(ROLES.JEFES, ROLES.ADMINISTRACION, ROLES.SUPERVISORES)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .profile-tabs {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    /*justify-content: center;*/

    .element {
      background-color: #2a3d6b;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      width: 50%;
      height: 35vw;
      text-align: center;
      vertical-align: center;
      cursor: pointer;

      h3 {
        color: white;
        font-weight: bold;
        font-size: large;
        padding: 0;
        margin: 0;
      }

      img {
        align-self: center;
        margin: 3vw;
        height: 9vw;
        width: 9vw;
        fill: #FFF;
      }

      &.information {
        background-color: #EE5D6B;
      }

      &.credentials {
        background-color: #6f99ee;
      }

      &.news {
        background-color: #8558AF;
      }

      &.request {
        background-color: #F98550;
      }

      &.performance {
        background-color: #83B7AD;
      }

      &.archive {
        background-color: #009aff;
      }
    }
  }

  aside {
    z-index: 1;
    width: 25%;
    position: relative;
    display: flex;
    flex-direction: column;
    padding-top: 80px;
    box-shadow: 1px 1px 8px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 480px) {
    .tab-content + .profile-tabs {
      display: none;
    }
  }

  @media (min-width: 481px) {

    .profile-tabs {
      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .element {
        width: auto;
        height: auto;
        padding: 10px 0;
        flex-direction: row-reverse;
        flex-grow: 1;
        align-items: center;
        h3 {
          color: #333;
        }
        img {
          align-self: center;
          margin: 0 1vw 0 0;
          height: 2vw;
          width: 2vw;
          fill: #333;
        }

        &.information.router-link-active {
          border-bottom: 3px solid #EE5D6B;
        }

        &.credentials.router-link-active {
          border-bottom: 3px solid #6f99ee;
        }

        &.archive.router-link-active {
          border-bottom: 3px solid #d2ee7c;
        }

        &.news.router-link-active {
          border-bottom: 3px solid #8558AF;
        }

        &.request.router-link-active {
          border-bottom: 3px solid #F98550;
        }

        &.performance.router-link-active {
          border-bottom: 3px solid #83B7AD;
        }

        &.archive, &.information, &.credentials, &.news, &.request, &.performance {
          background-color: #FFFFFF;
        }
      }
    }
  }
</style>
