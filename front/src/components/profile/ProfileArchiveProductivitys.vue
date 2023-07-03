<template>
  <div class="productivity-list">
    
    <div
      class="cards-container"
      v-infinite-scroll="fetch"
      infinite-scroll-disabled="notUpdateList"
      infinite-scroll-distance="200">

      <div class="empty" v-show="emptyList">
        No hay desempeños.
      </div>

      <productivity-card
        v-for="(item, index) in productivity.list"
        :key="index"
        :productivity="item"></productivity-card>

      <div class="spinner-container">
        <spinner
          class="spinner" :show="productivity.loading"
          loadingMessage="Cargando reuniones..."></spinner>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Navigation from '@/components/Navigation.vue'
  import Spinner from '@/components/SpinnerWrapper.vue'
  import ProductivityCard from '@/components/productivity/ProductivityCard.vue'

  export default {
    name: 'ProfileArchiveProductivitys',
    components: {
      ProductivityCard,
      Navigation,
      Spinner
    },
    data () {
      return {
        title: 'Listado de Desempeños',
        fullAccess: false,
        productivity: {
          list: [],
          loading: false,
          lastOne: false,
          page: 1
        }
      }
    },
    created () {
      this.fullAccess = true
    },
    methods: {
      fetch () {
        if (this.user) {
          this.productivity.loading = true
          const action = (this.fullAccess)
            ? 'productivity/fetchAllTo'
            : 'productivity/fetchAllTo'

          this.$store.dispatch(action, {userId: this.$route.params.id, page: this.productivity.page})
            .then(this.successFetch)
            .catch(this.failFetch)
        }
      },
      successFetch (response) {
        if (response.productivitys.length === 0) {
          this.productivity.lastOne = true
        } else {
          response.productivitys.forEach(e => {
            this.productivity.list.push(e)
          })
          this.productivity.page += 1
        }
        this.productivity.loading = false
      },
      failFetch () {
        this.$snotifyWrapper.error('Se produjo un error al buscar las desempeños')
        this.productivity.loading = false
      },
      notUpdate (dataModel) {
        return dataModel.loading || dataModel.lastOne
      },
      empty (dataModel) {
        return dataModel.list.length === 0 && !dataModel.loading
      }
    },
    computed: {
      ...mapState('users', [
        'user'
      ]),
      notUpdateList () {
        return this.notUpdate(this.productivity)
      },
      emptyList () {
        return this.empty(this.productivity)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/_variables.scss";
  @import "~@/assets/styles/_mixins.scss";

  .cards-container {
    position: relative;
    width: 90%;
    margin: 20px auto;
  }

  .spinner-container {
    margin: 25px 0;
  }

  .empty {
    font-size: 20px;
    text-align: center;
    margin-top: 20px;
  }

  .separator {
    height: 0;
    border-top: 3px solid $primary-color;
  }
</style>