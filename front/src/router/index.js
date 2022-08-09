import Vue from 'vue'
import Router from 'vue-router'
import auth from '../auth'
import store from '../store'

import Error from '@/components/Error'
import Notifications from '@/components/notifications/Notifications'
import Login from '@/components/Login'
import Home from '@/components/Home'
// EPP
import EPPIndex from '@/components/epp/EPPIndex'
import FormView from '@/components/epp/FormView'
import RequestVisualization from '@/components/epp/RequestVisualization'
import EPPHistory from '@/components/epp/EPPHistory'
import EPPHistoryView from '@/components/epp/EPPHistoryView'
import EPPMyRequests from '@/components/epp/EPPMyRequests'

// Pañol
import PanolIndex from '@/components/panol/PanolIndex'
import PanolRequests from '@/components/panol/PanolRequests'
import PanolRequestsHistory from '@/components/panol/PanolRequestsHistory'
import CatalogView from '@/components/panol/catalog/CatalogView'
// Checklist
import ChecklistsIndex from '@/components/checklists/ChecklistsIndex'
import ChecklistsList from '@/components/checklists/ChecklistsList'
import ChecklistHistory from '@/components/checklists/ChecklistHistory'
import ChecklistForm from '@/components/checklists/ChecklistForm'
import ChecklistsControl from '@/components/checklists/ChecklistsControl'
// Checklist
import ChecklistsL3Index from '@/components/checklistsLTres/ChecklistsIndex'
import ChecklistsL3List from '@/components/checklistsLTres/ChecklistsList'
import ChecklistL3History from '@/components/checklistsLTres/ChecklistHistory'
import ChecklistL3Form from '@/components/checklistsLTres/ChecklistForm'
import ChecklistsL3Control from '@/components/checklistsLTres/ChecklistsControl'
// Supervisionparts
import SupervisionpartIndex from '@/components/supervisionParts/SupervisionpartIndex'
import SupervisionpartList from '@/components/supervisionParts/SupervisionpartList'
import SupervisionpartHistory from '@/components/supervisionParts/SupervisionpartHistory'
import SupervisionpartForm from '@/components/supervisionParts/SupervisionpartForm'
import SupervisionpartsControl from '@/components/supervisionParts/SupervisionpartControl'
import SupervisionpartTotal from '@/components/supervisionParts/SupervisionpartTotal'
import SupervisionpartTotales from '@/components/supervisionParts/SupervisionpartTotales'
import SupervisionpartsResumen from '@/components/supervisionParts/SupervisionpartResumen'
import SupervisionpartResume from '@/components/supervisionParts/SupervisionpartResume'
import SupervisionpartResumeHistoryTotal from '@/components/supervisionParts/SupervisionpartResumeHistoryTotal'
// Supervisionparts
import SupervisionpartL3Index from '@/components/supervisionPartsL3/SupervisionpartIndex'
import SupervisionpartL3List from '@/components/supervisionPartsL3/SupervisionpartList'
import SupervisionpartL3History from '@/components/supervisionPartsL3/SupervisionpartHistory'
import SupervisionpartL3Form from '@/components/supervisionPartsL3/SupervisionpartForm'
import SupervisionpartsL3Control from '@/components/supervisionPartsL3/SupervisionpartControl'
import SupervisionpartL3Total from '@/components/supervisionPartsL3/SupervisionpartTotal'
import SupervisionpartL3Totales from '@/components/supervisionPartsL3/SupervisionpartTotales'
import SupervisionpartsL3Resumen from '@/components/supervisionPartsL3/SupervisionpartResumen'
import SupervisionpartL3Resume from '@/components/supervisionPartsL3/SupervisionpartResume'
import SupervisionpartResumeHistoryL3Total from '@/components/supervisionPartsL3/SupervisionpartResumeHistoryTotal'
// Panel de control
import ControlPanel from '@/components/control/ControlPanel'
import ControlPanelIndex from '@/components/control/ControlPanelIndex'
import ControlL2Index from '@/components/control/ControlL2Index'
import ControlL3Index from '@/components/control/ControlL3Index'
import EventsIndex from '@/components/control/events/EventsIndex'
import EventsIndexArchivadas from '@/components/control/events/EventsIndexArchivadas'
import NewsKanban from '@/components/news/NewsKanban'
import StaffRequestsControlIndex from '@/components/control/staffRequests/Index'

// Profile
import Profile from '@/components/profile/Profile'
import ProfileCredentials from '@/components/profile/ProfileCredentials'
import ProfileInformation from '@/components/profile/ProfileInformation'
import ProfileResponsible from '@/components/profile/ProfileResponsible'
import ProfileActivity from '@/components/profile/ProfileActivity'
import ProfileEdition from '@/components/profile/ProfileEdition'
import ProfileCreate from '@/components/profile/ProfileCreate'
import ProfileArchive from '@/components/profile/ProfileArchive'
import ProfileArchiveNews from '@/components/profile/ProfileArchiveNews'
import ProfileArchiveStaffRequests from '@/components/profile/ProfileArchiveStaffRequests'
import ProfileArchiveSanctions from '@/components/profile/ProfileArchiveSanctions'
import ProfileArchiveOccurrences from '@/components/profile/ProfileArchiveOccurrences'
import ProfileArchiveMeeting from '@/components/profile/ProfileArchiveMeetings'

// Personal
import PersonalIndex from '@/components/personal/PersonalIndex'
import NewsIndex from '@/components/news/NewsIndex.vue'
import ReportNews from '@/components/news/ReportNews.vue'
import ReportNewsTarde from '@/components/news/ReportNewsTarde.vue'
import ReportNewsFalta from '@/components/news/ReportNewsFalta.vue'
import ReportNewsEarly from '@/components/news/ReportNewsEarly.vue'
import ReportNewsAccident from '@/components/news/ReportNewsAccident.vue'
import ReportNewsObservation from '@/components/news/ReportNewsObservation.vue'
import ReportNewsScheduled from '@/components/news/ReportNewsScheduled.vue'
import ControlPersonal from '@/components/control/ControlPersonal.vue'
import PersonalManager from '@/components/personal/PersonalManager.vue'
import PersonalStaffRequest from '@/components/personal/PersonalStaffRequest.vue'
import OccurrenceTrackingList from '@/components/occurrences/tracking/OccurrenceTrackingList'

import AppLogged from '@/components/AppLogged'

import Const from '@/const.js'
import authorize from '@/utils/authorize'
// Solicitudes
import StaffRequestsIndex from '@/components/staffRequests/StaffRequestsIndex'
import StaffRequestsHome from '@/components/staffRequests/StaffRequestsHome'
import StaffRequestsPermission from '@/components/staffRequests/StaffRequestsPermission'
import StaffRequestsChangesHours from '@/components/staffRequests/StaffRequestsChangesHours'
import StaffRequestsExtraHours from '@/components/staffRequests/StaffRequestsExtraHours'
import StaffRequestsVisualization from '@/components/staffRequests/StaffRequestsVisualization'

// Sanciones
import SanctionVisualization from '@/components/sanctions/SanctionVisualization'
import SanctionEdition from '@/components/sanctions/SanctionEdition'
import SanctionCreation from '@/components/sanctions/SanctionCreation'

// Ocurrencias
import OccurrenceList from '@/components/occurrences/OccurrenceList'
import OccurrenceCreation from '@/components/occurrences/OccurrenceCreation'
import OccurrenceVisualization from '@/components/occurrences/OccurrenceVisualization'
import OccurrenceEdition from '@/components/occurrences/OccurrenceEdition'

// Administracion fabrica
import FabricManagement from '@/components/fabric/FabricManagement'

// Reporte de fallas
import BugReportIndex from '@/components/fails/BugReportIndex'
import BugReportCreation from '@/components/fails/BugReportCreation'
import BugReportHistory from '@/components/fails/BugReportHistory'
import BugReportResume from '@/components/fails/BugReportResume'
import BugReportView from '@/components/fails/BugReportView'
import BugReportVisualization from '@/components/fails/BugReportVisualization'
import BugReportEdit from '@/components/fails/BugReportEdit'
import BugReportHistoryPass from '@/components/fails/BugReportHistoryPass'
import BugReportJobsRequest from '@/components/fails/BugReportJobsRequest'

// Reuniones
import MeetingIndex from '@/components/meeting/MeetingIndex'
import MeetingCreation from '@/components/meeting/MeetingCreation'
import MeetingEdition from '@/components/meeting/MeetingEdition'
import MeetingList from '@/components/meeting/MeetingList'
import MeetingHistory from '@/components/meeting/MeetingHistory'
import MeetingVisualization from '@/components/meeting/MeetingVisualization'
import MeetingManager from '@/components/meeting/MeetingManager'
import MeetingSector from '@/components/meeting/MeetingSector'
import MeetingCalendar from '@/components/meeting/MeetingCalendar'
import treeFailsManagement from '@/components/fails/treefails/TreeFailsManagement'

const { ROLES } = Const

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/error',
      name: 'error',
      component: Error,
      meta: {
        permission: 'any'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        permission: 'any',
        fail: '/error'
      }
    },
    {
      path: '/',
      component: AppLogged,
      meta: {
        permission: 'any',
        fail: '/error'
      },
      children: [
        {
          path: '',
          name: 'home',
          component: Home,
          meta: {
            permission: 'any',
            fail: '/error'
          }
        },
        {
          path: 'perfil/nuevo',
          name: 'profile-new',
          component: ProfileCreate,
          meta: {
            permission: 'any',
            fail: '/error'
          }
        },
        {
          path: 'perfil/:id',
          name: 'profile',
          component: Profile,
          meta: {
            permission: 'any',
            fail: '/error'
          },
          children: [
            {
              path: 'credenciales',
              name: 'profile-credentials',
              component: ProfileCredentials,
              meta: {
                permission: authorize(ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: 'informacion',
              name: 'profile-information',
              component: ProfileInformation,
              meta: {
                permission: 'any',
                fail: '/error'
              }
            },
            {
              path: 'editar',
              name: 'profile-edit',
              component: ProfileEdition,
              meta: {
                permission: authorize(ROLES.ADMINISTRACION),
                fail: '/error'
              }
            },
            {
              path: 'responsable',
              name: 'profile-responsible',
              component: ProfileResponsible,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.ADMINISTRACION, ROLES.SUPERVISORES),
                fail: '/error'
              }
            },
            {
              path: 'novedades',
              name: 'profile-activity',
              component: ProfileActivity,
              meta: {
                permission: 'any',
                fail: '/error'
              }
            },
            {
              path: 'archivo',
              name: 'profile-archive',
              component: ProfileArchive,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.ADMINISTRACION, ROLES.SUPERVISORES),
                fail: '/error'
              },
              children: [
                {
                  path: 'novedades',
                  name: 'profile-archive-news',
                  component: ProfileArchiveNews,
                  meta: {
                    permission: 'any',
                    fail: '/error'
                  }
                },
                {
                  path: 'solicitudes',
                  name: 'profile-archive-staffRequests',
                  component: ProfileArchiveStaffRequests,
                  meta: {
                    permission: 'any',
                    fail: '/error'
                  }
                },
                {
                  path: 'sanciones',
                  name: 'profile-archive-sanctions',
                  component: ProfileArchiveSanctions,
                  meta: {
                    permission: 'any',
                    fail: '/error'
                  }
                },
                {
                  path: 'acontecimientos',
                  name: 'profile-archive-occurrences',
                  component: ProfileArchiveOccurrences,
                  meta: {
                    permission: 'any',
                    fail: '/error'
                  }
                },
                {
                  path: 'reuniones',
                  name: 'profile-archive-meetings',
                  component: ProfileArchiveMeeting,
                  meta: {
                    permission: 'any',
                    fail: '/error'
                  }
                }
              ]
            }
          ]
        },
        {
          path: 'notificaciones',
          name: 'notifications',
          component: Notifications,
          meta: {
            permission: 'any',
            fail: '/error'
          }
        },
        {
          path: 'control',
          component: ControlPanel,
          name: 'control-panel-linea3',
          redirect: {
            name: 'control-panel-index-linea3'
          },
          meta: {
            permission: authorize(ROLES.JEFES, ROLES.ADMINISTRACION, ROLES.SUPERVISORES),
            fail: '/error'
          },
          children: [
            {
              path: '',
              name: 'control-panel-index-linea3',
              component: ControlL3Index,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.ADMINISTRACION),
                fail: '/error'
              }
            },
            {
              path: 'checklistsLTres',
              name: 'control-checklists-LTres',
              component: ChecklistsL3Control,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: 'supervisionpartsLTres',
              name: 'control-supervisionparts-LTres',
              component: SupervisionpartsL3Control,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: 'supervisionparts-resume-LTres',
              name: 'control-resume-supervisionparts-LTres',
              component: SupervisionpartsL3Resumen,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: 'supervisionparts-totals-LTres',
              name: 'control-totales-supervisionparts-LTres',
              component: SupervisionpartL3Totales,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.RRHH),
                fail: '/error'
              }
            }
          ]
        },
        {
          path: 'control',
          component: ControlPanel,
          name: 'control-panel-linea2',
          redirect: {
            name: 'control-panel-index-linea2'
          },
          meta: {
            permission: authorize(ROLES.JEFES, ROLES.ADMINISTRACION, ROLES.SUPERVISORES),
            fail: '/error'
          },
          children: [
            {
              path: '',
              name: 'control-panel-index-linea2',
              component: ControlL2Index,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.ADMINISTRACION),
                fail: '/error'
              }
            },
            {
              path: 'checklists',
              name: 'control-checklists',
              component: ChecklistsControl,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: 'supervisionparts',
              name: 'control-supervisionparts',
              component: SupervisionpartsControl,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: 'supervisionparts-resume',
              name: 'control-resume-supervisionparts',
              component: SupervisionpartsResumen,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: 'supervisionparts-totals',
              name: 'control-totales-supervisionparts',
              component: SupervisionpartTotales,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: 'supervisionparts',
              name: 'control-supervisionparts-historico',
              component: SupervisionpartsControl,
              meta: {
                permission: authorize(ROLES.OFICIALES, ROLES.SUPERVISOR_PRODUCCION, ROLES.SUPERVISOR),
                fail: '/error'
              }
            },
            {
              path: 'supervisionparts-resume',
              name: 'control-oficial-control',
              component: SupervisionpartsResumen,
              meta: {
                permission: authorize(ROLES.OFICIALES, ROLES.SUPERVISOR_PRODUCCION, ROLES.SUPERVISOR),
                fail: '/error'
              }
            }
          ]
        },
        {
          path: 'control',
          component: ControlPanel,
          name: 'control-panel',
          redirect: {
            name: 'control-panel-index'
          },
          meta: {
            permission: authorize(ROLES.JEFES, ROLES.ADMINISTRACION, ROLES.SUPERVISORES),
            fail: '/error'
          },
          children: [
            {
              path: '',
              name: 'control-panel-index',
              component: ControlPanelIndex,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.ADMINISTRACION),
                fail: '/error'
              }
            },
            {
              path: 'novedades',
              name: 'control-novedades',
              component: EventsIndex,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.ADMINISTRACION, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: 'novedadesas',
              name: 'control-novedades-archivadas',
              component: EventsIndexArchivadas,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.ADMINISTRACION, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: 'personal',
              name: 'control-personal',
              component: PersonalManager,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.ADMINISTRACION, ROLES.SECTOR_PANOL, ROLES.SUPERVISORES),
                fail: '/error'
              }
            },
            {
              path: 'epp-historial',
              name: 'control-epp',
              component: EPPHistory,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: 'solicitudes',
              name: 'control-staff-requests',
              component: StaffRequestsControlIndex,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION),
                fail: '/error'
              }
            },
            {
              path: '/acontecimientos',
              name: 'control-occurrence',
              component: OccurrenceList,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.HIGIENE_SEGURIDAD, ROLES.ADMINISTRACION),
                fail: '/error'
              }
            }
          ]
        },
        {
          path: 'administracion',
          name: 'fabric-management',
          component: FabricManagement,
          meta: {
            permission: authorize(ROLES.JEFE_PLANTA, ROLES.RRHH, ROLES.JEFE_PERSONAL),
            fail: '/error'
          }
        },
        {
          path: 'epp',
          component: EPPIndex,
          meta: {
            permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.RRHH),
            fail: '/error'
          },
          children: [
            {
              path: '',
              name: 'epp',
              component: FormView,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: 'historial',
              name: 'epp-historial',
              component: EPPHistoryView,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: 'mias',
              name: 'epp-my-requests',
              component: EPPMyRequests,
              meta: {
                permission: authorize(ROLES.SUPERVISORES, ROLES.RRHH, ROLES.JEFE_PERSONAL),
                fail: '/error'
              }
            },
            {
              path: ':id',
              name: 'epp-request',
              component: RequestVisualization,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: ':id/edicion',
              name: 'epp-edition',
              component: FormView,
              props: { edition: true },
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.RRHH),
                fail: '/error'
              }
            }
          ]
        },
        {
          path: 'check',
          component: ChecklistsIndex,
          name: 'checklistsIndex',
          redirect: {
            name: 'checklists'
          },
          meta: {
            permission: authorize(ROLES.JEFES, ROLES.SUPERVISOR_PRODUCCION),
            fail: '/error'
          },
          children: [
            {
              path: '',
              name: 'checklists',
              component: ChecklistsList,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISOR_PRODUCCION),
                fail: '/error'
              }
            },
            {
              path: 'historial/:date',
              name: 'checklistsHistory',
              component: ChecklistHistory,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: ':sector',
              name: 'checklist',
              component: ChecklistForm,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISOR_PRODUCCION),
                fail: '/error'
              }
            }
          ]
        },
        {
          path: 'supervisionpart',
          component: SupervisionpartIndex,
          name: 'supervisionpartsIndex',
          redirect: {
            name: 'supervisionparts'
          },
          meta: {
            permission: authorize(ROLES.OFICIALES, ROLES.JEFES, ROLES.SUPERVISOR_PRODUCCION),
            fail: '/error'
          },
          children: [
            {
              path: '',
              name: 'supervisionparts',
              component: SupervisionpartList,
              meta: {
                permission: authorize(ROLES.OFICIALES, ROLES.JEFES, ROLES.SUPERVISOR_PRODUCCION),
                fail: '/error'
              }
            },
            {
              path: 'historial/:date',
              name: 'supervisionpartsHistory',
              component: SupervisionpartHistory,
              meta: {
                permission: authorize(ROLES.OFICIALES, ROLES.SUPERVISOR_PRODUCCION, ROLES.SUPERVISOR, ROLES.JEFES, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: 'historial-resume-total/:date',
              name: 'supervisionpartResumeHistoryTotal',
              component: SupervisionpartResumeHistoryTotal,
              meta: {
                permission: authorize(ROLES.OFICIALES, ROLES.SUPERVISOR_PRODUCCION, ROLES.SUPERVISOR, ROLES.JEFES, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: 'historial-totales-total/:date',
              name: 'supervisionpartTotalesView',
              component: SupervisionpartTotal,
              meta: {
                permission: authorize(ROLES.OFICIALES, ROLES.SUPERVISOR_PRODUCCION, ROLES.SUPERVISOR, ROLES.JEFES, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: 'historial-resume/:date',
              name: 'supervisionpartsResumen',
              component: SupervisionpartResume,
              meta: {
                permission: authorize(ROLES.OFICIALES, ROLES.SUPERVISOR_PRODUCCION, ROLES.SUPERVISOR, ROLES.JEFES, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: ':sector',
              name: 'supervisionpart',
              component: SupervisionpartForm,
              meta: {
                permission: authorize(ROLES.OFICIALES, ROLES.JEFES, ROLES.SUPERVISOR_PRODUCCION),
                fail: '/error'
              }
            }
          ]
        },
        {
          path: 'checkL3',
          component: ChecklistsL3Index,
          name: 'checklistsL3Index',
          redirect: {
            name: 'checklistsL3'
          },
          meta: {
            permission: authorize(ROLES.JEFES, ROLES.SUPERVISOR_PRODUCCION),
            fail: '/error'
          },
          children: [
            {
              path: '',
              name: 'checklistsL3',
              component: ChecklistsL3List,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISOR_PRODUCCION),
                fail: '/error'
              }
            },
            {
              path: 'historial/:date',
              name: 'checklistsL3History',
              component: ChecklistL3History,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: ':sector',
              name: 'checklistL3',
              component: ChecklistL3Form,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISOR_PRODUCCION),
                fail: '/error'
              }
            }
          ]
        },
        {
          path: 'supervisionpartL3',
          component: SupervisionpartL3Index,
          name: 'supervisionpartsL3Index',
          redirect: {
            name: 'supervisionpartsL3'
          },
          meta: {
            permission: authorize(ROLES.OFICIAL_L3, ROLES.JEFES, ROLES.SUPERVISOR_PRODUCCION),
            fail: '/error'
          },
          children: [
            {
              path: '',
              name: 'supervisionpartsL3',
              component: SupervisionpartL3List,
              meta: {
                permission: authorize(ROLES.OFICIAL_L3, ROLES.JEFES, ROLES.SUPERVISOR_PRODUCCION),
                fail: '/error'
              }
            },
            {
              path: 'historial-linea3/:date',
              name: 'supervisionpartsHistory-linea3',
              component: SupervisionpartL3History,
              meta: {
                permission: authorize(ROLES.OFICIAL_L3, ROLES.SUPERVISOR_PRODUCCION, ROLES.SUPERVISOR, ROLES.JEFES, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: 'historial-resume-total-linea3/:date',
              name: 'supervisionpartResumeHistoryTotal-linea3',
              component: SupervisionpartResumeHistoryL3Total,
              meta: {
                permission: authorize(ROLES.OFICIAL_L3, ROLES.SUPERVISOR_PRODUCCION, ROLES.SUPERVISOR, ROLES.JEFES, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: 'historial-totales-total-linea3/:date',
              name: 'supervisionpartTotalesView-linea3',
              component: SupervisionpartL3Total,
              meta: {
                permission: authorize(ROLES.OFICIAL_L3, ROLES.SUPERVISOR_PRODUCCION, ROLES.SUPERVISOR, ROLES.JEFES, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: 'historial-resume-linea3/:date',
              name: 'supervisionpartsResumen-linea3',
              component: SupervisionpartL3Resume,
              meta: {
                permission: authorize(ROLES.OFICIAL_L3, ROLES.SUPERVISOR_PRODUCCION, ROLES.SUPERVISOR, ROLES.JEFES, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: ':sector',
              name: 'supervisionpart-linea3',
              component: SupervisionpartL3Form,
              meta: {
                permission: authorize(ROLES.OFICIAL_L3, ROLES.JEFES, ROLES.SUPERVISOR_PRODUCCION),
                fail: '/error'
              }
            }
          ]
        },
        {
          path: 'panol',
          component: PanolIndex,
          meta: {
            permission: authorize(ROLES.SECTOR_PANOL),
            fail: '/error'
          },
          children: [
            {
              path: 'catalogo',
              name: 'panol-catalogo',
              component: CatalogView,
              meta: {
                permission: authorize(ROLES.SECTOR_PANOL),
                fail: '/error'
              }
            },
            {
              path: 'solicitudes',
              name: 'panol-requests',
              component: PanolRequests,
              meta: {
                permission: authorize(ROLES.SECTOR_PANOL),
                fail: '/error'
              }
            },
            {
              path: 'historial',
              name: 'panol-history',
              component: PanolRequestsHistory,
              meta: {
                permission: authorize(ROLES.SECTOR_PANOL),
                fail: '/error'
              }
            }
          ]
        },
        {
          path: 'personal',
          component: PersonalIndex,
          meta: {
            permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION),
            fail: '/error'
          },
          children: [
            {
              path: 'solicitudes',
              name: 'personal-staff-request',
              component: PersonalStaffRequest,
              meta: {
                permission: authorize(ROLES.ADMINISTRACION),
                fail: '/error'
              }
            },
            {
              path: 'acontecimientos',
              name: 'personal-occurrence',
              component: OccurrenceTrackingList,
              meta: {
                permission: authorize(ROLES.ADMINISTRACION),
                fail: '/error'
              }
            },
            {
              path: 'control',
              name: 'controlPersonal',
              component: ControlPersonal,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION),
                fail: '/error'
              },
              children: [
                {
                  path: 'gestion',
                  name: 'gestionPersonal',
                  component: PersonalManager,
                  meta: {
                    permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION),
                    fail: '/error'
                  }
                },
                {
                  path: 'novedades',
                  name: 'new-kanban-personal',
                  component: NewsKanban,
                  meta: {
                    permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION),
                    fail: '/error'
                  }
                }
              ]
            }
          ]
        },
        {
          path: 'novedades',
          component: NewsIndex,
          name: 'news',
          redirect: {
            name: 'report-news'
          },
          meta: {
            permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.PERSONAL, ROLES.RRHH),
            fail: '/error'
          },
          children: [
            {
              path: '',
              name: 'report-news',
              component: ReportNews,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.PERSONAL, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: 'tarde',
              name: 'report-news-tarde',
              component: ReportNewsTarde,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.PERSONAL, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: 'falta',
              name: 'report-news-falta',
              component: ReportNewsFalta,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.PERSONAL, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: 'temprano',
              name: 'report-news-early',
              component: ReportNewsEarly,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.PERSONAL, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: 'accidente',
              name: 'report-news-accident',
              component: ReportNewsAccident,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.PERSONAL, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: 'observacion',
              name: 'report-news-observation',
              component: ReportNewsObservation,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.PERSONAL, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: 'novedad-personal',
              name: 'report-news-scheduled',
              component: ReportNewsScheduled,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.PERSONAL, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: 'sancion',
              name: 'report-news-sanction',
              component: SanctionCreation,
              meta: {
                permission: authorize(ROLES.ADMINISTRACION, ROLES.RRHH),
                fail: '/error'
              }
            }
          ]
        },
        {
          path: 'solicitudes',
          component: StaffRequestsIndex,
          meta: {
            permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION),
            fail: '/error'
          },
          children: [
            {
              path: '',
              name: 'staff-requests',
              component: StaffRequestsHome,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION),
                fail: '/error'
              }
            },
            {
              path: 'permisos',
              name: 'staff-requests-permission',
              component: StaffRequestsPermission,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION),
                fail: '/error'
              }
            },
            {
              path: 'cambios-hora',
              name: 'staff-requests-changes-hours',
              component: StaffRequestsChangesHours,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION),
                fail: '/error'
              }
            },
            {
              path: 'horas-extras',
              name: 'staff-requests-extra-hours',
              component: StaffRequestsExtraHours,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION),
                fail: '/error'
              }
            },
            {
              path: 'acontecimientos',
              name: 'occurrence-creation',
              component: OccurrenceCreation,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION, ROLES.HIGIENE_SEGURIDAD),
                fail: '/error'
              }
            },
            {
              path: ':type/:id',
              name: 'staff-request-visualization',
              component: StaffRequestsVisualization,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION),
                fail: '/error'
              }
            }
          ]
        },
        {
          path: 'sanciones/:id',
          name: 'sanction-detail',
          component: SanctionVisualization,
          meta: {
            permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION),
            fail: '/error'
          }
        },
        {
          path: 'sanciones/:id/edicion',
          name: 'sanction-edition',
          component: SanctionEdition,
          meta: {
            permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION),
            fail: '/error'
          }
        },
        {
          path: 'acontecimientos/:id',
          name: 'occurrence-detail',
          component: OccurrenceVisualization,
          meta: {
            permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION, ROLES.HIGIENE_SEGURIDAD),
            fail: '/error'
          }
        },
        {
          path: 'acontecimientos/:id/edicion',
          name: 'occurrence-edition',
          component: OccurrenceEdition,
          meta: {
            permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION, ROLES.HIGIENE_SEGURIDAD),
            fail: '/error'
          }
        },
        {
          path: 'fallas',
          component: BugReportIndex,
          name: 'bug-report-index',
          redirect: {
            name: 'bug-report-creation'
          },
          meta: {
            permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION, ROLES.HIGIENE_SEGURIDAD),
            fail: '/error'
          },
          children: [
            {
              path: 'creacion',
              name: 'bug-report-creation',
              component: BugReportCreation,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION, ROLES.HIGIENE_SEGURIDAD),
                fail: '/error'
              }
            },
            {
              path: 'historial-fallas',
              name: 'bug-report-history',
              component: BugReportHistory,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION, ROLES.HIGIENE_SEGURIDAD),
                fail: '/error'
              }
            },
            {
              path: 'posibles-solicitudes-reparacion',
              name: 'bug-report-solicitudes-reparacion',
              component: BugReportHistoryPass,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION, ROLES.HIGIENE_SEGURIDAD),
                fail: '/error'
              }
            },
            {
              path: 'solicitudes-trabajo',
              name: 'bug-report-jobs-request',
              component: BugReportJobsRequest,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION, ROLES.HIGIENE_SEGURIDAD),
                fail: '/error'
              }
            },
            {
              path: 'resumen-fallas',
              name: 'bug-report-resume',
              component: BugReportResume,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION, ROLES.HIGIENE_SEGURIDAD),
                fail: '/error'
              }
            },
            {
              path: 'bug-report-config',
              name: 'bug-report-config',
              component: treeFailsManagement,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION, ROLES.HIGIENE_SEGURIDAD),
                fail: '/error'
              }
            },
            {
              path: ':id',
              name: 'bugReport-request',
              component: BugReportVisualization,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: ':id/edicion',
              name: 'bugReport-edition',
              component: BugReportView,
              props: { edition: true },
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.RRHH),
                fail: '/error'
              }
            },
            {
              path: 'edicion/:id',
              name: 'bug-report-edit',
              component: BugReportEdit,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.RRHH),
                fail: '/error'
              }
            }
          ]
        },
        {
          path: 'reuniones',
          component: MeetingIndex,
          name: 'meeting-index',
          redirect: {
            name: 'meeting-creation'
          },
          meta: {
            permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION, ROLES.HIGIENE_SEGURIDAD),
            fail: '/error'
          },
          children: [
            {
              path: 'creacion',
              name: 'meeting-creation',
              component: MeetingCreation,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION, ROLES.HIGIENE_SEGURIDAD),
                fail: '/error'
              }
            },
            {
              path: 'listado',
              name: 'meeting-list',
              component: MeetingList,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION, ROLES.HIGIENE_SEGURIDAD),
                fail: '/error'
              }
            },
            {
              path: 'control',
              name: 'meeting-manager',
              component: MeetingManager,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION, ROLES.HIGIENE_SEGURIDAD),
                fail: '/error'
              }
            },
            {
              path: 'sectores',
              name: 'meeting-sector',
              component: MeetingSector,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION, ROLES.HIGIENE_SEGURIDAD),
                fail: '/error'
              }
            },
            {
              path: 'calendario',
              name: 'meeting-calendar',
              component: MeetingCalendar,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION, ROLES.HIGIENE_SEGURIDAD),
                fail: '/error'
              }
            },
            {
              path: 'meeting-historial',
              name: 'meeting-history',
              component: MeetingHistory,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION, ROLES.HIGIENE_SEGURIDAD),
                fail: '/error'
              }
            },
            {
              path: ':id',
              name: 'meeting-detail',
              component: MeetingVisualization,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION, ROLES.HIGIENE_SEGURIDAD),
                fail: '/error'
              }
            },
            {
              path: ':id/edicion',
              name: 'meeting-edition',
              component: MeetingEdition,
              meta: {
                permission: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION, ROLES.HIGIENE_SEGURIDAD),
                fail: '/error'
              }
            }
          ]
        }
      ]
    }
  ]
})

router.$_redirect = false
router.$_prev = null

router.beforeEach((to, from, next) => {
  const isAuthenticated = auth.checkAuth()
  router.$_prev = from.name
  if (!isAuthenticated && to.name === 'login') {
    next()
  }
  if (!isAuthenticated && to.name === null) {
    next({name: 'login'})
  }
  if (!isAuthenticated && to.name !== 'login' && to.name !== null) {
    router.$_redirect = true
    next({name: 'login', query: {redirect: to.path}})
  }
  if (isAuthenticated && from.name === 'login' && router.$_redirect) {
    router.$_redirect = false
    next({path: from.query.redirect})
  }
  if (isAuthenticated && from.name === null && to.name === 'login') {
    next('/')
    return
  }
  if (isAuthenticated && to.name === 'login') {
    next(false)
    return
  }
  if (isAuthenticated) {
    store.dispatch('notifications/fetch')
    store.dispatch('tasksQueue/loadTasks')
    next()
  }
})

export default router
