<template>
  <div class="treefails-management">
    <navigation
      title="Configuración de Fallas"></navigation>
    <section>
      <div class="buttons">
        <treefails-button
          v-for="(value, key) in $constants.treefails_ATTRIBUTE"
          :key="key"
          :attribute="key"
          @update="changeForm"
          :current="attribute"
          :father_id="father_id"
          :icon="`/static/img/${key}.png`"></treefails-button>
      </div>
      <div class="content">
        <treefails-form 
          :father_id="father_id" 
          :prefather_id="prefather_id"
          :indexPrefather="indexPrefather" 
          :attribute="attribute" 
          :father="father" >
        </treefails-form>
      </div>
    </section>

  </div>
</template>

<script>
  import Navigation from '@/components/Navigation'
  import treefailsButton from '@/components/fails/treefails/TreeFailsButton'
  import treefailsForm from '@/components/fails/treefails/TreeFailsForm'

  export default {
    components: {
      treefailsForm,
      Navigation,
      treefailsButton
    },
    name: 'treeFailsManagement',
    data () {
      return {
        attribute: 'linea',
        father: 'null',
        father_id: 'null',
        prefather_id: 'null',
        indexPrefather: 0,
        arrPrefather: [null]
      }
    },
    methods: {
      changeForm (attr) {
        this.attribute = 'linea'
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
