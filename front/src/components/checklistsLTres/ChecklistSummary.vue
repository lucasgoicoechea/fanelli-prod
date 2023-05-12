<template>
  <article class="checklist-sumary">
    <header>
      <h4>{{summary.sector | pretty}}</h4>
      <!-- <router-link :to="{ name: 'checklist', params: { sector: type } }"><h4>Ver check</h4></router-link> -->
    </header>
    <section class="review">
      <h3>Revisión</h3>
      <table>
        <tr>
          <th></th>
          <th><img src="/static/img/checklists/sumary/ok.svg" alt=""></th>
          <th><img src="/static/img/checklists/sumary/mal.svg" alt=""></th>
          <th><img src="/static/img/checklists/sumary/obsvmal.svg" alt=""></th>
          <th><img src="/static/img/checklists/sumary/obsv.svg" alt=""></th>
          <th><img src="/static/img/checklists/sumary/inc.svg" alt=""></th>
          <th><img src="/static/img/checklists/sumary/progreso.svg" alt=""></th>
        </tr>
        <tr v-for="item in summary.revision" v-if="item !== null">
          <td>
            <p>{{ item | shiftReadable }}</p>
          </td>
          <td>{{ item.goodChecks }}</td>
          <td>{{ item.badChecks }}</td>
          <td>{{ item.badComments }} </td>
          <td>{{ item.goodComments }}</td>
          <td>{{ item.incompleteChecks }}</td>
          <td>{{ item.totalChecks - item.incompleteChecks }}/{{ item.totalChecks }}</td>
        </tr>
        <tr v-else>
          <td>
            <p>-</p>
          </td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr v-if="!isEmpty(totalRevision)">
          <th>
            <p>Total</p>
          </th>
          <th>{{ totalRevision.goodChecks }}</th>
          <th>{{ totalRevision.badChecks }}</th>
          <th>{{ totalRevision.badComments }} </th>
          <th>{{ totalRevision.goodComments }}</th>
          <th>{{ totalRevision.incompleteChecks }}</th>
          <th>{{ totalRevision.totalChecks - totalRevision.incompleteChecks }}/{{ totalRevision.totalChecks }}</th>
        </tr>
        <tr v-else>
          <th>
            <p>Total</p>
          </th>
          <th>-</th>
          <th>-</th>
          <th>-</th>
          <th>-</th>
          <th>-</th>
          <th>-</th>
        </tr>
      </table>
    </section>
    <section class="correction">
      <h3>Corrección</h3>
      <table>
        <tr>
          <th><img src="/static/img/checklists/sumary/ok.svg" alt=""></th>
          <th><img src="/static/img/checklists/sumary/mal.svg" alt=""></th>
          <th><img src="/static/img/checklists/sumary/obsvmal.svg" alt=""></th>
          <th><img src="/static/img/checklists/sumary/obsv.svg" alt=""></th>
          <th><img src="/static/img/checklists/sumary/inc.svg" alt=""></th>
          <th><img src="/static/img/checklists/sumary/progreso.svg" alt=""></th>
        </tr>
        <tr v-for="item in summary.correction" v-if="item !== null">
          <td>{{ item.goodChecks }}</td>
          <td>{{ item.badChecks }}</td>
          <td>{{ item.badComments }} </td>
          <td>{{ item.goodComments }}</td>
          <td>{{ item.incompleteChecks }}</td>
          <td>{{ item.totalChecks - item.incompleteChecks }}/{{ item.totalChecks }}</td>
        </tr>
        <tr v-else>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>
        <tr v-if="!isEmpty(totalCorrection)">
          <th>{{ totalCorrection.goodChecks }}</th>
          <th>{{ totalCorrection.badChecks }}</th>
          <th>{{ totalCorrection.badComments }} </th>
          <th>{{ totalCorrection.goodComments }}</th>
          <th>{{ totalCorrection.incompleteChecks }}</th>
          <th>{{ totalCorrection.totalChecks - totalCorrection.incompleteChecks }}/{{ totalCorrection.totalChecks }}
          </th>
        </tr>
        <tr v-else>
          <th>-</th>
          <th>-</th>
          <th>-</th>
          <th>-</th>
          <th>-</th>
          <th>-</th>
        </tr>
      </table>
    </section>
  </article>
</template>

<script>
  export default {
    name: 'ChecklistSumary',
    props: {
      summary: {
        type: Object
      }
    },
    data () {
      return {}
    },
    methods: {
      isEmpty (obj) {
        return Object.keys(obj).length === 0
      }
    },
    computed: {
      totalRevision: function () {
        const total = {}
        this.summary.revision
          .filter(s => s !== null)
          .forEach(s => {
            Object.keys(s).forEach(k => {
              if (!total.hasOwnProperty(k)) {
                total[k] = s[k]
              } else {
                total[k] += s[k]
              }
            })
          })
        return total
      },
      totalCorrection: function () {
        const total = {}
        this.summary.correction
          .filter(s => s !== null)
          .forEach(s => {
            Object.keys(s).forEach(k => {
              if (!total.hasOwnProperty(k)) {
                total[k] = s[k]
              } else {
                total[k] += s[k]
              }
            })
          })
        return total
      }
    },
    filters: {
      shiftReadable: function (item) {
        if (item.hasOwnProperty('shift') && item.hasOwnProperty('schedule')) {
          return item.shift + item.schedule.charAt(0).toUpperCase()
        }
        return '-'
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/variables";

  header {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-bottom: 3px solid $secondary-color;

    h4 {
      margin: 2px 0;
      padding: 0;
      background-color: inherit;
      color: $primary-color;
      font-weight: bold;
      text-decoration: none;
    }
  }

  article {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: flex-start;
    margin: 30px 0;
  }

  section {
    margin: 10px 0;
    display: inline-block;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
  }

  table {
    position: relative;
    width: 100%;
    table-layout: fixed;
  }

  p {
    margin: 0;
    padding: 0;
  }

  h3 {
    margin: 0;
    padding: 8px;
    background-color: $primary-color;
    text-align: center;
    color: white;
  }

  th, td {
    padding: 10px 8px;
    text-align: center;
    vertical-align: middle;
    color: white;
    font-weight: bold;
    font-size: large;
  }

  th {
    img {
      height: 25px;
    }
  }

  tr:nth-child(1) {
    background-color: rgba(86, 113, 160, 1); // === #5671a0 with 100% opacity
  }

  tr:nth-last-child(1) {
    background-color: $primary-color;

    th {
      padding: 4px !important;
    }
  }

  tr:nth-child(2) {
    background-color: darken(rgba(186, 202, 226, .2), 20%); // == #bacae2
  }

  tr:nth-child(3) {
    background-color: darken(rgba(186, 202, 226, .6), 30%); // == #bacae2
  }

  tr:nth-child(4) {
    background-color: darken(rgba(186, 202, 226, .9), 50%); // == #bacae2
  }

  .review {
    width: 53%;

    th:nth-child(1) {
      width: 18%;
    }

    td:nth-child(1) {
      background-color: rgba(86, 113, 160, 0.90); // === #5671a0 with 100% opacity
      font-size: small;
      text-align: center;
      padding: 4px;
    }

    th:nth-child(1) {
      font-size: small;
    }

    td:nth-child(2) {
      background-color: rgba(111, 191, 57, .75); // == #6fbf39;
    }
    td:nth-child(3) {
      background-color: rgba(220, 66, 66, .85); // === #dc4242;
    }
    td:nth-child(4) {
      background-color: rgba(227, 104, 104, .75); // === #e36868;
    }
    td:nth-child(5) {
      background-color: rgba(186, 202, 226, 0.71); // === #bacae2 with 100% opacity
    }
    td:nth-child(6) {
      background-color: rgba(86, 113, 160, 0.34); // === #5671a0 with 100% opacity
    }
    td:nth-child(7) {
      background-color: rgba(86, 113, 160, 0.67); // === #5671a0 with 100% opacity
    }
  }

  .correction {
    width: 45%;

    td:nth-child(1) {
      background-color: rgba(111, 191, 57, .75); // == #6fbf39;
    }
    td:nth-child(2) {
      background-color: rgba(220, 66, 66, .85); // === #dc4242;
    }
    td:nth-child(3) {
      background-color: rgba(227, 104, 104, .75); // === #e36868;
    }
    td:nth-child(4) {
      background-color: rgba(186, 202, 226, 0.71); // === #bacae2 with 100% opacity
    }
    td:nth-child(5) {
      background-color: rgba(86, 113, 160, 0.34); // === #5671a0 with 100% opacity
    }
    td:nth-child(6) {
      background-color: rgba(86, 113, 160, 0.67); // === #5671a0 with 100% opacity
    }
  }

  @media (max-width: 630px) {
    .review, .correction {
      width: 100%;
    }

    tr:nth-last-child(1) th:nth-last-child(1) {
      padding: 2px;
      font-size: 4vw;
    }

    .review {
      td:nth-child(1) {
        font-size: x-small;
        padding: 2px;
      }
      td:nth-child(7) {
        padding: 2px;
        font-size: 4vw;
      }
    }

    .correction {
      td:nth-child(6) {
        padding: 2px;
        font-size: 5vw;
      }
    }
  }

  @media (min-width: 420px) and (max-width: 736px) { // iphone 6plus landscape

    tr:nth-last-child(1) th:nth-last-child(1) {
      padding: 2px;
      font-size: 2.5vw;
    }

    .review {
      td:nth-child(1) {
        font-size: x-small;
        padding: 2px;
      }
      td:nth-child(7) {
        padding: 2px;
        font-size: 2.5vw;
      }
    }

    .correction {
      td:nth-child(6) {
        padding: 2px;
        font-size: 2.8vw;
      }
    }
  }
</style>
