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
        return `Item de checklist`
      },
      secondaryHeaderText: function () {
        let type = ''
        let statusText
        const checkItemText = this.request.extra_data.text
        const status = this.request.data.value ? '"Correcto"' : '"Incorrecto"'
        const extra = this.request.data.hasOwnProperty('extra') ? `"${this.request.data.extra}"` : ''

        statusText = extra !== '' ? `${status}, ${extra}` : status

        switch (this.request.state) {
          case Constants.states.COMPLETED:
            type = `${statusText} en "${checkItemText}"`
            break
          case Constants.states.PENDING:
            type = `${statusText} en "${checkItemText}"`
            break
          case Constants.states.ERROR:
            type = `Se produjo un error con "${checkItemText}"`
            break
        }
        return type
      }
    }
  }
</script>
