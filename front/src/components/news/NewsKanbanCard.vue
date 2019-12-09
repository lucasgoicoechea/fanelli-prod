<template>
  <card-container>
    <card-section actionsBackgroundColor="#ee9130">
      <div slot="content">
        <h4>{{ obj.collaborator.lastname }} {{ obj.collaborator.name }} {{ mapType }}</h4>
        <p>Reporta: {{ obj.creator.lastname }} {{ obj.creator.name }} - <span>{{obj.created_at | moment("DD/MM/YY - hh:mm a")}}</span>
        </p>
      </div>
      <div slot="actions">
        <div class="time">
          <h5>{{ discountedMinutes }}</h5>
          <p>minutos</p>
        </div>
      </div>
    </card-section>
    <card-footer backgroundColor="#5162a5">
      <p class="footer">{{ agoTime }}</p>
      <p class="footer" v-show="isFinished">VER DESCARGO</p>
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
    created: function () {},
    methods: {},
    computed: {
      mapType () {
        return this.TYPES[this.obj.type]
      },
      agoTime () {
        return this.$moment(this.obj.created_at).fromNow()
      },
      isFinished () {
        return this.obj.hasOwnProperty('exculpatory')
      },
      discountedMinutes () {
        if (this.obj.hasOwnProperty('discountedTime')) {
          const minutes = parseInt((this.obj.discountedTime / (1000 * 60)))
          return (minutes < 10) ? '0' + minutes : minutes
        }
        return 0
      }
    }

  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";
  .content {
    h4 {
      color: gray;
      font-weight: bold;
    }

    p {
      color: gray;
      margin-bottom: 2px;
    }

    span {
      font-family: monospace;
    }
  }

  .time {
    margin: 10px;

    h5, p {
      color: white;
      margin: 0;
      text-align: center;
      font-weight: bold;
    }

    h5 {
      font-size: xx-large;
      font-family: monospace;
    }

    p {
      font-size: smaller;
    }
  }

  .clarification {
    text-align: center;
  }

  .footer {
    padding: 0 4px;
    margin: 0;
    color: white;
    font-weight: bold;
  }
</style>
