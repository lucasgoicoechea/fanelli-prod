<!--
  NotificationWrapper component represent a generic base
  layout for a notification.

  Use and Define NotificationWrapper's props to build
  a new type of notification.
  -->
<template>
  <article class="notification-wrapper" :class="seenStyle">
    <figure class="icon" :style="[headerBg, paddingIconStyle]">
      <img :src="iconUrl">
    </figure>
    <header :style="headerBg">
      <h4>{{ headerText }}</h4>
    </header>
    <div class="secondaryHeader" v-show="secondaryHeaderShow" :style="[secondaryHeaderBg, secondaryColor]">
      {{ secondaryHeaderText }}
    </div>
    <section>
      <span class="time">{{ detailtDate | moment("DD/MM/YY HH:mm") }}</span>
      <span class="info">{{ detailtText }}</span>
    </section>
  </article>
</template>

<script>
  export default {
    name: 'NotificationWrapper',
    props: {
      icon: {
        type: String,
        required: true
      },
      paddingIcon: {
        type: String,
        default: '0'
      },
      headerBackground: {
        type: String,
        default: 'blue'
      },
      headerText: {
        type: String,
        required: true
      },
      secondaryHeaderShow: {
        type: Boolean,
        default: false
      },
      secondaryHeaderBackground: {
        type: String,
        default: '#ffd195'
      },
      secondaryHeaderText: {
        type: String
      },
      secondaryHeaderTextColor: {
        type: String
      },
      detailtText: {
        type: String,
        require: true
      },
      detailtDate: {
        type: String,
        require: true
      },
      isSeen: {
        type: Boolean,
        default: false
      }
    },
    methods: {},
    computed: {
      seenStyle: function () {
        return {
          'not-seen': !this.isSeen,
          'seen': this.isSeen
        }
      },
      paddingIconStyle: function () {
        return {
          padding: this.paddingIcon
        }
      },
      iconUrl: function () {
        return `/static/img/notifications/${this.icon}.svg`
      },
      shortime: function () {
        return this.$moment(this.detailtDate).short()
      },
      headerBg: function () {
        return {
          backgroundColor: this.headerBackground
        }
      },
      secondaryHeaderBg: function () {
        return {
          backgroundColor: this.secondaryHeaderBackground
        }
      },
      secondaryColor: function () {
        return {
          color: this.secondaryHeaderTextColor
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .notification-wrapper {
    position: relative;
    margin: 40px 10px 20px 60px;
    box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.3);
    cursor: pointer;

    &.seen {
      opacity: 0.5;
    }
  }

  header {
    padding: 4px 35px;
    h4 {
      margin: 0;
      color: white;
      font-size: 16px;
      font-weight: bold;
      text-transform: uppercase;
    }
  }

  .secondaryHeader {
    padding: 4px 35px;
  }

  section {
    background-color: #f2f2f2;
    padding: 5px 5px 5px 35px;
    font-weight: bold;
    color: #727272;
  }

  .icon {
    position: absolute;
    width: 80px;
    height: 80px;
    padding: 15px;
    border-radius: 50%;
    left: -50px;
    top: 50%;
    margin-top: -40px;
    box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.2);
    text-align: center;

    > img {
      width: 100%;
      height: auto;
    }
  }

  .time {
    font-family: monospace;
    font-weight: normal;
  }
</style>
