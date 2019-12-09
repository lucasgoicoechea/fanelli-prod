<template>
  <li class="collaborator-list-item" @click="selectCollaborator" :class="isSelected">
    <img class="lazyload" :data-src="collaboratorImage" alt="Foto del colaborador">
    <div class="information">
      <h4>{{collaborator.lastname}} {{collaborator.name}}</h4>
      <p><span v-show="sector">{{ sector }} -</span> Leg. {{collaborator.legajo}}</p>
      <p v-if="collaborator.shift">Turno {{collaborator.shift.value}}</p>
    </div>
    <div class="check" v-show="multipleSelection">
      <check-box v-model="collaborator.selected"></check-box>
    </div>
  </li>
</template>

<script>
  import 'lazysizes'
  import CheckBox from '@/components/CheckBox'

  export default {
    name: 'CollaboratorListItem',
    components: {CheckBox},
    props: {
      collaborator: {
        type: Object,
        required: true
      },
      multipleSelection: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {}
    },
    methods: {
      selectCollaborator () {
        if (this.multipleSelection) {
          this.$store.commit('collaborators/updateListCollaboratorsSelected', this.collaborator)
        } else {
          this.$store.commit('collaborators/selectCollaborator', this.collaborator)
          this.$store.commit('collaborators/changeShowList')
        }
      }
    },
    computed: {
      collaboratorImage: function () {
        return (this.collaborator.hasOwnProperty('picture') && this.collaborator.picture)
          ? this.collaborator.picture
          : '/static/img/icon-navigation/nofoto.svg'
      },
      isSelected () {
        return {
          selected: this.multipleSelection && this.collaborator.selected
        }
      },
      sector () {
        return this.collaborator.hasOwnProperty('sector') && this.collaborator.sector.value
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/variables";

  li {
    list-style-type: none;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    background-color: rgb(242, 242, 242);
    margin: 14px 0;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
    cursor: pointer;

    &.selected {
      background-color: #ffd4bd;
      box-shadow: 0 0 8px rgba(255, 52, 0, 0.5);
    }

    img {
      width: 10rem;
      height: 10rem;
      background-color: #2f9af7;
    }

    .information {
      flex: 1;
      padding: 8px 14px;

      h4 {
        color: $secondary-color;
        font-weight: bold;
        margin: 4px 4px 12px 0;
      }

      p {
        margin: 1px 0;
      }
    }

    .check {
      align-self: center;
      padding-right: 15px;
    }

  }

  @media (max-width: 360px) {
    li {
      img {
        width: 7rem;
        height: 7rem;
      }

      .information {
        padding: 6px 8px;

        h4 {
          color: $secondary-color;
          font-weight: bold;
          font-size: medium;
          margin: 4px 0;
        }

        p {
          font-size: smaller;
          margin: 1px 0;
        }
      }

    }
  }

</style>
