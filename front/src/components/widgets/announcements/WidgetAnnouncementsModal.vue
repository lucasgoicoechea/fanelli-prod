<template>
  <modal
    name="widget-announcements-modal"
    height="auto"
    :scrollable="true"
    :pivot-y="0.30"
    :adaptive="true">

    <div class="modal-description">
      <h3 class="title">Avisos</h3>
      <div class="close" @click="close">
        <img src="/static/img/cross.svg" alt="">
      </div>

      <div class="wrapper">
        <vue-editor
          v-model="description"
          :editorToolbar="customToolbar"></vue-editor>
      </div>

      <button class="post" @click="post">
        <span v-show="!loading">Publicar</span>
        <spinner :show="loading"></spinner>
      </button>
    </div>
  </modal>
</template>

<script>
  import { VueEditor } from 'vue2-editor'
  import Spinner from '@/components/SpinnerWrapper'

  export default {
    name: 'WidgetAnnouncementsModal',
    components: {
      VueEditor,
      Spinner
    },
    data () {
      return {
        description: '',
        customToolbar: [
          [{'header': [1, 2, 3, 4, false]}],
          ['bold', 'italic', 'underline', 'strike'],
          [{'color': []}, {'background': []}],
          [{'list': 'ordered'}, {'list': 'bullet'}],
          ['clean']
        ]
      }
    },
    methods: {
      post () {
        if (this.description === '') {
          return
        }
        this.$store.dispatch('widgets/createAnnouncement', {description: this.description})
          .then(response => {
            this.$emit('post', response.announcement)
            this.description = ''
          })
      },
      close () {
        this.$modal.hide('widget-announcements-modal')
      }
    },
    computed: {
      loading () {
        return this.$loading.isLoading('widgets createAnnouncement')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .modal-description {
    display: flex;
    flex-direction: column;
    justify-description: center;
    align-items: center;
    border: none;
  }

  .title {
    font-weight: bold;
    color: #6a6a6a;
  }

  .wrapper {
    width: 100%;
    padding: 10px;
  }

  .post {
    border-radius: 20px;
    border: none;
    background-color: #8bc34a;
    color: white;
    font-size: medium;
    padding: 10px 15px;
    margin: 20px;
    min-width: 100px;
  }

  .close {
    position: absolute;
    top: 10px;
    right: 25px;

    img {
      width: 15px;
      height: 15px;
    }
  }

</style>
