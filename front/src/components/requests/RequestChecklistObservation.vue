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
        return `Observación de checklist`
      },
      secondaryHeaderText: function () {
        let type = ''
        switch (this.request.state) {
          case Constants.states.COMPLETED:
            type = `"${this.request.data.comment}" en "${this.request.extra_data.text}"`
            break
          case Constants.states.PENDING:
            type = `"${this.request.data.comment}" en "${this.request.extra_data.text}"`
            break
          case Constants.states.ERROR:
            type = `Se produjo un error con "${this.request.data.comment}"`
            break
        }
        return type
      }
    }
  }
</script>
