<template>
  <article class="check-history-item">
    <header>
      <div class="title" :title="comparative.text" @click="showMobile()" :class="mobile()">{{ comparative.text }}</div>
      <div class="states">
        <check-value-number
          v-if="comparative.extra"
          v-for="(c, i) in comparative.comparative"
          :key="i"
          class="state"
          v-bind:class="arrow(index(c))"
          :item="c"
          @click.native="select(index(c))"
        ></check-value-number>
        <check-value-boolean
          v-if="!comparative.extra"
          v-for="(c, i) in comparative.comparative"
          :key="i"
          class="state"
          v-bind:class="arrow(index(c))"
          :item="c"
          @click.native="select(index(c))"
        ></check-value-boolean>
      </div>
    </header>
    <section v-for="c in comparative.comparative" v-show="show(index(c))">
      <h3>Turno {{ getComparativeHeaders[index(c)].schedule | capitalize }} </h3>
      <div class="information" v-if="history(c).length === 0">
        <p>No hay información</p>
      </div>
      <div class="information" v-for="h in history(c)">
        <p>
          <span class="time">{{h.date | moment("DD/MM/YY HH:mm")}}</span>
          <span class="separator"> - </span>
          <span>{{h.comment}}</span>
          <img v-show="(h.value !== undefined) && h.value" src="/static/img/checklists/tick.svg" alt="">
          <img v-show="(h.value !== undefined) && !h.value" src="/static/img/checklists/cross.svg" alt="">
          <span>{{h.extra}}</span>
        </p>
        <p class="colaborator">{{h.supervisor.lastname}}</p>
      </div>
    </section>
  </article>
</template>

<script>
  import CheckValueBoolean from '@/components/checklistsLTres/CheckValueBoolean.vue'
  import CheckValueNumber from '@/components/checklistsLTres/CheckValueNumber.vue'
  import { mapState, mapGetters } from 'vuex'

  export default {
    name: 'CheckHistoryItem',
    components: {CheckValueBoolean, CheckValueNumber},
    props: {
      comparative: {
        type: Object
      }
    },
    data () {
      return {
        selected: -1,
        mobileView: false
      }
    },
    methods: {
      showMobile () {
        this.mobileView = !this.mobileView
      },
      mobile () {
        return {
          mobile: this.mobileView
        }
      },
      select (id) {
        if (this.selected === id) {
          this.selected = -1
        } else {
          this.selected = id
        }
      },
      show: function (id) {
        return id === this.selected
      },
      arrow: function (id) {
        return {
          arrow: this.show(id)
        }
      },
      index: function (e) {
        return this.comparative.comparative.indexOf(e)
      },
      history: function (e) {
        const history = e.comments.concat(e.values)
        return history.sort(function (a, b) {
          return new Date(b.date) - new Date(a.date)
        })
      }
    },
    computed: {
      ...mapState('checklistsLTres', [
        'types'
      ]),
      ...mapGetters('checklistsLTres', [
        'getComparativeHeaders'
      ])
    },
    filters: {
      capitalize: function (value) {
        if (!value) return ''
        if (value === 'MANIANA') value = 'MAÑANA'
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  article {
    margin-top: 12px;
    color: $secondary-darker;
    font-weight: bold;
    transition: all 0.2s ease;
  }

  header {
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.5);
    border-radius: 2px;
    background: #bdbdbd;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    //align-items: flex-start;
    flex-wrap: wrap;

    .title {
      flex-grow: 1;
      flex-basis: auto;
      font-size: larger;
      padding: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 20%;
    }

    .states {
      flex-grow: 0;
      flex-basis: auto;
      display: flex;
      justify-content: space-between;

      .state {
        cursor: pointer;
        margin: 0 10px;

        &:first-child {
          margin-left: 0;
        }
        &:last-child {
          margin-right: 0;
        }
      }
    }
  }

  section {
    background-color: $primary-color;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.5);
    margin-top: 10px;
    padding: 4px 0;

    h3 {
      margin: 8px 0;
      font-weight: bold;
      color: white;
      text-align: center;
    }
  }

  .information {
    display: flex;
    justify-content: space-between;
    background-color: $primary-light;
    padding: 4px 6px;
    font-size: 1.5rem;
    color: white;
    margin: 8px;

    &:last-child {
      margin-bottom: 4px;
    }

    .time {
      font-family: monospace;
      font-size: 1.5rem;
      font-weight: normal;
    }

    .separator {
      margin: 0 6px;
    }

    p {
      margin: 0;
      padding: 0;

      img {
        width: 1.5rem;
      }
    }

    .colaborator {
      min-width: 20%;
      text-align: right;
    }
  }

  .arrow:after {
    bottom: -26px;
    left: 50%;
    border: solid transparent;
    content: "";
    height: 0;
    width: 0;
    position: absolute;
    border-color: rgba(136, 183, 213, 0);
    border-bottom-color: $primary-color;
    border-width: 28px;
    margin-left: -30px;
  }

  @media (max-width: 340px) { // iphone 6plus landscape
    header {

      .title {

        &.mobile {
          width: 100%;
          white-space: normal;
        }

      }

      .states {
        .state {
          margin: 0 2px;
        }
      }
    }
  }

</style>
