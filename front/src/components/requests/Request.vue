<template>
  <div class="request-base">
    <component v-bind:is="request.type" :request="request"></component>
  </div>
</template>
<script>
  import RequestEPP from '@/components/requests/RequestEPP.vue'
  import RequestNews from '@/components/requests/RequestNews.vue'
  import RequestChecklistObservation from '@/components/requests/RequestChecklistObservation.vue'
  import RequestChecklistGeneralObservation from '@/components/requests/RequestChecklistGeneralObservation.vue'
  import RequestSupervisionpartGeneralObservation from '@/components/requests/RequestSupervisionpartGeneralObservation.vue'
  import RequestChecklistCheck from '@/components/requests/RequestChecklistCheck.vue'

  export default {
    name: 'RequestBase',
    components: {
      EPP: RequestEPP,
      NEWS: RequestNews,
      CHECKLIST_OBSERVATION: RequestChecklistObservation,
      CHECKLIST_GENERAL_OBSERVATION: RequestChecklistGeneralObservation,
      SUPERVISIONPART_GENERAL_OBSERVATION: RequestSupervisionpartGeneralObservation,
      CHECKLIST_CHECK: RequestChecklistCheck
    },
    props: {
      request: {
        type: Object,
        required: true
      }
    }
  }
</script>
