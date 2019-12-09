<template>
  <div class="card-sanction">
    <router-link :to="redirect">
      <card-container>
        <card-header :headerBackground="getTitleBackgroundColor">
          <p slot="header">
            <span>{{ sanctionType }}</span>
          </p>
          <!--
          <p slot="subHeader" class="subheader">
            por {{ creatorName }}
          </p>
          -->
        </card-header>
        <card-section>
          <div class="card-section" slot="content">
            <p>
              <span class="time"> {{ createdDate }} </span>
              <span>para {{ applyCollaborators }}</span>
            </p>
            <p v-if="isSuspension">{{ summarySuspension }}</p>
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
    name: 'CardSanction',
    components: {
      CardContainer,
      CardHeader,
      CardSection,
      CardFooter
    },
    props: {
      sanction: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        TYPE_COLOR: {
          SUSPENSION: '#378ffa',
          WARNING: '#475b8b'
        },
        redirect: {
          name: 'sanction-detail',
          params: { id: this.sanction._id }
        }
      }
    },
    computed: {
      getTitleBackgroundColor () {
        return this.TYPE_COLOR[this.sanction.type]
      },
      sanctionType () {
        return this.$constants.SANCTION_TYPE_READABLE[this.sanction.type]
      },
      createdDate () {
        return dateAndTime.dateWithTimeLong(this.sanction.created_at)
      },
      creatorName () {
        return `${this.sanction.creator.lastname} ${this.sanction.creator.name}`
      },
      applyCollaborators () {
        return this.sanction.collaborators
          .map(collaborator => collaborator.lastname)
          .join(', ')
      },
      isSuspension () {
        return this.sanction.type === this.$constants.SANCTION_TYPE.SUSPENSION
      },
      summarySuspension () {
        const type = this.$constants.SANCTION_TYPE_READABLE[this.sanction.type]
        const rangeText =
          `para el ${dateAndTime.dateDayAndMonth(this.sanction.dateRange.from)}
          hasta el ${dateAndTime.dateDayAndMonth(this.sanction.dateRange.to)}`
        return `${type} ${rangeText}`
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
