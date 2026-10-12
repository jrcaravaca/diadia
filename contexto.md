# Documentación de Contexto - Día a Día

> **Documento generado para registrar la arquitectura, funcionamiento, estado actual y componentes de la aplicación "Día a Día".**

---

## 1. Resumen y Propósito General

**"Día a Día"** es una aplicación web de gestión y agenda digital escolar diseñada principalmente para centros de educación infantil y guarderías.

Su objetivo principal es facilitar a los docentes y educadores el seguimiento diario de los alumnos dentro de sus respectivas aulas, permitiendo:
1. **Control de aulas y alumnado**: Visualización por clases, creación y edición de fichas de alumnos.
2. **Registro de actividades diarias (diario escolar)**: Registro en tiempo real de comidas, siestas, visitas al baño, avisos generales y fotografías de la jornada.
3. **Gestión de personas autorizadas**: Control de recogida de menores con soporte para datos identificativos (DNI/NIE) y subida de fotografía del documento, limitado por seguridad a un máximo de 4 personas por alumno.
4. **Vinculación con familias**: Asignación de perfiles de familiares (padres/tutores) a cada alumno con mecanismos de confirmación para evitar fallos de privacidad y RGPD.
5. **Base para mensajería**: Estructura de base de datos preparada para comunicación interna entre usuarios (profesores y familias).

---

## 2. Arquitectura General y Stack Tecnológico

El proyecto está estructurado como un monorepo que separa claramente el backend y el frontend:

```
diadia/
├── backend/            # API REST en Python / Django
├── frontend/           # SPA en React / Vite
├── notas.txt           # Credenciales y usuarios de prueba
└── contexto.md         # Documento de contexto del sistema
```

### 2.1 Backend
- **Lenguaje**: Python
- **Framework Web**: Django 6.1.1
- **API REST**: Django REST Framework (DRF) 3.18.1
- **Base de Datos**: SQLite (`backend/db.sqlite3`)
- **Tratamiento de Imágenes**: Pillow 12.3.0
- **CORS**: `django-cors-headers` 4.9.0 (habilitado para `http://localhost:5173`)
- **Gestión de archivos multimedia**: Guardado en `backend/media/` para fotos diarias y DNIs autorizados.

### 2.2 Frontend
- **Framework / Bundler**: React 19 + Vite 8
- **Enrutamiento**: React Router v7 (`react-router-dom`)
- **Cliente HTTP**: Axios 1.20.0
- **Estilos y Diseño**: Tailwind CSS v4 (`@tailwindcss/postcss`) con fuentes de Google Fonts (*Quicksand* y *Be Vietnam Pro*).
- **Paleta de diseño definida**:
  - `dia-primary`: `#7CB3F8` (Azul pastel)
  - `dia-secondary`: `#FDFD96` (Amarillo suave)
  - `dia-tertiary`: `#B2F2E3` (Menta / Verde pastel)
  - `dia-neutral`: `#444444` (Gris texto oscuro)

---

## 3. Estructura de Datos y Modelos (Backend)

Ubicación principal: [backend/registros/models.py](file:///home/jose-ramon/Documentos/diadia/backend/registros/models.py)

### 3.1 Modelos Principales
1. **`PerfilProfesor`**:
   - `usuario` (OneToOne con `auth.User`): Cuenta de usuario Django.
   - `telefono` (CharField, opcional).
   - `turno` (CharField, ej: "Mañana", "Tarde").
2. **`PerfilFamiliar`**:
   - `usuario` (OneToOne con `auth.User`): Cuenta de acceso para los familiares.
   - `telefono` (CharField).
   - `direccion` (CharField, opcional).
   - `dni` (CharField, opcional).
3. **`Aula`**:
   - `nombre` (CharField): Nombre descriptivo (ej: Aula Bebés, Aula 2-3 años).
   - `profesor` (ForeignKey a `PerfilProfesor`, `null=True`, `on_delete=SET_NULL`).
4. **`Alumno`**:
   - `nombre` (CharField): Nombre y apellidos del alumno.
   - `aula` (ForeignKey a `Aula`, `on_delete=CASCADE`).
   - `familiares` (ManyToManyField a `PerfilFamiliar`, `blank=True`): Padres o tutores asignados.
   - *Relación inversa `autorizados`*: Colección de personas autorizadas a recoger al alumno.
   - *Relación inversa `registros`*: Lista de actividades registradas.
5. **`Registro`**:
   - `alumno` (ForeignKey a `Alumno`).
   - `tipo` (CharField, opciones: `COMIDA`, `SIESTA`, `BAÑO`, `FOTO`, `INFO`).
   - `descripcion` (TextField, notas y observaciones).
   - `foto` (ImageField, carpeta `fotos_diarias/`, opcional).
   - `fecha_hora` (DateTimeField, auto_now_add).
6. **`PersonaAutorizada`**:
   - `alumno` (ForeignKey a `Alumno`).
   - `nombre_completo` (CharField).
   - `dni` (CharField).
   - `foto_dni` (ImageField, carpeta `dnis_autorizados/`, opcional).
   - **Regla de negocio**: Validación en método `clean()` que restringe a un máximo de 4 personas autorizadas por alumno.
7. **`Mensaje`**:
   - `asunto` (CharField).
   - `remitente` (ForeignKey a `User`).
   - `destinatario` (ForeignKey a `User`).
   - `fecha_envio` (DateTimeField).
   - `leido` (BooleanField, default=False).

---

## 4. API Endpoints (Backend)

Ubicación: [backend/registros/urls.py](file:///home/jose-ramon/Documentos/diadia/backend/registros/urls.py) y [backend/registros/views.py](file:///home/jose-ramon/Documentos/diadia/backend/registros/views.py)

Prefijo base: `http://127.0.0.1:8000/api/`

| Endpoint | Método(s) | Descripción | Parámetros / Filtros |
| :--- | :--- | :--- | :--- |
| `/api/aulas/` | GET, POST, PUT, DELETE | CRUD de aulas. | Ninguno. |
| `/api/alumnos/` | GET, POST, PUT, DELETE | CRUD de alumnos. Incluye autorizados anidados. | `?aula=<id>`: filtra alumnos de un aula específica. |
| `/api/alumnos/<id>/` | GET, PUT, PATCH, DELETE | Consulta y actualización de datos de un alumno y sus familiares. | ID del alumno. |
| `/api/registros/` | GET, POST, DELETE | Creación y listado de actividades diarias. Admite `multipart/form-data`. | `?alumno=<id>`: devuelve **únicamente los registros del día actual** (`timezone.now().date()`) ordenados cronológicamente desc. |
| `/api/registros/<id>/` | DELETE | Elimina un registro diario específico. | ID del registro. |
| `/api/familiares/` | GET, POST, etc. | Listado de perfiles familiares (ID, username, email, DNI, teléfono). | Utilizado para vincular familiares en el desplegable. |
| `/api/autorizados/` | GET, POST, DELETE | CRUD de personas autorizadas. Valida el límite de 4 por alumno. | Admite subida de foto de DNI mediante `multipart/form-data`. |

---

## 5. Frontend: Vistas y Componentes

Ubicación principal: [frontend/src/](file:///home/jose-ramon/Documentos/diadia/frontend/src/)

### 5.1 Enrutamiento (`App.jsx`)
- **`/` (`VistaAulas`)**:
  - Consulta las aulas al backend.
  - Muestra tarjetas interactivas para cada aula.
  - Botón de acceso directo para crear nuevo alumno (`/nuevo-alumno`).
- **`/aula/:id` (`FichaAlumno`)**:
  - Obtiene los alumnos correspondientes al aula seleccionada (`/api/alumnos/?aula=:id`).
  - Renderiza una cuadrícula de tarjetas de alumno (`TarjetaAlumno`).
  - Controla el modal centralizado (`ModalRegistro`) para dar de alta actividades y fotos.
- **`/nuevo-alumno` (`RegistrarAlumno`)**:
  - Formulario con selector de aula y campo de texto para nombre y apellidos.
  - Ofrece dos modos de guardado: "Guardar" (redirige al inicio) y "Guardar y añadir otro" (limpia el formulario para registrar alumnos consecutivamente).
- **`/editar-alumno/:id` (`EditarAlumno`)**:
  - Carga y edita el nombre y el aula asignada.
  - Selector múltiple para asociar `PerfilFamiliar` con advertencia de seguridad/privacidad previa al envío (`window.confirm`).
  - Gestor de personas autorizadas: listado con borrado y formulario para añadir hasta un máximo de 4 con foto de DNI opcional.

### 5.2 Componentes UI Reutilizables
- **`Navbar`** (`components/ui/Navbar.jsx`): Encabezado superior con la marca "Día a Día" y el identificador de "Panel de Profesor".
- **`BotonAccion`** (`components/ui/BotonAccion.jsx`): Botones de interacción rápida para registrar Comida (🍽️), Siesta (🌙) o Baño (💧).
- **`ModalRegistro`** (`components/ui/ModalRegistro.jsx`): Ventana emergente flotante con campo de observaciones y selector de imagen para adjuntar al registro diario.
- **`TarjetaAlumno`** (`components/FichaAlumno/TarjetaAlumno.jsx`):
  - Avatar generado dinámicamente con la inicial del alumno.
  - Listado de personas autorizadas a la recogida.
  - Botones de acción rápida que abren el modal de registro.
  - Historial de actividad del día actual con desglose de tipo, hora, observaciones, foto subida y botón de borrado individual.

---

## 6. Datos de Prueba y Credenciales (`notas.txt`)

En la raíz se encuentra el archivo [notas.txt](file:///home/jose-ramon/Documentos/diadia/notas.txt) con usuarios de prueba para el entorno de desarrollo:

- **Familiar**:
  - Usuario: `carlos_alcantara`
  - Clave: `passwd123`
- **Profesora**:
  - Usuario: `LauraR`
  - Clave: `passwd123`
- **Administrador**:
  - Usuario: `admin`
  - Clave: `admin123`

---

## 7. Instrucciones para Ejecución Local

### Backend (Django)
```bash
# 1. Acceder al directorio backend
cd backend

# 2. Activar el entorno virtual
source .venv/bin/activate

# 3. Aplicar migraciones pendientes (si fuera necesario)
python manage.py migrate

# 4. Iniciar el servidor de desarrollo
python manage.py runserver
# Servidor disponible en http://127.0.0.1:8000
```

### Frontend (React + Vite)
```bash
# 1. Acceder al directorio frontend
cd frontend

# 2. Instalar dependencias si no están instaladas
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
# Aplicación disponible en http://localhost:5173
```

---


