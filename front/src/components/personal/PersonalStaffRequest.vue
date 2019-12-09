<template>
  <section class="personal-staff-request">
    <navigation :title="title"></navigation>
    <div class="container-fluid">
      <div class="scroll" v-infinite-scroll="loadMore"
           infinite-scroll-disabled="notUpdate"
           infinite-scroll-distance="0">
        <transition-group class="box" name="list-complete" tag="article">
          <card-tracking-request
            v-for="staff in notArchived.requests"
            :key="staff.request._id"
            :staffRequest="staff"
            class="list-complete-item"
          ></card-tracking-request>
        </transition-group>
      </div>
      <p class="clarification" v-show="notArchived.requests.length === 0 && !$loading.isLoading('staffRequests getNotArchived')">Aún no se han recibido solicitudes</p>
      <spinner
        class="loading"
        :show="$loading.isLoading('staffRequests getNotArchived')"></spinner>
    </div>
  </section>
</template>

<script>
  import Navigation from '@/components/Navigation'
  import CardTrackingRequest from '@/components/cards/CardTrackingRequest'
  import { mapState, mapActions } from 'vuex'
  import Spinner from '@/components/SpinnerWrapper'

  export default {
    name: 'PersonalStaffRequest',
    components: {Navigation, CardTrackingRequest, Spinner},
    data: function () {
      return {
        title: 'Solicitudes'
      }
    },
    methods: {
      loadMore () {
        this.getNotArchived
      }
    },
    computed: {
      ...mapState('staffRequests', [
        'notArchived'
      ]),
      ...mapActions('staffRequests', [
        'getNotArchived'
      ]),
      notUpdate () {
        return this.notArchived.lastOne || this.$loading.isLoading('staffRequests getNotArchived')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .personal-staff-request {
    position: relative;
    height: 100vh;
    overflow: auto;
  }

  .container-fluid {
    position: relative;
  }

  .loading {
    margin: 20px 0;
  }

  .box {
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .list-complete-item {
    transition: all 0.5s;
    display: inline-block;
  }

  .list-complete-enter, .list-complete-leave-to
    /* .list-complete-leave-active below version 2.1.8 */
  {
    opacity: 0;
    transform: translateY(-50px);
  }

  .list-complete-leave-active {
    position: absolute;
  }

  .clarification {
    text-align: center;
  }

</style>
