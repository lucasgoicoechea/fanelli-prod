<template>
  <article class="collaborator-profile">
    <header>
      <span>{{ collaboratorShift }}</span>
      <span>{{ collaborator.legajo }}</span>
    </header>
    <div class="information">
      <img class="profile" v-if="!collaborator.picture" src="/static/img/icon-navigation/nofoto.svg"
           alt="Foto del colaborador">
      <img class="profile" v-else :src="collaborator.picture" alt="Foto del colaborador">
      <p>{{ collaborator.name }} {{ collaborator.lastname }}</p>
      <p v-if="hasCredentials">
        <img src="/static/img/icons-personal/key.svg" alt="Credenciales" class="key-icon"
             :title="`Este colaborador tiene acceso al sistema como ${$constants.USER_TYPE_READABLE[collaborator.user_type]}`">
      </p>
      <div class="relief" :class="deactivated">
        <div class="triangle1" :class="deactivated"></div>
        <div class="triangle2" :class="deactivated"></div>
      </div>
    </div>
  </article>
</template>

<script>
  export default {
    name: 'PersonalCard',
    props: {
      collaborator: {
        type: Object,
        required: true
      }
    },
    computed: {
      collaboratorShift () {
        return this.collaborator.shift
          ? this.collaborator.shift.value
          : ' '
      },
      collaboratorLegajo () {
        return this.collaborator.legajo
          ? this.collaborator.legajo
          : ' '
      },
      deactivated () {
        return {
          deactivated: this.collaborator.deactivated
        }
      },
      hasCredentials: function () {
        return Object.keys(this.collaborator.auth).length !== 0
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .key-icon {
    width: 32px
  }

  .collaborator-profile {
    margin: 16px 0;
    box-shadow: 0 2px 4px 1px rgba(0, 0, 0, 0.3);

    &:hover {
      box-shadow: 0 2px 10px 2px rgba(0, 0, 0, 0.3);
    }

    header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      height: 70px;
      padding: 2px;
    }

    .information {
      position: relative;
      padding: 4px;
      height: 150px;
      text-align: center;
      color: white;
      font-weight: bold;

      .profile {
        position: relative;
        top: -4.5vw;
        border-radius: 100vw;
        width: 9vw;
        height: 9vw;
        background-color: #1b6d85;
        border: 3px solid white;
        z-index: 4;
      }

      p {
        margin-top: 4px;
        position: relative;
        top: -4.5vw;
        z-index: 4;
      }
    }
  }

  .relief {
    position: absolute;
    background-color: #552ab4;
    width: 100%;
    height: 100%;
    bottom: 0;
    left: 0;
    overflow: hidden;

    &.deactivated {
      background-color: $seguridad-primary;
    }

    .triangle1 {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 0 0 6rem 15rem;
      border-color: transparent transparent #007bff transparent;
      z-index: 2;

      &.deactivated {
        border-color: transparent transparent $seguridad-tertiary transparent;
      }
    }

    .triangle2 {
      position: absolute;
      width: 0;
      height: 0;
      left: -5rem;
      bottom: 0;
      border-style: solid;
      border-width: 0 8rem 6rem 8rem;
      border-color: transparent transparent #94ffca transparent;
      z-index: 1;

      &.deactivated {
        border-color: transparent transparent $seguridad-secondary transparent;
      }
    }
  }

  @media (min-width: 1400px) {
    .collaborator-profile {
      .information {
        .profile {
          width: 5.5vw;
          height: 5.5vw;
          top: -3vw;
        }

        p {
          top: -2.5vw;
        }
      }
    }
  }

  @media (max-width: 850px) {
    .collaborator-profile {
      .information {
        .profile {
          width: 15vw;
          height: 15vw;
          top: -8vw;
        }

        p {
          top: -7vw;
        }
      }
    }
  }
</style>
