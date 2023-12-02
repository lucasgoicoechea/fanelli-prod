<template>
  <card-container>
    <card-section backgroundColor="#ff0c1b" actionsBackgroundColor="#ff0c1b">
      <div slot="content">
        <h4>{{ obj.collaborator.lastname }} {{ obj.collaborator.name }} {{ mapType }}</h4>
        <p>Reporta: {{ obj.creator.lastname }} {{ obj.creator.name }} - <span>{{obj.created_at | moment("DD/MM/YY - hh:mm a")}}</span>
        </p>
      </div>
      <div slot="actions">
        <div class="image">
          <img src="/static/img/icon-novedades/novacc.svg" alt="">
        </div>
      </div>
    </card-section>
    <card-footer backgroundColor="white">
      <p class="footer">{{ agoTime }}</p>
    </card-footer>
  </card-container>
</template>

<script>
  import CardContainer from '@/components/cards/CardContainer.vue'
  import CardSection from '@/components/cards/CardSection.vue'
  import CardFooter from '@/components/cards/CardFooter.vue'

  export default {
    name: 'NewsKanbanCard',
    components: {
      CardContainer,
      CardSection,
      CardFooter
    },
    props: {
      obj: {
        type: Object,
        required: true
      }
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
    computed: {
      mapType () {
        return this.TYPES[this.obj.type]
      },
      agoTime () {
        return this.$moment(this.obj.created_at).fromNow()
      }
    }

  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .content {
    h4 {
      color: white;
      font-weight: bold;
    }

    p {
      color: #ff9596;
      margin-bottom: 2px;
    }

    span {
      font-family: monospace;
    }
  }



  .clarification {
    text-align: center;
  }

  .footer {
    padding: 0 4px;
    margin: 0;
    color: red;
    font-weight: bold;
  }

  .image {
    margin: 5px;
    height: 50px;
    width: 50px;
  }
</style>
