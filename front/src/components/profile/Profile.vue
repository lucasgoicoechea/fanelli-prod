<template>
  <div class="profile">
    <router-view :key="$route.params.id"></router-view>
    <profile-tabs></profile-tabs>
    <profile-header :user="user"></profile-header>
    <navigation title="Personal"></navigation>
  </div>
</template>

<script>
  import Navigation from '@/components/Navigation'
  import ProfileHeader from '@/components/profile/ProfileHeader'
  import ProfileTabs from '@/components/profile/ProfileTabs'
  import { mapState } from 'vuex'

  export default {
    name: 'Profile',
    components: {
      ProfileHeader,
      ProfileTabs,
      Navigation
    },
    created: function () {
      this.fetch()
    },
    watch: {
      '$route' (to, from) {
        this.fetch()
      }
    },
    methods: {
      fetch () {
        this.$store.dispatch('users/fetchById', {id: this.$route.params.id})
        if (this.$mq !== 'mobile' && this.$route.name === 'profile') {
          this.$router.replace({name: 'profile-information', params: {id: this.$route.params.id}})
        }
      }
    },
    computed: {
      ...mapState('users', [
        'user'
      ])
    }
  }
</script>


<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .profile {
    display: flex;
    flex-direction: column-reverse;
  }

  section {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }
</style>
