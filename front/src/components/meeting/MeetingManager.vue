<template>
  <div class="meeting-manager">
    <navigation
      :title="title"></navigation>

    <div class="container"
      v-infinite-scroll="fetch"
      infinite-scroll-disabled="notUpdateList"
      infinite-scroll-distance="200">

      <div class="empty" v-show="emptyList">
        No hay reuniones.
      </div>

      <div class="spinner-container">
        <spinner
          class="spinner" :show="meeting.loading"
          loadingMessage="Cargando reuniones..."></spinner>
      </div>
        <vuetable 
        ref="vuetableReuniones"
        :api-mode="false"
        :fields="campos"
        :data="this.meeting.list"
        pagination-path=""
        :css="css.table"
      ></vuetable>
      <!-- <div class="pagination ui basic segment grid">
        <vuetable-pagination-info ref="paginationInfo"
        ></vuetable-pagination-info>

        <vuetable-pagination ref="pagination"
          @vuetable-pagination:change-page="onChangePage"
        ></vuetable-pagination>
      </div>
      -->
    </div>
  </div>
</template>

<script>
  import Navigation from '@/components/Navigation.vue'
  import Spinner from '@/components/SpinnerWrapper.vue'
  import { mapState, mapGetters } from 'vuex'
  import Vuetable from 'vuetable-2'
  import CssForBootstrap4 from './VuetableCssBootstrap4.js'
  import dateAndTime from '@/utils/dateAndTime.js'
  // import constants from '@/const.js'

  export default {
    name: 'MeetingManager',
    components: {
      Navigation,
      Spinner,
      Vuetable,
      CssForBootstrap4
    },
    data () {
      return {
        title: 'Manager reuniones',
        fullAccess: false,
        meeting: {
          list: [],
          loading: false,
          lastOne: false,
          page: 1
        },
        campos: [
          {
            name: 'date',
            title: 'Fecha',
            callback: function (value) {
              return dateAndTime.dateDayAndMonth(new Date(value))
            }
          },
          {
            name: 'frecuency',
            title: 'Tipo'
          },
          {
            name: 'creator',
            title: 'Creador',
            callback: function (item) {
              if (item !== null) {
                return item.lastname + ', ' + item.name
              }
              return ''
            }
            // formatter: (value) => value.name + ' ' + value.lastname
          },
          {
            name: 'recommendations',
            title: 'Objetivos',
            callback: function (value) {
              var textt = ''
              value.map((item) => {
                textt = textt + '<li>' + item + '</li>'
              })
              return textt
            }
          },
          {
            name: 'collaborators',
            title: 'Asistentes',
            callback: function (value) {
              var textt = ''
              value.map((item) => {
                textt = textt + '<li style="font-size: 6px;" >' + item.lastname + ', ' + item.name + '</li>'
              })
              return textt
            }
          },
          {
            name: 'state',
            title: 'Estado',
            callback: function (value) {
              if (value === 2) {
                return '<img src="/static/img/checklists/sumary/ok.svg" alt="">'
              }
              if (value === 3) {
                return '<img src="/static/img/checklists/sumary/mal.svg" alt="">'
              }
              if (value === 1) {
                return '<img src="/static/img/checklists/sumary/obsvmal.svg" alt="">'
              }
              if (value === 4) {
                return '<img src="/static/img/checklists/undo.svg" alt="">'
              }
              return '<img src="/static/img/checklists/sumary/obsv.svg" alt="">'
            }
          },
          {
            name: 'repro',
            title: 'Reprogramada',
            callback: function (value) {
              let textt = ''
              if (value !== null) {
                value.map((item) => {
                  textt = dateAndTime.dateDayAndMonth(new Date(item.date)) + ' ' + (item.state === 2 ? 'Realizada' : '')
                })
              }
              return textt
            }
          }
        ],
        css: {
          table: {
            tableClass: 'table table-striped table-bordered table-hovered',
            loadingClass: 'loading',
            ascendingIcon: 'glyphicon glyphicon-chevron-up',
            descendingIcon: 'glyphicon glyphicon-chevron-down',
            handleIcon: 'glyphicon glyphicon-menu-hamburger'
          },
          pagination: {
            infoClass: 'pull-left',
            wrapperClass: 'vuetable-pagination pull-right',
            activeClass: 'btn-primary',
            disabledClass: 'disabled',
            pageClass: 'btn btn-border',
            linkClass: 'btn btn-border',
            icons: {
              first: '',
              prev: '',
              next: '',
              last: ''
            }
          }
        }
      }
    },
    created () {
      this.fullAccess = this.$can(this.$constants.ROLES.JEFES)
    },
    methods: {
      onPaginationData (paginationData) {
        this.$refs.pagination.setPaginationData(paginationData)
        this.$refs.paginationInfo.setPaginationData(paginationData)
      },
      onChangePage (page) {
        this.$refs.vuetableReuniones.changePage(page)
      },
      fetch () {
        this.meeting.loading = true
        const action = (this.fullAccess)
          ? 'meetings/fetchManager'
          : 'meetings/fetchManager'

        this.$store.dispatch(action, {page: this.meeting.page})
          .then(this.successFetch)
          .catch(this.failFetch)
      },
      /* fetch () {
        this.meeting.loading = true
        const action = (this.fullAccess)
         ? 'meetings/fetchPass'
         : 'meetings/fetchPassMe'
        const params = {
          ...((this.hasSelected) ? {userId: this.collaboratorSelected._id} : {userId: this.user.id}),
          ...((this.date !== '') ? {date: this.date} : {}),
          ...((this.type !== '') ? {type: this.type} : {}),
          ...((this.frecuency !== '') ? {frecuency: this.frecuency} : {}),
          page: this.meeting.page
        }
        this.$store.dispatch(action, params)
        .then(this.successFetch)
        .catch(this.failFetch)
      }, */
      successFetch (response) {
        if (response.meetings.length === 0) {
          this.meeting.lastOne = true
        } else {
          response.meetings.forEach(e => {
            this.meeting.list.push(e)
          })
          this.meeting.page += 1
        }
        this.meeting.loading = false
      },
      failFetch () {
        this.$snotifyWrapper.error('Se produjo un error al buscar las reuniones')
        this.meeting.loading = false
      },
      notUpdate (dataModel) {
        return dataModel.loading || dataModel.lastOne
      },
      empty (dataModel) {
        return dataModel.list.length === 0 && !dataModel.loading
      }
    },
    computed: {
      notUpdateList () {
        return this.notUpdate(this.meeting)
      },
      emptyList () {
        return this.empty(this.meeting)
      },
      ...mapState('collaborators', [
        'collaboratorSelected'
      ]),
      ...mapState('auth', [
        'user'
      ]),
      ...mapGetters('collaborators', [
        'hasSelected'
      ]),
      headerBackground () {
        if (this.meeting.hasOwnProperty('date')) {
          if (dateAndTime.compareDate(new Date(), this.meeting.date) === 0) {
            return '#1e3773'
          }
          if (dateAndTime.compareDate(new Date(), this.meeting.date) > 0) {
            return '#3ecc1a'
          }
        }
        return 'red'
      },
      meetingType () {
        return (this.meeting.hasOwnProperty('type')
          ? `${this.$constants.MEETING_TYPE_READABLE[this.meeting.type]}`
          : '') +
          (this.meeting.frecuency
          ? ` -  ${this.$constants.MEETING_FRECUENCY[this.meeting.frecuency]}`
          : '')
      },
      meetingState () {
        return (this.meeting.hasOwnProperty('state')
          ? `${this.$constants.MEETING_STATE_READABLE[this.meeting.state]}`
          : '')
      }
    }
  }
</script>

<style lang="scss">
  @import "~@/assets/styles/_variables.scss";
  @import "~@/assets/styles/_mixins.scss";
  .container {
    position: relative;
    width: 90%;
    margin: 20px auto;
  }
  .spinner-container {
    margin: 25px 0;
  }
  .empty {
    font-size: 20px;
    text-align: center;
    margin-top: 20px;
  }
  .separator {
    height: 0;
    border-top: 3px solid $primary-color;
  }
</style>