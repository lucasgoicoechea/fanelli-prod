<template>
  <div class="bugReport-visualization">
    <navigation :title="title"></navigation>
    <section v-if="Object.keys(request).length > 0">
      <p>Fecha: {{ request.created_at | moment($constants.FORMAT_DATE) }}</p>
      <!--<p>De: {{ request.supervisor.lastname }} {{ request.supervisor.name }}</p>
      <p>Para: {{ request.collaborator.lastname }} {{ request.collaborator.name }}</p>-->
      <div>
        <b>Estado:</b> {{ status }}
      </div>
      <table-preview :bugReports="request"></table-preview>
      <div class="actions">
        <div v-if="editPermission">
          <router-link class="edit" :to="{ name: 'epp-edition', params: { id: request._id }}">
            Editar
          </router-link>
        </div>
        <!--<div v-if="$can('JEFE_PLANTA|JEFE_LINEA')">
          <a class="cancel-button" @click="reject">Rechazar</a>
          <a class="accept" @click="accept">Aceptar</a>
        </div>-->
      </div>
      <!--<h3> Últimas solicitudes para {{ request.collaborator.lastname}}</h3>
      <a class="print" v-if="$can('PANOL')" @click="print">IMPRIMIR</a>-->
    </section>
  </div>
</template>

<script>
  import Navigation from '../Navigation.vue'
  import TablePreview from './TablePreview.vue'
  // import LastUserEPPRequests from './LastUserEPPRequests.vue'
  import { mapState } from 'vuex'
  import Vue from 'vue'
  // import auth from '@/auth'

  export default {
    name: 'BugReportVisualization',
    components: {
      TablePreview,
      Navigation
      // LastUserEPPRequests
    },
    data () {
      return {
        title: 'Detalle de Falla',
        request: Object
      }
    },
    created: function () {
      this.$store.dispatch('bugReport/getDetail', {id: this.$route.params.id}).then(response => {
        this.request = response.bugReport
      })
    },
    methods: {
      reject () {
        this.$store.dispatch('bugReport/approval', {approved: false})
      },
      accept () {
        this.$store.dispatch('bugReport/approval', {approved: true})
      },
      print () {
        Vue.http.get('bugReport/get-pdf/' + this.request._id,
          {responseType: 'arraybuffer'}
        ).then(function (response) {
          var blob = new Blob([response.data], {type: response.headers.get['content-type']})
          var link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = 'solicitud.pdf'
          link.click()
        })
      }
    },
    computed: {
      status: function () {
        /* if (this.request.delivered) {
          return 'Entregada'
        } else if (this.request.resolved) {
          return 'Para entregar'
        } else if (this.request.hasOwnProperty('approved') && this.request.approved) {
          return `Aprobada por: ${this.request.approved_by.lastname}, recibida por el pañol`
        } else if (this.request.hasOwnProperty('approved') && !this.request.approved) {
          return `Denegada por: ${this.request.approved_by.lastname}`
        } else {
          return 'Pendiente de aprobación'
        } */
        return this.request.prioridad
      },
      isPendingApproval: function () {
        return this.request.hasOwnProperty('approved')
      },
      ...mapState('requests', [
      ]),
      editPermission () {
        return true
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  h3 {
    font-weight: bold;
    padding: 5px 0;
    border-bottom: 4px solid #ec6e25;
  }

  .actions {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    margin: 30px 10px;
  }

  a {
    cursor: pointer;
    color: white;
    text-align: center;
    min-width: 12vh;
    padding: 10px 10px;
    border-radius: 25px;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.3);

    &:hover {
      text-decoration: none;
    }

    &.edit {
      background-color: #00da3c;
    }
  }

  .print {
    background: $secondary-darker;
  }

  .cancel-button {
    background-color: $danger-color;
  }

  .accept {
    background-color: $success-color;
  }

  section {
    margin: 40px auto;
    width: 90%;
  }
</style>