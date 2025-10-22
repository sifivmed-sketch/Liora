# Station Store - Sistema de Gestión de ID de Estación

Este sistema maneja automáticamente la obtención y persistencia del ID único de la estación donde se ejecuta la aplicación.

## Características

- **Persistencia automática**: El ID se guarda en localStorage y se restaura automáticamente
- **Generación automática**: Si no existe un ID, se genera uno nuevo llamando al endpoint `GenerarIdEstación`
- **Store global**: Disponible en toda la aplicación a través de Zustand
- **Middleware integrado**: Se ejecuta automáticamente en cada navegación
- **Manejo de errores**: Gestión robusta de errores y estados de carga

## Flujo de Funcionamiento

1. **Al cargar cualquier página**: El middleware se ejecuta automáticamente
2. **Middleware**: Agrega headers indicando que se necesita el station ID
3. **Layout Global**: El `StationProvider` se ejecuta automáticamente en todas las páginas
4. **Inicialización**: El Provider inicializa automáticamente el station ID
5. **Verificación del store**: Se verifica si ya existe un ID en el store de Zustand
6. **Verificación de localStorage**: Si no hay ID en el store, se busca en localStorage
7. **Generación de nuevo ID**: Si no existe en ningún lugar, se llama al endpoint `GenerarIdEstación`
8. **Persistencia**: El nuevo ID se guarda tanto en el store como en localStorage

## Uso

### Uso Básico (Solo Lectura)

```typescript
import { useStationId } from '@/lib/stores/station.store';

const MyComponent = () => {
  // El station ID se inicializa automáticamente por el StationProvider
  const stationId = useStationId();
  
  return (
    <div>
      {stationId && <p>ID de estación: {stationId}</p>}
    </div>
  );
};
```

### Uso Avanzado (Con Control)

```typescript
import { useStationInitializer } from '@/hooks/useStationInitializer';

const MyComponent = () => {
  const { 
    stationId, 
    isLoading, 
    error, 
    hasStationId,
    refreshStationId,
    resetStationId 
  } = useStationInitializer();

  return (
    <div>
      {isLoading && <p>Cargando ID de estación...</p>}
      {error && <p>Error: {error}</p>}
      {hasStationId && <p>ID de estación: {stationId}</p>}
      <button onClick={refreshStationId}>Refrescar ID</button>
    </div>
  );
};
```

### Hooks Específicos

```typescript
import { useStationId, useStationLoading, useStationError } from '@/lib/stores/station.store';

const MyComponent = () => {
  const stationId = useStationId();
  const isLoading = useStationLoading();
  const error = useStationError();

  // Usar los valores...
};
```

### Acceso Directo al Store

```typescript
import { useStationStore } from '@/lib/stores/station.store';

const MyComponent = () => {
  const { idUnico, initializeStationId, clearStationId } = useStationStore();

  const handleRefresh = () => {
    initializeStationId();
  };

  const handleClear = () => {
    clearStationId();
  };

  return (
    <div>
      <p>ID actual: {idUnico}</p>
      <button onClick={handleRefresh}>Refrescar ID</button>
      <button onClick={handleClear}>Limpiar ID</button>
    </div>
  );
};
```

## Configuración

### Variables de Entorno

Asegúrate de tener configurada la variable de entorno:

```env
NEXT_PUBLIC_API_URL=https://tu-api.com
```

### Endpoint de la API

El sistema espera que el endpoint `GenerarIdEstación` esté disponible en:

```
GET {API_BASE_URL}/General/GenerarIdEstacion
```

**Parámetros opcionales (query parameters):**
- `userAgent`: User agent del navegador
- `timestamp`: Timestamp de la solicitud
- `location`: Información de ubicación

**Ejemplo de URL completa:**
```
GET {API_BASE_URL}/General/GenerarIdEstacion?userAgent=Mozilla/5.0&timestamp=1234567890
```

Y que devuelva una respuesta con el formato:

```json
{
  "idUnico": "string"
}
```

**Nota:** El endpoint solo devuelve el campo `idUnico`, no incluye campos de estado como `success` o `message`.

## Archivos del Sistema

- `src/lib/stores/station.store.ts` - Store principal de Zustand
- `src/lib/api/station.api.ts` - Funciones de API para manejo del ID
- `src/hooks/useStationInitializer.ts` - Hook principal para inicialización
- `src/hooks/useStationMiddleware.ts` - Hook para detectar señales del middleware
- `src/components/providers/StationProvider.tsx` - Provider que inicializa automáticamente
- `src/middleware.ts` - Middleware de Next.js que señala cuando se necesita el ID

## Integración

El sistema está integrado automáticamente en el layout principal (`src/app/layout.tsx`) a través del `StationProvider`. El station ID se inicializa automáticamente en **cualquier página** sin necesidad de agregar nada manualmente a los componentes.

## Manejo de Errores

El sistema maneja automáticamente:

- Errores de red al llamar a la API
- Errores de localStorage (permisos, espacio, etc.)
- IDs inválidos o corruptos
- Estados de carga y timeout

En caso de error, el sistema continuará funcionando y el usuario podrá intentar refrescar el ID manualmente.
