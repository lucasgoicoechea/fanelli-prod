<template>
  <div class="widget-pending-exculpatory">
    <div class="widget-title-container">
      <div class="widget-title">Novedades pendientes</div>
      <div class="widget-title">de descargo</div>
    </div>
    <widget-pending-exculpatory-container></widget-pending-exculpatory-container>
  </div>
</template>

<script>
  import WidgetPendingExculpatoryContainer from '@/components/widgets/pending-exculpatory/WidgetPendingExculpatoryContainer'

  export default {
    name: 'WidgetPendingExculpatory',
    components: {
      WidgetPendingExculpatoryContainer
    }
  }
</script>

<style lang="scss" scoped>
  .widget-pending-exculpatory {
    display: flex;
    flex-direction: column;
    position: relative;
    margin: 10px;
    width: 400px;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0px 2px 4px 2px rgba(0, 0, 0, 0.3);
    height: 480px;
  }

  .widget-title-container {
    background-color: #777;
    padding: 10px 5px;
  }

  .widget-title {
    font-weight: bold;
    outline: none;
    text-align: center;
    color: #ffffff;
    font-size: 18px;
  }

  @media (max-width: 480px) {
    .widget-pending-exculpatory {
      margin: 10px;
      width: calc(100% - 20px);
    }
  }

</style>
