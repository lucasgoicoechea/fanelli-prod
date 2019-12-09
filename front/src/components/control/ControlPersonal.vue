<template>
  <div class="control-personal">
    <navigation :title="title"></navigation>
    <section>
      <header class="wrapper-horizontal">
        <div class="card">
          <card-button
            to="#"
            :replace="true"
            icon="/static/img/icons-personal/solicitudes.svg"
            title="Solicitudes"
            @click.native="select(0)"
            :isSelected="element === 0"></card-button>
        </div>
        <div class="card">
          <card-button
            :to="{ name: 'new-kanban-personal' }"
            :replace="true"
            icon="/static/img/icons-personal/Eventos.svg"
            title="Novedades"
            @click.native="select(1)"
            :isSelected="element === 1"></card-button>
        </div>
        <div class="card">
          <card-button
            :to="{ name: 'gestionPersonal' }"
            :replace="true"
            icon="/static/img/icons-personal/gestionpersonal.svg"
            title="Personal"
            @click.native="select(2)"
            :isSelected="element === 2"></card-button>
        </div>
      </header>
    </section>
    <router-view></router-view>
  </div>
</template>

<script>
  import Navigation from '@/components/Navigation.vue'
  import CardButton from '@/components/CardButton.vue'

  export default {
    name: 'ControlPersonal',
    components: {Navigation, CardButton},
    props: {},
    data () {
      return {
        title: 'Panel de control',
        element: -1
      }
    },
    created: function () {
    },
    methods: {
      select (e) {
        this.element = e
      }
    },
    computed: {
      sector: function () {
        return this.$route.params.sector.value
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  section {
    margin-top: 20px;

    .wrapper-horizontal {
      min-width: 100%;
      display: flex;
      overflow-x: auto;
    }

    header::-webkit-scrollbar {
      display: none;
    }

    .card {
      background-color: white;
      min-width: 13vw;
      margin: 0 15px;
    }
  }

  @media (max-width: 740px) {
    section {
      header {
        .card {
          min-width: 22vw;
          margin: 5px 15px;
        }
      }
    }
  }

  @media (max-width: 470px) {
    section {
      header {
        .card {
          min-width: 28vw;
          margin: 5px 8px;
        }
      }
    }
  }
</style>
