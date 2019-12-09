<template>
  <div class="widget-availability-card">

    <div v-if="mode === 'full'" class="card-base">
      <div class="image-status">
        <img :style="imageBorderColor" :src="collaboratorImage" alt="">
      </div>

      <div class="availability">
        <p class="type-label" :style="[labelColor, imageBorderColor]">{{ typeAvailability }}</p>
        <card-collaborator :collaborator="availability.collaborator"></card-collaborator>
        <p>{{ datePritty }} - {{ typeMsg }}</p>
      </div>
    </div>

    <div v-else class="card-base reduced">
      <div class="image-status">
        <img :style="imageBorderColor" :src="collaboratorImage" alt="">
      </div>

      <div class="availability">
        <p class="type-label" :style="[labelColor, imageBorderColor]">{{ typeAvailability }}</p>
        <card-collaborator :collaborator="availability.collaborator"></card-collaborator>
      </div>
    </div>


  </div>
</template>

<script>
  import Spinner from '@/components/SpinnerWrapper'
  import CardCollaborator from '@/components/cards/CardCollaborator'
  import dateAndTime from '@/utils/dateAndTime'
  import availabilityProperties from './availabilityProperties'

  export default {
    name: 'WidgetAvailabilityCard',
    components: {
      Spinner,
      CardCollaborator
    },
    props: {
      availability: {
        type: Object
      },
      mode: {
        type: String,
        default: 'full',
        validator: function (value) {
          return ['full', 'reduced'].indexOf(value) !== -1
        }
      }
    },
    computed: {
      typeMsg () {
        return availabilityProperties
          .typeMsg[this.availability.type](this.availability)
      },
      datePritty () {
        return dateAndTime.dateDayAndMonth(this.availability.from)
      },
      typeAvailability () {
        let string =
          this.$constants.AVAILABILITY_WIDGET_TYPES[this.availability.type]

        if (this.availability.type === this.$constants.AVAILABILITY_WIDGET_TYPES.MEDICAL_REPORT && this.availability.request.medicalDischarge) {
          string = 'alta medica'
        }

        if (!string) string = 'tipo'

        return string.toUpperCase()
      },
      imageBorderColor () {
        return {
          'borderColor': availabilityProperties.typeColor[this.availability.type]
        }
      },
      labelColor () {
        return {
          color: availabilityProperties.typeColor[this.availability.type]
        }
      },
      collaboratorImage () {
        const collaborator = this.availability.collaborator
        return (collaborator.hasOwnProperty('picture') && collaborator.picture !== null)
          ? collaborator.picture
          : '/static/img/icon-navigation/nofoto.svg'
      }
    }
  }
</script>

<style lang="scss" scoped>

  .widget-availability-card {
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

  @media (max-width: 480px) {
    .image-status {
      img {
        height: 50px;
        width: 50px;
      }
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
    margin: 4px 0;
    border: 2px solid #777777;
    color: rgb(74, 74, 74);
    font-weight: bold;
    border-radius: 4px;
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
</style>
