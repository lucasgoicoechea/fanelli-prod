<template>
  <div class="home">
    <navigation :title="title"></navigation>
    <div class="announcements">
      <widget-announcements></widget-announcements>
    </div>
    <div class="widgets-container">
      <widget-availability></widget-availability>
      <widget-pending-exculpatory></widget-pending-exculpatory>
    </div>
  </div>
</template>

<script>
  import WidgetAvailability from '@/components/widgets/availability/WidgetAvailability'
  import WidgetPendingExculpatory from '@/components/widgets/pending-exculpatory/WidgetPendingExculpatory'
  import WidgetAnnouncements from '@/components/widgets/announcements/WidgetAnnouncements'
  import Navigation from './Navigation.vue'
  import PanolHome from './home/PanolHome.vue'
  import JefeLineaHome from './home/JefeLineaHome.vue'
  import JefePlantaHome from './home/JefePlantaHome.vue'
  import SuperAdminHome from './home/SuperAdminHome.vue'
  import PersonalHome from './home/PersonalHome.vue'
  import SupervisorHome from './home/SupervisorHome.vue'
  import auth from '../auth'

  export default {
    name: 'Home',
    components: {
      Navigation,
      WidgetAvailability,
      WidgetPendingExculpatory,
      WidgetAnnouncements,
      SUPERVISOR: SupervisorHome,
      PANOL: PanolHome,
      SUPERADMIN: SuperAdminHome,
      JEFE_PLANTA: JefePlantaHome,
      JEFE_LINEA: JefeLineaHome,
      PERSONAL: PersonalHome
    },
    data () {
      return {
        title: 'Inicio',
        currentView: ''
      }
    },
    created () {
      // agrego evento si cierra navegador mata session token
      // window.addEventListener('beforeunload', auth.logout());
      window.addEventListener('beforeunload', function (e) {
        e = e || window.event
        var localStorageTime = localStorage.getItem('storagetime')
        if (localStorageTime !== null && localStorageTime !== undefined) {
          var currentTime = new Date().getTime()
          var timeDifference = currentTime - localStorageTime
          if (timeDifference < 25) { // Browser Closed
            localStorage.removeItem('storagetime')
          } else { // Browser Tab Closed
            localStorage.setItem('storagetime', new Date().getTime())
          }
        } else {
          localStorage.setItem('storagetime', new Date().getTime())
        }
      })
      // tipo de usuario
      this.currentView = auth.getUser().user_type
      // DESVIO EL HOME HACIA LOS PARTES OFICIALES
      if (auth.getUser().user_type === 'OFICIAL_EXTRUSORA') {
        this.$router.push({name: 'supervisionpart', params: {sector: 'EXTRUSORA'}})
      }
      if (auth.getUser().user_type === 'OFICIAL_APILADORA') {
        this.$router.push({name: 'supervisionpart', params: {sector: 'APILADORA'}})
      }
      if (auth.getUser().user_type === 'OFICIAL_DESAPILADORA') {
        this.$router.push({name: 'supervisionpart', params: {sector: 'DESAPILADORA'}})
      }
      /* setTimeout(function () {
        auth.logout();
        next({name: 'login'});
      }, 6000); */
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/styles/variables";

  .home {
    width: 100%;
    position: relative;
    // background: url("../../static/android-icon-512x512-trans.png") center center no-repeat;
  }

  .widgets-container {
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }

  .announcements {
    width: 80%;
    margin: 0 auto;
  }

  @media(max-width: 480px) {
    .home {
      background-size: 70%;
    }
  }
  @media(max-width: 768px) {
    .announcements {
      width: 95%;
    }
  }
</style>
