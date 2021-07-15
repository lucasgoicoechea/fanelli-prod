<template>
  <div class="sidebar-container">
    <div class="user-section" :class="{'expanded': expandedUserSection}">
      <div class="cross-icon"
           title="Mostrar/ocultar barra lateral"
           @click="toggleSidebar()">
        <img src="~@img/icons-sidebar/cross.svg">
      </div>
      <div class="profile-picture-container">
        <img class="profile-picture"
             :title="profilePictureTitle"
             :src="profilePicture">
      </div>
      <div class="left-triangle" :class="{'expanded': expandedUserSection}"></div>
      <div class="right-triangle" :class="{'expanded': expandedUserSection}"></div>
      <div class="collaborator-name"
           :title="userName"
           @click="toggleUserSectionExpansion"> {{ userName }}</div>
      <div class="collaborator-area"
           :title="userType"
           @click="toggleUserSectionExpansion"> {{ userType }}</div>
      <div class="chevron"
           :title="chevronTitle"
           :class="{'clicked': expandedUserSection}"
           @click="toggleUserSectionExpansion"></div>
      <div class="horizontal-line" :class="{'expanded': expandedUserSection}"></div>
      <a class="logout-container"
           v-if="expandedUserSection"
           @click="logout">
        <div class="logout-text"
             :class="{'expanded': expandedUserSection}"> Cerrar Sesión
        </div>
        <img src="~@img/icon-navigation/logout.svg"
             class="logout-icon"
             :class="{'expanded': expandedUserSection}">
      </a>
    </div>

    <ul class="main-menu">
      <li class="menu-item"
          v-for="item in menuItems"
          v-if="$can(item.can)"
          :class="{'active': isRouterItemActive(item.routeName),
          'extended': hasSubmenu(item) && isRouterItemActive(item.routeName)}"
          @click.capture="selectMenuItem($event, item)">
        <div class="menu-item-container">
          <img class="menu-item-icon"
               :src="item.img"
               :class="{'active': isRouterItemActive(item.routeName)}">
          <span class="menu-item-name"
                :class="{'active': isRouterItemActive(item.routeName)}"> {{ item.name }} </span>
        </div>
        <div v-if="isRouterItemActive(item.routeName)">
          <ul class="sub-menu">
            <router-link
              class="sub-menu-item"
              v-for="subItem in item.submenu"
              :key="subItem.type"
              v-if="$can(subItem.can)"
              tag="li"
              :to="subItem.route"
              @click.native="selectSubItem($event, subItem)">
              <span class="sub-menu-item-name">{{ subItem.name }} </span>
            </router-link>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  import pushNotification from '@/push-notification'
  import { mapState } from 'vuex'
  import authorize from '@/utils/authorize'
  import Const from '@/const'
  const { ROLES } = Const

  export default {
    name: 'SidebarContent',
    data: function () {
      return {
        menuItems: [
          {
            name: 'Inicio',
            img: '/static/img/icons-sidebar/home.svg',
            type: 'home',
            routeName: 'home',
            can: 'any'
          },
          {
            name: 'Mi Equipo',
            type: 'control-personal',
            img: '/static/img/my-team.svg',
            routeName: 'control-personal',
            route: {name: 'control-personal'},
            can: authorize(ROLES.RRHH, ROLES.SUPERVISORES)
          },
          {
            name: 'Panel de Control',
            img: '/static/img/icons-sidebar/controlpanel.svg',
            type: 'controlpanel',
            routeName: 'control-panel',
            submenu: [
              {
                name: 'Checklists',
                type: 'control-checklists',
                route: {name: 'control-checklists'},
                can: authorize(ROLES.JEFE_PLANTA, ROLES.JEFE_LINEA, ROLES.JEFE_MANTENIMIENTO, ROLES.RRHH)
              },
              {
                name: 'Partes',
                type: 'control-supervisionparts',
                route: {name: 'control-supervisionparts'},
                can: authorize(ROLES.OFICIALES, ROLES.JEFE_PLANTA, ROLES.JEFE_LINEA, ROLES.JEFE_MANTENIMIENTO, ROLES.RRHH)
              },
              {
                name: 'Novedades',
                type: 'control-novedades',
                route: {name: 'control-novedades'},
                can: authorize(ROLES.JEFES, ROLES.ADMINISTRACION)
              },
              {
                name: 'Personal',
                type: 'control-personal',
                route: {name: 'control-personal'},
                can: authorize(ROLES.JEFES, ROLES.ADMINISTRACION, ROLES.SUPERVISORES)
              },
              {
                name: 'Solicitudes de EPP',
                type: 'control-epp',
                route: {name: 'control-epp'},
                can: authorize(ROLES.JEFES, ROLES.RRHH)
              },
              {
                name: 'Solicitudes',
                type: 'control-staff-requests',
                route: {name: 'control-staff-requests'},
                can: authorize(ROLES.JEFES, ROLES.RRHH)
              },
              {
                name: 'Acontecimientos',
                type: 'control-occurrence',
                route: {name: 'control-occurrence'},
                can: authorize(ROLES.JEFES, ROLES.HIGIENE_SEGURIDAD, ROLES.RRHH)
              },
              {
                name: 'Config. de Personal',
                type: 'fabric-management',
                route: {name: 'fabric-management'},
                can: authorize(ROLES.JEFE_PLANTA, ROLES.RRHH, ROLES.JEFE_PERSONAL)
              }
            ],
            can: authorize(ROLES.JEFES, ROLES.ADMINISTRACION)
          },
          {
            name: 'Checklist',
            img: '/static/img/icons-sidebar/checklist.svg',
            type: 'checklist',
            can: authorize(ROLES.JEFE_LINEA, ROLES.JEFE_PLANTA, ROLES.SUPERVISOR_PRODUCCION),
            routeName: 'checklistsIndex',
            submenu: [
              {
                name: 'Extrusora',
                type: 'extrusora',
                route: {name: 'checklist', params: {sector: 'EXTRUSORA'}},
                can: authorize(ROLES.JEFE_LINEA, ROLES.JEFE_PLANTA, ROLES.SUPERVISOR_PRODUCCION)
              },
              {
                name: 'Apiladora',
                type: 'apiladora',
                route: {name: 'checklist', params: {sector: 'APILADORA'}},
                can: authorize(ROLES.JEFE_LINEA, ROLES.JEFE_PLANTA, ROLES.SUPERVISOR_PRODUCCION)
              },
              {
                name: 'Desapiladora',
                type: 'desapiladora',
                route: {name: 'checklist', params: {sector: 'DESAPILADORA'}},
                can: authorize(ROLES.JEFE_LINEA, ROLES.JEFE_PLANTA, ROLES.SUPERVISOR_PRODUCCION)
              }
            ]
          },
          {
            name: 'Partes',
            img: '/static/img/icons-sidebar/checklist.svg',
            type: 'checklist',
            can: authorize(ROLES.OFICIALES, ROLES.JEFE_LINEA, ROLES.JEFE_PLANTA, ROLES.SUPERVISOR_PRODUCCION),
            routeName: 'supervisionpartsIndex',
            submenu: [
              {
                name: 'Extrusora',
                type: 'extrusora',
                route: {name: 'supervisionpart', params: {sector: 'EXTRUSORA'}},
                can: authorize(ROLES.OFICIAL_EXTRUSORA, ROLES.JEFE_LINEA, ROLES.JEFE_PLANTA, ROLES.SUPERVISOR_PRODUCCION)
              },
              {
                name: 'Apiladora',
                type: 'apiladora',
                route: {name: 'supervisionpart', params: {sector: 'APILADORA'}},
                can: authorize(ROLES.OFICIAL_APILADORA, ROLES.JEFE_LINEA, ROLES.JEFE_PLANTA, ROLES.SUPERVISOR_PRODUCCION)
              },
              {
                name: 'Desapiladora',
                type: 'desapiladora',
                route: {name: 'supervisionpart', params: {sector: 'DESAPILADORA'}},
                can: authorize(ROLES.OFICIAL_DESAPILADORA, ROLES.JEFE_LINEA, ROLES.JEFE_PLANTA, ROLES.SUPERVISOR_PRODUCCION)
              }
            ]
          },
          {
            name: 'Novedades',
            img: '/static/img/icons-sidebar/news.svg',
            type: 'news',
            routeName: 'news',
            can: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION)
          },
          {
            name: 'Solicitudes',
            img: '/static/img/icons-sidebar/staffRequests.svg',
            type: 'staffnews',
            routeName: 'staff-requests',
            can: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION),
            submenu: [
              {
                name: 'Mis solicitudes',
                img: '/static/img/icons-sidebar/staffRequests.svg',
                type: 'control-staff-requests-supervisor',
                route: {name: 'control-staff-requests'},
                can: authorize(ROLES.SUPERVISORES, ROLES.ADMINISTRACION)
              },
              {
                name: 'Mis acontecimientos',
                img: '/static/img/icons-sidebar/staffRequests.svg',
                type: 'control-occurrence',
                route: {name: 'control-occurrence'},
                can: authorize(ROLES.SUPERVISORES, ROLES.HIGIENE_SEGURIDAD, ROLES.ADMINISTRACION)
              }
            ]
          },
          {
            name: 'Reuniones',
            img: '/static/img/icons-sidebar/staffRequests.svg',
            type: 'meeting',
            routeName: 'meeting-index',
            can: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION, ROLES.HIGIENE_SEGURIDAD),
            submenu: [
              {
                name: 'Creación',
                img: '/static/img/icons-sidebar/staffRequests.svg',
                type: 'meeting-creation',
                route: {name: 'meeting-creation'},
                can: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION, ROLES.HIGIENE_SEGURIDAD)
              },
              {
                name: 'Mis Reuniones',
                img: '/static/img/icons-sidebar/staffRequests.svg',
                type: 'meeting-list',
                route: {name: 'meeting-list'},
                can: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION, ROLES.HIGIENE_SEGURIDAD)
              },
              {
                name: 'Mis Reuniones Historico',
                img: '/static/img/icons-sidebar/staffRequests.svg',
                type: 'meeting-history',
                route: {name: 'meeting-history'},
                can: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION, ROLES.HIGIENE_SEGURIDAD)
              },
              {
                name: 'Control',
                img: '/static/img/icons-sidebar/staffRequests.svg',
                type: 'meeting-manager',
                route: {name: 'meeting-manager'},
                can: authorize(ROLES.JEFES, ROLES.SUPERVISORES, ROLES.ADMINISTRACION, ROLES.HIGIENE_SEGURIDAD)
              }
            ]
          },
          {
            name: 'EPP',
            img: '/static/img/icons-sidebar/epp.svg',
            type: 'EPP',
            routeName: 'epp',
            can: authorize(ROLES.JEFE_LINEA, ROLES.JEFE_PLANTA, ROLES.JEFE_SECTOR, ROLES.JEFE_MANTENIMIENTO, ROLES.RRHH, ROLES.SUPERVISORES, ROLES.JEFE_PERSONAL),
            submenu: [
              {
                name: 'Mis EPP',
                img: '/static/img/icons-sidebar/epp.svg',
                type: 'EPP',
                route: {name: 'epp-my-requests'},
                can: authorize(ROLES.SUPERVISORES, ROLES.JEFE_PERSONAL)
              }
            ]
          },
          {
            name: 'Solicitudes EPP',
            img: '/static/img/icons-sidebar/requests.svg',
            type: 'requestspanol',
            routeName: 'panol-requests',
            can: authorize(ROLES.SECTOR_PANOL)
          },
          {
            name: 'Historial',
            img: '/static/img/icons-sidebar/historial.svg',
            type: 'requestshistorypanol',
            routeName: 'panol-history',
            can: authorize(ROLES.SECTOR_PANOL)
          },
          {
            name: 'Catálogo',
            img: '/static/img/icons-sidebar/epp.svg',
            type: 'panol-catalogo',
            routeName: 'panol-catalogo',
            can: authorize(ROLES.SECTOR_PANOL)
          },
          // proof concept layout tracking card
          {
            name: 'Adm. Solicitudes',
            img: '/static/img/icons-sidebar/staffRequests.svg',
            type: 'personal-staff-request',
            routeName: 'personal-staff-request',
            can: authorize(ROLES.ADMINISTRACION)
          },
          {
            name: 'Acontecimientos',
            img: '/static/img/icons-sidebar/staffRequests.svg',
            type: 'personal-occurrence',
            routeName: 'personal-occurrence',
            can: authorize(ROLES.ADMINISTRACION)
          },
          {
            name: 'Acontecimientos',
            img: '/static/img/icons-sidebar/staffRequests.svg',
            type: 'occurrence-creation',
            routeName: 'occurrence-creation',
            can: authorize(ROLES.HIGIENE_SEGURIDAD),
            submenu: [
              {
                name: 'Creación',
                img: '/static/img/icons-sidebar/staffRequests.svg',
                type: 'occurrence-creation',
                route: {name: 'occurrence-creation'},
                can: authorize(ROLES.HIGIENE_SEGURIDAD)
              },
              {
                name: 'Listado',
                img: '/static/img/icons-sidebar/staffRequests.svg',
                type: 'control-occurrence',
                route: {name: 'control-occurrence'},
                can: authorize(ROLES.HIGIENE_SEGURIDAD)
              }
            ]
          }
        ],
        activeMenuItem: undefined,
        activeMenuSubItem: undefined,
        expandedUserSection: false,
        subItemExpanded: false
      }
    },
    methods: {
      selectMenuItem (event, item) {
        if (this.hasSubmenu(item)) {
          this.subItemExpanded = true
        } else {
          this.subItemExpanded = false
          this.checkDeviceAndToggleSidebar()
        }
        this.$router.push({name: this.getItemRoute(item)})

        this.activeMenuSubItem = undefined
        this.activeMenuItem = item
      },
      selectSubItem (event, itemType) {
        this.activeMenuSubItem = itemType
        // this.$router.replace(this.getSubitemRoute(this.activeMenuSubItem))
        this.checkDeviceAndToggleSidebar()
      },
      isRouterItemActive (itemRouteName) {
        if (itemRouteName === this.$route.name) {
          return true
        } else {
          for (const route of this.$route.matched) {
            if (route.name === itemRouteName) {
              return true
            }
          }
          return false
        }
      },
      isRouterSubItemActive (subItemRoute) {
        if (subItemRoute.name === 'checklist' || subItemRoute.name === 'supervisionpart') {
          return subItemRoute.params.sector === this.$route.params.sector
        } else {
          return subItemRoute === this.$route.name
        }
      },
      hasSubmenu (menuItem) {
        return (typeof menuItem === 'object' && menuItem.hasOwnProperty('submenu'))
      },
      getItemRoute (menuItem) {
        return menuItem.routeName
      },
      getSubitemRoute (subMenuItem) {
        return subMenuItem.route
      },
      toggleSidebar () {
        this.subItemExpanded = false
        this.$Sidebar.toggle('sidebar')
      },
      toggleUserSectionExpansion () {
        this.expandedUserSection = !this.expandedUserSection
      },
      checkDeviceAndToggleSidebar () {
        if (this.$mq === 'mobile' || this.$mq === 'iphone5' || this.$mq === 'tablet') {
          this.toggleSidebar()
        }
      },
      logout () {
        pushNotification.unsubscribeUser()
        this.$store.dispatch('auth/logout')
        this.$store.dispatch('tasksQueue/clearCompletedTasks')
        this.$Sidebar.toggle('sidebar')
        this.$store.dispatch('reset')
        this.$router.push({name: 'login'})
        this.$access('any')
      },
      assignSelectedMenuItem () {
        for (const menuItem of this.menuItems) {
          if (menuItem.routeName === this.$route.name) {
            this.activeMenuItem = menuItem
            if (this.hasSubmenu(menuItem)) {
              this.subItemExpanded = true
            }
            return
          }
        }

        for (const matchedRoute of this.$route.matched) {
          for (const menuItem of this.menuItems) {
            if (menuItem.routeName === matchedRoute.name) {
              this.activeMenuItem = menuItem
              if (this.hasSubmenu(menuItem)) {
                this.subItemExpanded = true
              }
              return
            }
          }
        }
      },
      assignSelectedMenuSubItem () {
        let checklistItem = this.menuItems.find(item => item.type === 'checklist')

        for (const checklistSubitem of checklistItem.submenu) {
          if (checklistSubitem.route.params.sector === this.$route.params.sector) {
            this.activeMenuSubItem = checklistSubitem
          }
        }
      }
    },
    computed: {
      profilePicture () {
        if (this.user === undefined) {
          return '/icon-navigation/nofoto.svg'
        }

        if (this.user.hasOwnProperty('picture') && this.user.picture) {
          return this.user.picture
        } else {
          return '/static/img/icon-navigation/nofoto.svg'
        }
      },
      userName () {
        if (Object.keys(this.user).length === 0 && this.user.constructor === Object) {
          return 'Nombre de usuario'
        }
        return `${this.user.lastname} ${this.user.name}`
      },
      userType () {
        if (Object.keys(this.user).length === 0 && this.user.constructor === Object) {
          return 'Tipo de usuario'
        }
        return this.$constants.USER_TYPE_READABLE[this.user.user_type]
      },
      profilePictureTitle () {
        return `Foto de perfil de ${this.user.lastname} ${this.user.name}`
      },
      chevronTitle () {
        return this.expandedUserSection ? 'Reducir sección' : 'Expandir sección'
      },
      ...mapState('auth', [
        'user'
      ])
    },
    mounted () {
      this.assignSelectedMenuItem()
      this.assignSelectedMenuSubItem()
    }
  }

</script>

<style lang="scss" scoped>
  .sidebar-container {
    height: 100%;
    width: 280px;
    background-color: #ededed;
  }

  .user-section {
    position: relative;
    height: 250px;
    background-color: #074c8b;
    margin: 0;
    transition: all 0.35s;

    &.expanded {
      height: 310px;
    }
  }

  .profile-picture-container {
    position: relative;
    top: 70px;
    height: 95px;
    width: 95px;
    margin: 0 auto;
    border-radius: 50%;
    background-color: #ffffff;
    z-index: 3;
  }

  .profile-picture {
    height: 95px;
    width: 95px;
    border-radius: 50%;
  }

  .collaborator-name {
    position: absolute;
    top: 193px;
    left: 15px;
    font-size: 16px;
    color: #ffffff;
    font-weight: 600;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 220px;
    white-space: nowrap;
    cursor: pointer;
  }

  .collaborator-area {
    position: absolute;
    top: 218px;
    left: 15px;
    font-size: 16px;
    color: #ffffff;
    cursor: pointer;
  }

  .right-triangle {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 0 16rem 20rem;
    border-color: transparent transparent #3e87d9 transparent;
    transition: border-width 0.3s;

    &.expanded {
      border-width: 0 0 21rem 20rem;
    }
  }

  .left-triangle {
    position: absolute;
    width: 0;
    height: 0;
    left: -5rem;
    bottom: 0;
    border-style: solid;
    border-width: 0 28rem 20rem 5rem;
    border-color: transparent transparent #69a0e0 transparent;
    transition: border-width 0.3s;

    &.expanded {
      border-width: 0 21rem 21rem 5rem;
    }
  }

  .main-menu {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .menu-item {
    display: block;
    transition: all 0.2s ease-out;
    cursor: pointer;

    &:nth-child(even) {
      background-color: #ffffff;
    }

    &:nth-child(odd) {
      background-color: #ededed;
    }

    &.active, &.router-link-active {
      background-color: #b3b3b3;
    }
  }

  .menu-item-container {
    display: flex;
    align-items: center;
    height: 60px;
  }

  .menu-item-name {
    margin-left: 10px;
    font-weight: bolder;
    font-size: 20px;
    color: #585858;

    &.active, &.router-link-active {
      color: #ffffff;
    }
  }

  .menu-item-icon {
    margin-left: 10px;
    height: 20px;
    width: 20px;

    &.active, &.router-link-active {
      filter: brightness(0) invert(1)
    }
  }

  .sub-menu {
    overflow: hidden;
    width: 100%;
    height: 100%;
    background-color: #b3b3b3;
    transition: all .2s ease-out;
    list-style: none;
    padding: 0;
  }

  .sub-menu-item {
    height: 40px;
    display: flex;
    align-items: center;
    padding: 1px 0;
    font-size: 18px;
    color: #ffffff;
    transition: all 0.2s ease-out;
    cursor: pointer;

    &.active, &.router-link-active {
      background-color: #676767;
      color: #ffffff;
      font-weight: 100;
    }
  }

  .sub-menu-item-name {
    margin-left: 40px;
  }

  .cross-icon {
    position: absolute;
    display: none;
    right: 15px;
    top: 15px;
    height: 40px;
    width: 40px;
    cursor: pointer;
  }

  .chevron {
    position: absolute;
    right: 17px;
    top: 199px;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #ffffff;
    transition: all 0.3s ease-out;
    cursor: pointer;
    transform: rotate(-180deg);

    &.clicked {
      transform: rotate(0deg);
    }
  }

  .horizontal-line {
    position: absolute;
    width: calc(100% - 35px);
    margin-left: 15px;
    top: 250px;
    border-bottom: 3px solid #ffffff;
    border-radius: 7px;
    display: flex;
    align-self: center;
    animation: hide 0.3s forwards;

    &.expanded {
      animation: show 0.5s forwards;
    }

    @keyframes show {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }

    @keyframes hide {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  }

  .logout-container {
    cursor: pointer;
    color: #FFF;
  }

  .logout-text {
    position: absolute;
    top: 268px;
    right: 45px;
    font-size: 17px;
    animation: hide 0.1s forwards;

    &.expanded {
      animation: show 0.5s forwards;
    }

    @keyframes show {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }

    @keyframes hide {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  }

  .logout-icon {
    position: absolute;
    top: 270px;
    right: 17px;
    width: 20px;
    height: 20px;
    animation: hide 0.1s forwards;
    filter: brightness(0) invert(1);

    &.expanded {
      animation: show 0.5s forwards;
    }

    @keyframes show {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }

    @keyframes hide {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0;
      }
    }
  }

  @media screen and (max-width: 768px) {
    .cross-icon {
      display: block;
    }
  }

</style>
