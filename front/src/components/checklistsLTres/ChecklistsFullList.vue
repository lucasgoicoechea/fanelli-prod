<template>
  <div class="form-list">
    <div class="container-fluid">
      <div class="col-xs-12 loading" v-show="loading">
        <spinner :show="loading"></spinner>
      </div>
      <div class="col-xs-12 marginBottom">
        <input class="filterDate" v-model="date" type="date">
        <button class="redirect" @click="redirect">Ir a la fecha</button>
      </div>
    </div>

    <div class="container-fluid" v-show="!loading">
      <div class="col-xs-6 col-sm-4 col-md-2"  v-for="checklistDate in getDatesChecklists">
        <spinner :show="loading"></spinner>
        <checklist-date-button
          :key="checklistDate"
          :date="checklistDate"></checklist-date-button>
      </div>
    </div>
  </div>
</template>

<script>
  import Spinner from '@/components/Spinner.vue'
  import ChecklistDateButton from '@/components/checklists/ChecklistDateButton.vue'
  import { mapState, mapGetters } from 'vuex'

  export default {
    name: 'ChecklistsList',
    components: {Spinner, ChecklistDateButton},
    data () {
      return {
        date: ''
      }
    },
    created: function () {
      this.$store.dispatch('checklistsLTres/fetchLast30days')
    },
    methods: {
      redirect: function () {
        if (this.date !== '') {
          const formatedDate = this.$moment(this.date).format('DD-MM-YYYY')
          this.$router.push({name: 'checklistsHistory', params: {date: formatedDate}})
        } else {
          this.$modal.show('dialog', {
            text: 'Ingrese una fecha válida',
            buttons: [
              {
                title: 'Aceptar'
              }
            ]
          })
        }
      }
    },
    computed: {
      shouldNotUpdate: function () {
        return this.lastOne || this.loading
      },
      ...mapState(
        'checklistsLTres', [
          'checklists',
          'loading',
          'lastOne'
        ]),
      ...mapGetters(
        'checklistsLTres', [
          'filterChecklistsByDate',
          'getDatesChecklists'
        ]
      )
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  .filterDate {
    margin: 20px 5px 10px 5px;
    width: 180px;
  }

  .marginBottom {
    margin-bottom: 20px;
  }

  .redirect {
    background-color: $secondary-color;
    border: none;
    color: white;
    padding: 5px 15px;
    text-align: center;
    text-decoration: none;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
  }

  .dates {
    margin: 10px 25px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .loading {
    text-align: center;
    margin: 20px;

    .spinner {
      font-size: xx-large;
    }
  }
</style>
