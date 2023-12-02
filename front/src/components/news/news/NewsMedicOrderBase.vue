<template>
  <section>
    <slot name="date"></slot>
    <input type="date"
           name="medicalAppointment"
           class="date-input"
           :min="minDate"
           @input="updateField">

    <slot name="observations"></slot>
    <div class="news-observations-input">
        <textarea class="observations-input" placeholder="Escriba aquí una observación" name="observation"
                  @input="updateField"></textarea>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'MedicOrderBase',
    components: {},
    methods: {
      updateField (e) {
        this.$store.commit('events/updateToSubmitField', {field: e.target.name, value: e.target.value})
      }
    },
    computed: {
      minDate () {
        const today = new Date()
        return this.$moment(today).format('YYYY-MM-DD')
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
    color: #232323;
  }

  .observations-input {
    margin-top: 5px;
    border: 2px solid orangered;
    width: 100%;
    display: block;
    min-height: 100px;
  }

</style>
