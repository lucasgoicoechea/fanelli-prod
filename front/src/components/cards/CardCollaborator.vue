<template>
  <article class="card-collaborator">
    <h4 class="collaborator">
      <span>{{ collaborator.legajo }} -</span>
      <span class="name"> {{ collaborator.lastname }} {{ collaborator.name }}</span>
      <span v-if="collaboratorHasShift">- {{ collaborator.shift.value }}</span>
    </h4>
  </article>
</template>

<script>
  export default {
    name: 'CardCollaborator',
    props: {
      collaborator: {
        type: Object
      }
    },
    computed: {
      collaboratorHasShift () {
        return this.collaborator.hasOwnProperty('shift')
      }
    }
  }
</script>

<style lang="scss" scoped>
  h4 {
    color: #101010;
    margin: 0;
    font-weight: 400;
    display: flex;
    flex-wrap: nowrap;

    span {
      padding: 0 2px;
    }
  }

  .name {
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 175px;
    flex: 1;
  }

  @media (max-width: 321px) {
    .name {
      max-width: 85px;
    }
  }

  @media (min-width: 321px) and (max-width: 450px) {
    .name {
      max-width: 120px;
    }
  }

</style>
