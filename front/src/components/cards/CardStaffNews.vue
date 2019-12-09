<template>
  <div>
    <card-container>
      <card-header :headerBackground="getTitleBackgroundColor">
        <p slot="header">
          <span>{{ requestType }}</span>
        </p>
        <p slot="subHeader" class="subheader">
          por {{ creatorName }}
        </p>
      </card-header>
      <card-section>
        <div class="card-section" slot="content">
          <span class="time"> {{ createdDate }} </span>
          <div class="request-extra-info">
            <span class="monospace grey">{{ request.observation }}
              <a v-if="hasMedicalReport()"
                 :href="request.medicalOrder">
                Click aquí para descargar el informe médico</a> </span>
          </div>
        </div>
      </card-section>
    </card-container>
  </div>

</template>

<script>
  import CardContainer from '@/components/cards/CardContainer.vue'
  import CardHeader from '@/components/cards/CardHeader.vue'
  import CardSection from '@/components/cards/CardSection.vue'
  import CardFooter from '@/components/cards/CardFooter.vue'
  import dateAndTime from '@/utils/dateAndTime.js'

  export default {
    name: 'CardStaffRequest',
    components: {
      CardContainer,
      CardHeader,
      CardSection,
      CardFooter
    },
    props: {
      request: {
        type: Object,
        required: true
      }
    },
    methods: {
      hasMedicalReport () {
        return this.request.medicalOrderPath !== undefined
      }
    },
    computed: {
      getTitleBackgroundColor () {
        return '#ec6e25'
      },
      requestType () {
        return this.$constants.news_types_text[this.request.type]
      },
      createdDate () {
        return dateAndTime.dateWithTimeLong(this.request.created_at)
      },
      creatorName () {
        return `${this.request.creator.lastname} ${this.request.creator.name}`
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  p {
    margin: 0;
    font-weight: 300;
  }

  .request-info {
    font-weight: bold;
  }

  .time {
    font-family: monospace;
    color: grey;
  }

  .request-extra-info {
    color: grey;
  }

  .subheader {
    font-size: 16px;
    color: #000000;
  }
</style>
