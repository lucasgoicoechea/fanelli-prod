<template>
  <div class="bug-report-edit">
    <navigation
      :title="title"></navigation>

    <form-component
      @update="update" :bugReport="request"></form-component>

    <bottom-navbar>
      <div class="submit">
        <div
          v-if="!loading"
          class="msg pointer"
          @click="confirm">
          <h5 class="items">Edicion de falla</h5>
          <span class="glyphicon glyphicon-send items icon-action"></span>
        </div>

        <div class="msg" v-else>
          <h5 class="items">Editando falla</h5>
          <spinner
            class="items"
            :show="loading"></spinner>
        </div>
      </div>

    </bottom-navbar>
  </div>
</template>

<script>
  import Navigation from '@/components/Navigation.vue'
  import BottomNavbar from '@/components/BottomNavbar.vue'
  import Spinner from '@/components/SpinnerWrapper.vue'
  import FormComponent from '@/components/fails/BugReportFormEdit'

  export default {
    name: 'BugReportEdit',
    components: {
      BottomNavbar,
      Navigation,
      Spinner,
      FormComponent
    },
    data () {
      return {
        title: 'Fallas',
        form: {},
        validation: {},
        loading: false,
        sendStoreAction: 'bugReport/edit',
        request: Object
      }
    },
    created: function () {
      this.$store.dispatch('bugReport/getDetail', {id: this.$route.params.id}).then(response => {
        this.request = response.bugReport
      })
    },
    methods: {
      update (data) {
        this.form = data.form
        this.validation = data.validation
      },
      showModal ({title, msg}) {
        this.$modal.show('dialog', {
          title: title,
          text: msg,
          buttons: [{title: 'Aceptar'}]
        })
      },
      successfulCreation (res) {
        this.loading = false
        if (res.success) {
          this.$snotifyWrapper.success('La falla se ha creado con exito')
          this.$router.push({name: 'bug-report-solicitudes-reparacion'})
        } else {
          this.$snotifyWrapper.error(res.message)
        }
      },
      failedCreation () {
        this.loading = false
        this.$snotifyWrapper.warning('Se produjo un error. Intente nuevamente')
      },
      send () {
        this.loading = true
        this.$store.dispatch(this.sendStoreAction, this.form)
          .then(this.successfulCreation)
          .catch(this.failedCreation)
      },
      confirm () {
        if (this.loading) {
          return
        }

        if (!this.validation.valid) {
          this.showModal({title: 'Completar', msg: this.validation.msg})
          return
        }

        this.$modal.show('dialog', {
          title: 'Confirmación',
          text: '¿Esta seguro de generar esta falla?',
          buttons: [
            {
              title: 'Aceptar',
              handler: () => {
                this.$modal.hide('dialog')
                this.send()
              }
            },
            {
              title: 'Cancelar',
              handler: this.$modal.hide('dialog')
            }
          ]
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/_variables.scss";
  @import "~@/assets/styles/_mixins.scss";

  .msg {
    display: flex;
    flex-direction: row;
    padding: 18px;

    &.pointer {
      cursor: pointer;
    }

    .items {
      padding: 0 5px;
      font-weight: bold;
    }

    .icon-action {
      font-size: 34px;
    }
  }
</style>