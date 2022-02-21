<template>
  <div class="bug-report-form-edit">
    <div class="container-fluid">

      <div class="row">

        <div>
        <div class="col-xs-12">
          <h3>Estado de Falla</h3>
          <!--<sub-part-selector
            :multipleSelection="true"
             typeList="full"
            :preSelection="editable.collaborators"></sub-part-selector>-->
            <select v-model="bugReport.estado" id="estado">
              <option v-for="(label, value) in $constants.BUG_REPORT_ESTADO"  :key="value" :value="value"> {{label}}</option>
          </select>
        </div>
        </div>

       <div class="col-xs-12">
          <h3>Resuelto por</h3>
          <div class="row">
            <div
              class="col-md-6"
              v-for="(label, value) in $constants.BUG_REPORT_TURNOS"
              :key="value">
              <check-box
                class="margin"
                type="radio"
                v-model="bugReport.resuelto"
                :val="value"
                :label="label"></check-box>
            </div>      
          </div>
        </div>

        <div class="col-xs-12">
          <h3>Resumen/Resolucion</h3>
          <vue-editor
          v-model="bugReport.resume"
          placeholder="Escriba aquí el resumen de la resolucion de la falla"
          :editorToolbar="defaultToolbar"></vue-editor>
        </div>
      </div>

      <div class="separator"></div>

    </div>
  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import LineSelector from '@/components/fails/line/LineSelector'
  import SectorSelector from '@/components/fails/sector/SectorSelector'
  import SubSectorSelector from '@/components/fails/subsector/SubSectorSelector'
  import EquipoSelector from '@/components/fails/equipo/EquipoSelector'
  import PartSelector from '@/components/fails/part/PartSelector'
  import SubPartSelector from '@/components/fails/subpart/SubPartSelector'
  import CheckBox from '@/components/CheckBoxInput'
  import { VueEditor } from 'vue2-editor'

  export default {
    name: 'BugReportForm',
    components: {
      VueEditor,
      LineSelector,
      SectorSelector,
      SubSectorSelector,
      EquipoSelector,
      PartSelector,
      SubPartSelector,
      CheckBox
    },
    props: {
      bugReports: {
        type: Object
      },
      preSelection: {
        type: Array,
        default: () => ([])
      },
      editable: {
        type: Object,
        default: () => ({})
      },
      mode: {
        type: String,
        default: 'creation',
        validator: function (value) {
          return ['creation', 'edition'].indexOf(value) !== -1
        }
      }
    },
    data () {
      return {
        bugReport: this.generateData(),
        customToolbar: [
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['image', 'code-block']
        ],
        defaultToolbar: [
          [{ header: [false, 1, 2, 3, 4, 5, 6] }],
          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          [
            { align: '' },
            { align: 'center' },
            { align: 'right' },
            { align: 'justify' }
          ],
          ['blockquote', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ color: [] }, { background: [] }],
          ['link'],
          ['clean']
        ]
      }
    },
    mounted () {
      this.$emit('update', {
        validation: this.validate(),
        form: this.bugReport
      })
    },
    methods: {
      generateData () {
        return {
          line: this.editable.line || '',
          sector: this.editable.sector || '',
          sub_sector: this.editable.sub_sector || '',
          equipo: this.editable.equipo || '',
          group: this.editable.group || '',
          part: this.editable.part || '',
          estado: this.editable.estado || '',
          prioridad: this.editable.prioridad || '',
          inconveniente: this.editable.inconveniente || '',
          detectado: this.editable.detectado || '',
          resuelto: this.editable.resuelto || '',
          resume: this.editable.resume || ''
        }
      },
      validate () {
        /* if (!this.hasSelected) {
          return {valid: false, msg: 'Seleccione un/unos colaborador/es'}
        }
        if (this.bugReport.type.length === 0) {
          return {valid: false, msg: 'Seleccione un tipo de reunión'}
        }
        if (this.bugReport.recommendations.length === 0) {
          return {valid: false, msg: 'Seleccione al menos un objetivo'}
        }
        if (this.bugReport.description.length === 0) {
          return {valid: false, msg: 'Ingrese un resumen de la reunión'}
        } */
        return {valid: true, msg: 'OK'}
      }
    },
    watch: {
      bugReport: {
        handler: function () {
          this.$emit('update', {
            validation: this.validate(),
            form: this.bugReport
          })
        },
        deep: true
      },
      getSelectedIds: {
        handler: function () {
          this.prepareMeeting()
          this.$emit('update', {
            validation: this.validate(),
            form: this.bugReport
          })
        },
        deep: true
      },
      /* getSelectedEditorsIds: {
        handler: function () {
          this.prepareMeeting()
          this.$emit('update', {
            validation: this.validate(),
            form: this.bugReport
          })
        },
        deep: true
      }, */
      editable: {
        handler: function () {
          this.bugReport = this.generateData()
          this.initPickers()
        },
        deep: true
      }
    },
    computed: {
      frecuency () {
        return this.isFrecuency
      },
      sectorList () { // Lista de Sectores, Linea 0
        if (this.bugReport.line === 'LINE_0') {
          return this.$constants.BUG_REPORT_SECTORS_LINE_0
        } else { // Lista de Sectores, Linea 1
          if (this.bugReport.line === 'LINE_1') {
            return '-'
          } else { // Lista de Sectores, Linea 2
            if (this.bugReport.line === 'LINE_2') {
              return this.$constants.BUG_REPORT_SECTORS_LINE_2
            } else { // Lista de Sectores, Linea 3
              if (this.bugReport.line === 'LINE_3') {
                return '-'
              }
            }
          }
        }
      },
      subSectorList () {
        if (this.bugReport.sector === 'PRODUCCION') { // Lista de Sub-Sectores, Sector Produccion
          return this.$constants.BUG_REPORT_SUBSECTORS_PRODUCCION
        } else {
          if (this.bugReport.sector === 'AUTOMATISMO_CORTE_Y_CARGA') { // Lista de Sub-Sectores, Sector Automatismo Corte y Carga
            return this.$constants.BUG_REPORT_SUBSECTORS_AUTOMATISMO_CORTE_Y_CARGA
          } else {
            if (this.bugReport.sector === 'SECADO') { // Lista de Sub-Sectores, Sector Secado
              return this.$constants.BUG_REPORT_SUBSECTORS_SECADO
            } else {
              if (this.bugReport.sector === 'MOVIMENTACION_SECADERO') { // Lista de Sub-Sectores, Sector Movimentacion de Secadero
                return this.$constants.BUG_REPORT_SUBSECTORS_MOVIMENTACION_SECADERO
              } else {
                if (this.bugReport.sector === 'APILADO') { // Lista de Sub-Sectores, Sector Apilado
                  return this.$constants.BUG_REPORT_SUBSECTORS_APILADO
                } else {
                  if (this.bugReport.sector === 'HORNO') { // Lista de Sub-Sectores, Sector Horno
                    return this.$constants.BUG_REPORT_SUBSECTORS_HORNO
                  } else { // Lista de Sub-Sectores, Sector Movimentacion de Horno
                    if (this.bugReport.sector === 'MOVIMENTACION_HORNO') {
                      return this.$constants.BUG_REPORT_SUBSECTORS_MOVIMENTACION_HORNO
                    } else { // Lista de Sub-Sectores, Sector Desapilado y Empaque
                      if (this.bugReport.sector === 'DESAPILADO_Y_EMPAQUE') {
                        return this.$constants.BUG_REPORT_SUBSECTORS_DESAPILADO_EMPAQUE
                      } else { // Lista de Sub-Sectores, Sector Servicios Auxiliares
                        if (this.bugReport.sector === 'SERVICIOS_AUXILIARES') {
                          return this.$constants.BUG_REPORT_SUBSECTORS_SERVICIOS_AUXILIARES
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return this.$constants.BUG_REPORT_SUBSECTORS
      },
      equipoList () { // Lista de Equipos, Sector Produccion
        if (this.bugReport.sector === 'PRODUCCION' && this.bugReport.sub_sector === 'DOSIFICACION') {
          return this.$constants.BUG_REPORT_TEAM_PRODUCCION_DOSIFICACION
        } else {
          if (this.bugReport.sector === 'PRODUCCION' && this.bugReport.sub_sector === 'EXTRUSION') {
            return this.$constants.BUG_REPORT_TEAM_PRODUCCION_EXTRUSION
          } else {
            if (this.bugReport.sector === 'PRODUCCION' && this.bugReport.sub_sector === 'LAMINADO') {
              return this.$constants.BUG_REPORT_TEAM_PRODUCCION_LAMINADO
            } else {
              if (this.bugReport.sector === 'PRODUCCION' && this.bugReport.sub_sector === 'MEZCLADO') {
                return this.$constants.BUG_REPORT_TEAM_PRODUCCION_MEZCLADO
              } else {
                if (this.bugReport.sector === 'PRODUCCION' && this.bugReport.sub_sector === 'TRANSPORTE') {
                  return this.$constants.BUG_REPORT_TEAM_PRODUCCION_TRANSPORTE
                } else { // Lista de Equipos, Sector Automatismo Corte y Carga
                  if (this.bugReport.sector === 'AUTOMATISMO_CORTE_Y_CARGA' && this.bugReport.sub_sector === 'CORTADORA') {
                    return this.$constants.BUG_REPORT_TEAM_AUTOMATISMO_CORTE_Y_CARGA_CORTADORA
                  } else {
                    if (this.bugReport.sector === 'AUTOMATISMO_CORTE_Y_CARGA' && this.bugReport.sub_sector === 'MESA_DE_TRANSPORTE') {
                      return this.$constants.BUG_REPORT_TEAM_AUTOMATISMO_CORTE_Y_CARGA_MESA_DE_TRANSPORTE
                    } else {
                      if (this.bugReport.sector === 'AUTOMATISMO_CORTE_Y_CARGA' && this.bugReport.sub_sector === 'MECANISMO_DE_CARGA') {
                        return this.$constants.BUG_REPORT_TEAM_AUTOMATISMO_CORTE_Y_CARGA_MECANISMO_DE_CARGA
                      } else { // Lista de Equipos, Sector Secado
                        if (this.bugReport.sector === 'SECADO' && this.bugReport.sub_sector === 'SECADERO_TUNEL_PLANTA_2') {
                          return this.$constants.BUG_REPORT_TEAM_SECADO_SECADERO_TUNEL_PLANTA_2
                        } else {
                          if (this.bugReport.sector === 'SECADO' && this.bugReport.sub_sector === 'VENTILACION_INTERNA') {
                            return this.$constants.BUG_REPORT_TEAM_SECADO_VENTILACION_INTERNA
                          } else {
                            if (this.bugReport.sector === 'SECADO' && this.bugReport.sub_sector === 'VENTILACION_EXTERNA') {
                              return this.$constants.BUG_REPORT_TEAM_SECADO_VENTILACION_EXTERNA
                            } else { // Lista de Equipos, Sector Movimentacion de Secadero
                              if (this.bugReport.sector === 'MOVIMENTACION_SECADERO' && this.bugReport.sub_sector === 'EXTERNA') {
                                return this.$constants.BUG_REPORT_TEAM_MOVIMENTACION_SECADERO_EXTERNA
                              } else {
                                if (this.bugReport.sector === 'MOVIMENTACION_SECADERO' && this.bugReport.sub_sector === 'TRASBORDO') {
                                  return this.$constants.BUG_REPORT_TEAM_MOVIMENTACION_SECADERO_TRASBORDO
                                } else { // Lista de Equipos, Sector Apilado
                                  if (this.bugReport.sector === 'APILADO' && this.bugReport.sub_sector === 'MECANISMO_DESCARGA') {
                                    return this.$constants.BUG_REPORT_TEAM_APILADO_MECANISMO_DESCARGA
                                  } else {
                                    if (this.bugReport.sector === 'APILADO' && this.bugReport.sub_sector === 'MESA_TRANSPORTE') {
                                      return this.$constants.BUG_REPORT_TEAM_APILADO_MESA_TRANSPORTE
                                    } else { // Lista de Equipos, Sector Horno
                                      if (this.bugReport.sector === 'APILADO' && this.bugReport.sub_sector === 'PINZA') {
                                        return this.$constants.BUG_REPORT_TEAM_APILADO_PINZA
                                      } else {
                                        if (this.bugReport.sector === 'HORNO' && this.bugReport.sub_sector === 'HORNO') {
                                          return this.$constants.BUG_REPORT_TEAM_HORNO
                                        } else {
                                          if (this.bugReport.sector === 'HORNO' && this.bugReport.sub_sector === 'VAGONETAS') {
                                            return this.$constants.BUG_REPORT_TEAM_HORNO_VAGONETAS
                                          } else {
                                            if (this.bugReport.sector === 'HORNO' && this.bugReport.sub_sector === 'VENTILACION') {
                                              return this.$constants.BUG_REPORT_TEAM_HORNO_VENTILACION
                                            } else {
                                              if (this.bugReport.sector === 'HORNO' && this.bugReport.sub_sector === 'QUEMADORES') {
                                                return this.$constants.BUG_REPORT_TEAM_HORNO_QUEMADORES
                                              } else { // Lista de Equipos, Sector Movimentacion de Horno
                                                if (this.bugReport.sector === 'MOVIMENTACION_HORNO' && this.bugReport.sub_sector === 'EXTERNA') {
                                                  return this.$constants.BUG_REPORT_TEAM_MOVIMENTACION_HORNO_EXTERNA
                                                } else {
                                                  if (this.bugReport.sector === 'MOVIMENTACION_HORNO' && this.bugReport.sub_sector === 'TRASBORDO') {
                                                    return this.$constants.BUG_REPORT_TEAM_MOVIMENTACION_HORNO_TRASBORDO
                                                  } else { // Lista de Equipos, Sector Desapilado y Empaque
                                                    if (this.bugReport.sector === 'DESAPILADO_Y_EMPAQUE' && this.bugReport.sub_sector === 'PINZA') {
                                                      return this.$constants.BUG_REPORT_TEAM_DESAPILADO_EMPAQUE_PINZA
                                                    } else {
                                                      if (this.bugReport.sector === 'DESAPILADO_Y_EMPAQUE' && this.bugReport.sub_sector === 'LIMPIEZA_VAGONETAS') {
                                                        return this.$constants.BUG_REPORT_TEAM_DESAPILADO_EMPAQUE_LIMPIEZA_VAGONETAS
                                                      } else {
                                                        if (this.bugReport.sector === 'DESAPILADO_Y_EMPAQUE' && this.bugReport.sub_sector === 'ENVOLVEDORA') {
                                                          return this.$constants.BUG_REPORT_TEAM_DESAPILADO_EMPAQUE_ENVOLVEDORA
                                                        } else {
                                                          if (this.bugReport.sector === 'DESAPILADO_Y_EMPAQUE' && this.bugReport.sub_sector === 'PEGADO_FILM') {
                                                            return this.$constants.BUG_REPORT_TEAM_DESAPILADO_EMPAQUE_PEGADO_FILM
                                                          } else {
                                                            if (this.bugReport.sector === 'DESAPILADO_Y_EMPAQUE' && this.bugReport.sub_sector === 'MESA_TRANSPORTE') {
                                                              return this.$constants.BUG_REPORT_TEAM_DESAPILADO_EMPAQUE_MESA_TRANSPORTE
                                                            } else {
                                                              if (this.bugReport.sector === 'DESAPILADO_Y_EMPAQUE' && this.bugReport.sub_sector === 'FLEJADORA') {
                                                                return this.$constants.BUG_REPORT_TEAM_DESAPILADO_EMPAQUE_FLEJADORA
                                                              } else {
                                                                if (this.bugReport.sector === 'DESAPILADO_Y_EMPAQUE' && this.bugReport.sub_sector === 'REMOJADORA') {
                                                                  return this.$constants.BUG_REPORT_TEAM_DESAPILADO_EMPAQUE_REMOJADORA
                                                                } else { // Lista de Equipos, Sector Servicios Auxiliares
                                                                  if (this.bugReport.sector === 'SERVICIOS_AUXILIARES' && this.bugReport.sub_sector === 'ENERGIA_ELECTRICA') {
                                                                    return this.$constants.BUG_REPORT_TEAM_SERVICIOS_AUXILIARES_ENERGIA_ELECTRICA
                                                                  } else {
                                                                    if (this.bugReport.sector === 'SERVICIOS_AUXILIARES' && this.bugReport.sub_sector === 'MOLDES') {
                                                                      return this.$constants.BUG_REPORT_TEAM_SERVICIOS_AUXILIARES_MOLDES
                                                                    } else {
                                                                      if (this.bugReport.sector === 'SERVICIOS_AUXILIARES' && this.bugReport.sub_sector === 'GAS') {
                                                                        return this.$constants.BUG_REPORT_TEAM_SERVICIOS_AUXILIARES_GAS
                                                                      } else {
                                                                        if (this.bugReport.sector === 'SERVICIOS_AUXILIARES' && this.bugReport.sub_sector === 'VAPOR') {
                                                                          return this.$constants.BUG_REPORT_TEAM_SERVICIOS_AUXILIARES_VAPOR
                                                                        } else {
                                                                          if (this.bugReport.sector === 'SERVICIOS_AUXILIARES' && this.bugReport.sub_sector === 'AIRE') {
                                                                            return this.$constants.BUG_REPORT_TEAM_SERVICIOS_AUXILIARES_AIRE
                                                                          } else {
                                                                            if (this.bugReport.sector === 'SERVICIOS_AUXILIARES' && this.bugReport.sub_sector === 'AUTOELEVADORES_PRODUCCION') {
                                                                              return this.$constants.BUG_REPORT_TEAM_SERVICIOS_AUXILIARES_AUTOELEVADORES_PRODUCCION
                                                                            } else {
                                                                              if (this.bugReport.sector === 'SERVICIOS_AUXILIARES' && this.bugReport.sub_sector === 'MAQ_LIMPIEZA') {
                                                                                return this.$constants.BUG_REPORT_TEAM_SERVICIOS_AUXILIARES_MAQ_LIMPIEZA
                                                                              } else {
                                                                                if (this.bugReport.sector === 'SERVICIOS_AUXILIARES' && this.bugReport.sub_sector === 'GENERADORES') {
                                                                                  return this.$constants.BUG_REPORT_TEAM_SERVICIOS_AUXILIARES_GENERADORES
                                                                                } else {
                                                                                  if (this.bugReport.sector === 'SERVICIOS_AUXILIARES' && this.bugReport.sub_sector === 'OTROS_SERVICIOS') {
                                                                                    return this.$constants.BUG_REPORT_TEAM_SERVICIOS_AUXILIARES_OTROS_SERVICIOS
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return this.$constants.BUG_REPORT_TEAM
      },
      groupList () {
        if (this.bugReport.sector === 'PRODUCCION' && this.bugReport.sub_sector === 'DOSIFICACION') { // Lista de Grupos, Sector Produccion
          return this.$constants.BUG_REPORT_GROUPS_PRODUCCION_DOSIFICACION
        } else {
          if (this.bugReport.sector === 'PRODUCCION' && this.bugReport.equipo === 'DESMENUZADOR_DESCARTE_F2') {
            return this.$constants.BUG_REPORT_GROUPS_PRODUCCION_EXTRUSION_DESMENUZADOR_DESCARTE_F2
          } else {
            if (this.bugReport.sector === 'PRODUCCION' && this.bugReport.equipo === 'EXTRUSORA_2_750_PLANTA_2') {
              return this.$constants.BUG_REPORT_GROUPS_PRODUCCION_EXTRUSION_EXTRUSORA_2_750_PLANTA_2
            } else {
              if (this.bugReport.sector === 'PRODUCCION' && this.bugReport.equipo === 'EXTRUSORA_3_850_PLANTA_2') {
                return this.$constants.BUG_REPORT_GROUPS_PRODUCCION_EXTRUSION_EXTRUSORA_3_850_PLANTA_2
              } else {
                if (this.bugReport.sector === 'PRODUCCION' && this.bugReport.equipo === 'VACIO_PLANTA_2') {
                  return this.$constants.BUG_REPORT_GROUPS_PRODUCCION_EXTRUSION_VACIO_PLANTA_2
                } else {
                  if (this.bugReport.sector === 'PRODUCCION' && this.bugReport.equipo === 'MEZCLADOR_13B_PLANTA_2' || this.bugReport.equipo === 'MEZCLADOR_BATEA_EXTERNA_2_750' || this.bugReport.equipo === 'MEZCLADOR_BATEA_EXTERNA_3_850') {
                    return this.$constants.BUG_REPORT_GROUPS_PRODUCCION_EXTRUSION_MEZCLADORES_13_P2_BATEA_EXTERNA_2_750_BATEA_EXTERNA_3_850
                  } else {
                    if (this.bugReport.sector === 'PRODUCCION' && this.bugReport.equipo === 'LAMINADOR_PRIMARIO_LA9_PLANTA_2' || this.bugReport.equipo === 'LAMINADOR_3_PLANTA_2' || this.bugReport.equipo === 'LAMINADOR_7_PLANTA_2' || this.bugReport.equipo === 'LAMINADOR_9_PLANTA_2') {
                      return this.$constants.BUG_REPORT_GROUPS_PRODUCCION_LAMINADO
                    } else {
                      if (this.bugReport.sector === 'PRODUCCION' && this.bugReport.equipo === 'LAMINADOR_PRIMARIO_BEDESCHI_1210_PLANTA_3') {
                        return this.$constants.BUG_REPORT_GROUPS_PRODUCCION_LAMINADO_LAMINADOR_PRIMARIO_BEDESCHI_1210_PLANTA_3
                      } else {
                        if (this.bugReport.sector === 'PRODUCCION' && this.bugReport.sub_sector === 'MEZCLADO') {
                          return this.$constants.BUG_REPORT_GROUPS_PRODUCCION_MEZCLADO
                        } else {
                          if (this.bugReport.sector === 'PRODUCCION' && this.bugReport.sub_sector === 'TRANSPORTE') {
                            return this.$constants.BUG_REPORT_GROUPS_PRODUCCION_TRANSPORTE
                          } else { // Lista de Grupos, Sector Automatismo Corte y Carga
                            if (this.bugReport.sector === 'AUTOMATISMO_CORTE_Y_CARGA' && this.bugReport.equipo === 'CORTADORA_EXTERNA_750' || this.bugReport.equipo === 'CORTADORA_EXTERNA_751' || this.bugReport.equipo === 'CORTADORA_EXTERNA_752') {
                              return this.$constants.BUG_REPORT_GROUPS_AUTOMATISMO_CORTE_Y_CARGA_CORTADORA_EXTERNA_750_751_752
                            } else {
                              if (this.bugReport.sector === 'AUTOMATISMO_CORTE_Y_CARGA' && this.bugReport.equipo === 'CORTADORA_EXTERNA_753' || this.bugReport.equipo === 'CORTADORA_EXTERNA_754' || this.bugReport.equipo === 'CORTADORA_EXTERNA_755') {
                                return this.$constants.BUG_REPORT_GROUPS_AUTOMATISMO_CORTE_Y_CARGA_CORTADORA_EXTERNA_753_754_755
                              } else {
                                if (this.bugReport.sector === 'AUTOMATISMO_CORTE_Y_CARGA' && this.bugReport.equipo === 'CORTADORA_EXTERNA_756' || this.bugReport.equipo === 'CORTADORA_EXTERNA_757' || this.bugReport.equipo === 'CORTADORA_EXTERNA_758') {
                                  return this.$constants.BUG_REPORT_GROUPS_AUTOMATISMO_CORTE_Y_CARGA_CORTADORA_EXTERNA_756_757_758
                                } else {
                                  if (this.bugReport.sector === 'AUTOMATISMO_CORTE_Y_CARGA' && this.bugReport.equipo === 'CORTADORA_EXTERNA_759' || this.bugReport.equipo === 'CORTADORA_EXTERNA_760' || this.bugReport.equipo === 'CORTADORA_EXTERNA_761') {
                                    return this.$constants.BUG_REPORT_GROUPS_AUTOMATISMO_CORTE_Y_CARGA_CORTADORA_EXTERNA_759_760_761
                                  } else {
                                    if (this.bugReport.sector === 'AUTOMATISMO_CORTE_Y_CARGA' && this.bugReport.equipo === 'CORTADORA_EXTERNA_762' || this.bugReport.equipo === 'CORTADORA_EXTERNA_763' || this.bugReport.equipo === 'CORTADORA_EXTERNA_764' || this.bugReport.equipo === 'CORTADORA_EXTERNA_765' || this.bugReport.equipo === 'CORTADORA_EXTERNA_766') {
                                      return this.$constants.BUG_REPORT_GROUPS_AUTOMATISMO_CORTE_Y_CARGA_CORTADORA_EXTERNA_762_763_764_765_766
                                    } else {
                                      if (this.bugReport.sector === 'AUTOMATISMO_CORTE_Y_CARGA' && this.bugReport.equipo === 'CORTADORA_EXTERNA_767' || this.bugReport.equipo === 'CORTADORA_EXTERNA_768') {
                                        return this.$constants.BUG_REPORT_GROUPS_AUTOMATISMO_CORTE_Y_CARGA_CORTADORA_EXTERNA_767_768
                                      } else {
                                        if (this.bugReport.sector === 'AUTOMATISMO_CORTE_Y_CARGA' && this.bugReport.equipo === 'CORTADORA_EXTERNA_769' || this.bugReport.equipo === 'CORTADORA_EXTERNA_770') {
                                          return this.$constants.BUG_REPORT_GROUPS_AUTOMATISMO_CORTE_Y_CARGA_CORTADORA_EXTERNA_769_770
                                        } else {
                                          if (this.bugReport.sector === 'AUTOMATISMO_CORTE_Y_CARGA' && this.bugReport.equipo === 'CORTADORA_EXTERNA_850') {
                                            return this.$constants.BUG_REPORT_GROUPS_AUTOMATISMO_CORTE_Y_CARGA_CORTADORA_EXTERNA_850
                                          } else {
                                            if (this.bugReport.sector === 'AUTOMATISMO_CORTE_Y_CARGA' && this.bugReport.equipo === 'MESA_1' || this.bugReport.equipo === 'MESA_1A' || this.bugReport.equipo === 'MESA_2' || this.bugReport.equipo === 'MESA_5' || this.bugReport.equipo === 'MESA_6') {
                                              return this.$constants.BUG_REPORT_GROUPS_AUTOMATISMO_CORTE_Y_CARGA_MESA_DE_TRANSPORTE_MESA_1_1A_2_5_6
                                            } else {
                                              if (this.bugReport.sector === 'AUTOMATISMO_CORTE_Y_CARGA' && this.bugReport.equipo === 'MESA_3' || this.bugReport.equipo === 'MESA_4') {
                                                return this.$constants.BUG_REPORT_GROUPS_AUTOMATISMO_CORTE_Y_CARGA_MESA_DE_TRANSPORTE_MESA_3_4
                                              } else {
                                                if (this.bugReport.sector === 'AUTOMATISMO_CORTE_Y_CARGA' && this.bugReport.equipo === 'RODILLOS_DESVIADORES') {
                                                  return this.$constants.BUG_REPORT_GROUPS_AUTOMATISMO_CORTE_Y_CARGA_MECANISMO_DE_CARGA_RODILLOS_DESVIADORES
                                                } else {
                                                  if (this.bugReport.sector === 'AUTOMATISMO_CORTE_Y_CARGA' && this.bugReport.equipo === 'CINTA_PULMON_MOVIL' || this.bugReport.equipo === 'CINTA_MOVIL_CARGA') {
                                                    return this.$constants.BUG_REPORT_GROUPS_AUTOMATISMO_CORTE_Y_CARGA_MECANISMO_DE_CARGA_CINTA_PULMON_MOVIL_Y_MOVIL_CARGA
                                                  } else {
                                                    if (this.bugReport.sector === 'AUTOMATISMO_CORTE_Y_CARGA' && this.bugReport.equipo === 'CINTA_PULMON_FIJA') {
                                                      return this.$constants.BUG_REPORT_GROUPS_AUTOMATISMO_CORTE_Y_CARGA_MECANISMO_DE_CARGA_CINTA_PULMON_FIJA
                                                    } else {
                                                      if (this.bugReport.sector === 'AUTOMATISMO_CORTE_Y_CARGA' && this.bugReport.equipo === 'MECANISMO_DE_CARGA') {
                                                        return this.$constants.BUG_REPORT_GROUPS_AUTOMATISMO_DE_CORTE_Y_CARGA_MECANISMO_DE_CARGA
                                                      } else { // Lista de Grupos, Sector Secado
                                                        if (this.bugReport.sector === 'SECADO' && this.bugReport.equipo === 'ESTRUCTURA') {
                                                          return this.$constants.BUG_REPORT_GROUPS_SECADO_SECADERO_TUNEL_PLANTA_2_ESTRUCTURA
                                                        } else {
                                                          if (this.bugReport.sector === 'SECADO' && this.bugReport.equipo === 'QUEMADORES') {
                                                            return this.$constants.BUG_REPORT_GROUPS_SECADO_SECADERO_TUNEL_PLANTA_2_QUEMADORES
                                                          } else {
                                                            if (this.bugReport.sector === 'SECADO' && this.bugReport.equipo === 'VAISALA' || this.bugReport.equipo === 'TERMOCUPLA' || this.bugReport.equipo === 'PRESOSTATOS') {
                                                              return '-'
                                                            } else {
                                                              if (this.bugReport.sector === 'SECADO' && this.bugReport.sub_sector === 'VENTILACION_INTERNA') {
                                                                return this.$constants.BUG_REPORT_GROUPS_SECADO_VENTILACION_INTERNA
                                                              } else {
                                                                if (this.bugReport.sector === 'SECADO' && this.bugReport.sub_sector === 'VENTILACION_EXTERNA') {
                                                                  return this.$constants.BUG_REPORT_GROUPS_SECADO_VENTILACION_EXTERNA
                                                                } else { // Lista de Grupos, Sector Movimentacion Secadero
                                                                  if (this.bugReport.sector === 'MOVIMENTACION_SECADERO' && this.bugReport.sub_sector === 'EXTERNA') {
                                                                    return this.$constants.BUG_REPORT_GROUPS_MOVIMENTACION_SECADERO_EXTERNA
                                                                  } else {
                                                                    if (this.bugReport.sector === 'MOVIMENTACION_SECADERO' && this.bugReport.sub_sector === 'TRASBORDO') {
                                                                      return this.$constants.BUG_REPORT_GROUPS_MOVIMENTACION_SECADERO_TRASBORDO
                                                                    } else { // Lista de Grupos, Sector Apilado
                                                                      if (this.bugReport.sector === 'APILADO' && this.bugReport.equipo === 'RODILLOS_DESCARGA') {
                                                                        return this.$constants.BUG_REPORT_GROUPS_APILADO_MECANISMO_DESCARGA_RODILLOS_DESCARGA
                                                                      } else {
                                                                        if (this.bugReport.sector === 'APILADO' && this.bugReport.equipo === 'CINTA_MOVIL') {
                                                                          return this.$constants.BUG_REPORT_GROUPS_APILADO_MECANISMO_DESCARGA_CINTA_MOVIL
                                                                        } else {
                                                                          if (this.bugReport.sector === 'APILADO' && this.bugReport.equipo === 'RODILLOS_MOVILES') {
                                                                            return this.$constants.BUG_REPORT_GROUPS_APILADO_MECANISMO_DESCARGA_RODILLOS_MOVILES
                                                                          } else {
                                                                            if (this.bugReport.sector === 'APILADO' && this.bugReport.equipo === 'Z1') {
                                                                              return this.$constants.BUG_REPORT_GROUPS_APILADO_MESA_TRANSPORTE_Z1
                                                                            } else {
                                                                              if (this.bugReport.sector === 'APILADO' && this.bugReport.equipo === 'Z2') {
                                                                                return this.$constants.BUG_REPORT_GROUPS_APILADO_MESA_TRANSPORTE_Z2
                                                                              } else {
                                                                                if (this.bugReport.sector === 'APILADO' && this.bugReport.equipo === 'Z3') {
                                                                                  return this.$constants.BUG_REPORT_GROUPS_APILADO_MESA_TRANSPORTE_Z3
                                                                                } else {
                                                                                  if (this.bugReport.sector === 'APILADO' && this.bugReport.equipo === 'Z4') {
                                                                                    return this.$constants.BUG_REPORT_GROUPS_APILADO_MESA_TRANSPORTE_Z4
                                                                                  } else {
                                                                                    if (this.bugReport.sector === 'APILADO' && this.bugReport.equipo === 'Z5') {
                                                                                      return this.$constants.BUG_REPORT_GROUPS_APILADO_MESA_TRANSPORTE_Z5
                                                                                    } else {
                                                                                      if (this.bugReport.sector === 'APILADO' && this.bugReport.equipo === 'Z6') {
                                                                                        return this.$constants.BUG_REPORT_GROUPS_APILADO_MESA_TRANSPORTE_Z6
                                                                                      } else {
                                                                                        if (this.bugReport.sector === 'APILADO' && this.bugReport.sub_sector === 'PINZA') {
                                                                                          return this.$constants.BUG_REPORT_GROUPS_APILADO_PINZA
                                                                                        } else { // Lista de Grupos, Sector Horno
                                                                                          if (this.bugReport.sector === 'HORNO' && this.bugReport.equipo === 'PORTONES') {
                                                                                            return this.$constants.BUG_REPORT_GROUPS_HORNO_PORTONES
                                                                                          } else {
                                                                                            if (this.bugReport.sector === 'HORNO' && this.bugReport.equipo === 'TUBERIAS_CONDUCTOS' || this.bugReport.equipo === 'VALVULAS' || this.bugReport.equipo === 'RAMPA_GAS') {
                                                                                              return '-'
                                                                                            } else {
                                                                                              if (this.bugReport.sector === 'HORNO' && this.bugReport.sub_sector === 'VAGONETAS') {
                                                                                                return '-'
                                                                                              } else {
                                                                                                if (this.bugReport.sector === 'HORNO' && this.bugReport.sub_sector === 'VENTILACION') {
                                                                                                  return this.$constants.BUG_REPORT_GROUPS_HORNO_VENTILACION
                                                                                                } else {
                                                                                                  if (this.bugReport.sector === 'HORNO' && this.bugReport.sub_sector === 'QUEMADORES') {
                                                                                                    return '-'
                                                                                                  } else { // Lista de Grupos, Sector Movimentacion de Horno
                                                                                                    if (this.bugReport.sector === 'MOVIMENTACION_HORNO' && this.bugReport.equipo === 'ESLINGA_COCIDO' || this.bugReport.equipo === 'ESLINGA_VACIAS' || this.bugReport.equipo === 'ESLINGA_SECO') {
                                                                                                      return this.$constants.BUG_REPORT_GROUPS_MOVIMENTACION_HORNO_EXTERNA
                                                                                                    } else {
                                                                                                      if (this.bugReport.sector === 'MOVIMENTACION_HORNO' && this.bugReport.equipo === 'FRENOS_BALLESTA' || this.bugReport.equipo === 'EMPUJADORES_BLOQUEADORES') {
                                                                                                        return '-'
                                                                                                      } else {
                                                                                                        if (this.bugReport.sector === 'MOVIMENTACION_HORNO' && this.bugReport.sub_sector === 'TRASBORDO') {
                                                                                                          return this.$constants.BUG_REPORT_GROUPS_MOVIMENTACION_HORNO_TRASBORDO
                                                                                                        } else { // Lista de Grupos, Sector Desapilado y Empaque
                                                                                                          if (this.bugReport.sector === 'DESAPILADO_Y_EMPAQUE' && this.bugReport.equipo === 'PINZA_1') {
                                                                                                            return this.$constants.BUG_REPORT_GROUPS_DESAPILADO_EMPAQUE_PINZA_1
                                                                                                          } else {
                                                                                                            if (this.bugReport.sector === 'DESAPILADO_Y_EMPAQUE' && this.bugReport.equipo === 'PINZA_COMPOSICION' || this.bugReport.sub_sector === 'REMOJADORA') {
                                                                                                              return this.$constants.BUG_REPORT_GROUPS_DESAPILADO_EMPAQUE_PINZA_COMPOSICION_Y_REMOJADORA
                                                                                                            } else {
                                                                                                              if (this.bugReport.sector === 'DESAPILADO_Y_EMPAQUE' && this.bugReport.sub_sector === 'LIMPIEZA_VAGONETAS' || this.bugReport.sub_sector === 'PEGADO_FILM' || this.bugReport.sub_sector === 'FLEJADORA') {
                                                                                                                return '-'
                                                                                                              } else {
                                                                                                                if (this.bugReport.sector === 'DESAPILADO_Y_EMPAQUE' && this.bugReport.sub_sector === 'ENVOLVEDORA') {
                                                                                                                  return this.$constants.BUG_REPORT_GROUPS_DESAPILADO_EMPAQUE_ENVOLVEDORA
                                                                                                                } else {
                                                                                                                  if (this.bugReport.sector === 'DESAPILADO_Y_EMPAQUE' && this.bugReport.sub_sector === 'MESA_TRANSPORTE') {
                                                                                                                    return this.$constants.BUG_REPORT_GROUPS_DESAPILADO_EMPAQUE_MESA_TRANSPORTE
                                                                                                                  } else { // Lista de Grupos, Sector Servicios Auxiliares
                                                                                                                    if (this.bugReport.sector === 'SERVICIOS_AUXILIARES' && this.bugReport.sub_sector !== 'AIRE' && this.bugReport.sub_sector !== 'OTROS_SERVICIOS') {
                                                                                                                      return '-'
                                                                                                                    } else {
                                                                                                                      if (this.bugReport.sector === 'SERVICIOS_AUXILIARES' && this.bugReport.sub_sector === 'AIRE') {
                                                                                                                        return this.$constants.BUG_REPORT_GROUPS_SERVICIOS_AUXILIARES_AIRE
                                                                                                                      } else {
                                                                                                                        if (this.bugReport.sector === 'SERVICIOS_AUXILIARES' && this.bugReport.sub_sector === 'OTROS_SERVICIOS') {
                                                                                                                          return this.$constants.BUG_REPORT_GROUPS_SERVICIOS_AUXILIARES_OTROS_SERVICIOS_INSTALACIONES
                                                                                                                        }
                                                                                                                      }
                                                                                                                    }
                                                                                                                  }
                                                                                                                }
                                                                                                              }
                                                                                                            }
                                                                                                          }
                                                                                                        }
                                                                                                      }
                                                                                                    }
                                                                                                  }
                                                                                                }
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        return this.$constants.BUG_REPORT_GROUPS
      },
      partList () { // Lista de Partes, Sector Produccion
        if (this.bugReport.sector === 'PRODUCCION' && this.bugReport.sub_sector === 'EXTRUSION') {
          return '-'
        } else {
          if (this.bugReport.sector === 'PRODUCCION' && this.bugReport.sub_sector === 'LAMINADO') {
            return this.$constants.BUG_REPORT_PARTS_PRODUCCION_LAMINADO
          } else {
            if (this.bugReport.sector === 'PRODUCCION' && this.bugReport.sub_sector === 'MEZCLADO') {
              return '-'
            } else {
              if (this.bugReport.sector === 'PRODUCCION' && this.bugReport.sub_sector === 'TRANSPORTE') {
                return '-'
              } else { // Lista de Partes, Sector Automatismo Corte y Carga
                if (this.bugReport.sector === 'AUTOMATISMO_CORTE_Y_CARGA' && this.bugReport.group === 'CINTA_PUENTE_750' || this.bugReport.group === 'CINTA_LANZADORA_1_750' || this.bugReport.group === 'CINTA_LANZADORA_2_750' || this.bugReport.group === 'CINTA_PUENTE_850' || this.bugReport.group === 'CINTA_LANZADORA_1_850' || this.bugReport.group === 'CINTA_LANZADORA_2_850') {
                  return this.$constants.BUG_REPORT_PARTS_AUTOMATISMO_CORTE_Y_CARGA_CORTADORA_CINTA_PUENTE_750_Y_850_LANZADORA_1_Y_2_750_Y_850
                } else {
                  if (this.bugReport.sector === 'AUTOMATISMO_CORTE_Y_CARGA' && this.bugReport.group === 'CORTADORA_SIMPLE_750' || this.bugReport.group === 'CORTADORA_SIMPLE_850') {
                    return this.$constants.BUG_REPORT_PARTS_AUTOMATISMO_CORTE_Y_CARGA_CORTADORA_SIMPLE_750_Y_850
                  } else {
                    if (this.bugReport.sector === 'AUTOMATISMO_CORTE_Y_CARGA' && this.bugReport.group === 'CORTADORA_MULTIPLE_750' || this.bugReport.group === 'CORTADORA_MULTIPLE_850') {
                      return this.$constants.BUG_REPORT_PARTS_AUTOMATISMO_CORTE_Y_CARGA_CORTADORA_MULTIPLE_750_Y_850
                    } else {
                      if (this.bugReport.sector === 'AUTOMATISMO_CORTE_Y_CARGA' && this.bugReport.group === 'LIMPIADOR_DE_ALAMBRE_750' || this.bugReport.group === 'LIMPIADOR_DE_ALAMBRE_850') {
                        return this.$constants.BUG_REPORT_PARTS_AUTOMATISMO_CORTE_Y_CARGA_CORTADORA_LIMPIADOR_ALAMBRE_750_Y_850
                      } else {
                        if (this.bugReport.sector === 'AUTOMATISMO_CORTE_Y_CARGA' && this.bugReport.group === 'RODILLOS_DESVIADORES_750' || this.bugReport.group === 'RODILLOS_DESVIADORES_850') {
                          return this.$constants.BUG_REPORT_PARTS_AUTOMATISMO_CORTE_Y_CARGA_CORTADORA_RODILLOS_DESVIADORES_750_Y_850
                        } else { // Lista de Partes, Sector Secado
                          if (this.bugReport.sector === 'SECADO') {
                            return '-'
                          } else { // Lista de Partes, Sector Movimentacion de Secadero
                            if (this.bugReport.sector === 'MOVIMENTACION_SECADERO') {
                              return '-'
                            } else { // Lista de Partes, Sector Apilado
                              if (this.bugReport.sector === 'APILADO' && this.bugReport.sub_sector === 'MECANISMO_DESCARGA') {
                                return '-'
                              } else {
                                if (this.bugReport.sector === 'APILADO' && this.bugReport.group === 'Z1_RODILLOS_1') {
                                  return this.$constants.BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z1_RODILLOS_1
                                } else {
                                  if (this.bugReport.sector === 'APILADO' && this.bugReport.group === 'Z1_CINTA_1') {
                                    return this.$constants.BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z1_CINTA_1
                                  } else {
                                    if (this.bugReport.sector === 'APILADO' && this.bugReport.group === 'Z1_RODILLOS_2') {
                                      return this.$constants.BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z1_RODILLOS_2
                                    } else {
                                      if (this.bugReport.sector === 'APILADO' && this.bugReport.group === 'Z1_RODILLOS_1_Z1_A_Z6') {
                                        return this.$constants.BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z1_RODILLOS_1_Z1_A_Z6
                                      } else {
                                        if (this.bugReport.sector === 'APILADO' && this.bugReport.group === 'Z1_RODILLOS_2_Z1_A_Z6') {
                                          return this.$constants.BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z1_RODILLOS_2_Z1_A_Z6
                                        } else {
                                          if (this.bugReport.sector === 'APILADO' && this.bugReport.group === 'Z1_BARRERA_Z1_A_Z2' || this.bugReport.group === 'Z1_BARRERA_Z1_A_Z6') {
                                            return this.$constants.BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z1_BARRERA_Z1_A_Z2_Y_Z1_A_Z6
                                          } else {
                                            if (this.bugReport.sector === 'APILADO' && this.bugReport.group === 'Z2_MESA_1' || this.bugReport.group === 'Z2_MESA_2' || this.bugReport.group === 'Z2_MESA_3' || this.bugReport.group === 'Z2_MESA_4' || this.bugReport.group === 'Z2_MESA_5' || this.bugReport.group === 'Z2_MESA_6' || this.bugReport.group === 'Z2_BARRERA_FRONTAL') {
                                              return this.$constants.BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z2_MESA_Y_BARRERA
                                            } else {
                                              if (this.bugReport.sector === 'APILADO' && this.bugReport.group === 'Z2_RODILLOS_DESV_A_25') {
                                                return this.$constants.BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z2_RODILLOS
                                              } else {
                                                if (this.bugReport.sector === 'APILADO' && this.bugReport.equipo === 'Z3') {
                                                  return this.$constants.BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z3
                                                } else {
                                                  if (this.bugReport.sector === 'APILADO' && this.bugReport.group === 'Z4_CINTA_1' || this.bugReport.group === 'Z4_CINTA_2' || this.bugReport.group === 'Z4_CINTA_PROGRAMACION') {
                                                    return this.$constants.BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z4_CINTA
                                                  } else {
                                                    if (this.bugReport.sector === 'APILADO' && this.bugReport.group === 'Z4_RODILLO_COMPACTADOR') {
                                                      return this.$constants.BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z4_RODILLO
                                                    } else {
                                                      if (this.bugReport.sector === 'APILADO' && this.bugReport.group === 'Z5_CINTA_1') {
                                                        return this.$constants.BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z5_CINTA_1
                                                      } else {
                                                        if (this.bugReport.sector === 'APILADO' && this.bugReport.group === 'Z5_CINTA_2' || this.bugReport.group === 'Z5_CINTA_PROGRAMACION') {
                                                          return this.$constants.BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z5_CINTA_2_Y_PROGRAMACION
                                                        } else {
                                                          if (this.bugReport.sector === 'APILADO' && this.bugReport.group === 'Z5_RODILLO_COMPACTADOR') {
                                                            return this.$constants.BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z5_RODILLO_COMPACTADOR
                                                          } else {
                                                            if (this.bugReport.sector === 'APILADO' && this.bugReport.group === 'CINTA_CARRELO') {
                                                              return this.$constants.BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z5_CINTA_CARRELO
                                                            } else {
                                                              if (this.bugReport.sector === 'APILADO' && this.bugReport.group === 'Z6_MESA_1' || this.bugReport.group === 'Z6_MESA_2' || this.bugReport.group === 'Z6_MESA_3' || this.bugReport.group === 'Z6_MESA_4' || this.bugReport.group === 'Z6_MESA_5' || this.bugReport.group === 'Z6_MESA_6') {
                                                                return this.$constants.BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z6_MESA
                                                              } else {
                                                                if (this.bugReport.sector === 'APILADO' && this.bugReport.group === 'Z6_BARRERA_FRONTAL') {
                                                                  return this.$constants.BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z6_BARRERA_FRONTAL
                                                                } else {
                                                                  if (this.bugReport.sector === 'APILADO' && this.bugReport.group === 'Z6_RODILLO_DESV_Z4') {
                                                                    return this.$constants.BUG_REPORT_PARTS_APILADO_MESA_TRANSPORTE_Z6_RODILLO_DESV_Z4
                                                                  } else {
                                                                    if (this.bugReport.sector === 'APILADO' && this.bugReport.sub_sector === 'PINZA') {
                                                                      return this.$constants.BUG_REPORT_PARTS_APILADO_PINZA
                                                                    } else { // Lista de Partes, Sector Horno
                                                                      if (this.bugReport.sector === 'HORNO') {
                                                                        return '-'
                                                                      } else { // Lista de Partes, Sector Movimentacion de Horno
                                                                        if (this.bugReport.sector === 'MOVIMENTACION_HORNO' && this.bugReport.sub_sector === 'EXTERNA') {
                                                                          return '-'
                                                                        } else {
                                                                          if (this.bugReport.sector === 'MOVIMENTACION_HORNO' && this.bugReport.sub_sector === 'TRASBORDO') {
                                                                            return this.$constants.BUG_REPORT_PARTS_MOVIMENTACION_HORNO_TRASBORDO
                                                                          } else { // Lista de Partes, Sector Desapilado y Empaque
                                                                            if (this.bugReport.sector === 'DESAPILADO_Y_EMPAQUE' && this.bugReport.sub_sector !== 'MESA_TRANSPORTE') {
                                                                              return '-'
                                                                            } else {
                                                                              if (this.bugReport.sector === 'DESAPILADO_Y_EMPAQUE' && this.bugReport.sub_sector === 'MESA_TRANSPORTE') {
                                                                                return this.$constants.BUG_REPORT_PARTS_DESAPILADO_EMPAQUE_MESA_TRANSPORTE
                                                                              } else { // Lista de Partes, Sector Servicios Auxiliares
                                                                                if (this.bugReport.sector === 'SERVICIOS_AUXILIARES') {
                                                                                  return '-'
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      inconvenienteList () {
        if (this.bugReport.estado === 'SOLUCIONADO') {
          return '-'
        } else {
          if (this.bugReport.estado === 'SOLUCION_TEMPORAL') {
            return '-'
          } else {
            if (this.bugReport.estado === 'NO_SOLUCIONADO') {
              return this.$constants.BUG_REPORT_ESTADO_NO_SOLUCIONADO
            }
          }
        }
      },
      ...mapGetters('collaborators', [
        'hasSelected',
        'getSelectedIds'
      ]),
      ...mapState('collaborators', [
        'collaboratorSelected',
        'showList',
        'listCollaboratorsSelected'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  @import "~@/assets/styles/_variables.scss";
  @import "~@/assets/styles/_mixins.scss";
  @import "~@/assets/styles/_animations.scss";

  h3 {
    flex-grow: 1;
    width: 100%;
    font-weight: bold;
    border-bottom: 3px solid $primary-color;
    margin: 18px 0;
    display: flex;
    justify-content: space-between;

    img {
      padding: 0 5px 2px 0;
      margin: 0 8px;
      height: 35px;
      width: 35px;

      &:hover {
        @include wobble-hor-bottom();
      }
    }
  }

  .textarea {
    border: 2px solid $primary-light;
    width: 100%;
    padding: 10px;
    display: block;
    resize: none;
    min-height: 100px;
    height: 250px;

    &:focus {
      outline: none;
    }
  }

  .container-fluid {
    width: 80%;
  }

  .disabled {
    opacity: 0.5;
  }

  .separator {
    height: 0;
    margin-bottom: 100px;
  }

  @media (max-width: 599px) {
    .container-fluid {
      width: 100%;
    }
  }

  .recommendation-text {
    font-size: large;
    color: #5d5d5d;
    margin: 5px 10px;
  }

  .text-bold {
    font-weight: bold;
    color: #2f2f2f;
  }

  .calendar {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .button {
    background-color: #fb8964;
    border: none;
    border-radius: 100px;
    color: white;
    padding: 8px 16px;
    box-shadow: 0px 1px 4px 0 rgba(0, 0, 0, 0.3);
    text-align: center;
    text-decoration: none;
    outline: none;
    display: inline-block;
    margin: 15px 0;

    &:hover {
      background-color: #dc725c;
    }
  }

  .margin {
    margin: 0 0 0 10px !important;
  }
</style>