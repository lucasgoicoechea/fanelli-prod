<template>
  <div class="day-selector">
    <div class="dates">
      <div class="clarification" v-show="dates.length === 0">
        No hay fechas seleccionadas.
      </div>
      <div class="date" v-for="(date, key) in dates" :key="key">
        <div class="information">
          <p><span>Desde:</span> {{ date.from | moment($constants.FORMAT_DATETIME) }}</p>
          <p><span>Hasta:</span> {{ date.to | moment($constants.FORMAT_DATETIME) }}</p>
        </div>
        <button class="button-circle" @click="remove(key)">
          <img src="/static/img/cross-orange.svg" alt="">
        </button>
      </div>
    </div>

    <div class="selector">
      <div class="picker">
        <label for="from">Desde</label>
        <flat-pickr
          id="from"
          v-model="selected.from"
          :config="conf"
          ref="_flatpickrFrom"
          placeholder="01/01/2018 12:00"></flat-pickr>
      </div>

      <div class="picker">
        <label for="to">Hasta</label>
        <flat-pickr
          id="to"
          v-model="selected.to"
          :config="conf"
          ref="_flatpickrTo"
          placeholder="01/01/2018 12:00"></flat-pickr>
      </div>
      <div class="action">
        <button class="button-circle solid" @click="add">
          <img src="/static/img/tickwhite.svg" alt="">
        </button>
      </div>

      <div class="bar-separator">
      </div>
      <span class="bar-separator-text"> Para confirmar la fecha haga click en el botón naranja con la tilde</span>
    </div>
  </div>
</template>

<script>
  import { Spanish } from 'flatpickr/dist/l10n/es'

  export default {
    name: 'DaySelector',
    props: {
      minDate: {
        type: Date,
        require: false
      }
    },
    data () {
      return {
        conf: {
          inline: false,
          locale: Spanish,
          disableMobile: true,
          enableTime: true,
          time_24hr: true
        },
        selected: {
          from: '',
          to: ''
        },
        dates: []
      }
    },
    created () {
      if (this.minDate) {
        this.conf.minDate = this.minDate
      }
    },
    methods: {
      clearDatePicker (picker) {
        this.$refs[picker].fp.clear()
      },
      showError (msg) {
        this.$modal.show('dialog', {
          title: msg,
          buttons: [
            {
              title: 'Aceptar',
              handler: () => {
                this.$modal.hide('dialog')
              }
            }
          ]
        })
      },
      add () {
        if (!this.validate) {
          this.showError('Falta completar campo de fecha')
          return
        }
        if (!this.validateRange) {
          this.showError('La fecha "Hasta" no puede ser menor a la fecha "Desde"')
          return
        }
        this.dates.push(JSON.parse(JSON.stringify(this.selected)))
        this.clearDatePicker('_flatpickrFrom')
        this.clearDatePicker('_flatpickrTo')
        this.update()
      },
      remove (index) {
        this.dates.splice(index, 1)
        this.update()
      },
      update () {
        this.$emit('onDateSelected', this.dates)
      }
    },
    computed: {
      validate () {
        return this.selected.from !== '' && this.selected.to !== ''
      },
      validateRange () {
        return this.selected.from < this.selected.to
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/variables";

  .selector {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;

    input {
      margin: 0;
    }

    .picker {
      width: 180px;
      padding: 5px;
      margin: 8px 5px;
    }
  }

  .date {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: nowrap;

    .information {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;
      margin: 8px 5px;
    }

    p {
      display: inline-block;
      width: 175px;
      margin: 5px;

      span {
        font-weight: bold;
      }
    }
  }

  .button-circle {
    border-radius: 100px;
    padding: 5px;
    background-color: white;
    border: solid 2px $primary-color;
    color: $primary-color;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.25);

    &.solid {
      background-color: $primary-color;
      color: white;
    }

    img {
      height: 25px;
      width: 25px;
    }
  }

  .clarification {
    padding: 2px 10px;
  }

  .bar-separator {
    display: inline-block;
    position: relative;
    left: 15px;
    height: 39px;
    border-left: 5px solid $secondary-darker;
  }

  .bar-separator-text {
    position: relative;
    left: 30px;
    width: 40%;
    font-weight: bolder;
  }

  @media (max-width: 1098px) {

    .bar-separator {
      display: none;
    }

    .bar-separator-text {
      position: static;
      width: auto;
    }
  }

  @media (max-width: 480px) {
    .information {
      width: 180px;
    }

    .selector {
      flex-direction: column;

      .picker {
        width: 100%;
        margin: 0;
        padding: 4px 0;
      }
    }

    p {
      margin: 2px 5px;
    }

    .bar-separator-text {
      margin-top: 10px;
      text-align: center;
    }

    .action {
      margin-top: 10px;
    }

  }

</style>
