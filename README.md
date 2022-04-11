<p align="center"><a href="ospedale.com.co" target="_blank"><img src="src/assets/images/login/juridico-4.jpg" width="400"></a></p>

# Front de Jurídico

El front de jurídico es la parte visual el usuario para poder realizar la creación de nuevos procesos/litigios con los involucrados, actuaciones, links, costos/cuantías, polizas, eventos en el calendario, exportar procesos, etc.


## Instalación

A continuación, se listan las tecnologías necesarias para ejecutar la parte front de Jurídico.

1. Clonar repositorio
```bash
https://github.com/luisorduz/juridico_front.git
```
3. Abrir terminal y dentro de la carpeta del front de Jurídico, instalar paquetes de NPM.
```bash
npm install
```
3. Para ejecutar el front de Jurídico en local o en producción se debe de seguir algunos de los siguientes pasos.

3.1 Ejecutar front de Jurídico de manera local
```bash
npm run serve
```
4. Para construir el front de Jurídico para producción
```bash
npm run build
```
4.1 Crear carpeta
```bash
dist
```
4.2 Cortar lo creado en la carpeta **export** a **dist**.

4.3 Se debe de abrir el proyecto en la ruta donde se encuentra instalado el front de Jurídico y acceder a la carpeta dist. Ejemplo: http://localhost/juridico_front/dist/auth/sign-in1

5. Para ejecutar el proyecto en el docker, confirmar los el archivo Dockerfile y docker-compose.yml
- Se debe de ejecutar el siguiente comando para construir la imagen del docker y desplegar el mismo
    ```
    docker-compose up -d
    ```
    el sistema estará disponible en el puerto 80 para ser accedido desde cualquier lugar.



## Variables de entorno

Para ejecutar este proyecto, deberá agregar las siguientes variables de entorno a su archivo .env

`VUE_APP_BASE_URL`

`VUE_APP_I18N_LOCALE`

`VUE_APP_I18N_FALLBACK_LOCALE`

`VUE_APP_NODE_ENV`

