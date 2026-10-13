# Research Browser

Research Browser ist eine workspacebasierte Desktop-Anwendung für strukturierte Online-Recherche. Die Anwendung verbindet einen integrierten Browser mit getrennten Arbeitsbereichen, dauerhafter Tab-Speicherung, Quellenverwaltung und Notizen.

**Aktueller Entwicklungsstand:** Version `0.10.2`

## Ziel des Projekts

Bei umfangreichen Recherchen verteilen sich Webseiten, Quellen und Notizen schnell auf viele Browser-Tabs und verschiedene Programme. Research Browser bündelt diese Inhalte in getrennten Workspaces.

Jeder Workspace besitzt eigene:

- geöffnete Browser-Tabs
- Chromium-Sitzung mit getrennten Cookies und Website-Daten
- gespeicherte Quellen
- Notizen
- Verknüpfungen zwischen Notizen und Quellen
- Notiz-Tags

Alle derzeit unterstützten Anwendungsdaten werden lokal gespeichert.

## Aktueller Funktionsumfang

### Desktop-Anwendung

- eigenständige Electron-Anwendung
- Start über `npm start`
- Browserfenster mit eigener Titelleiste und Seitenleiste
- interne Ansichten für Browser, Quellen und Notizen
- responsive Oberfläche für unterschiedliche Fenstergrößen

### Browser

- Webseiten über URL oder Suchbegriff öffnen
- mehrere Tabs erstellen, wechseln und schließen
- aktive URL und Seitentitel anzeigen
- Navigation vorwärts und zurück
- Webseite neu laden
- neue Tabs über die Oberfläche oder Tastenkürzel öffnen
- gespeicherte Quellen wieder im Browser öffnen

### Tastenkürzel

- `Cmd/Ctrl + T`: neuen Tab öffnen
- `Cmd/Ctrl + W`: aktiven Tab schließen
- `Cmd/Ctrl + L`: Adressleiste fokussieren
- `Cmd/Ctrl + R`: aktive Webseite neu laden
- `Escape`: geöffneten Notizeditor schließen

### Workspaces

- neue Workspaces erstellen
- vorhandene Workspaces öffnen
- Workspaces umbenennen
- Workspaces über ein Drei-Punkte-Menü verwalten
- Workspaces samt zugehöriger lokaler Daten löschen
- zuletzt verwendete Workspaces anzeigen
- Anzahl gespeicherter Tabs anzeigen
- geöffnete Tabs pro Workspace speichern
- Tabs nach Workspace-Wechsel und App-Neustart wiederherstellen
- zuletzt aktiven Tab wieder auswählen
- Cookies, Anmeldungen, Cache und Website-Speicher durch eigene Chromium-Partitionen trennen

### Quellenverwaltung

- aktuelle Webseite als Quelle speichern
- Quellen dauerhaft und getrennt pro Workspace speichern
- Titel, Domain, URL und Speicherzeitpunkt anzeigen
- doppelte Speicherung derselben URL innerhalb eines Workspace verhindern
- gespeicherte Quellen wieder im Browser öffnen
- Quellen nach Sicherheitsabfrage löschen
- aus einer Quellenkarte direkt eine neue Notiz erstellen
- zugehörige Quelle im Notizeditor automatisch vorauswählen
- Quellen beim Löschen eines Workspace mit entfernen

### Notizverwaltung

- Notizen dauerhaft und getrennt pro Workspace speichern
- neue Notizen erstellen
- vorhandene Notizen bearbeiten
- Notizen nach Sicherheitsabfrage löschen
- Titel und Inhalt auf Notizkarten anzeigen
- Bearbeitungszeitpunkt anzeigen
- Notizen optional mit gespeicherten Quellen verknüpfen
- verknüpfte Quelle auf der Notizkarte anzeigen
- verknüpfte Quelle direkt im Browser öffnen
- Quellenverknüpfung bearbeiten oder entfernen
- bestehende Notizen ohne Quellenverknüpfung weiterhin laden

### Tags für Notizen

- mehrere Tags über eine kommagetrennte Eingabe erfassen
- Tags beim Erstellen und Bearbeiten einer Notiz speichern
- vorhandene Tags beim Bearbeiten erneut anzeigen
- Tags als Chips auf Notizkarten darstellen
- leere Tags automatisch entfernen
- überflüssige Leerzeichen bereinigen
- doppelte Tags unabhängig von Groß- und Kleinschreibung verhindern
- bestehende Notizen ohne Tags weiterhin laden

## Lokale Datenspeicherung

Research Browser speichert die Anwendungsdaten im Electron-Ordner `userData`. Die Speicherdateien werden beim ersten Bedarf automatisch angelegt.

- `workspace-data.json`: geöffnete Tabs und aktiver Tab je Workspace
- `source-data.json`: gespeicherte Quellen je Workspace
- `note-data.json`: gespeicherte Notizen, Quellenverknüpfungen und Tags je Workspace

Die JSON-Dateien gehören nicht in das Git-Repository, da sie persönliche lokale Anwendungsdaten enthalten.

## Datenschutz und Datentrennung

- Workspace-Daten werden lokal gespeichert.
- Jeder Workspace verwendet eine eigene persistente Chromium-Partition.
- Cookies und Website-Sitzungen verschiedener Workspaces bleiben getrennt.
- Notizen und Quellen werden anhand der Workspace-ID getrennt gespeichert.
- Beim Löschen eines Workspace werden die zugehörigen gespeicherten Tabs, Quellen und Notizen entfernt.
- Research Browser besitzt derzeit keine Cloud-Synchronisierung.

## Projektstruktur

```text
research-browser/
├── src/
│   ├── index.html
│   ├── main.js
│   ├── note-storage.js
│   ├── preload.js
│   ├── renderer.js
│   ├── source-storage.js
│   ├── styles.css
│   ├── tag-utils.js
│   ├── workspace-storage.js
│   ├── workspace.css
│   ├── workspace.html
│   └── workspace.js
├── CHANGELOG.md
├── README.md
├── package-lock.json
└── package.json
```

## Beschreibung der wichtigsten Dateien

### Hauptanwendung

- `src/main.js`: Electron-Hauptprozess, Fensterverwaltung, Browser-Tabs, WebContentsViews, Workspace-Wechsel und IPC-Handler
- `src/preload.js`: sichere Schnittstelle zwischen Renderer und Electron-Hauptprozess
- `src/renderer.js`: Benutzeroberfläche der Browser-, Quellen- und Notizansicht

### Browseroberfläche

- `src/index.html`: Struktur der Hauptoberfläche, internen Ansichten und Formulare
- `src/styles.css`: Gestaltung der Browseroberfläche, Quellenkarten, Notizkarten und Tag-Chips

### Workspace-Auswahl

- `src/workspace.html`: Struktur der Workspace-Auswahl
- `src/workspace.js`: Erstellen, Anzeigen, Umbenennen, Öffnen und Löschen von Workspaces
- `src/workspace.css`: Gestaltung der Workspace-Auswahl und Workspace-Karten

### Lokale Speicherbausteine

- `src/workspace-storage.js`: Speicherung und Wiederherstellung der geöffneten Tabs je Workspace
- `src/source-storage.js`: Speicherung, Laden und Löschen von Quellen je Workspace
- `src/note-storage.js`: Speicherung, Bearbeitung und Löschung von Notizen je Workspace
- `src/tag-utils.js`: gemeinsame Bereinigung und Normalisierung von Tags

### Projektdateien

- `package.json`: Projektinformationen, Version, Startskript und Electron-Abhängigkeit
- `package-lock.json`: festgeschriebene Versionen der installierten npm-Pakete
- `CHANGELOG.md`: dokumentierte Änderungen aller Versionen
- `README.md`: Projektübersicht, Funktionen, Struktur und Entwicklungsinformationen

## Technische Grundlage

- Electron
- Chromium
- Node.js
- HTML
- CSS
- JavaScript
- JSON-Dateien für die lokale Anwendungsspeicherung
- Electron IPC für die Kommunikation zwischen Renderer und Hauptprozess

## Anwendung lokal starten

### Voraussetzungen

- Node.js
- npm
- Git für die Versionsverwaltung

### Installation

Repository klonen oder den Projektordner öffnen und anschließend im Hauptverzeichnis ausführen:

```bash
npm install
```

### Start

```bash
npm start
```

Das Startskript führt `electron .` aus. Der Einstiegspunkt ist `src/main.js`.

## Entwicklung und Tests

Vor einem Commit sollten mindestens folgende Prüfungen durchgeführt werden:

### JavaScript-Syntax prüfen

```bash
node --check src/main.js
node --check src/preload.js
node --check src/renderer.js
node --check src/workspace.js
node --check src/workspace-storage.js
node --check src/source-storage.js
node --check src/note-storage.js
node --check src/tag-utils.js
```

Bei einer erfolgreichen Syntaxprüfung gibt Node.js normalerweise keine Meldung aus.

### Manuelle Funktionstests

- Workspace erstellen, umbenennen, öffnen und löschen
- mehrere Tabs öffnen und zwischen ihnen wechseln
- App vollständig beenden und Tabs nach dem Neustart prüfen
- Quelle speichern, öffnen und löschen
- doppelte Quelle im selben Workspace speichern
- Notiz erstellen, bearbeiten und löschen
- Notiz mit einer Quelle verknüpfen und die Quelle öffnen
- Notiz direkt aus einer Quellenkarte erstellen
- Tags erstellen, bearbeiten und vollständig entfernen
- doppelte Tags mit unterschiedlicher Groß- und Kleinschreibung testen
- Daten in mindestens zwei Workspaces auf korrekte Trennung prüfen

## Versionsverwaltung

Das Projekt verwendet semantische Versionsnummern im Format:

```text
MAJOR.MINOR.PATCH
```

Beispiele:

- `0.10.1`: Notizen mit Quellen verknüpft
- `0.10.2`: Tags für Notizen hinzugefügt

Vor jedem Commit gilt:

1. Änderungen vollständig testen.
2. `CHANGELOG.md` aktualisieren.
3. Versionsangaben bei Bedarf in `package.json` und `package-lock.json` aktualisieren.
4. Änderungen über die Quellcodeverwaltung in Visual Studio Code committen.

Commit-Nachrichten verwenden dieses Format:

```text
0.0.0 - Kurze Beschreibung der Änderung
```

## Nächste geplante Schritte

- Tags für gespeicherte Quellen
- Quellen und Notizen nach Tags filtern
- Quellen und Notizen durchsuchen
- Prüfstatus und Bewertung für Quellen
- verbesserte Sortiermöglichkeiten
- Datenexport und Datensicherung
- weitere Rechercheansichten wie Timeline oder Research Board

## Aktuelle Grenzen

- keine Cloud-Synchronisierung
- keine Zusammenarbeit mit mehreren Personen
- keine automatische Quellenbewertung
- keine vollständige Volltextsuche
- keine Tags für Quellen
- kein Datenexport
- keine Installationspakete für die Veröffentlichung

## Lizenz

Das Projekt verwendet laut `package.json` derzeit die Lizenz `ISC`.

## Autor

Felix Michel (Entwickelt und veröffentlicht unter dem Projektnamen **NovaByte Studios**.)
