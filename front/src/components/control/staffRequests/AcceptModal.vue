<template>
  <dialog-with-content
    name="staff-request-accept-modal"
    :width="600"
    @before-opened="beforeOpened"
    @before-closed="resetDataToSubmit">
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12">
          <div v-if="requestType === $constants.staff_requests_types.LEAVE">
            <div class="horizontal-center">
              <h3>Complete las acciones ante la solicitud</h3>
            </div>

            <div class="row">
              <div class="col-xs-12 section-container">
                <div class="header">Acciones</div>
                <ul class="options-container">
                  <li>
                    <input type="radio" id="compensa-option" name="resolution"
                           :value="$constants.LEAVE_RESOLUTION.COMPENSATE"
                           v-model="resolution"
                           @change="updateField">
                    <label for="compensa-option">Compensa</label>
                    <div class="check"></div>
                  </li>
                  <li>
                    <input type="radio" id="no-compensa-option" name="resolution"
                           :value="$constants.LEAVE_RESOLUTION.NO_COMPENSATE"
                           v-model="resolution"
                           @change="updateField">
                    <label for="no-compensa-option">No compensa</label>
                    <div class="check"></div>
                  </li>
                  <li>
                    <input type="radio" id="no-descuenta-option" name="resolution"
                           :value="$constants.LEAVE_RESOLUTION.NO_DEDUCT"
                           v-model="resolution"
                           @change="updateField">
                    <label for="no-descuenta-option">No descuenta</label>
                    <div class="check"></div>
                  </li>
                  <li>
                    <input type="radio" id="franco-option" name="resolution"
                           :value="$constants.LEAVE_RESOLUTION.DAY_OFF"
                           v-model="resolution"
                           @change="updateField">
                    <label for="franco-option">Franco</label>
                    <div class="check"></div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </dialog-with-content>
</template>
<script>
  import DialogWithContent from '@/components/modals/DialogWithContent.vue'

  export default {
    components: {
      DialogWithContent
    },
    name: 'StaffRequestAcceptModal',
    data () {
      return {
        requestType: '',
        resolution: ''
      }
    },
    methods: {
      updateField (e) {
        this.$store.commit('staffRequests/updateToSubmitField', {field: e.target.name, value: e.target.value})
      },
      resetDataToSubmit () {
        this.resolution = ''
        this.$store.commit('staffRequests/resetDataToSubmit')
      },
      beforeOpened (event) {
        this.requestType = event.params.type
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/variables";

  .horizontal-center {
    display: flex;
    justify-content: center;
  }

  .justify-around {
    justify-content: space-around;
  }

  section {
    .header {
      font-size: 20px;
      font-weight: bolder;
      border-bottom: 2px solid $primary-color;
      margin-top: 10px;
    }
  }

  .section-container {
    margin-bottom: 15px;
  }

  .options-container {
    display: grid;
    grid-template-columns: 2fr 1.5fr;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    overflow: auto;
  }

  ul li {
    display: block;
    position: relative;
    float: left;
  }

  ul li input[type=radio] {
    position: absolute;
    visibility: hidden;
  }

  ul li label {
    display: block;
    position: relative;
    font-weight: 300;
    font-size: 1.35em;
    padding: 10px 5px 10px 60px;
    margin: 10px auto;
    height: 30px;
    z-index: 9;
    cursor: pointer;
  }

  ul li .check {
    display: block;
    position: absolute;
    border: 5px solid $primary-light;
    border-radius: 100%;
    height: 35px;
    width: 35px;
    top: 15px;
    left: 15px;
    z-index: 5;
  }

  ul li .check::before {
    display: block;
    position: absolute;
    content: '';
    border-radius: 100%;
    height: 15px;
    width: 15px;
    top: 5px;
    left: 5px;
    margin: auto;
  }

  input[type=radio]:checked ~ .check {
    border: 5px solid $primary-light;
  }

  input[type=radio]:checked ~ .check::before {
    background: $primary-light;
  }

  input[type=radio]:checked ~ label {
    color: $primary-light;
  }

  @media screen and (max-width: 480px) {
    .options-container {
      grid-template-columns: auto;
    }
  }

</style>
