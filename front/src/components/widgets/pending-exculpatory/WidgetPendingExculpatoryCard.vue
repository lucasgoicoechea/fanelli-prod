<template>
  <div class="widget-news-without-exculpatory">

    <div v-if="mode === 'full'" class="card-base">
      <div class="image-status">
        <img :style="imageBorderColor" :src="collaboratorImage" alt="">
      </div>

      <div class="news-info">
        <div class="type-and-pending-text">
          <p class="type-label" :style="[labelColor, imageBorderColor]">{{ typeNews }}</p>
          <div class="pending-text" title="PENDIENTE DE DESCARGO"> PENDIENTE DE DESCARGO</div>
        </div>
        <card-collaborator :collaborator="news.collaborator"></card-collaborator>
        <p>{{ datePretty }} - {{ typeMsg }}</p>
      </div>
    </div>

    <div v-else class="card-base reduced">
      <div class="image-status">
        <img :style="imageBorderColor" :src="collaboratorImage" alt="">
      </div>

      <div class="news-info">
        <p class="type-label" :style="[labelColor, imageBorderColor]">{{ typeNews }}</p>
        <card-collaborator :collaborator="news.collaborator"></card-collaborator>
      </div>
    </div>

  </div>
</template>

<script>
  import Spinner from '@/components/SpinnerWrapper'
  import CardCollaborator from '@/components/cards/CardCollaborator'
  import dateAndTime from '@/utils/dateAndTime'

  export default {
    name: 'WidgetPendingExculpatoryCard',
    components: {
      Spinner,
      CardCollaborator
    },
    props: {
      news: {
        type: Object,
        required: true
      },
      mode: {
        type: String,
        default: 'full',
        validator: function (value) {
          return ['full', 'reduced'].indexOf(value) !== -1
        }
      }
    },
    data () {
      return {
        typeColor: {
          'ABSENT': '#ff0000',
          'EARLY': '#ef6c00',
          'LATE': '#ef6c00',
          'ACCIDENT': '#ff0000'
        },
        typeText: {
          'LATE': (params) => {
            return `LLegada tarde
            ${(params.withNotice) ? 'con aviso' : 'sin aviso'}.`
          },
          'ABSENT': (params) => {
            return `Ausente
            ${(params.withNotice) ? 'con aviso' : 'sin aviso'}.`
          },
          'EARLY': (params) => {
            return `Se retira
            ${(params.withNotice) ? 'con aviso' : 'sin aviso'}.`
          },
          'ACCIDENT': (params) => {
            return `El accidente
            ${(params.informed) ? 'fue denunciado' : 'no fue denunciado'}.
            ${!(params.inPlant) ? 'In Itinere.' : 'Ocurrio en la plata.'}
            ${(params.left) ? 'Se retira a las ' + params.time : 'Falta'}`
          }
        }
      }
    },
    computed: {
      typeMsg () {
        return this.typeText[this.news.type](this.news)
      },
      datePretty () {
        return dateAndTime.dateDayAndMonth(this.news.created_at)
      },
      timeFrom () {
        const time = new Date()
        let [hours, minutes] = this.news.time.from.split(':')
        time.setHours(hours)
        time.setMinutes(minutes)
        return time
      },
      timeFromString () {
        return dateAndTime.toTime24(this.timeFrom)
      },
      timeTo () {
        return this.news.time.to
      },
      timeToString () {
        return dateAndTime.toTime24(this.timeTo)
      },
      typeNews () {
        let string = this.$constants.news_types_text[this.news.type]
        if (!string) string = 'tipo'
        return string.toUpperCase()
      },
      imageBorderColor () {
        return {
          'borderColor': this.typeColor[this.news.type]
        }
      },
      labelColor () {
        return {
          color: this.typeColor[this.news.type]
        }
      },
      collaboratorImage () {
        const collaborator = this.news.collaborator
        return (collaborator.hasOwnProperty('picture') && collaborator.picture !== null)
          ? collaborator.picture
          : '/static/img/icon-navigation/nofoto.svg'
      }
    }
  }
</script>

<style lang="scss" scoped>

  .widget-news-without-exculpatory {
    transition: all 0.2s;
    position: relative;
  }

  .card-base {
    position: relative;
    margin: 5px;
    padding: 10px;
    border-radius: 4px;
    background-color: #f5f5f5;
    box-shadow: 1px 1px 5px 0 rgba(0, 0, 0, 0.4);
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .image-status {
    display: flex;
    align-items: center;
    margin-right: 10px;

    img {
      border: 3px solid grey;
      border-radius: 100px;
      height: 70px;
      width: 70px;
    }
  }

  .type-and-pending-text {
    display: flex;
    align-items: center;
    max-width: 274px;
  }

  .news-info {
    width: 70%;
  }

  @media (max-width: 480px) {
    .image-status {
      img {
        height: 50px;
        width: 50px;
      }
    }

    .type-and-pending-text {
      display: block;
    }
  }

  p {
    margin: 0;
    color: #3d3d3d;
    font-weight: bold;
  }

  .type-label {
    display: inline-block;
    padding: 0 4px;
    margin: 4px 2px;
    border: 2px solid #777777;
    color: rgb(74, 74, 74);
    font-weight: bold;
    border-radius: 4px;
    white-space: nowrap;
  }

  .reduced {
    .type-label {
      font-size: smaller;
      margin: 3px 0;
    }

    .image-status {
      img {
        height: 45px;
        width: 45px;
      }
    }
  }

  .pending-text {
    max-width: 190px;
    padding: 0 1px 0 3px;
    color: #000000;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

</style>
