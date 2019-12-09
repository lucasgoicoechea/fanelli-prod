<template>
  <request-wrapper
    :headerText="headerText"
    :secondaryHeaderText="secondaryHeaderText"
    :state="request.state">
  </request-wrapper>
</template>

<script>
  import RequestWrapper from '@/components/requests/RequestWrapper.vue'
  import Constants from '../../const.js'

  export default {
    name: 'RequestEpp',
    components: {RequestWrapper},
    props: {
      request: {
        type: Object,
        required: true
      }
    },
    computed: {
      headerText: function () {
        return `Solicitud de EPP`
      },
      secondaryHeaderText: function () {
        let type = ''
        switch (this.request.state) {
          case Constants.states.COMPLETED:
            type = `Pedido enviado para ${this.request.data.collaborator.lastname}`
            break
          case Constants.states.PENDING:
            type = `Enviando pedido para ${this.request.data.collaborator.lastname}`
            break
          case Constants.states.ERROR:
            type = 'Se produjo un error con el pedido'
            break
        }
        return type
      }
    }
  }
</script>
