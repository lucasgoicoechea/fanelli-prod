<template>
  <medic-order-base>
    <div slot="date">
      <h3>Fecha del turno médico</h3>
    </div>

    <div slot="observations">
      <h3>Observaciones</h3>
    </div>
  </medic-order-base>
</template>

<script>
  import MedicOrderBase from '@/components/news/NewsMedicOrderBase.vue'
  export default {
    name: 'MedicOrderControl',
    components: {MedicOrderBase},
    data () {
      return {}
    },
    methods: {
      updateField (e) {
        this.$store.commit('events/updateToSubmitField', {field: e.target.name, value: e.target.value})
      }
    }
  }
</script>

<style lang="scss" scoped>

  @import "/../../assets/styles/variables";

  h3 {
    width: 100%;
    font-weight: bold;
    border-bottom: 3px solid $primary-color;
    margin: 18px 0;
  }

  .date-input {
    margin-top: 3px;
    width: 170px;
    color: #d3d3d3;
  }

  .observations-input {
    margin-top: 5px;
    border: 2px solid orangered;
    width: 100%;
    display: block;
    min-height: 100px;
  }

</style>
