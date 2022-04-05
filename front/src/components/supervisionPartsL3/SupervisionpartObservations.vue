<template>
  <article class="supervisionpart-observations">
    <header>
      <div  >Observaciones </div>
        <div class="check-action"
           @click.stop
           @click="showLoadObservation"
           >   
        <img src="/static/img/checklists/comment.svg" alt="">
      </div>
   
    </header>
    <section >
      <div v-if="!observations || observations.length == 0"  style=" background-color: #F0AC83;">
          <span>No hay observaciones de la hora.</span>
      </div>
      <div  v-show="loadObservation"  style="border: solid 1px; padding: 3px 1px 1px 2px; background-color: bisque;" >
       <div v-if="!$loading.isLoading('supervisionpart fetch')" class="observaciones">
        <p v-show="loadingObservation">Cargando ...</p>
        <div class="textarea">
        <textarea
          style="95%"
          v-model="observation"
          placeholder="Escriba aquí una observación general del proceso">
        </textarea>
          <button @click="createObservation" :disabled="loadingObservation">
            <span v-if="!loadingObservation">Agregar</span>
            <spinner-little :show="loadingObservation"></spinner-little>
          </button>
        </div>
       </div>
      </div>
      <div class="  information"  v-for="o in observations" :key="o._id" >
        <div class="container">
          <div class="row">
           <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">
               <span>{{o.comment}}</span>
            </div>
          </div>
          <hr>
          <div class="row">
          <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4"> 
            <span>Fecha/hora: {{o.date | moment("HH:mm")}} </span>
          </div>
          <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">   
            <span>Autor:  {{o.supervisor.lastname}}</span>
          </div>
         </div>
        </div>
      </div>
      
      
    </section> 
  </article>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import Spinner from '@/components/Spinner.vue'
  import SpinnerLittle from '../Spinner.vue'
  import Const from '@/const'

  export default {
    name: 'SupervisionpartObservations',
    components: {
      Spinner,
      SpinnerLittle
    },
    props: {
      observations: Array,
      hour: Object,
      supervisionpart_id: String,
      date: {
        type: String,
        required: false
      }
    },
    data () {
      return {
        current: '',
        observation: ' ',
        loadingObservation: false,
        loadObservation: false,
        selected: -1,
        mobileView: false
      }
    },
    methods: {
      currentStyle (header) {
        return header.schedule === this.current && !this.date ? 'title' : ''
      },
      init () {
        this.current = Const.currentSchedule().value
      },
      currentSchedule (header) {
        return header.schedule === this.current && !this.date
      },
      showMobile () {
        this.mobileView = !this.mobileView
      },
      mobile () {
        return {
          mobile: this.mobileView
        }
      },
      createObservation: function () {
        if (this.observation !== '') {
          this.loadingObservation = true
          const observation = {
            observation: this.observation,
            hour_id: this.hour.hour._id,
            supervisionpart_id: this.supervisionpart_id
          }
          this.$store.dispatch('supervisionparts/createObservationHour', {sector: this.sector, observation})
            .then(() => {
              this.loadingObservation = false
              this.showLoadObservation()
            })
          this.observation = ''
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
        return this.hour.comparative.indexOf(e)
      },
      style: function (e) {

      },
      showLoadObservation: function () {
        this.loadObservation = !this.loadObservation
      },
      history: function (e) {
        const history = e.materials.concat(e.values)
        return history
        /* return history.sort(function (a, b) {
          return new Date(b.date) - new Date(a.date)
        })  */
      }
    },
    created () {
      this.init()
    },
    computed: {
      ...mapState('supervisionparts', [
        'types'
      ]),
      ...mapGetters('supervisionparts', [
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

    textarea {
      width: 80%;
    }
  }

  .information {
    display: flex;
    justify-content: space-between;
    background-color: rgb(240, 172, 131);
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
  .check-action {
    display: block;
    text-align: right;
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
      height: 40px;
      width: 40px;
    }
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
