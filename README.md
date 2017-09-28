# Página web del proyecto Dataleufú

Dataleufú es un Mapeo ambiental ciudadano del Río Negro, Limay y Neuquén que busca visibilizar nuestros conflictos y amenazas ambientales, para convertirlas en desafíos colectivos que movilicen a la ciudadanía para trabajar conjuntamente en sus soluciones.

Este proyecto es la parte del cliente web desarrollado con Angular2 y [Cesium](https://cesiumjs.org/).

##Prerequisitos

Node.

##Instalación

```
git clone https://github.com/dataleufu/dataleufuwebapp
cd dataleufuwebapp/
npm install
```

##Configuración

Modificar el archivo src/app/config.ts para ingresar la url del servicio de datos.

```
export const API_BASE_URL = 'http://localhost:8000';
```

##Ejecución

```
npm start
```


