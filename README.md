# Proyecto de Cer�mica Fanelli

### Dependencias 

**Node:**
  Version 6.11.3
  
** Mongo: **
  Version 3.4

**Mocha**

**EsLint**

**db-migrate**

**db-migrate-mongodb**

Una vez clonado el repo realizar `npm install` en la raiz del proyecto la cual instalara las dependencias necesarias de Node del backend y de frontend, tambien hace el build del frontend. Por ultimo corre los test

Luego crear un archivo  '.env' usando el example.env como guia. Pida sus credenciales para llenar este archivo con las keys correspondientes

Para correr los test utilizar `npm test`

Si en cambio de se corre `test-watcher` el cual correra los test y enviara una notificacion con el resultado. Tambien quedara escuchando y por cada cambio se realizaran nuevamente 



### Migraciones

Las migraciones se encuentran en la carpeta migrations. Se usa el framework de migracion [db-migrate](https://db-migrate.readthedocs.io/en/latest/)

Para realizar las migraciones debe hacer `db-migrate up` si tiene instalada la dependencia instalada globalmente. Sino utilizar la que se instala al realizar npm install `node node_modules/db-migrate/bin/db-migrate up`

Para crear nuevas migraciones utilice la CLI de db migrate: `db-migrate create`. Esto creara un nuevo archivo en la carpeta de migraciones. Lo que hara la migracion debe ser cargado en la funcion up

### usuarios disponibles al realizar las migraciones
**PA�OL**

  `username: curcio_alejandro`
  
  `password: curcio_alejandro`
  
**Supervisor de Produccion**

  `username: cantero_orlando`
  
  `password: cantero_orlando`
  
-------------------------------------
  `username: tolosa_lucas`
  
  `password: tolosa_lucas`
  
-------------------------------------
  `username: britez_manuel`
  
  `password: britez_manuel`
  
-------------------------------------
  `username: daguerre_martin`
  
  `password: daguerre_martin`

**Jefe Linea**

  `username: espinola_leonardo`
  
  `password: espinola_leonardo`

**Jefe Planta**

  `username: iacovich_jose`
  
  `password: iacovich_jose`
  
**Superadmin**

  `username: superadmin`
  
  `password: superadmin`
  
  
  
## Backend Structure (13/12/2017)
```
index.js
mongoConnection.js
server.js
api.js
test/
config/
controller/
data/
front/
libs/
middlewares/
migrations/
model/
scripts/
service/
test/
```

**index.js**
La raiz de la aplicacion, el archivo a ejecutar con node para que la aplicacion comience. Inicializa Mongo, setea los middlewares, las notificaciones, la api y finalmente el server
    
**mongoConnection**
Realiza la conexion usando mongoose. Para utilizar mongoose para definir esquemas o para cualquier otro uso de las funcionalidades de este usar el metodo getMongoose, exportado por este archivo 
    
**server.js**
Empieza la ejecucion del server http
    
**config/**
Contiene los archivos de configuracion para cada ambiente. El index dentro de esta carpeta resuelve que archivo usar dependiendo de process.env.NODE_ENV
    
**controller/**
Capa intermedia entre la logica que recibe el request y del usuario y es el encargado re responder. Delega la logica en el service para aislarlo del framework de express

**data/**
Contiene los datos en JSON iniciales del sistema como usuarios, items del catalogo, checks, etc

**front/**
Directorio del front

**middlewares/**
Son middlewares que se ejecutan antes de que los resuelva el controlador. Realizan tareas de autorizacion , autenticacion, forzado de conexion https y validacion de los datos enviados por el usuario

**migrations/**
Scripts para realizar las migraciones 

**model/**
Contiene los modelos de la BD construidos con mognoose. Se exportan a traves del index. Son los que deben ser usados para hacer consultas a la BD

**scripts/**
Scripts de ayuda. Solo contiene un script para parsear los datos de los usuarios en crudo (extraidos de un excel) a un formato aceptado de acuerdo al modelo, agregando usuarios por defecto a estos usuarios

**service/**
Realizan la logica correspondiente, son los que interactuan con la BD. Son los con los que se realizara los unit tests

**test/**
Test de la aplicacion



  
## Pasos para agregar nuevo modulo 

Para agregar un modulo completamente nuevo a la aplicacion se debe: 

  - Agregar el modelo en model/ y agregar la propiedad que represente ese modelo en model/index.
  
  - Agregar el service en service/  y agregar la propiedad que represente ese service en service/index
  
  - Agregar el controlador en controller/  y agregar la propiedad que represente ese service en controller/index
  
  - Agregar la ruta en routes/  y agregar la propiedad que represente esa ruta en routes/index
  
  - En api.js agregar la nueva ruta que representara ese modulo


En caso de que ya existe pero deba agregarse una nueva ruta se debe 
 
 - Agregar la ruta al routes del modulo 
 
 - Agregar el methodo del controllador que manejara la ruta
 
 - Reusar los servicios o crear uno nuevo


Para mas informacion vea la documentacion en el codigo en los archivos index 


Nota: existen controladores que no usan servicios ya que en un principio no se tenia en cuenta los servicios en la arquitectura, pero se encontro que usandolos se podian hacer mejores casos de uso y extraian la logica de express de la logica de la aplicacion
  
  
## Api Documentation
    
Para poder acceder a la documentacion de la api se debe correr `npm run apidoc` el cual generara un directorio con todos los archivos generados para poder visualizar la documentacion en una intefaz web
Luego de correr el comando para poder visualizarlo se debe correr el backend y entrar a localhost:<puertoDelBackend>/doc



## Errors
Las requests al servidor siempre retornan codigo http 200 (excepto los 404). 
En caso de que la request no pueda resolverse se retornara con codigo http 200 pero en el body se enviara 
```json
    { 
      "success": false,
      "error": "error",
      "message": "Un mensage para ser mostrado", 
      "statusCode": "codigo_interno"
    }
```
**Codigos internos**


 - `1001` El idempotency key ya ha sido enviado por lo que es una request repetida 
 - `1002` Limitacion de tiempo en la Solicitud
 - `1003` La solicitud ya tiene una aprobacion 
 - `1004` La solicitud no se encuentra en un estado donde se pueda archivar
 - `1005` La solicitud no se encuentra en un estado donde se pueda cancelar 

##ENUMS
        USER_TYPE:  ['SUPERADMIN', 'JEFE_PLANTA', 'JEFE_LINEA', 'SUPERVISOR', 'COLABORADOR', 'PANOL', 'RRHH', 'ADMINISTRACION']
        shift: ['T1', 'T2', 'T3', 'T4']
        sector: [PRODUCCION', 'COMPRAS', 'MANTENIMIENTO', 'PA�OL', 'SOLDADORES', 'VAGONETAS']
        position: ['EXTRUSORA', 'AYUDANTE_EXTRUSORA', 'APILADORA', 'AYUDANTE_APILADORA', 'PALA_CARGADORA', 'DESAPILADORA', 'AUTOELEVADOR_DESAPILADORA', 'ELECTRICISTA', 'MECANICO']
