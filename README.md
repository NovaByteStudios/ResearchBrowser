# Research Browser

**Research Browser** ist eine Desktop-Anwendung für strukturierte Recherchen. Die Anwendung verbindet einen echten, auf Chromium basierenden Webbrowser mit getrennten Workspaces, gespeicherten Browser-Tabs und späteren Werkzeugen für Quellen, Notizen, Timelines und KI-gestützte Auswertungen.

Das Projekt wird mit Electron und Visual Studio Code entwickelt. Der aktuelle Schwerpunkt liegt auf einem stabilen Browser-Grundgerüst und der technischen Trennung der Workspaces.

> **Entwicklungsstatus:** Frühe Entwicklungsversion. Research Browser ist noch nicht für den produktiven Einsatz oder die Weitergabe an andere Personen bereit.

## Projektidee

Normale Webbrowser verwalten Tabs, Verlauf und Lesezeichen meist global. Research Browser verfolgt einen anderen Ansatz: Jede Recherche findet in einem eigenen Workspace statt.

Beispiele für Workspaces:

- 🔎 Fall Recherche
- 🎓 Schule
- 📰 Nachrichten
- 📷 Fotografie

Beim Öffnen eines Workspaces arbeitet die Person ausschließlich in diesem Recherchebereich. Tabs und weitere Daten sollen automatisch dem aktiven Workspace zugeordnet werden, ohne dass bei jedem Speichervorgang ein Ziel ausgewählt werden muss.

## Aktueller Funktionsumfang

Die folgenden Funktionen sind bereits grundsätzlich umgesetzt:

### Desktop-Anwendung

- Start als echte Electron-Desktop-App auf macOS
- Chromium als Browser-Engine
- Entwicklung mit Visual Studio Code
- dunkle, eigenständige Benutzeroberfläche
- native macOS-Menüs und Tastenkürzel

### Browser

- Webseiten laden
- Eingabe von vollständigen Webadressen
- automatische Ergänzung von `https://` bei erkannten Domains
- Suche über Google bei normalen Suchbegriffen
- Zurück, Vorwärts und Neu laden
- mehrere echte Browser-Tabs
- neue Tabs erstellen
- Tabs wechseln
- Tabs schließen
- automatische Seitentitel in der Tab-Leiste
- sichtbare Ladeanimation

### Tastenkürzel

- `Cmd + T`: neuer Tab
- `Cmd + W`: aktiven Tab schließen
- `Cmd + L`: Adressleiste auswählen
- `Cmd + R`: aktive Webseite neu laden
- `Cmd + Z`: Texteingabe rückgängig machen
- `Cmd + Shift + Z`: rückgängig gemachte Texteingabe wiederholen

### Workspaces

- Workspace-Auswahl beim App-Start
- neue Workspaces erstellen
- Workspaces lokal speichern
- aktiven Workspace in der Seitenleiste anzeigen
- zur Workspace-Auswahl zurückkehren
- geöffnete Tabs pro Workspace speichern
- Tabs beim erneuten Öffnen eines Workspaces wiederherstellen
- zuletzt aktiven Tab eines Workspaces merken
- getrennte Chromium-Sitzungen pro Workspace

Durch die getrennten Chromium-Sitzungen besitzt jeder Workspace eigene:

- Cookies
- Website-Anmeldungen
- Website-Speicherdaten
- Cache-Daten
- Service Worker

Tabs innerhalb desselben Workspaces teilen sich eine Sitzung. Verschiedene Workspaces verwenden voneinander getrennte Sitzungen.

## Noch nicht umgesetzt

Die folgenden Bereiche sind geplant, aber noch nicht vollständig entwickelt:

- Browserverlauf pro Workspace
- Lesezeichen
- Downloadverwaltung
- Find-in-Page
- Zoomsteuerung
- angeheftete Tabs
- Tabs duplizieren
- mehrere Fenster
- Split View
- Quellenverwaltung
- Notizsystem mit Markdown
- Tags und Quellenverknüpfungen
- PDFs und Screenshots
- Personen, Unternehmen und Orte
- Timeline
- visuelles Research Board
- Google-Drive-Synchronisierung
- Ollama-KI
- App-Paket für die normale macOS-Installation
- automatische Updates
- umfangreiche Tests und Fehlerbehandlung

## Technische Grundlage

### Electron

Electron stellt das Desktop-Fenster bereit und verbindet die Benutzeroberfläche mit Chromium und Node.js.

### Chromium

Jeder Browser-Tab verwendet eine eigene `WebContentsView`. Dadurch können mehrere echte Webseiten gleichzeitig geöffnet und getrennt verwaltet werden.

### HTML, CSS und JavaScript

Die Benutzeroberfläche wird zunächst ohne zusätzliches Frontend-Framework entwickelt. Dadurch bleibt das Projekt für Einsteiger besser nachvollziehbar.

### Lokale Speicherung

Workspace-Namen werden derzeit lokal gespeichert. Tab-Zustände werden in einer JSON-Datei im benutzerspezifischen App-Datenordner abgelegt.

Auf macOS liegt diese Datei während der Entwicklung ungefähr hier:

```text
~/Library/Application Support/research-browser/workspace-data.json
```

Der Pfad wird von Electron automatisch für die jeweilige Person und das jeweilige Betriebssystem bestimmt. Es ist kein fest eingetragener Benutzerpfad im Programmcode vorhanden.

### SQLite

SQLite ist für eine spätere Entwicklungsphase vorgesehen. Die Datenbank soll langfristig unter anderem Quellen, Notizen, Ereignisse, Personen, Unternehmen, Orte und Verknüpfungen verwalten.

### Ollama

Die geplanten KI-Funktionen sollen lokal über Ollama ausgeführt werden. Ein externer API-Schlüssel ist dafür nicht erforderlich. Die KI soll möglichst nur mit den Daten des aktuell geöffneten Workspaces arbeiten.

### Google Drive

Google Drive soll später als optionale Synchronisierungs- und Backup-Lösung integriert werden. Die lokale Arbeit soll weiterhin ohne Internetverbindung möglich bleiben.

## Datenschutz und Datentrennung

Research Browser ist als lokale Anwendung geplant.

Aktuell gilt:

- Workspace-Daten werden lokal auf dem jeweiligen Computer gespeichert.
- Andere Installationen erhalten nicht automatisch dieselben Workspaces oder Recherchedaten.
- Persönliche Workspace-Daten befinden sich nicht im Git-Repository.
- GitHub enthält nur den Programmcode und die Projektdokumentation.
- Jeder Betriebssystembenutzer erhält einen eigenen App-Datenordner.
- Chromium-Sitzungen werden pro Workspace getrennt.

Eine spätere Google-Drive-Verbindung soll optional sein. Vor einer Veröffentlichung benötigt das Projekt zusätzlich ein vollständiges Datenschutz-, Berechtigungs- und Sicherheitskonzept.

## Projektstruktur

```text
ResearchBrowser/
├── assets/
│   └── icons/
│       ├── delete.svg
│       ├── more.svg
│       ├── rename.svg
│       ├── workspace-add.svg
│       └── workspace.svg
├── docs/
├── src/
│   ├── index.html
│   ├── main.js
│   ├── preload.js
│   ├── renderer.js
│   ├── styles.css
│   ├── workspace.html
│   ├── workspace.css
│   ├── workspace.js
│   └── workspace-storage.js
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

### Wichtige Dateien

- `src/main.js`: Hauptprozess, Fenster, Tabs, Workspaces, WebContentsViews und IPC-Kommunikation
- `src/preload.js`: sichere Schnittstelle zwischen Oberfläche und Hauptprozess
- `src/renderer.js`: Bedienung der Browseroberfläche
- `src/index.html`: Struktur der Browseroberfläche
- `src/styles.css`: Gestaltung der Browseroberfläche
- `src/workspace.html`: Struktur der Workspace-Auswahl
- `src/workspace.css`: Gestaltung der Workspace-Auswahl
- `src/workspace.js`: Bedienung und lokale Liste der Workspaces
- `src/workspace-storage.js`: Speicherung und Wiederherstellung der Tabs pro Workspace

## Anwendung in der Entwicklung starten

### Voraussetzungen

- macOS
- Node.js
- npm
- Visual Studio Code
- Git

### Installation

Nach dem Herunterladen oder Klonen des Projekts müssen die Abhängigkeiten installiert werden:

```bash
npm install
```

### Start

```bash
npm start
```

Research Browser öffnet anschließend die Workspace-Auswahl in einem Electron-Fenster.

## Entwicklungsphasen

### Phase 1: Electron-Grundgerüst

- Desktop-Fenster
- Chromium
- zuverlässiger App-Start

### Phase 2: Browser-Grundfunktionen

- Navigation
- Adressleiste
- Suche
- Tabs
- Ladeanzeige
- Tastenkürzel

### Phase 3: Workspace-System

- Workspace-Auswahl
- Workspace-Erstellung
- getrennte Tabs
- persistente Tab-Zustände
- getrennte Chromium-Sitzungen

### Phase 4: Persistente Anwendungsdaten

- robustere Speicherung
- Datenmigrationen
- automatische Sicherungen
- Vorbereitung auf SQLite

### Phase 5: Quellenverwaltung

- Webseiten als Quellen speichern
- Titel, URL und Website erfassen
- Autor und Veröffentlichungsdatum erkennen, sofern verfügbar
- Abrufdatum
- Notizen und Tags
- Prüfstatus
- Screenshot oder Vorschau

Geplante Statuswerte:

- Ungeprüft
- In Prüfung
- Bestätigt
- Unsicher
- Widerlegt
- Wichtig

### Phase 6: Notizen

- neue Notizen
- Bearbeiten und Löschen
- automatische Speicherung
- Markdown
- Tags
- Quellenverknüpfungen
- Suche

### Phase 7: Timeline

- Ereignisse mit Datum
- Beschreibungen
- Quellen
- Personen
- Unternehmen
- Orte
- Notizen

### Phase 8: Research Board

- Quellen, Notizen und Rechercheobjekte als Karten
- visuelle Verbindungen
- frei anordenbare Rechercheansicht

### Phase 9: Google Drive

- optionale Verbindung
- Backups
- Dokumente, PDFs und Screenshots
- Offline-Arbeit
- spätere Synchronisierung

### Phase 10: Ollama-KI

Mögliche Funktionen:

- Webseiten zusammenfassen
- PDFs zusammenfassen
- Notizen analysieren
- Quellen vergleichen
- Widersprüche erkennen
- Personen, Unternehmen und Orte erkennen
- Timeline-Vorschläge erzeugen
- Fragen zu gespeicherten Quellen beantworten
- weitere Recherchefragen vorschlagen

### Phase 11: Feinschliff und Veröffentlichung

- Design und Bedienbarkeit
- Performance
- Barrierefreiheit
- Fehlerseiten
- Tests
- macOS-App-Paket
- Signierung
- Update-System

## Versionsverwaltung

Das Projekt verwendet Git und GitHub.

Wichtige Entwicklungsstände werden mit eindeutigen Versionsnummern gesichert:

```text
v0.1.0  Erstes funktionierendes Electron-Fenster
v0.2.0  Browser-Oberfläche und Startseite
v0.3.0  Erste echte Browser-Navigation
v0.3.1  Ladeanimation für Webseiten
v0.4.0  Echte Browser-Tabs
v0.4.1  Tab-Verhalten und Mac-Tastenkürzel
v0.5.0  Workspace-Auswahl und lokale Speicherung
v0.5.1  Workspace-Wechsel und Tab-Erstellung repariert
v0.6.0  Tabs getrennt pro Workspace speichern
v0.6.1  Browsersitzungen pro Workspace trennen
v0.7.0  Workspace-Verwaltung mit Umbenennen und Löschen erweitern
v0.7.1  Workspace-Übersicht mit Tabanzahl, Hervorhebung und reparierten Symbolen verbessern
```

Die vollständige Versionshistorie wird ab jetzt in `CHANGELOG.md` gepflegt.

## Entwicklungsprinzipien

- Nach jeder Phase bleibt die App startfähig.
- Große Funktionen werden in kleine, testbare Schritte aufgeteilt.
- Vor riskanten Änderungen wird ein Git-Commit erstellt.
- Workspace-Daten werden strikt getrennt.
- Die Benutzeroberfläche erhält keinen direkten, unkontrollierten Node.js-Zugriff.
- Persönliche Daten werden nicht in Git gespeichert.
- Zukünftige Cloud- und KI-Funktionen werden über eigene Services angebunden.
- Der Code soll ausführlich und für Menschen ohne Programmiererfahrung erklärt werden.
- Erklärende Kommentare sollen in Visual Studio Code ein- und ausgeblendet werden können, ohne eine zweite Codeversion zu pflegen.

## Bekannte Einschränkungen

- Die Anwendung befindet sich in einer frühen Entwicklungsphase.
- Manche Webseiten können zusätzliche Sicherheitsabfragen anzeigen.
- Google kann gelegentlich eine Roboterprüfung verlangen.
- Einzelne Chromium-Netzwerkwarnungen können im Terminal erscheinen, obwohl die Hauptseite korrekt lädt.
- Der Zustand innerhalb einer Webseite, beispielsweise Scrollpositionen oder nicht abgesendete Formulare, wird noch nicht wiederhergestellt.
- Die Speicherstruktur verwendet derzeit teilweise JSON und Browser-Local-Storage statt der später vorgesehenen SQLite-Datenbank.

## Mitwirkung

Das Projekt wird derzeit schrittweise entwickelt und ist noch nicht für externe Beiträge vorbereitet. Vor einer öffentlichen Zusammenarbeit werden Entwicklungsrichtlinien, Tests und ein Issue-System ergänzt.

## Lizenz

Die endgültige Lizenz des Projekts wurde noch nicht festgelegt. Bis zur Entscheidung sollte der Code nicht ohne Erlaubnis weiterveröffentlicht oder als eigenes Produkt angeboten werden.

## Autor

**Felix Michel**
