<template>
  <div class="input-date">
    <div v-if="label !== undefined" class="input-label">{{ label }}</div>
    <input
      type="date"
      :value="formatDate"
      @input="update"
      @focus="selectAll"
      :id="id"
      :style="inputStyle"
      :class="{ 'has-error': error, 'flat': flat }"
      :readonly="readonly"
      :min="min"
      :placeholder="placeholder">
  </div>
</template>

<script>
  export default {
    name: 'input-date',
    props: {
      value: {
        required: true
      },
      placeholder: {
        type: String,
        default: 'DD-MM-AAAA'
      },
      id: {
        type: String,
        required: true
      },
      readonly: {
        type: Boolean,
        default: false
      },
      error: {
        type: Boolean,
        default: false
      },
      label: {
        type: String,
        required: false
      },
      flat: {
        type: Boolean,
        required: false,
        default: false
      },
      min: {
        type: Date,
        required: false
      },
      width: {
        type: String,
        required: false,
        default: 'auto'
      }
    },
    methods: {
      update (e) {
        this.$emit('input', this.$moment(e.target.value).toDate())
      },
      selectAll (event) {
        // Workaround for Safari bug
        // https://stackoverflow.com/q/1269722/1850609
        setTimeout(function () {
          event.target.select()
        }, 0)
      }
    },
    computed: {
      formatDate () {
        return this.value && this.$moment(this.value).utc().format('YYYY-MM-DD')
      },
      inputStyle () {
        return {
          width: this.width
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .input-label {
    position: absolute;
  }

  .flat {
    margin: 0;
    padding: 0;
  }

</style>
