# Changelog

Alle wichtigen Änderungen am Research Browser werden in dieser Datei dokumentiert.

Das Projekt verwendet Versionsnummern nach dem Schema `MAJOR.MINOR.PATCH`.

## [Unveröffentlicht]

### Hinzugefügt
- Grundstruktur der Quellenansicht in der Browseroberfläche vorbereitet.
- Eindeutige Steuerelemente für das spätere Öffnen und Schließen der Quellenansicht ergänzt.
- Leerer Ausgangszustand und Container für gespeicherte Quellen angelegt.

### Geplant
- Umschalten zwischen Browser- und Quellenansicht.
- Aktuelle Webseite als Quelle im aktiven Workspace speichern.
- Quellen pro Workspace getrennt verwalten, öffnen und löschen.

## [0.7.1] - 2026-09-20

### Hinzugefügt
- Tatsächliche Anzahl gespeicherter Tabs in der Workspace-Auswahl angezeigt.
- Sprachlich korrekte Anzeige für keinen, einen oder mehrere Tabs ergänzt.
- Zuletzt geöffneten Workspace gekennzeichnet und optisch hervorgehoben.

### Behoben
- SVG-Symbole für Workspace, neuen Workspace und das Aktionsmenü wiederhergestellt.
- Symbole für Umbenennen und Löschen im Workspace-Menü repariert.

## [0.7.0]

### Hinzugefügt
- Aktionsmenü für vorhandene Workspaces ergänzt.
- Workspaces können umbenannt werden.
- Workspaces können nach einer Sicherheitsabfrage gelöscht werden.
- Eigene SVG-Symbole für Workspace-Aktionen eingeführt.

## [0.6.1]

### Hinzugefügt
- Getrennte Chromium-Sitzungen pro Workspace eingerichtet.
- Cookies, Anmeldungen, Cache, Website-Speicher und Service Worker werden nach Workspace getrennt.

## [0.6.0]

### Hinzugefügt
- Geöffnete Tabs werden pro Workspace gespeichert.
- Tabs werden beim erneuten Öffnen eines Workspaces wiederhergestellt.
- Zuletzt aktiver Tab eines Workspaces wird gespeichert.

## [0.5.1]

### Behoben
- Workspace-Wechsel stabilisiert.
- Erstellung neuer Tabs nach einem Workspace-Wechsel repariert.

## [0.5.0]

### Hinzugefügt
- Workspace-Auswahl beim App-Start eingeführt.
- Neue Workspaces können erstellt und lokal gespeichert werden.
- Aktiver Workspace wird in der Browser-Seitenleiste angezeigt.
- Rückkehr zur Workspace-Auswahl ergänzt.

## [0.4.1]

### Hinzugefügt
- macOS-Tastenkürzel für Tabs, Adressleiste und Neuladen ergänzt.

### Verbessert
- Verhalten beim Wechseln und Schließen von Tabs verbessert.

## [0.4.0]

### Hinzugefügt
- Mehrere echte Browser-Tabs umgesetzt.
- Tabs können erstellt, gewechselt und geschlossen werden.
- Seitentitel werden automatisch in der Tab-Leiste angezeigt.

## [0.3.1]

### Hinzugefügt
- Sichtbare Ladeanimation für Webseiten ergänzt.

## [0.3.0]

### Hinzugefügt
- Echte Browser-Navigation mit Chromium-Webinhalten umgesetzt.
- Zurück, Vorwärts und Neu laden ergänzt.
- Adress- und Suchleiste funktionsfähig gemacht.

## [0.2.0]

### Hinzugefügt
- Browseroberfläche mit Tab-Leiste, Navigation, Seitenleiste und Startseite erstellt.
- Dunkles Erscheinungsbild eingeführt.

## [0.1.0]

### Hinzugefügt
- Erstes funktionierendes Electron-Fenster erstellt.
- Grundlegenden Projektaufbau mit Electron, HTML, CSS und JavaScript angelegt.
