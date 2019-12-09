<template>
  <card-container :style="cardContainerStyle" @click.native="goTo">
    <card-header :headerBackground="getTitleBackgroundColor(titleBackgroundColor)">
      <p slot="header">{{ title }}</p>
      <p slot="subHeader" v-if="subTitle !== undefined" class="subheader"> {{ subTitle }} </p>
    </card-header>
    <card-section>
      <div class="card-section" slot="content">
        <span class="time"> {{ date }} </span>
        <span class="request-info"> {{ extraInfo }} </span>
        <div class="request-extra-info"> {{ secondLineInfo }} </div>
      </div>
      <div @click.stop slot="actions">
        <button class="reject">
          <img src="/static/img/checklists/cross.svg" alt="">
          <!--<spinner-little v-else :show="request.rejectLoading"></spinner-little>-->
        </button>
        <button class="accept">
          <img src="/static/img/checklists/tick.svg" alt="">
          <!--<spinner-little v-else :show="request.acceptLoading"></spinner-little>-->
        </button>
      </div>
      <span v-if="$can('JEFE_LINEA') && showActionButtons" slot="actions"> <!-- handle roles !-->
        <blockable-button class="button-icon"
                          icon="../static/img/icons-kanban/print.svg"
                          buttonBackgroundColor="#2b3775"
                          buttonRadius="20%"
                          buttonWidth="80px"
                          buttonHeight="45px"></blockable-button>
      </span>
    </card-section>
  </card-container>
</template>

<script>
  import auth from '@/auth'
  import CardContainer from '@/components/cards/CardContainer.vue'
  import CardHeader from '@/components/cards/CardHeader.vue'
  import CardSection from '@/components/cards/CardSection.vue'
  import CardFooter from '@/components/cards/CardFooter.vue'

  import Const from '@/const.js'
  import authorize from '@/utils/authorize'
  import BlockableButton from '../buttons/blockableButton.vue'

  const {ROLES} = Const

  export default {
    name: 'StatusCard',
    components: {
      CardContainer,
      CardHeader,
      CardSection,
      CardFooter,
      BlockableButton
    },
    props: {
      request: {
        type: Object,
        required: false
      },
      title: {
        type: String,
        required: true
      },
      subTitle: {
        type: String,
        required: false
      },
      date: {
        type: String,
        required: false
      },
      extraInfo: {
        type: String,
        required: false
      },
      titleBackgroundColor: {
        type: String,
        required: false
      },
      subTitleBackgroundColor: {
        type: String,
        required: false
      },
      goToData: {
        type: Object,
        required: false
      },
      secondLineInfo: {
        type: String,
        required: false
      },
      showActionButtons: {
        type: Boolean,
        required: false,
        default: false
      }
    },
    data () {
      return {}
    },
    methods: {
      goTo () {
        if (this.goToData === undefined) {
          return
        }
        this.$router.push({
          name: this.goToData.routeName,
          params: {[this.goToData.paramName]: this.goToData.paramValue}
        })
      },
      accept () {
      },
      getTitleBackgroundColor (color) {
        switch (color) {
          case 'DEEPBLUE':
            return '#1e3773'
          case 'PINK':
            return '#f86567'
          case 'GREEN':
            return '#65c25a'
          case 'MARINEBLUE':
            return '#3063ac'
          case 'TERRACOTA':
            return '#e28c44'
          case 'ORANGE':
            return '#e28c44'
          default:
            return '#e28c44'
        }
      },
      getSubTitleBackgroundColor (color) {
        switch (color) {
          case 'MARINEBLUE':
            return '#2b4a9f'
          case 'PINK':
            return '#f78384'
          case 'LIGHTGREEN':
            return '#a2da9b'
          case 'BLUE':
            return '#3c7ed9'
          case 'LIGHTPINK':
            return '#fbc697'
          default:
            return '#e2cea4'
        }
      },
      storeAction (req) {
        this.$store.dispatch('requests/approvalById', {id: req._id, approved: false, user: auth.getUser()})
      }
    },
    computed: {
      permission: function () {
        return authorize(ROLES.JEFES)
      },
      cardContainerStyle () {
        return {
          cursor: (this.goToData !== undefined) ? 'pointer' : 'default'
        }
      }
    }
  }
</script>yaera oarA

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  p {
    margin: 0;
    font-weight: 300;
  }

  button {
    margin: 2px 0;
    padding: 4px 16px;
    text-decoration: none;
    border: none;
    border-radius: 50px;
    color: white;

    img {
      height: 20px;
      width: 20px;
    }

    &.accept {
      background-color: #65c25a;
    }
    &.reject {
      background-color: #f86567;
    }

    &:disabled {
      cursor: not-allowed;
    }
  }

  .card-section {
  }

  .request-info {
    font-weight: bold;
  }

  .time {
    font-size: 16px;
    font-family: monospace;
  }

  .request-extra-info {
    font-size: 16px;
  }

  .subheader {
    color: #000000;
    background-color: unset;
  }

  .button-icon {
    position: relative;
    bottom: 10px;
  }


</style>
