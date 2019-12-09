<template>
  <article class="card-collaborator-full">
    <figure class="collaborator-picture">
      <img :src="collaboratorPicture" alt="no foto">
    </figure>
    <div class="collaborator-information">
      <h4>{{ collaborator.lastname }} {{ collaborator.name }}</h4>
      <p>Legajo: {{ collaborator.legajo }}</p>
      <p v-if="collaboratorHasShift">Turno: {{ collaborator.shift.value }}</p>
    </div>
  </article>
</template>

<script>
  export default {
    name: 'CardCollaboratorFull',
    props: {
      collaborator: {
        type: Object
      }
    },
    computed: {
      collaboratorHasShift () {
        return this.collaborator.hasOwnProperty('shift')
      },
      collaboratorPicture () {
        return (this.collaborator.hasOwnProperty('picture') && this.collaborator.picture)
          ? this.collaborator.picture
          : '/static/img/icon-navigation/nofoto.svg'
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .card-collaborator-full {
    display: flex;
    margin: 10px 0;
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;

    .collaborator-picture {
      flex-shrink: 0;
      width: 80px;
      height: 80px;
      border-radius: 100%;
      background-color: $secondary-color;
      overflow: hidden;
      box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.50);

      img {
        width: 100%;
        height: 100%;
      }
    }

    .collaborator-information {
      padding: 5px 15px;

      h4 {
        margin: 0 0 4px 0;
      }

      p {
        margin: 2px 0;
      }
    }
  }
</style>
