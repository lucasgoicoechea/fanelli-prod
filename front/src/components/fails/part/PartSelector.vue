<template>
  <div class="part-selector">
    <header v-if="reduced" class="reduced">
      <a @click="show">
        <span v-show="!hasSelected">Presione aquí para seleccionar partes</span>
        <span v-show="hasSelected">{{ collaboratorSelected.lastname }} {{ collaboratorSelected.name }}</span>
        <div class="actions">
          <img :src="showIcon" alt="buscar">
          <img @click.stop="clear" v-show="hasSelected" src="/static/img/checklists/cross.svg" alt="limpiar">
        </div>
      </a>
    </header>
    <div v-else-if="multipleSelection" class="multiple">
      <a @click="show" v-show="!disabled">
        <span v-show="!hasSelected">Presione aquí para seleccionar partes</span>
        <span v-show="hasSelected">Presione aquí para cambiar partes</span>
        <div class="actions">
          <img :src="showIcon" alt="buscar">
          <img @click.stop="clear" v-show="hasSelected" src="/static/img/checklists/cross.svg" alt="limpiar">
        </div>
      </a>
      <div class="box">
        <div class="box-item" v-for="c in listCollaboratorsSelected" :key="c._id">
          <img v-if="c.picture" :src="c.picture" alt="">
          <img v-else src="/static/img/icon-navigation/nofoto.svg" alt="">
          <span class="name">{{ c.lastname }} {{ c.name }}</span>
        </div>
      </div>
    </div>
    <div v-else class="full">
      <img :src="collaboratorImage" alt="Foto del colaborador" @click="show">
      <div class="information">
        <a @click="show">
          <span v-show="!hasSelected">Presione aquí para seleccionar partes</span>
          <span v-show="hasSelected">Presione aquí para cambiar partes</span>
          <div class="actions">
            <img :src="showIcon" alt="buscar">
            <img @click.stop="clear" v-show="hasSelected" src="/static/img/checklists/cross.svg" alt="limpiar">
          </div>
        </a>
        <input v-model="collaboratorSelected.lastname" placeholder="Nombre" readonly>
        <input v-if="collaboratorSelected.sector" v-model="collaboratorSelected.sector.value" placeholder="Puesto" readonly>
        <input v-if="collaboratorSelected.shift" v-model="collaboratorSelected.shift.value" placeholder="Turno" readonly>
        <input v-else placeholder="Turno" readonly>
      </div>
    </div>
    <part-list
      :multipleSelection="multipleSelection"
      :show="showList"
      :typeList="typeList"
      :preSelection="preSelection"></part-list>
  </div>
</template>

<script>
  import PartList from './PartList.vue'
  import { mapState, mapGetters } from 'vuex'

  export default {
    name: 'PartSelector',
    components: {PartList},
    props: {
      reduced: {
        type: Boolean,
        default: false
      },
      multipleSelection: {
        type: Boolean,
        default: false
      },
      preSelection: {
        type: Array,
        require: false
      },
      typeList: {
        type: String,
        default: 'responsible',
        validator: function (value) {
          return ['responsible', 'full'].indexOf(value) !== -1
        }
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        showListCollaborator: false
      }
    },
    methods: {
      name () {
        return this.collaboratorSelected.name
      },
      show () {
        this.$store.commit('collaborators/changeShowList')
      },
      clear () {
        this.$store.dispatch('collaborators/clear')
      }
    },
    destroyed: function () {
      this.$store.commit('collaborators/reset')
    },
    computed: {
      ...mapState('collaborators', [
        'collaboratorSelected',
        'listCollaboratorsSelected',
        'showList'
      ]),
      ...mapGetters('collaborators', [
        'hasSelected'
      ]),
      showIcon: function () {
        return (this.hasSelected)
          ? '/static/img/icon-selector/change.svg'
          : '/static/img/icon-selector/search.svg'
      },
      collaboratorImage: function () {
        return (this.collaboratorSelected.hasOwnProperty('picture') && this.collaboratorSelected.picture)
          ? this.collaboratorSelected.picture
          : '/static/img/icon-navigation/nofoto.svg'
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/variables";

  .full {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }

  img {
    background-color: gainsboro;
    width: 20rem;
    height: 20rem;
    margin: 0 10px 10px 0;
    align-self: center;
    cursor: pointer;
  }

  .information {
    flex: 1;
    margin: 0 10px;
  }

  input {
    padding: 5px 2px;
    margin: 7px 0;
    font-weight: bold;
    font-size: 14px;
  }

  a {
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    padding: 10px;
    margin-bottom: 15px;
    background-color: gainsboro;
    box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.4);
    font-weight: bold;
    color: gray;
    text-decoration: none;

    span {
      align-self: center;
    }

    img {
      margin: 0;
      width: 30px;
      height: 30px;
      align-self: center;
    }

    .actions {
      display: flex;
      flex-direction: row;

      img {
        margin: 0 5px;
      }
    }
  }

  .box {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .box-item {
    position: relative;
    background-color: gainsboro;
    margin: 5px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    height: calc(100% * (1/5) - 10px);
    width: calc(100% * (1/5) - 10px);
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

  @media (max-width: 450px) {
    .box {
      .box-item {
        height: calc(100% * (1/2) - 10px);
        width: calc(100% * (1/2) - 10px);
      }
    }
  }

  @media (min-width: 1400px) {
    .box {
      .box-item {
        height: calc(100% * (1/8) - 10px);
        width: calc(100% * (1/8) - 10px);
      }
    }
  }
</style>