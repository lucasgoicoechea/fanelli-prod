<template>
  <div class="check-item" v-on:click="select" v-bind:class="current">
    <header v-bind:class="current">
      <div class="text">
        {{ item.check.text }}
        <p v-show="loadObservation && isCurrentCheck(sector, item)">
          Presione la burbuja para añadir una observación
        </p>
      </div>
      <div class="check-action"
           @click.stop
           @click="showLoadObservation"
           v-bind:class="actionActive">
        <img src="/static/img/checklists/comment.svg" alt="">
      </div>
      <check-value-boolean v-if="!item.check.extra" :item="item" :isCurrent="current.active"></check-value-boolean>
      <check-value-number v-else :item="item" :isCurrent="current.active"></check-value-number>
    </header>
    <section v-bind:class="current" v-show="showObservationSection">
      <div class="observations" v-show="itemHasObservation && !loadObservation">
        <h5>Observaciones</h5>
        <div v-for="history in itemHistory" :key="history._id">
          {{history.date | moment("HH:mm")}} {{history.comment}}
          <div class="history">
            <img v-show="(history.value !== undefined) && history.value" src="/static/img/checklists/tick.svg" alt="">
            <img v-show="(history.value !== undefined) && !history.value" src="/static/img/checklists/cross.svg" alt="">
            <span v-show="item.check.extra">{{history.extra}}</span>
          </div>
        </div>
      </div>
      <div class="load-observations" v-show="loadObservation">
        <div class="textarea">
          <textarea placeholder="Escriba aquí una observación..." v-model="comment"></textarea>
          <button @click="submitComment">Agregar</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'
  import Spinner from '@/components/Spinner.vue'
  import CheckValueBoolean from '@/components/checklists/CheckValueBoolean.vue'
  import CheckValueNumber from '@/components/checklists/CheckValueNumber.vue'

  export default {
    name: 'CheckItem',
    components: {
      Spinner,
      CheckValueBoolean,
      CheckValueNumber
    },
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        loadObservation: false,
        comment: ''
      }
    },
    created: function () {
    },
    methods: {
      select: function () {
        this.$store.commit('checklists/selectCheck', {check: this.item.check})
      },
      showLoadObservation: function () {
        this.loadObservation = !this.loadObservation
      },
      submitComment: function () {
        if (this.comment !== '') {
          const check = {
            id: this.item.check._id,
            checklist_id: this.getSector(this.item.check.sector).checklist._id,
            comment: this.comment,
            text: this.item.check.text
          }
          this.$store.dispatch('checklists/createComment', {sector: this.item.check.sector, check})
          this.comment = ''
          this.showLoadObservation()
        }
      }
    },
    computed: {
      sector: function () {
        return this.item.check.sector
      },
      current: function () {
        return {
          active: this.isCurrentCheck(this.sector, this.item)
        }
      },
      actionActive: function () {
        return {
          active: this.loadObservation
        }
      },
      itemHasObservation: function () {
        return this.itemHistory.length > 0
      },
      showObservationSection: function () {
        return this.itemHistory.length > 0 || this.loadObservation
      },
      itemHistory: function () {
        const history = this.item.comments.concat(this.item.values)
        return history.sort(function (a, b) {
          return new Date(b.date) - new Date(a.date)
        })
      },
      ...mapGetters('checklists', [
        'getSector',
        'currentCheck',
        'isCurrentCheck'
      ]),
      ...mapState('checklists', [
        'loading'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";
  @import "../../assets/styles/mixins";

  .check-item {
    cursor: pointer;
    background: #bfbfbf;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.3);
    margin-top: 7px;
    color: $secondary-darker;
    border-radius: 3px;
    overflow: hidden;
    transition: all 0.2s ease;

    &.active {
      background: $primary-color;
      color: #ffffff;
      margin: 10px 10px 10px -10px;
    }
  }

  header {
    display: flex;
    flex-direction: row;
    align-items: flex-start;

    .text {
      padding: 5px;
      font-size: 16px;
      flex-grow: 1;
      flex-shrink: 1;
      flex-basis: auto;

      p {
        margin: 0;
        padding: 0;
        font-size: small;
        color: #dab897;
        font-weight: bold;
      }
    }
    .check-action {
      display: none;
      padding: 8px;
      margin: 10px;
      flex-grow: 0;
      flex-shrink: 0;
      flex-basis: auto;
      align-self: flex-start;

      &.active {
        background: #da9d77;
        border-radius: 25px;
      }

      img {
        height: 25px;
      }
    }

    &.active {

      .text {
        font-weight: bold;
        font-size: 20px;
      }
      .check-action {
        display: block;
      }
    }

  }

  section {
    padding: 5px;
    display: none;

    &.active {
      display: block;
    }

    .observations {
      h5 {
        color: #dac5a9;
        font-weight: bold;
      }

      div {
        margin: 0;
        padding: 2px 0;
        font-weight: bold;
        font-size: medium;

        img {
          width: 15px;
        }
      }

      .history {
        display: inline;
      }
    }
  }

  .textarea {
    position: relative;
    color: $secondary-darker;
    font-weight: bold;
    @include clearfix;
    textarea {
      width: 100%;
      border: none;
      padding: 10px;
      display: block;
      resize: vertical;
      min-height: 100px;

      &:focus {
        outline: none !important;
        border: 2px solid $primary-darker;
      }
    }
    button {
      position: absolute;
      bottom: 5px;
      right: 5px;
      background: $secondary-darker;
      color: #ffffff;
      border: none;
      -webkit-border-radius: 15px;
      -moz-border-radius: 15px;
      border-radius: 15px;
      padding: 5px 15px;
      font-weight: bold;
    }
  }

</style>
