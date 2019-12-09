<template>
  <section class="tabs">
    <header>
      <div
        class="tab"
        v-for="(tab, i) in tabs"
        :key="i"
        :class="active(i)"
        @click="selectTab(i)">
          <h2>{{tab.name}}</h2>
      </div>
    </header>
    <div class="tabs-content">
      <slot/>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'tabs',
    props: {
      history: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        tabs: [],
        current: 0
      }
    },
    created () {
      this.tabs = this.$children
    },
    mounted () {
      this.selectTab(0)
    },
    methods: {
      selectTab (index) {
        this.current = index
        this.tabs.forEach(e => { e.isShow = false })
        this.tabs[index].isShow = true
        this.$emit('changeTab', this.tabs[index].name)
      },
      active (index) {
        return {
          active: this.current === index
        }
      }
    },
    computed: {}
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  header {
    padding: 15px 10px 0 10px;
    margin: 0;
    background-color: white;
    border-bottom: 1px solid #d1d1d1;
    position: relative;
    display: flex;
    justify-content: space-between;
  }

  .tabs-content {
    height: 100%;
  }

  .tab {
    color: $primary-color;
    font-weight: bold;
    padding: 0 20px;
    min-width: 20%;
    position: relative;
    top: 1px;
    cursor: pointer;

    &.active {
      border-bottom: 3px solid $primary-color;
    }

    h2 {
      text-align: center;
      font-weight: bold;
      font-size: large;
      margin: 0;
      padding: 0;
    }
  }

  @media (min-width: 471px) and (max-width: 960px) {
    .tab {
      padding: 0 15px;
    }
  }

  @media (max-width: 470px) {
    .tab {
      padding: 0 5px;
    }
  }

</style>
