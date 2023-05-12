<template>
  <footer class="form-footer">
    <!-- <div class="action true" @click="closeParte(true)">
      <img src="/static/img/checklists/tick.svg">
    </div> -->
    <div class="action">
      <span v-if="reset">00:00:00</span>
      <div v-else class="timer">
        <div class="number">{{hours}}</div>
        <span>:</span>
        <div class="number">{{minutes}}</div>
        <span>:</span>
        <div class="number">{{seconds}}</div>
      </div>
    </div>
    <v-dialog @closed="onClose"></v-dialog>
  </footer>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Const from '@/const'

  export default {
    name: 'FormFooter',
    data: function () {
      return {
        now: new Date(),
        current: new Date(),
        currentSchedule: {},
        reset: false
      }
    },
    created: function () {
      this.currentSchedule = Const.currentSchedule()
      this.current.setHours(this.currentSchedule.ends - 1)
      if (this.currentSchedule.ends < this.now.getHours()) {
        this.current.setHours(this.current.getHours() + 12)
      }
      this.current.setMinutes(0)
      this.current.setSeconds(0)
    },
    mounted () {
      window.setInterval(() => {
        const now = new Date()
        now.setMinutes(now.getMinutes() - 8)
        this.endChecklist(now)
        if (this.currentSchedule.ends < this.now.getHours()) {
          /* to avoid problem ends < current when schedule is NOCHE */
          now.setHours(now.getHours() - 12)
        }
        this.now = now
      }, 1000)
    },
    methods: {
      /* closeParte (value) {
        const check = {
          id: this.currentCheck(this.sector).check._id,
          supervisionpart_id: this.getSector(this.sector).supervisionpart._id,
          value: value,
          comment: '',
          text: this.currentCheck(this.sector).check.text
        }
        if (this.currentCheck(this.sector).check.extra) {
          check.extra = this.currentCheck(this.sector).auxExtra
        }
        this.$store.dispatch('checklists/updateCheck', {sector: this.sector, check})
      }, */
      undo () {
        this.$store.commit('supervisionpartsLTres/undo', {sector: this.sector})
      },
      onClose () {
        this.$router.push({name: 'home'})
      },
      endChecklist (datetime) {
        if ((datetime.getHours() === this.currentSchedule.ends) && !(this.reset)) {
          this.reset = true
          this.$modal.show('dialog', {
            text: 'Terminó el turno del Parte actual',
            buttons: [
              {
                title: 'Aceptar',
                handler: () => {
                  this.$modal.hide('dialog')
                }
              }
            ]
          })
        }
      }
    },
    computed: {
      sector: function () {
        return this.$route.params.sector
      },
      ...mapGetters('supervisionpartsLTres', [
        'currentCheck',
        'getSector'
      ]),
      seconds () {
        const seconds = (60 - this.now.getSeconds()) % 60
        return (seconds > 9) ? seconds : '0' + seconds
      },
      minutes () {
        let minutes = (59 - this.now.getMinutes()) % 60
        minutes = (this.seconds === '00') ? minutes + 1 : minutes
        return (minutes > 9) ? minutes : '0' + minutes
      },
      hours () {
        const hours = this.current.getHours() - this.now.getHours()
        return (hours > 9) ? hours : '0' + hours
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .form-footer {
    position: sticky;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: $primary-color;
    text-align: center;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.4);
    margin-top: 30px;
  }

  .action {
    cursor: pointer;
    display: inline-block;
    padding: 5px;
    margin: 10px;
    position: relative;
    font-size: 12px;
    color: white;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    line-height: 20px;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.3);
    img {
      width: 50px;
      height: 50px;
    }

    &.true {
      background: $success-color;
    }

    &.false {
      background: $danger-color;
    }
  }

  .counter {
    display: inline-block;
    position: absolute;
    top: 30px;
    right: 20px;
    font-weight: bold;
    font-size: x-large;
    color: white;
  }

  .timer {
    display: flex;

    .number {
      display: inline-block;
      width: 30px;
      text-align: center;
    }

    span {
      margin: 0 5px;
    }
  }

  @media (max-width: 600px) {

    .counter {
      display: flex;
      justify-content: center;
      position: relative;
      font-weight: bold;
      font-size: x-large;
      top: 0;
      right: 0;
    }
  }
</style>
