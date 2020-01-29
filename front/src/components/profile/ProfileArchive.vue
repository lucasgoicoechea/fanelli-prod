<template>
  <div class="tab-content profile-archive">
    <h3 class="title">Archivo</h3>
    <section class="archive-tabs">
      <router-link
        class="tab"
        :to="{name: 'profile-archive-staffRequests'}"
        :replace="$mq !== 'mobile'">
        <h3>Solicitudes</h3>
      </router-link>

      <router-link
        class="tab"
        :to="{name: 'profile-archive-news'}"
        :replace="$mq !== 'mobile'">
        <h3>Novedades</h3>
      </router-link>

      <router-link
        class="tab"
        :to="{name: 'profile-archive-sanctions'}"
        :replace="$mq !== 'mobile'">
        <h3>Disciplina</h3>
      </router-link>

      <router-link
        class="tab"
        :to="{name: 'profile-archive-occurrences'}"
        :replace="$mq !== 'mobile'">
        <h3>Acontecimientos</h3>
      </router-link>

      <router-link
        class="tab"
        :to="{name: 'profile-archive-meetings'}"
        :replace="$mq !== 'mobile'">
        <h3>Reuniones</h3>
      </router-link>
    </section>
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'ProfileArchive',
    created () {
      if (this.$mq !== 'mobile' && this.$route.name === 'profile-archive') {
        this.$router.replace({name: 'profile-archive-staffRequests', params: {id: this.$route.params.id}})
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .title {
    background-color: #009aff;
    color: #FFF;
    margin: 0;
    padding: 10px;
    font-weight: bold;
    font-size: 18px;
  }

  .archive-tabs {
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;
    margin: 0 auto;
    overflow-y: auto;

    .tab {
      width: auto;
      height: auto;
      padding: 30px 30px 5px 30px;
      align-items: center;

      h3 {
        color: black;
        font-size: large;
        padding: 0;
        margin: 0;
      }

      &.router-link-active {
        border-bottom: 3px solid #ec6060;

        h3 {
          font-weight: bold;
        }
      }
    }
  }

  @media (min-width: 481px) {
    .title {
      display: none;
    }

    .archive-tabs {
      justify-content: center;
    }
  }


</style>
