Paso 1: Preparar el entorno (Node.js)
Antes de tocar el código,instalamos Node.js, que es el motor que hace que todo esto se mueva.

¿Ya lo tenes? Abri una terminal y escribi node -v. Si sale un número (ej. v18.2.0), podes saltar al siguiente paso.

Si no lo tenes: Ve a nodejs.org y descarga la versión que dice LTS (es la más estable).

Instalación: Ejecuta el archivo, dale a "Siguiente" a todo y, al terminar, reinicia tu editor de código o la terminal para que se den por enterados.

🔗 Paso 2: Obtener la URL y Clonar el Repo
Clonar es básicamente "fotocopiar" el proyecto de GitHub a tu computadora.

Conseguir la URL: En la página del repositorio en GitHub, haz clic en el botón verde "<> Code" y copia el enlace que termina en .git.

Clonar: Abre tu terminal, navega hasta la carpeta donde quieras guardar el juego y escribe:

git clone <PEGA_AQUÍ_LA_URL>

Entrar al proyecto:

cd nombre-del-repositorio

Paso 3: Explorar las versiones (Las dos carpetas)
Al abrir la carpeta principal, verás dos subcarpetas. Cada una tiene un nombre distinto según la IA que se usó para generarla (ej. Version-ChatGPT, Version-Claude).

¿Por qué dos? Cada IA tiene su "estilo" de programar y diseñar. Te recomiendo entrar en una, probarla, y luego hacer lo mismo con la otra para ver cuál te gusta más o cuál funciona mejor.

Importante: Tenes que entrar en una de ellas antes de ejecutar los comandos de instalación.

Paso 4:Instalación y ejecución
Repite estos pasos dentro de la carpeta que elijas:

Entrar a la carpeta específica:

cd nombre-de-la-carpeta-ia

Instalar dependencias

npm install

Correr el juego:

npm run dev

Abrir el navegador: La terminal te dirá algo como Local: http://localhost:5173/. Hace clic ahí y listo

 Solución de errores comunes (Si algo falla)
"npm no se reconoce como un comando": Node.js no se instaló bien o no reiniciaste la terminal. Revisa el Paso 1.

"Cualquier error que mencione 'Module not found'": Te saltaste el paso npm install. Ejecútalo dentro de la carpeta del juego.

Pantalla en blanco al abrir el link: Abre la consola del navegador (tecla F12) y mira si hay letras rojas. A veces es solo un problema de una imagen que falta o una ruta mal escrita.

Puerto ocupado: Si intentas correr las dos carpetas al mismo tiempo, la segunda te pedirá usar un puerto distinto (ej. 5174). Dile que sí (escribe y y presiona Enter).
