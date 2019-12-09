<template>
  <div v-infinite-scroll="fetchData"
       infinite-scroll-disabled="disable"
       infinite-scroll-distance="0">
    <slot>

    </slot>
    <div class="center-horizontally">
      <div class="loading" v-show="loading && !showLoadMore">
        <spinner></spinner>
      </div>

      <div v-show="showLoadMore">
        <button class="button-load-more" @click="loadMore">Cargar más</button>
      </div>
    </div>
  </div>
</template>

<script>
  import Spinner from 'vue-simple-spinner'
  import InfiniteScroll from 'vue-infinite-scroll'

  export default {
    name: 'UbyInfiniteScroll',
    components: {
      Spinner,
      InfiniteScroll
    },
    data () {
      return {
        showLoadMore: false
      }
    },
    props: {
      onScroll: {
        type: Function,
        required: true
      },
      disable: {
        type: Boolean,
        required: true
      },
      loading: {
        type: Boolean,
        required: true
      }
    },
    methods: {
      fetchData () {
        this.showLoadMore = false
        return new Promise((resolve, reject) => {
          this.onScroll()
            .then(
              (res) => {
                if (this.showLoadMore) {
                  this.showLoadMore = false
                }
                resolve(res)
              }
            )
            .catch(
              (err) => {
                this.showLoadMore = true
                reject(err)
              }
            )
        })
      },
      loadMore () {
        this.fetchData()
          .catch(this.$snotifyWrapper.warning('No se pudieron cargar las solicitudes'))
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/styles/variables";

  .button-load-more {
    padding: 6px 16px;
    text-decoration: none;
    border: none;
    border-radius: 50px;
    color: white;
    font-weight: bold;
    outline: none;
    background-color: $secondary-color;
  }

  /* Extract to a common CSS utility file? */
  .center-horizontally {
    display: flex;
    justify-content: center;
  }

</style>
