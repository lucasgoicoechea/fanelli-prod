<template>
  <li class="request-item">
    <figure class="icon" :style="getCircleStyle">
      <img :src="iconUrl" :class="getIconClass">
    </figure>
    <header>
      <h4>{{ headerText }}</h4>
      <div class="secondaryHeader">
        {{ secondaryHeaderText }}
      </div>
    </header>
  </li>
</template>

<script>
  import Constants from '@/const.js'

  export default {
    name: 'RequestWrapper',
    props: {
      headerText: {
        type: String,
        required: true
      },
      secondaryHeaderText: {
        type: String,
        required: true
      },
      state: {
        type: String
      }
    },
    methods: {},
    computed: {
      iconUrl: function () {
        let url

        switch (this.state) {
          case Constants.states.COMPLETED:
            url = '/static/img/checklists/tick.svg'
            break
          case Constants.states.PENDING:
            url = '/static/img/icons-actions/cargando.svg'
            break
          case Constants.states.ERROR:
            url = '/static/img/checklists/cross.svg'
            break
          default:
            url = '/static/img/icons-actions/cargando.svg'
        }
        return url
      },
      getColor: function () {
        let color
        switch (this.state) {
          case Constants.states.COMPLETED:
            color = '#61c159'
            break
          case Constants.states.PENDING:
            color = '#ff7000'
            break
          case Constants.states.ERROR:
            color = '#fd0000'
            break
          default:
            color = '#000000'
            break
        }
        return color
      },
      getCircleStyle: function () {
        return {backgroundColor: this.getColor}
      },
      getIconClass: function () {
        return {
          loading: this.state === Constants.states.PENDING
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .request-item {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    height: 100%;
    cursor: pointer;
    border-top: 2px solid #929292;
    padding: 5px 0;
  }

  header {
    padding: 4px 55px;
    h4 {
      margin: 0;
      color: #1465a9;
      font-size: 16px;
      font-weight: bold;
    }
  }

  .secondaryHeader {
    padding-top: 5px;
    font-family: Poppins, sans-serif;
    width: 240px;
  }

  section {
    background-color: #EBEBEB;
    padding: 5px 5px 5px 35px;
    font-weight: bold;
    color: #727272;
  }

  .icon {
    position: absolute;
    width: 45px;
    height: 45px;
    padding: 10px;
    border-radius: 50%;
    text-align: center;

    > img {
      width: 100%;
      height: auto;
    }
  }

  .loading {
    animation: spin .7s infinite linear;
  }

  @keyframes spin2 {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes spin {
    from {
      transform: scale(1) rotate(0deg);
    }
    to {
      transform: scale(1) rotate(360deg);
    }
  }

</style>
