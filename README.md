# 📊 DISTRITO 6 - Gestión de Campaña 2026

**Aplicación web profesional para gestión de participantes y actividades de campaña electoral**

![Status](https://img.shields.io/badge/status-active-success)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Descripción

Sistema integral de gestión para la campaña electoral "Equipo Marcelo Zenteno - Primero Tarija 2026" en el Distrito 6 Municipal de Tarija. 

La aplicación permite:
- ✅ Gestionar participantes y su asistencia a actividades
- ✅ Registrar y editar actividades de campaña
- ✅ Visualizar estadísticas en tiempo real
- ✅ Generar carnés en PDF para cada participante
- ✅ Subir fotos de perfil
- ✅ Compartir enlaces a redes sociales
- ✅ Control de acceso con dos tipos de usuarios

## 🚀 Características Principales

### 👤 Usuarios

**Usuario Regular** (user / 123)
- Visualizar dashboard con estadísticas
- Ver listado de participantes
- Consultar detalles de cada participante
- Descargar carné en PDF
- Ver historia de participación

**Administrador** (admin / password)
- Todo lo del usuario regular, más:
- Crear, editar y eliminar participantes
- Crear, editar y eliminar actividades
- Subir 2 fotos por participante
- Agregar enlaces de redes sociales
- Importar datos desde Excel
- Control total del sistema

### 📊 Dashboard
- Estadísticas globales de campaña
- Top 5 participantes más activos
- Gráficos de distribución de participación
- Actualización en tiempo real

### 👥 Gestión de Participantes
- CRUD completo con validaciones
- Búsqueda y filtrado avanzado
- Ordenamiento por nombre o asistencia
- Visualización con avatares personalizados

### 📅 Actividades
- Registro de eventos y actividades
- Fecha y descripción
- Enlaces a redes sociales (Facebook, TikTok)
- Importación desde Excel

### 🎫 Carnés en PDF
- Diseño profesional tipo carnet
- Foto de perfil personalizable
- Datos del participante
- Total de asistencias
- Descarga en alta calidad

## 🛠️ Tecnologías Utilizadas

- **React 18** - Framework UI
- **Tailwind CSS** - Estilos y responsive
- **Lucide React** - Iconografía
- **html2pdf.js** - Generación de PDF
- **XLSX** - Importación/exportación de Excel
- **IndexedDB** - Base de datos local
- **LocalStorage** - Persistencia de datos

## 📋 Instalación

### Requisitos Previos
- Node.js (v16 o superior)
- npm o yarn

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/tuusuario/campaign-district-6.git
cd campaign-district-6
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Iniciar en desarrollo**
```bash
npm start
```

La aplicación se abrirá en `http://localhost:3000`

4. **Compilar para producción**
```bash
npm run build
```

## 🚀 Deploy en GitHub Pages

1. **Actualizar `package.json`** con tu usuario:
```json
"homepage": "https://tuusuario.github.io/campaign-district-6"
```

2. **Instalar gh-pages**
```bash
npm install --save-dev gh-pages
```

3. **Agregar scripts** a `package.json`:
```json
"scripts": {
  "deploy": "npm run build && gh-pages -d build"
}
```

4. **Hacer deploy**
```bash
npm run deploy
```

5. **Habilitar GitHub Pages**
   - Ve a Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Folder: / (root)
   - Save

Tu aplicación estará disponible en: `https://tuusuario.github.io/campaign-district-6`

## 📱 Uso

### Primera vez
1. **Login** con credenciales de prueba
2. **Admin** carga el Excel original con `Importar`
3. Sistema procesa automáticamente participantes y actividades

### Flujo Regular
1. Dashboard muestra estadísticas generales
2. Participantes → listar, buscar, ver detalles
3. Admin Panel → crear, editar, eliminar
4. Generar PDF de cada participante

### Agregar Documentos Externos
En `InfoPage.jsx`, reemplaza los `#` con tus URLs:

```javascript
// Ejemplo:
{
  title: 'Informe Campaña',
  url: 'https://drive.google.com/file/d/...'
}
```

## 📊 Estructura de Datos

### Persona
```javascript
{
  id: "person_001",
  fullName: "Kevin Flores",
  phone: "69309970",
  attendances: 28,
  profilePhotos: ["base64_image_1", "base64_image_2"],
  mediaLinks: ["https://facebook.com/..."],
  attendances_detail: {
    "activity_1": true,
    "activity_2": false
  }
}
```

### Actividad
```javascript
{
  id: "activity_001",
  name: "Rastrillaje Barrio Centro",
  date: "2026-03-15",
  mediaLink: "https://tiktok.com/..."
}
```

## 🎨 Colores Corporativos

- **Verde Oscuro**: `#0B5C3B` (Equipo Marcelo Zenteno)
- **Rojo**: `#E30613` (PRIMERO TARIJA)
- **Rosa**: `#E8316E` (Acentos)
- **Blanco**: Fondo

## 📖 Funcionalidades Avanzadas

### Importar Excel
- Carga automática de participantes
- Detección de actividades
- Cálculo de asistencias
- Validación de datos

### Generar PDF
- Diseño carnet profesional
- Selección de foto
- Datos completos del participante
- Alta calidad

### Búsqueda Avanzada
- Filtrar por nombre
- Filtrar por teléfono
- Ordenar por asistencias
- Ordenar alfabético

## 🔐 Seguridad

- ⚠️ **Nota**: Las credenciales están codificadas. Para producción, usar autenticación real.
- Datos almacenados en localStorage del navegador
- No se envían a servidor alguno
- Disponible offline después de primera carga

## 🐛 Troubleshooting

**El PDF no se descarga**
- Verificar que html2pdf.js esté cargado
- Revisar consola del navegador (F12)

**Excel no importa correctamente**
- Verificar formato de archivo
- Confirmar que tiene la estructura esperada

**Fotos no se guardan**
- Revisar tamaño del archivo
- Limpiar localStorage si está lleno

## 📝 Guía de Configuración

### Agregar Enlaces a Redes Sociales

**En InfoPage.jsx:**
```javascript
{
  title: 'Facebook Campaña',
  url: 'https://facebook.com/tu-pagina'
},
{
  title: 'TikTok Campaña',
  url: 'https://tiktok.com/@tu-usuario'
}
```

### Agregar Documentos Externos

**En InfoPage.jsx:**
```javascript
{
  title: 'Informe Campaña',
  url: 'https://dropbox.com/s/.../INFORME.docx'
}
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/mejora`)
3. Commit cambios (`git commit -am 'Agrega mejora'`)
4. Push a la rama (`git push origin feature/mejora`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo `LICENSE` para más detalles.

## 👨‍💻 Desarrollado por

**Sistemas Koffy's**

> "Transformando ideas en soluciones digitales"

## 📞 Contacto

- **Email**: info@sistemaskoffy.com
- **Teléfono**: +591 XXXXXXXXX
- **Web**: https://sistemaskoffy.com

## 🎉 Agradecimientos

- Equipo Marcelo Zenteno
- Alianza PRIMERO TARIJA
- Johnny Torres - Candidato Alcalde
- Todos los participantes y voluntarios

---

**Versión**: 1.0.0  
**Última actualización**: Marzo 2026  
**Estado**: ✅ Activo y funcional
