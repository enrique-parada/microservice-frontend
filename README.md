Frontend en **React + TypeScript** (Vite) para el proyecto **DevOps Text Toolkit**.

Esta SPA consume la API del backend (FastAPI en AWS Lambda + API Gateway) y permite:

- Analizar texto y ver métricas básicas.
- Evaluar la “fuerza” de una contraseña de forma sencilla.

El objetivo es tener un frontend **simple, claro** y que ejemplifique:

- Buenas prácticas básicas de React/TS.
- Integración con un backend serverless en AWS.
- CI/CD con GitHub Actions desplegando a S3 (static website).

---

## 🧱 Stack técnico

- **Framework:** React + TypeScript (Vite).
- **Estilo:** CSS simple (sin framework pesado).
- **Build tool:** Vite.
- **Linting:** ESLint (sin `any` permitidos).
- **CI/CD:** GitHub Actions → build + deploy a S3.
- **Infra del sitio:** S3 static website  
  (el bucket se crea desde Terraform en el repo `infra-terraform`).

---

## 🌐 Integración con el backend

El frontend consume la API del backend usando una variable de entorno:

- `VITE_API_URL` → URL base del API Gateway HTTP.

Ejemplo de valor (salida de Terraform en `infra-terraform/envs/dev`):

```bash
terraform output -raw api_url
# -> https://xxxxx.execute-api.us-east-1.amazonaws.com
```

En local, puedes crear un archivo `.env.local` o `.env` en la raíz:

```bash
VITE_API_URL=https://xxxxx.execute-api.us-east-1.amazonaws.com
```

El frontend asume que la API expone:

- `GET /health`
- `GET /info`
- `POST /analyze`
- `POST /analyze/password`

---

## 🗂️ Estructura del proyecto

```text
microservice-frontend/
├── src/
│   ├── App.tsx          # Componente principal: formulario y resultados
│   ├── main.tsx         # Punto de entrada de React
│   ├── api/             # (opcional) helpers de llamadas a la API
│   └── styles/          # Estilos básicos
├── public/
│   └── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .github/
    └── workflows/
        └── ci.yml       # Lint + build + deploy a S3
```

*(Ajusta los paths si tu estructura real es ligeramente distinta.)*

---

## 🚀 Cómo levantarlo en local

### 1. Prerrequisitos

- Node.js 18+ (o una versión LTS reciente).
- npm, pnpm o yarn (en ejemplos se usa npm).

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar la URL de la API

Crear un archivo `.env.local` en la raíz:

```bash
VITE_API_URL=https://xxxxx.execute-api.us-east-1.amazonaws.com
```

(O la URL que tengas como output `api_url` de Terraform.)

### 4. Ejecutar en modo desarrollo

```bash
npm run dev
```

Abrir en el navegador la URL que Vite indique (por defecto `http://localhost:5173`).

---

## 🧪 Scripts disponibles

En `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint . --max-warnings=0"
  }
}
```

Uso:

```bash
# Desarrollo
npm run dev

# Lint
npm run lint

# Build de producción
npm run build

# Vista previa del build
npm run preview
```

> Actualmente no se han definido pruebas unitarias automatizadas en el frontend.  
> La calidad se apoya en TypeScript + ESLint + pruebas manuales sobre el flujo principal.  
> En mejoras futuras se podría integrar Vitest + Testing Library.

---

## 🤖 CI/CD con GitHub Actions

El repo usa un workflow en `.github/workflows/ci.yml` que ejecuta, al menos:

1. `npm install`
2. `npm run lint`
3. `npm run build`
4. Deploy a S3 (static website) si los pasos anteriores pasan.

Variables/Secrets usados en GitHub Actions:

- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` → usuario IAM con permisos para subir al bucket del frontend.
- `AWS_REGION` → normalmente `us-east-1`.
- `FRONTEND_BUCKET_NAME` → nombre del bucket creado por Terraform (ej. `devops-text-toolkit-frontend-dev`).

El flujo típico es:

- Commit → push a `develop` o `main`.
- GitHub Actions corre lint + build.
- Si la rama/condición aplica para deploy:
  - Se sincroniza el contenido de `dist/` con el bucket S3 del frontend.

---

## 🔁 Estrategia de ramas (Git)

Este repo sigue la misma estrategia que el resto del proyecto:

- `main` → rama estable.
- `develop` → rama de integración.
- `feature/*` → ramas para nuevas funcionalidades o fixes (ej. `feature/frontend-ui`, `feature/frontend-api-url`).

Flujo típico:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nueva-feature-frontend

# cambios...

git push -u origin feature/nueva-feature-frontend
# abrir PR → develop
```

Los merges a `develop` y `main` se hacen solo con CI en verde.

---

## 📚 Más información

Este frontend forma parte del ecosistema **DevOps Text Toolkit**, junto con:

- Backend: [`microservice-api`](https://github.com/enrique-parada/microservice-api)  
  - Wiki backend: https://github.com/enrique-parada/microservice-api/wiki
- Infraestructura: [`infra-terraform`](https://github.com/enrique-parada/infra-terraform)  
  - Wiki infra: https://github.com/enrique-parada/infra-terraform/wiki

