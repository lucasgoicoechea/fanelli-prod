<template>
  <div class="request-card" @click="more">
    <article>
      <div class="card-container">
        <div class="actors">
          <h4>Supervisor: {{ supervisor }}</h4>
          <h5>Colaborador: {{ collaborator }}</h5>
          <h5>Nº de solicitud: {{ request.global_request_counter }}</h5>

        </div>
        <blockable-button v-if="request.resolved && showPrintButton"
                          icon="/static/img/icons-kanban/print.svg"
                          title="Imprimir"
                          :clickMethod="print.bind(this, {moveToSolved: false})"
                          :isLoading="loading"
                          buttonBackgroundColor="#4257b3"
                          buttonBackgroundHoverColor="#236098"
                          class="print-button-resolved"></blockable-button>

        <img v-if="request.resolved && !request.delivered" src="/static/img/icons-kanban/tick.svg"
             v-bind:class="imgStyle(request)" @click.stop @click="deliver">
        <img v-else-if="request.delivered" src="/static/img/icons-kanban/reestablecer.svg"
             v-bind:class="imgStyle(request)" @click.stop @click="moveToSolved">

        <blockable-button v-else-if="!request.delivered && !request.resolved && showPrintButton"
                          icon="/static/img/icons-kanban/print.svg"
                          title="Imprimir"
                          :clickMethod="print.bind(this, {moveToSolved: true})"
                          :isLoading="loading"
                          class="print-button-pending"></blockable-button>
      </div>
      <transition name=" slide-fade">
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
  import TablePreview from '../epp/TablePreview.vue'
  import Vue from 'vue'
  import BlockableButton from '../buttons/blockableButton.vue'

  export default {
    name: 'RequestCard',
    components: {
      BlockableButton,
      TablePreview
    },
    props: {
      request: {
        type: Object,
        required: true
      },
      showPrintButton: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        seeMore: false,
        loading: false
      }
    },
    methods: {
      goRequest (request) {
        this.$router.push({name: 'epp-request', params: {id: request._id}})
      },
      more () {
        this.seeMore = !this.seeMore
      },
      print (props) {
        this.loading = true
        const self = this
        Vue.http.get('security-element/get-pdf/' + this.request._id,
          {responseType: 'arraybuffer'}
        ).then(function (response) {
          var blob = new Blob([response.data], {type: response.headers.get['content-type']})
          var link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = `${self.request.collaborator.lastname} - ${self.request.global_request_counter}.pdf`
          link.click()

          if (props.moveToSolved) {
            self.$store.commit('requests/pendingToSolved', {request: self.request})
          }

          self.loading = false
        })
      },
      deliver () {
        this.$modal.show('dialog', {
          text: `¿Esta seguro de realizar esta acción?`,
          buttons: [
            {
              title: 'Si',
              handler: () => {
                this.$modal.hide('dialog')
                this.$store.dispatch('requests/moveToDelivery', {request: this.request, delivered: true})
              }
            },
            {
              title: 'No'
            }
          ]
        })
      },
      moveToSolved () {
        this.$modal.show('dialog', {
          text: `¿Esta seguro de mover esta solicitud ha 'Pendiente de entrega'?`,
          buttons: [
            {
              title: 'Si',
              handler: () => {
                this.$modal.hide('dialog')
                this.$store.dispatch('requests/moveToDelivery', {request: this.request, delivered: false})
              }
            },
            {
              title: 'No'
            }
          ]
        })
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
      }
    },
    computed: {
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
        return `${this.request.collaborator.lastname} ${this.request.collaborator.name}`
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .request-card {
    background: white;
    box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.3);
    margin-bottom: 20px;
    cursor: pointer;
  }

  .print-button-resolved {
    margin-left: auto;
    position: relative;
    right: 5%;
    background-color: $secondary-color;

    &:hover {
      background-color: $secondary-darker;
    }
  }

  .print-button-pending {
    margin-left: auto;
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

  .card-container {
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

  img {
    height: 50px;
    width: 50px;
    background-color: $secondary-darker;
    cursor: pointer;
  }

  .solved {
    background-color: $secondary-darker;
  }

  .delivered {
    background-color: gray;
  }

  .imgSolved {
    background-color: white;
  }

  /* Enter and leave animations can use different */
  /* durations and timing functions.              */
  .slide-fade-enter-active {
    transition: all .5s ease;
  }

  .slide-fade-leave-active {
    transition: all .5s ease;
  }

  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */
  {
    transform: translateY(50px);
    opacity: 0;
  }

  span {
    padding: 10px;
    font-size: 25px;
    cursor: pointer;
    color: $primary-color;
  }
</style>
