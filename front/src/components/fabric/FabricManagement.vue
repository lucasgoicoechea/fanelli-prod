<template>
  <div class="fabric-management">
    <navigation
      title="Configuración de Personal"></navigation>

    <section>
      <div class="buttons">
        <fabric-button
          v-for="(value, key) in $constants.FABRIC_ATTRIBUTE"
          :key="key"
          :attribute="key"
          @update="changeForm"
          :current="attribute"
          :icon="`/static/img/${key}.svg`"></fabric-button>
      </div>
      <div class="content">
        <fabric-form :attribute="attribute"></fabric-form>
      </div>
    </section>

  </div>
</template>

<script>
  import Navigation from '@/components/Navigation'
  import FabricButton from '@/components/fabric/FabricButton'
  import FabricForm from '@/components/fabric/FabricForm.vue'

  export default {
    components: {
      FabricForm,
      Navigation,
      FabricButton
    },
    name: 'FabricManagement',
    data () {
      return {
        attribute: 'sector'
      }
    },
    methods: {
      changeForm (attr) {
        this.attribute = attr
      }
    }
  }
</script>
<style lang="scss" scoped>
  section {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    margin: 40px;
    width: 90%;
  }

  .content {
    padding: 20px 40px;
    background: #EEE8E8;
    flex-grow: 1;
    border-radius: 8px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  }

  .buttons {
    *:last-child {
      margin-bottom: 0;
    }
  }
</style>
