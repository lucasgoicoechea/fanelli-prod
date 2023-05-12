<template>
  <article class="supervisionpart-totales-date-button">
    <router-link :to="{ name: 'supervisionpartTotalesView-linea3', params: { date: formatedDate }}">
      <header>{{ formatedDate }}</header>
      <div class="fill">
        <hr class="red">
        <hr class="green">
        <hr class="green">
        <hr class="red">
        <hr class="green">
        <hr class="red">
        <hr class="green">
        <hr class="green">
      </div>
    </router-link>
  </article>
</template>

<script>
  export default {
    name: 'SupervisionpartTotalesDateButton',
    props: {
      date: {
        type: String
      }
    },
    data () {
      return {}
    },
    methods: {},
    computed: {
      formatedDate () {
        return this.$moment(this.date, 'YYYY-MM-DD').format('DD-MM-YYYY')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  article {
    margin: 5px;
    cursor: pointer;
    text-align: center;
    background-color: rgb(247, 247, 247);
    position: relative;

    &:after {
      content: "";
      position: absolute;
      bottom: 0px;
      left: 0px;
      display: block;
      width: 0px;
      border-color: #ccc #ccc white white;
      border-style: solid;
      border-width: 25px 0px 0px 25px;
    }

    &:hover {
      header {
        background-color: $primary-color;
      }

      .red {
        border: 3px solid rgba(220, 66, 66, 0.47);
      }

      .green {
        border: 3px solid rgba(4, 175, 118, 0.29);
      }
    }

    header {
      background-color: rgb(191, 191, 191);
      color: white;
      font-weight: bold;
      font-size: larger;
    }

    .fill {
      height: 120px;
      padding: 5px;
    }

    hr {
      border: 3px solid rgb(232, 232, 232);
      margin: 4px;
    }
  }
</style>
