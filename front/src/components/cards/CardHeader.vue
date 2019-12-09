<template>
  <header class="card-header">
    <div class="titles">
      <div class="primary" v-if="hasHeader" :style="hasHeaderBackground">
        <slot name="header"></slot>
      </div>
      <div class="secondary" v-if="hasSubHeader" :style="hasSubHeaderBackground">
        <slot name="subHeader"></slot>
      </div>
    </div>
    <div class="actions">
      <slot name="actions"></slot>
    </div>
  </header>
</template>

<script>
  export default {
    name: 'CardHeader',
    props: {
      headerBackground: {
        type: String
      },
      subHeaderBackground: {
        type: String
      }
    },
    computed: {
      hasHeader () {
        return !!this.$slots.header
      },
      hasSubHeader () {
        return !!this.$slots.subHeader
      },
      hasHeaderBackground () {
        return {
          backgroundColor: this.headerBackground
        }
      },
      hasSubHeaderBackground () {
        return {
          backgroundColor: this.subHeaderBackground !== undefined ? this.subHeaderBackground : 'unset'
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    color: white;

    .titles {
      flex-grow: 1;
    }

    .primary {
      font-weight: bold;
      font-size: larger;
      background-color: $primary-color;
      padding: 4px 10px;
    }

    .secondary {
      max-width: 100%;
      background-color: $primary-light;
      padding: 2px 10px;
      font-size: small;
      font-weight: normal;
    }

    .action {
      padding: 10px;
      background-color: $secondary-color;
    }
  }

  div {
    padding: 0;
    margin: 0;
  }

</style>
