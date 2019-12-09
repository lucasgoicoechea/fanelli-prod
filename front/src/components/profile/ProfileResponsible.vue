<template>
  <div class="tab-content profile-information">
    <h3>Responsable</h3>
    <div class="container-fluid">
      <div class="row">

        <div class="col-xs-12">
          <h2 class="title">A cargo de:</h2>
          <spinner :show="loaderBosses"></spinner>
          <p class="empty"
             v-show="!hasBosses && !loaderBosses">Aún no está a cargo de nadie</p>
          <div v-show="hasBosses" class="box">
            <collaborator-box-item
              class="box-item"
              v-for="c in bosses"
              :collaborator="c"
              v-bind:linkable="false"
              :key="c._id"></collaborator-box-item>
          </div>
        </div>

        <div class="col-xs-12">
          <h2 class="title">Asignación de colaboradores:</h2>
          <p class="empty"
             v-show="!hasResponsibleTeam && !loaderTeam">Aún no tiene a nadie a cargo</p>

          <spinner :show="loaderTeam"></spinner>

          <div class="box">
            <collaborator-box-item
              class="box-item"
              v-for="c in responsibleTeam"
              :collaborator="c"
              :key="c._id"></collaborator-box-item>
          </div>

          <div class="actions" v-show="$can($constants.ROLES.RRHH)">
            <button @click="show" class="floating-button">
              <img src="/static/img/plus-white.svg" alt="">
            </button>
          </div>
        </div>

        <div class="col-xs-12">
          <h2 class="title">
            Responsables indirectos
            <span @click="loadMore"> - ver más</span>
          </h2>
          <div class="indirect" v-show="showMore">
            <spinner :show="loaderIndirectTeam"></spinner>
            <p class="empty"
               v-show="!hasIndirectResponsibleTeam && !loaderIndirectTeam">Aún no hay colaboradores indirectos</p>
            <div v-show="hasIndirectResponsibleTeam" class="box">
              <collaborator-box-item
                class="box-item"
                v-for="c in indirectResponsibleTeam"
                :collaborator="c"
                :key="c._id"></collaborator-box-item>
            </div>
          </div>
        </div>
      </div>
      <collaborator-list
        :multipleSelection="true"
        :preSelection="initResponsible"
        typeList="full"
        :show="showList"></collaborator-list>
      <div class="separator"></div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'
  import CollaboratorList from '@/components/selectors/collaborator/CollaboratorList'
  import confirmationHelper from '@/utils/confirmationHelper'
  import Spinner from '@/components/SpinnerWrapper'
  import CollaboratorBoxItem from '@/components/selectors/collaborator/CollaboratorBoxItem'

  export default {
    name: 'ProfileResponsible',
    components: {
      CollaboratorList,
      CollaboratorBoxItem,
      Spinner
    },
    data () {
      return {
        bosses: [],
        responsibleTeam: [],
        indirectResponsibleTeam: [],
        initResponsible: [],
        loaderBosses: false,
        loaderTeam: false,
        loaderIndirectTeam: false,
        showMore: false
      }
    },
    methods: {
      fetchResponsible (id) {
        this.loaderTeam = true
        this.$store.dispatch('collaborators/fetchResponsible', {userId: id})
          .then(response => {
            this.initResponsible = response.responsibleOf.map(e => ({_id: e}))
            this.responsibleTeam = this.filterById(this.initResponsible)
          })
          .catch(() => {
            this.$snotifyWrapper.error('No se pudo recuperar a los responsables')
          })
          .finally(() => { this.loaderTeam = false })
      },
      fetchIndirectResponsible (id) {
        this.loaderIndirectTeam = true
        this.$store.dispatch('collaborators/getIndirectTeam', {userId: id})
          .then(response => {
            this.indirectResponsibleTeam = response.responsibleOf
          })
          .catch(() => {
            this.$snotifyWrapper.error('No se pudo recuperar a los responsables indirectos')
          })
          .finally(() => { this.loaderIndirectTeam = false })
      },
      fetchBosses (id) {
        this.loaderBosses = true
        this.$store.dispatch('collaborators/getBosses', {userId: id})
          .then(response => {
            this.bosses = response.bosses
          })
          .catch(() => {
            this.$snotifyWrapper.error('No se pudo recuperar a los jefes')
          })
          .finally(() => { this.loaderBosses = false })
      },
      loadMore () {
        this.showMore = !this.showMore
      },
      show () {
        this.$store.commit('collaborators/changeShowList')
      },
      reject () {
        this.initResponsible = this.initResponsible.map(e => ({_id: e._id}))
      },
      confirmUpdate () {
        confirmationHelper.modalConfirm(this, {
          title: 'Confirmación',
          text: '¿Desea actualizar los responsables?',
          actions: {
            accept: this.updateResponsible,
            reject: this.reject
          }
        })
      },
      updateResponsible () {
        this.loaderTeam = true
        this.$store.dispatch('collaborators/updateResponsible', {
          userId: this.user._id,
          list: this.listCollaboratorsSelected.map(c => c._id)
        })
          .then(response => {
            if (!response.success) {
              this.$snotifyWrapper.error(response.message)
              return
            }
            this.initResponsible = response.responsibleOf.map(e => ({_id: e}))
            this.responsibleTeam = this.filterById(this.initResponsible)
            this.fetchIndirectResponsible(this.user._id)
          })
          .catch(() => {
            this.$snotifyWrapper.error('No se pudo actualizar el equipo del usuario')
          })
          .finally(() => { this.loaderTeam = false })
      }
    },
    computed: {
      ...mapState('users', [
        'user'
      ]),
      ...mapState('collaborators', [
        'collaboratorSelected',
        'listCollaboratorsSelected',
        'showList'
      ]),
      ...mapGetters('collaborators', [
        'hasSelected',
        'filterById'
      ]),
      hasBosses () {
        return this.bosses.length !== 0
      },
      hasResponsibleTeam () {
        return this.responsibleTeam.length !== 0
      },
      hasIndirectResponsibleTeam () {
        return this.indirectResponsibleTeam.length !== 0
      }
    },
    watch: {
      showList () {
        if (this.showList) {
          return
        }
        this.confirmUpdate()
      },
      user: {
        immediate: true,
        handler: function () {
          if (this.user.hasOwnProperty('_id')) {
            this.fetchBosses(this.user._id)
            this.fetchResponsible(this.user._id)
            this.fetchIndirectResponsible(this.user._id)
          }
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  h3 {
    background-color: #83B7AD;
    color: #FFF;
    margin: 0;
    padding: 10px;
    font-weight: bold;
    font-size: 18px;
  }

  .title {
    color: black;
    font-size: large;
    font-weight: bold;

    span {
      font-weight: normal;
      cursor: pointer;
    }
  }

  .empty {
    font-size: medium;
    color: black;
  }

  .floating-button {
    height: 56px;
    width: 56px;
    border: none;
    background: $primary-color;
    border-radius: 56px;
    position: absolute;
    right: 30px;
    bottom: 0;
    padding: 16px;
    box-shadow: 0px 6px 8px -1px rgba(0, 0, 0, 0.15);
    transition: all .3s ease;

    &:hover {
      height: 72px;
      width: 72px;
      right: 28px;
      bottom: 10px;
      box-shadow: 0 30px 30px -10px rgba(0, 0, 0, 0.2);
    }

    &:focus {
      outline: 0;
    }

    img {
      height: auto;
      width: auto;
    }
  }

  .box {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .separator {
    margin-bottom: 30px;
  }

  @media (min-width: 481px) {
    h3 {
      display: none;
    }
  }
</style>
