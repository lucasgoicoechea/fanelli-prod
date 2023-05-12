<template>
  <label class="check-box">
    <input
      :type="typeInput"
      :value="val"
    
      :disabled="disabled"
      @change="onChange">
    <span class="checkmark"></span>
    <span class="label">{{ label }}</span>
  </label>
</template>

<script>
  export default {
    name: 'CheckBox',
    props: ['value', 'val', 'label', 'color', 'disabled', 'type'],
    data () {
      return {
        checkedProxy: false
      }
    },
    computed: {
      checked: {
        get () {
          return this.value
        },
        set (val) {
          this.checkedProxy = val
        }
      },
      typeInput () {
        return (this.type)
          ? this.type
          : 'checkbox'
      }
    },
    methods: {
      onChange () {
        this.$emit('input', this.checkedProxy)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../assets/styles/variables";

  /* The container */
  .check-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    position: relative;
    // padding-left: 35px;
    // margin-bottom: 12px;
    margin: 0;
    cursor: pointer;
    font-size: 22px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  /* Hide the browser's default checkbox */
  .check-box input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  /* Create a custom checkbox */
  .checkmark {
    position: relative;
    display: block;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: #dadada;
    border-radius: 3px;

  }

  /* On mouse-over, add a grey background color */
  .check-box:hover input ~ .checkmark {
    background-color: #ccc;
  }

  /* When the checkbox is checked, add a blue background */
  .check-box input:checked ~ .checkmark {
    background-color: $primary-light;
    box-shadow: 0px 1px 4px 0px $primary-light;
  }

  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  /* Show the checkmark when checked */
  .check-box input:checked ~ .checkmark:after {
    display: block;
  }

  /* Style the checkmark/indicator */
  .check-box .checkmark:after {
    left: 10px;
    top: 7px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }

  .label {
    color: #404040;
    font-size: medium;
    margin: 0;
    padding: 8px;
  }

</style>
