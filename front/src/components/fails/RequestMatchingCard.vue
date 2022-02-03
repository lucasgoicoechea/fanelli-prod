<template>
  <div class="request-matching-card" @click="more">
    <article>
      <header>
        <div class="actors">
          <h4>Supervisor: {{ supervisor }}</h4>
          <h5 :class="coincidenceClass()">Coincidencia: {{ coincidences() }} elemento{{ checkPlural() }}</h5>
        </div>
      </header>
      <transition name="slide-fade">
        <section v-if="seeMore">
          <table-preview :elements="request.items"></table-preview>
        </section>
      </transition>
    </article>
    <footer v-bind:class="styleStatus(request)">
      <p>{{ niceDate }}</p>
      <p v-show="!seeMore" @click.stop @click="more">Ver más</p>
      <p v-show="seeMore" @click.stop @click="more">Ver menos</p>
    </footer>
  </div>
</template>

<script>
  import TablePreview from './TablePreview.vue'
  import { mapGetters, mapState } from 'vuex'

  export default {
    name: 'RequestMatchingCard',
    components: {TablePreview},
    props: {
      request: {
        type: Object,
        required: true
      },
      currentRequest: {
        type: Object,
        required: false
      }
    },
    data () {
      return {
        seeMore: false,
        itemCoincidences: 0
      }
    },
    methods: {
      goRequest (request) {
        this.$router.push({name: 'epp-request', params: {id: request._id}})
      },
      more () {
        this.seeMore = !this.seeMore
      },
      styleStatus: function (e) {
        return {
          solved: e.resolved && !e.delivered,
          delivered: e.delivered
        }
      },
      imgStyle: function (e) {
        return {
          imgSolved: e.resolved
        }
      },
      coincidenceClass: function () {
        return {
          'matching-item': this.itemCoincidences > 0
        }
      },
      // TODO: move this functionality to a utils file
      checkPlural: function () {
        return this.itemCoincidences !== 1 ? 's' : ''
      },
      coincidences: function () {
        let amount = 0
        if (this.currentRequest) {
          this.request.items.forEach((item) => {
            this.currentRequest.items.forEach((currentRequestItem) => {
              if (currentRequestItem.type === item.type) {
                amount++
              }
            })
          })
        } else {
          this.request.items.forEach((item) => {
            this.data.forEach((dataItem) => {
              if (dataItem.quantity > 0 && dataItem.type === item.type) {
                amount++
              }
            })
          })
        }
        this.itemCoincidences = amount
        return amount
      }
    },
    computed: {
      ...mapGetters('catalog', [
        'getWithQuantity'
      ]),
      ...mapState('catalog', [
        'data'
      ]),
      niceDate: function () {
        return this.$moment(this.request.created_at).fromNow()
      },
      supervisor: function () {
        if (this.request.supervisor === null || this.request.supervisor === undefined) {
          return ''
        }
        return `${this.request.supervisor.lastname} ${this.request.supervisor.name}`
      },
      collaborator: function () {
        if (this.request.collaborator === null || this.request.collaborator === undefined) {
          return ''
        }
        return this.request.collaborator.name
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .request-matching-card {
    background: white;
    box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    margin: 8px 0;
  }

  .matching-item {
    color: red;
  }

  article {
    padding: 5px;

    h4, h5 {
      font-weight: bold;
      margin: 4px 0;
    }
    p {
      font-size: 11px;
    }
  }

  header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  footer {
    font-size: 10px;
    text-align: left;
    background: $primary-color;
    color: white;
    padding: 4px;
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.25);

    p {
      font-weight: bold;
      font-size: 12px;
      margin: 0;
      cursor: pointer;
    }
  }

  span {
    padding: 10px;
    font-size: 25px;
    cursor: pointer;
    color: $primary-color;
  }
</style>
