# 🏥 API Health Check - GitHub Actions

Este proyecto incluye un sistema automatizado de health checks para monitorear la disponibilidad de la API usando GitHub Actions.

## 📋 Configuración Implementada

### 🤖 Workflows Automáticos

#### 1. Health Check Automático (`health-check.yml`)

-   **Frecuencia**: Cada 10 minutos
-   **Endpoint**: Configurable via secrets/variables
-   **Características**:
    -   Retry automático (2 intentos)
    -   Timeout de 30 segundos
    -   Logs detallados
    -   Resumen en GitHub UI
    -   Soporte para staging y production

#### 2. Health Check Manual (`manual-health-check.yml`)

-   **Ejecución**: Manual desde GitHub UI
-   **Parámetros configurables**:
    -   URL personalizada
    -   Timeout personalizado
    -   Número de reintentos
-   **Uso**: Debugging y pruebas puntuales

### 🔧 Scripts Adicionales

#### `scripts/health-check.js`

Script Node.js avanzado con:

-   Manejo de timeouts
-   Retry logic personalizable
-   Parsing de respuestas JSON
-   Métricas detalladas

## ⚙️ Configuración Requerida

### 1. Secrets de GitHub (Recomendado)

Ve a: `Settings > Secrets and variables > Actions`

**Secrets requeridos:**

```
HEALTH_CHECK_URL=https://tu-api.com/api/health
```

**Variables opcionales:**

```
STAGING_HEALTH_CHECK_URL=https://staging-api.com/api/health
```

### 2. URLs por Defecto

Si no configuras secrets, usa:

-   **Production**: `https://tu-api.com/api/health`
-   **Staging**: No configurado

## 🚀 Cómo Usar

### Ejecución Automática

-   Se ejecuta automáticamente cada 10 minutos
-   Ve los resultados en: `Actions > API Health Check`

### Ejecución Manual

1. Ve a `Actions > Manual Health Check`
2. Clic en "Run workflow"
3. Configura parámetros (opcional)
4. Clic en "Run workflow"

### Ver Resultados

-   **Logs detallados**: En cada job de GitHub Actions
-   **Resumen**: En la pestaña "Summary" de cada run
-   **Estado**: ✅ Success, ⚠️ Warning, ❌ Error

## 📊 Métricas Monitoreadas

-   **HTTP Status Code**: 200, 4xx, 5xx
-   **Response Time**: Tiempo de respuesta en segundos
-   **Availability**: Uptime/downtime
-   **Error Rate**: Fallos vs éxitos

## 🔔 Notificaciones

### Configuradas

-   Logs en GitHub Actions
-   Resúmenes automáticos
-   Template de issues para fallos

### Opcionales (para implementar)

-   Slack notifications
-   Discord webhooks
-   Email alerts
-   Custom webhooks

## 🛠️ Troubleshooting

### Health Check Falla

1. Verifica la URL en secrets
2. Revisa logs del workflow
3. Prueba ejecución manual
4. Verifica que la API esté disponible

### Configurar Notificaciones

```yaml
# Ejemplo para Slack
- name: Notify Slack
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
      status: failure
      webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 📁 Archivos Creados

```
.github/
├── workflows/
│   ├── health-check.yml          # Cron automático
│   └── manual-health-check.yml   # Ejecución manual
└── ISSUE_TEMPLATE/
    └── api-health-issue.md       # Template para reportar fallos

scripts/
└── health-check.js               # Script Node.js avanzado

README-HEALTH-CHECK.md            # Esta documentación
```

## 🎯 Próximos Pasos

1. **Configurar secrets** en GitHub
2. **Probar ejecución manual** para verificar
3. **Personalizar notificaciones** según necesidades
4. **Ajustar frecuencia** si es necesario

## 📈 Mejoras Futuras

-   Dashboard de métricas
-   Alertas inteligentes
-   Health checks de múltiples endpoints
-   Integración con servicios de monitoreo
-   Métricas de performance histórica
