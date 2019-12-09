<template>
  <div v-if="this.linkable" class="collaborator-box-item">
    <router-link :to="redirect">
      <img :src="collaboratorImage" alt="foto colaborador">
      <span class="name">{{ collaborator.lastname }} {{ collaborator.name }}</span>
    </router-link>
  </div>
  <div v-else class="collaborator-box-item">
    <img :src="collaboratorImage" alt="foto colaborador">
    <span class="name">{{ collaborator.lastname }} {{ collaborator.name }}</span>
  </div>
</template>

<script>
  export default {
    name: 'CollaboratorBoxItem',
    props: {
      collaborator: {
        type: Object,
        required: true
      },
      linkable: {
        required: true,
        default: true
      }
    },
    data () {
      return {}
    },
    computed: {
      collaboratorImage () {
        return (this.collaborator.hasOwnProperty('picture') && this.collaborator.picture)
          ? this.collaborator.picture
          : '/static/img/icon-navigation/nofoto.svg'
      },
      redirect () {
        return {
          name: 'profile',
          params: {id: this.collaborator._id}
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/_variables.scss";

  .box-item {
    position: relative;
    background-color: gainsboro;
    margin: 5px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    height: 100px;
    width: 100px;
    border-radius: 4px;
    overflow: hidden;

    img {
      position: relative;
      width: 100%;
      height: 100%;
      margin: 0;
    }

    .name {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      padding: 5px;
      font-weight: bold;
      color: white;
      background-color: rgba(66, 87, 179, 0.75);
    }
  }
</style>
