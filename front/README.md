# Ceramica Fanelli
## Front-End (Vue.js)


## Dependecias

**Vue**: ^2.5.2  
**Vuex**: ^3.0.0  
**Node**: >= 4.0.0  
**npm**: >= 3.0.0  

**EsLint**  
**Karma** + **Mocha** + **chai**

## Setup

``` bash
# Instalar las dependencias del proyecto
npm install  
  
# Iniciar el servidor con hot reload en localhost:8080
# Previamente se debe iniciar el servidor de Back-End
npm run dev
  
# Buildear el proyecto para producción con minificación.
npm run build
  
# Buildear el proyecto para producción con reportes
npm run build --report
  
# Correr Test de unidad.
npm run unit
  
# Correr Tes de integración
npm run e2e
  
# Correr todos los Tests
npm test
```

Luego de esto, se debe crear un archivo '.env' usando el archivo example.env como guia. El archivo '.env' contiene las variables de entornos que representan las credenciales para ejecutar los test en Browser Stack. Pida sus credenciales para llenar este archivo con las keys correspondientes 

## Estructura del proyecto
```
. (front/)
├── build/                      # webpack config files
│   └── ...
├── config/
│   ├── index.js                # main project config
│   └── ...
├── src/
│   ├── main.js                 # app entry file
│   ├── App.vue                 # main app component
│   ├── components/             # ui components
│   │   └── ...
│   ├── assets/                 # module assets (processed by webpack)
│   │   └── ...
│   ├── router/                 # App's Route
│   └── store/                  # Vuex Store
│  
├── static/                     # pure static assets (directly copied)
├── test/
│   └── unit/                   # unit tests
│   │   ├── specs/              # test spec files
│   │   ├── eslintrc            # config file for eslint with extra settings only for unit tests
│   │   ├── index.js            # test build entry file
│   │   └── karma.conf.js       # test runner config file when using Karma for unit tests
│   └── e2e/                    # e2e tests
│   │   ├── specs/              # test spec files
│   │   ├── custom-assertions/  # custom assertions for e2e tests
│   │   ├── runner.js           # test runner script
│   │   └── nightwatch.conf.js  # test runner config file
├── .babelrc                    # babel config
├── .editorconfig               # indentation, spaces/tabs and similar settings for your editor
├── .eslintrc.js                # eslint config
├── .eslintignore               # eslint ignore rules
├── .gitignore                  # sensible defaults for gitignore
├── .postcssrc.js               # postcss config
├── index.html                  # index.html template
├── package.json                # build scripts and dependencies
└── README.md                   # Default README file
```


###src/main.js
Es el archivo principal que crea la aplicación Vue cargando todos los plugins necesarios.

### build/
Este directorio contiene las configuraciones tanto para el servidor de desarrollo como para el de producción. Normalmente, no se necesita tocar estos archivos a menos que desee personalizar los loaders de Webpack, en cuyo caso probablemente deba mirar `build/webpack.base.conf.js.`

### config/index.js
archivo de configuración principal que donde estan las opciones de configuración más comunes para el setup para dev o para el build.

### src/
En esta carpeta se encuentra **el codigo de la applicación**. También se encuentra: el router de la aplicación y el store Vuex (el cual se utiliza para compartir información entre todos los componentes de la aplicación).

### static/
Directorio para assets estáticos que no desean procesar con Webpack. Se copiarán directamente en el mismo directorio donde se encuentran los archivos generados por webpack.
[assets/ vs static/](https://vuejs-templates.github.io/webpack/static.html)

### index.html
Template para para nuestra single page application. Durante el desarrollo y las compilaciones, Webpack generará assets, y las URL de esos assets generados se inyectarán automáticamente en esta template para representar el HTML final.


## Autorización

Se utiliza JWT para la autorización y autentificación de la aplicación. Dentro del archivo `src/main.js`, se puede ver que se agrega un `interceptor` que se encarga de agregar el header con el token de autorización de JWT a todas las request generadas desde el front.

Ademas de esto, se utiliza `vue-acl` para especificar los permisos de acceso a cada ruta, para lograr esto se define en cada ruta la propiedad `permission` en la cual se especifican los roles permitidos. 

La propiedad `permission` esta declarada utilizando la función helper `authorize(...params)` que recibe como parametros los roles definidos en la aplicación (ver archivo de constantes) y se encarga de formatear dichos permisos con el formato especificado por vue-acl (permisos separados por `|`).

A parte de los permisos en el router, en este proyecto, en el componente `SidebarContent.vue`, se encuentra definidos el menu de acciones que puede acceder cada rol, por lo que también se debe especificar los permisos de acceso a cada ruta definida dentro de este menu, utilizando la misma logica descripta para el router.


## Nice to have

* Separar en modulos el router.
* Generar servicios que consumen los endpoint del backend.
* Comtemplar la posibilidad de sacar Workbox.


Powered by ubykuo-ci 1 2

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
