<template>
  <div>
    <section class="card-section" :style="hasBackground">
      <div class="content">
        <slot name="content"></slot>
      </div>

      <div class="actions" :style="actionsBackground">
        <slot name="actions"></slot>
      </div>
    </section>
  </div>
</template>

<script>
  export default {
    name: 'CardSection',
    props: {
      backgroundColor: {
        type: String,
        default: 'white'
      },
      actionsBackgroundColor: {
        type: String,
        default: 'white'
      }
    },
    data () {
      return {}
    },
    created: function () {
    },
    destroyed: function () {
    },
    methods: {},
    computed: {
      hasBackground () {
        return {
          backgroundColor: this.backgroundColor
        }
      },
      actionsBackground () {
        return {
          backgroundColor: this.actionsBackgroundColor
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  section {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: nowrap;
    background-color: #f1f1f1;

    .content {
      padding: 4px 10px;
      color: black;
    }

    .actions {
      display: flex;
      padding: 2px 6px;
      flex-direction: row;
      align-items: center;
    }
  }

  div {
    padding: 0;
    margin: 0;
  }

  .fixed {
    width: 85%;
  }

</style>
