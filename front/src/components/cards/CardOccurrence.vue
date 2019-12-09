<template>
  <div class="card-occurrence">
    <router-link :to="redirect">
      <card-container>
        <card-header :headerBackground="getTitleBackgroundColor">
          <p slot="header">
            <span>{{ occurrenceType }}</span>
          </p>
        </card-header>
        <card-section>
          <div class="card-section" slot="content">
            <p>
              <span class="time"> {{ createdDate }} </span>
              <span>para {{ applyCollaborators }}</span>
            </p>
            <p>{{ summary }}</p>
          </div>
        </card-section>
      </card-container>
    </router-link>
  </div>

</template>

<script>
  import CardContainer from '@/components/cards/CardContainer.vue'
  import CardHeader from '@/components/cards/CardHeader.vue'
  import CardSection from '@/components/cards/CardSection.vue'
  import CardFooter from '@/components/cards/CardFooter.vue'
  import dateAndTime from '@/utils/dateAndTime.js'

  export default {
    name: 'CardOccurrence',
    components: {
      CardContainer,
      CardHeader,
      CardSection,
      CardFooter
    },
    props: {
      occurrence: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        TYPE_COLOR: {
          APPROVED: '#64c25a',
          REJECTED: '#f86467'
        }
      }
    },
    computed: {
      getTitleBackgroundColor () {
        return this.TYPE_COLOR[this.occurrence.state]
      },
      occurrenceType () {
        return this.occurrence.recommendations
          .map(e => this.$constants.OCCURRENCE_TYPE_READABLE[e])
          .join(', ')
      },
      createdDate () {
        return dateAndTime.dateWithTimeLong(this.occurrence.created_at)
      },
      applyCollaborators () {
        return this.occurrence.collaborators
          .map(collaborator => collaborator.lastname)
          .join(', ')
      },
      summary () {
        return this.occurrence.observation
      },
      redirect () {
        return {
          name: 'occurrence-detail',
          params: { id: this.occurrence._id }
        }
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
    color: #3d3d3d;
  }

  .request-extra-info {
    color: grey;
  }

  .subheader {
    font-size: 16px;
    color: #000000;
  }
</style>
