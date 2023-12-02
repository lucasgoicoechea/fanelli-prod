<template>
  <section>
    <slot name="license-type"></slot>
    <ul>
      <li v-for="license in licenseTypes">
        <input type="radio"
               :id="license.type"
               name="license-type"
               value="license.type"
               :min="minDate"
               @change="changeLicenseType(license.type)">
        <label :for="license.type"> {{ license.name }}</label>
        <div class="check"></div>
      </li>
    </ul>

    <slot name="date-from"></slot>
    <input type="date"
           name="time"
           class="date-input"
           :min="minDate"
           v-model="range.from"
           v-on:blur="validateDateRange()"
           @input="updateField">

    <slot name="date-to"></slot>
    <input type="date"
           name="exculpatory"
           :min="minDate"
           v-model="range.to"
           class="date-input"
           v-on:blur="validateDateRange()"
           @input="updateField">

    <slot name="observations"></slot>
    <div class="news-observations-input">
        <textarea class="observations-input" placeholder="Escriba aquí una observación sobre lo sucedido"
                  name="observation"
                  @input="updateField"></textarea>
    </div>

  </section>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'GenericLicenseBase',
    components: {},
    data () {
      return {
        range: {
          from: '',
          to: ''
        }
      }
    },
    methods: {
      updateField (e) {
        this.$store.commit('events/updateToSubmitField', {field: e.target.name, value: e.target.value})
      },
      validateDateRange () {
        if (new Date(this.range.from).getTime() > new Date(this.range.to).getTime()) {
          this.$modal.show('dialog', {
            title: 'La fecha de inicio no puede ser mayor a la fecha de fin',
            buttons: [
              {
                title: 'Aceptar',
                handler: () => {
                  this.range.to = ''
                  this.$modal.hide('dialog')
                }
              }
            ]
          })
        }
      },
      changeLicenseType (type) {
        this.$store.commit('events/updateSelectedEventType', {event: type})
      }
    },
    computed: {
      ...mapState('events', [
        'licenseTypes'
      ]),
      minDate () {
        const today = new Date()
        return this.$moment(today).format('YYYY-MM-DD')
      }
    }
  }
</script>

<style lang="scss" scoped>

  @import "/../../assets/styles/variables";

  /*h3 {
    font-size: 20px;
    margin: 0;
    display: block;
    color: $secondary-color;
    font-weight: 500;
  }*/

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

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    overflow: auto;
  }

  ul li {
    display: block;
    position: relative;
    float: left;
    width: 100%;
  }

  ul li input[type=radio] {
    position: absolute;
    visibility: hidden;
  }

  ul li label {
    display: block;
    position: relative;
    font-weight: 300;
    font-size: 1.35em;
    padding: 10px 5px 10px 60px;
    margin: 10px auto;
    height: 30px;
    z-index: 9;
    cursor: pointer;
  }

  ul li .check {
    display: block;
    position: absolute;
    border: 5px solid $primary-light;
    border-radius: 100%;
    height: 35px;
    width: 35px;
    top: 15px;
    left: 15px;
    z-index: 5;
  }

  ul li .check::before {
    display: block;
    position: absolute;
    content: '';
    border-radius: 100%;
    height: 15px;
    width: 15px;
    top: 5px;
    left: 5px;
    margin: auto;
  }

  input[type=radio]:checked ~ .check {
    border: 5px solid $primary-light;
  }

  input[type=radio]:checked ~ .check::before {
    background: $primary-light;
  }

  input[type=radio]:checked ~ label {
    color: $primary-light;
  }


</style>
