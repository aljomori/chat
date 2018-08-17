# Chat

## Requisitos

Docker y Docker Compose

## Ejecución

Revisa `docker-compose.yml` y haz cualquier cambio que consideres necesario. La aplicación escucha en el puerto 80 y usa un named volume para almacenar los archivos subidos.

Con el servicio de Docker corriendo, ejecuta la aplicación:

    $ docker-compose up -d

Luego inicializa la base de datos:

    $ docker-compose exec php php artisan migrate

Finalmente visita http://localhost en tu browser.

## Arquitectura y funcionalidades

El front-end está implementado en React y el back-end en Laravel. La
aplicación utiliza polling para obtener nuevos mensajes.

* Cualquier usuario puede crear mensajes en el chat sin autentificación. La aplicación no diferencia usuarios.
* Los nuevos mensajes se guardan en la base de datos MySQL y en Redis. Se leen sólo de Redis y sólo se hace caching de los últimos 100 mensajes.
* Se pueden subir imágenes (máximo 3MB) y videos (máximo 30MB).

## Funcionalidades por implementar

* Feeback al subir archivos.
* Creación de usuarios/usernames y autentificación.
* Vista previa de archivos.
* Procesamiento de imágenes/videos.
* Mensajes de error en general.
* Mejor manejo de scroll.
* Etc.
