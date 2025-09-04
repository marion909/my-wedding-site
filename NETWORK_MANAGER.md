# Network Manager

Ein umfassendes Netzwerk-Monitoring und Management-System für die My Wedding Site Anwendung.

## Übersicht

Der Network Manager bietet:
- **Echtzeit-Netzwerküberwachung** mit automatischer Online/Offline-Erkennung
- **Verbindungsqualität-Assessment** basierend auf der Network Information API
- **Automatische Retry-Mechanismen** bei Verbindungsfehlern
- **React Hooks** für einfache Integration in Komponenten
- **UI-Komponenten** für Statusanzeige
- **Health Check API** für Konnektivitätsprüfungen

## Architektur

### Kern-Komponenten

1. **NetworkManager Class** (`src/lib/network-manager.ts`)
   - Zentrale Klasse für Netzwerküberwachung
   - Event-basierte Architektur
   - Singleton Pattern für globale Instanz

2. **React Hooks** (`src/hooks/useNetworkManager.ts`)
   - `useNetworkManager()` - Vollständiger Zugriff auf Network Manager
   - `useOnlineStatus()` - Einfacher Online/Offline Status
   - `useConnectionQuality()` - Verbindungsqualitätsinformationen

3. **UI-Komponenten** (`src/components/NetworkStatusIndicator.tsx`)
   - `NetworkStatusIndicator` - Anpassbarer Status-Indikator
   - `OfflineBanner` - Banner für Offline-Benachrichtigungen
   - `NetworkStatusBadge` - Kompakter Status-Badge

4. **Health API** (`src/app/api/health/route.ts`)
   - Endpoint für Konnektivitätsprüfungen
   - Unterstützt GET und HEAD Requests
   - Cache-optimiert für häufige Anfragen

## Verwendung

### Basic Setup

```typescript
import { useNetworkManager } from '@/hooks/useNetworkManager'

function MyComponent() {
  const { isOnline, connectionQuality } = useNetworkManager()
  
  return (
    <div>
      Status: {isOnline ? 'Online' : 'Offline'}
      Qualität: {connectionQuality}
    </div>
  )
}
```

### Erweiterte Konfiguration

```typescript
const { status, checkConnection } = useNetworkManager({
  pingInterval: 30000,        // Prüfung alle 30 Sekunden
  retryAttempts: 3,          // 3 Wiederholungsversuche
  retryDelay: 2000,          // 2 Sekunden zwischen Versuchen
  onlineCallback: (status) => {
    console.log('Online:', status)
  },
  offlineCallback: (status) => {
    console.log('Offline:', status)
  }
})
```

### UI-Komponenten

```tsx
import { 
  NetworkStatusIndicator, 
  OfflineBanner, 
  NetworkStatusBadge 
} from '@/components/NetworkStatusIndicator'

// Vollständiger Status-Indikator
<NetworkStatusIndicator 
  position="top-right" 
  showDetails={true} 
  size="md" 
/>

// Offline-Banner
<OfflineBanner />

// Status-Badge
<NetworkStatusBadge />
```

## API Referenz

### NetworkManager Klasse

#### Konstruktor
```typescript
new NetworkManager(options?: NetworkManagerOptions)
```

#### Methoden
- `startMonitoring()` - Startet periodische Überwachung
- `stopMonitoring()` - Stoppt Überwachung
- `checkConnection()` - Manuelle Verbindungsprüfung
- `getStatus()` - Aktueller Netzwerkstatus
- `isOnline()` - Boolean Online-Status
- `getConnectionQuality()` - Verbindungsqualität
- `destroy()` - Cleanup und Event-Listener entfernen

#### Events
- `onlineCallback` - Wird ausgelöst wenn online
- `offlineCallback` - Wird ausgelöst wenn offline
- `statusChangeCallback` - Wird bei Statusänderungen ausgelöst

### NetworkStatus Interface

```typescript
interface NetworkStatus {
  isOnline: boolean
  connectionType: string | null
  downlink: number | null
  effectiveType: string | null
  lastOnline: Date | null
  lastOffline: Date | null
}
```

### Connection Quality Types

- `excellent` - 4G, sehr schnell
- `good` - 3G, gut
- `fair` - 2G, akzeptabel
- `poor` - Slow-2G, langsam
- `unknown` - Unbekannt

## Konfiguration

### Standard-Einstellungen

```typescript
{
  pingUrl: '/api/health',      // Health Check Endpoint
  pingInterval: 30000,         // 30 Sekunden
  retryAttempts: 3,           // 3 Versuche
  retryDelay: 2000,           // 2 Sekunden
  onlineCallback: () => {},
  offlineCallback: () => {},
  statusChangeCallback: () => {}
}
```

### Anpassung für Produktionsumgebung

```typescript
const networkManager = getNetworkManager({
  pingInterval: 60000,         // Weniger häufige Checks in Produktion
  retryAttempts: 5,           // Mehr Versuche für stabilere Verbindungen
  retryDelay: 3000,           // Längere Wartezeiten
  onlineCallback: (status) => {
    // Analytics oder Logging
    trackNetworkEvent('online', status)
  },
  offlineCallback: (status) => {
    // Benutzer-Benachrichtigungen
    showOfflineNotification()
  }
})
```

## Integration in die Anwendung

### Layout Integration

```tsx
// src/app/layout.tsx
import { OfflineBanner, NetworkStatusIndicator } from '@/components/NetworkStatusIndicator'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <OfflineBanner />
        {children}
        <NetworkStatusIndicator 
          position="bottom-right" 
          showOnlyOffline={true}
        />
      </body>
    </html>
  )
}
```

### Formular-Integration

```tsx
import { useOnlineStatus } from '@/hooks/useNetworkManager'

function ContactForm() {
  const isOnline = useOnlineStatus()
  
  return (
    <form>
      {/* Formularfelder */}
      <button 
        type="submit" 
        disabled={!isOnline}
        className={!isOnline ? 'opacity-50 cursor-not-allowed' : ''}
      >
        {isOnline ? 'Senden' : 'Offline - Bitte später versuchen'}
      </button>
    </form>
  )
}
```

## Browser-Kompatibilität

- **Online/Offline Events**: Alle modernen Browser
- **Network Information API**: Chrome, Edge, Firefox (teilweise)
- **Visibility API**: Alle modernen Browser
- **Fetch API**: Alle modernen Browser

## Leistung

- **Speicherverbrauch**: Minimal (~5KB gzipped)
- **CPU-Last**: Sehr gering, nur bei Events aktiv
- **Netzwerk-Overhead**: Minimale HEAD-Requests alle 30 Sekunden
- **Battery Impact**: Vernachlässigbar durch effiziente Event-Listener

## Debugging

### Entwicklungstools

```typescript
// Debug-Modus aktivieren
const networkManager = getNetworkManager({
  statusChangeCallback: (status) => {
    console.log('Network Status:', status)
  }
})

// Manuelle Tests
await networkManager.checkConnection()
console.log('Status:', networkManager.getStatus())
```

### Demo-Seite

Besuche `/network-manager` für eine interaktive Demo der Funktionalität.

## Erweiterungen

### Zukünftige Features

1. **Bandbreiten-Messung** - Aktive Geschwindigkeitstests
2. **Latenz-Monitoring** - RTT-Messungen
3. **Verbindungshistorie** - Langzeit-Analytik
4. **Adaptive Qualität** - Anpassung basierend auf Verbindung
5. **PWA-Integration** - Service Worker Synchronisation

### Custom Event Listener

```typescript
networkManager.updateCallbacks({
  statusChangeCallback: (status) => {
    // Custom Logik
    if (!status.isOnline) {
      // Offline-Modus aktivieren
      enableOfflineMode()
    } else {
      // Synchronisation starten
      syncOfflineData()
    }
  }
})
```

## Support

Bei Fragen oder Problemen mit dem Network Manager:

1. Prüfe die Browser-Konsole auf Fehlermeldungen
2. Teste die `/api/health` Endpoint direkt
3. Überprüfe Netzwerk-Berechtigungen
4. Kontaktiere das Entwicklerteam

---

**Hinweis**: Der Network Manager ist vollständig in die My Wedding Site integriert und bietet zuverlässige Netzwerküberwachung für eine bessere Benutzererfahrung.