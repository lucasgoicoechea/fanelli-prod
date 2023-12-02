<template>
  <div class="news-kanban">
    <section>
      <div class="container-fluid">
        <div class="row">
          <div class="col-xs-6">
            <h3>Pendientes de descargo</h3>
            <div class="cards-container">
              <p class="clarification" v-show="pending.length === 0">
                Aún no se han recibido novedades </p>
              <component v-for="p in pending" :key="p._id" :obj="p" v-bind:is="typeCard(p.type)">
              </component>
            </div>
          </div>
          <div class="col-xs-6">
            <h3>Terminadas</h3>
            <div class="cards-container">
              <p class="clarification" v-show="finished.length === 0">
                No hay novedades terminadas </p>
              <component v-for="f in finished" :key="f._id" :obj="f" v-bind:is="typeCard(f.type)">
              </component>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import NewsKanbanCard from '@/components/news/NewsKanbanCard.vue'
  import NewsKanbanCardAccident from '@/components/news/NewsKanbanCardAccident.vue'

  export default {
    name: 'NewsKanban',
    components: {
      'default': NewsKanbanCard,
      'accident': NewsKanbanCardAccident
    },
    data () {
      return {
        TYPES: {
          ABSENT: 'Faltó con aviso',
          LATE: 'LLegó tarde',
          EARLY: 'Salió antes',
          ACCIDENT: 'sufrió un accidente'
        }
      }
    },
    created: function () {
      this.$store.dispatch('news/fetchPendingNews')
      this.$store.dispatch('news/fetchFinishedNews')
    },
    methods: {
      typeCard (type) {
        if (type === 'ACCIDENT') {
          return 'accident'
        }
        return 'default'
      }
    },
    computed: {
      ...mapState('news', [
        'pending',
        'finished'
      ])
    }

  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .cards-container {
    background: #EEEEEE;
    padding: 10px;
    min-height: 50vh;
  }

  h3 {
    text-align: center;
    font-weight: bold;
    color: $secondary-darker;
  }

  .clarification {
    text-align: center;
  }

  .container-fluid {
    width: 80%;
  }

  @media (min-width: 600px) and (max-width: 1200px) {
    .container-fluid {
      width: 90%;
    }
  }

  @media (max-width: 599px)  {
    .container-fluid {
      width: 100%;
    }
  }

</style>
