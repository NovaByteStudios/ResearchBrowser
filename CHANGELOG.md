# Changelog

Alle wichtigen Änderungen am Research Browser werden in dieser Datei dokumentiert.

Das Projekt verwendet Versionsnummern nach dem Schema `MAJOR.MINOR.PATCH`.

## [Unveröffentlicht]

### Geplant
- Notizen und Tags für gespeicherte Quellen ergänzen.
- Prüfstatus für Quellen hinzufügen.
- Quellen durchsuchen und filtern.
## 0.10.1 – 05.10.2026

### Hinzugefügt
- Notizen können optional mit gespeicherten Quellen verknüpft werden
- Verknüpfte Quellen werden auf Notizkarten angezeigt
- Verknüpfte Quellen können direkt aus einer Notiz geöffnet werden
- Quellenkarten besitzen die neue Aktion „Notiz erstellen“
- Beim Erstellen einer Notiz aus einer Quelle wird die Quelle automatisch vorausgewählt

### Verbessert
- Quellenverknüpfungen können beim Bearbeiten geändert oder entfernt werden
- Notizeditor lädt die Quellen des aktuellen Workspaces
- Responsive Darstellung der Quelleninformationen auf Notizkarten
- Bestehende Notizen ohne Quellenverknüpfung bleiben kompatibel

### Verhalten
- Wird eine verknüpfte Quelle gelöscht, bleibt die Notiz erhalten
- Eine nicht mehr vorhandene Quelle wird auf der Notizkarte als nicht verfügbar gekennzeichnet

## 0.10.0 – 04.10.2026

### Hinzugefügt
- Vollständiger Notizenbereich im Research Browser
- Neue Notizen können erstellt und gespeichert werden
- Gespeicherte Notizen werden als Karten angezeigt
- Notizen können bearbeitet und gelöscht werden
- Notizen werden getrennt nach Workspace gespeichert
- Notizen bleiben nach einem Neustart erhalten

### Verbessert
- Interne Navigation unterstützt jetzt den Notizenbereich
- Browseransicht wird beim Öffnen von Notizen korrekt ausgeblendet
- Notizeditor kann über Abbrechen, Schließen und Escape verlassen werden
- Responsive Darstellung des Notizenbereichs

### Behoben
- Notizen wurden nach dem Speichern nicht angezeigt
- Schnittstelle zwischen Renderer, Preload und Notizspeicher wurde vereinheitlicht
- Fehlerhafte und unvollständige Renderer- und CSS-Dateien wurden korrigiert

## [0.9.0] - 2026-09-28

### Hinzugefügt
- Aktuelle Webseite kann als Quelle im aktiven Workspace gespeichert werden.
- Quellen werden dauerhaft und getrennt pro Workspace gespeichert.
- Gespeicherte Quellen werden mit Titel, Domain, URL und Speicherzeitpunkt angezeigt.
- Gespeicherte Quellen können wieder im Browser geöffnet werden.
- Gespeicherte Quellen können nach einer Sicherheitsabfrage gelöscht werden.
- Doppelte Speicherung derselben URL innerhalb eines Workspace wird verhindert.
- Lokalen Quellenspeicher in `source-data.json` hinzugefügt.
- Beim Löschen eines Workspace werden auch dessen gespeicherte Quellen entfernt.

### Verbessert
- Quellenansicht zeigt automatisch entweder den leeren Ausgangszustand oder die gespeicherten Quellen an.
- Quellen bleiben nach einem vollständigen Neustart der Anwendung erhalten.
- Quellen verschiedener Workspaces bleiben voneinander getrennt.
- Nach dem Öffnen einer gespeicherten Quelle wird automatisch zur Browseransicht zurückgekehrt.
- Schaltfläche „Quelle speichern“ zeigt den laufenden Speichervorgang an.
- Drei-Punkte-Menü der Workspace-Karten vollständig gestaltet und wieder sichtbar gemacht.

### Behoben
- Fehlende Darstellung des Drei-Punkte-Menüs in der Workspace-Auswahl behoben.
- Workspace-Daten werden beim Löschen jetzt vollständig einschließlich gespeicherter Quellen entfernt.
- Bekannten Darstellungsfehler des Workspace-Menüs behoben, der im Entwicklungsstand `0.9.0-dev` noch vorhanden war.

## [0.8.0] - 2026-09-26

### Hinzugefügt
- Eigene Quellenansicht in der Browseroberfläche hinzugefügt.
- Leeren Ausgangszustand für Workspaces ohne gespeicherte Quellen ergänzt.
- Schaltfläche zur Rückkehr in die Browseransicht hinzugefügt.
- Gespeicherte Tabanzahl in der Workspace-Auswahl mit dem Workspace-Speicher verbunden.
- Getrennte Chromium-Sitzungen beim Erstellen neuer Workspace-Tabs aktiviert.

### Verbessert
- Wechsel zwischen Browser- und Quellenansicht ermöglicht.
- Aktiven Bereich in der Seitenleiste optisch hervorgehoben.
- Geöffnete Webseite beim Anzeigen der Quellenansicht ausgeblendet.
- Geöffneten Browser-Tab beim Wechsel der Ansicht beibehalten.
- Browseransicht kann über die Seitenleiste oder die Zurück-Schaltfläche wiederhergestellt werden.
- Interne Ansicht wird beim Öffnen und Verlassen eines Workspaces zurückgesetzt.
- Geöffnete Tabs werden beim Verlassen eines Workspace automatisch gespeichert.
- Gespeicherte Tabs werden beim erneuten Öffnen des Workspace automatisch wiederhergestellt.
- Zuletzt aktiver Tab eines Workspace wird wieder ausgewählt.
- Tabs werden auch beim vollständigen Beenden der Anwendung gespeichert.
- Websites, Cookies, Anmeldungen, Cache und Website-Speicher bleiben zwischen Workspaces getrennt.

### Behoben
- Fehlende Verbindung zwischen dem Hauptprozess und dem Workspace-Speicher hergestellt.
- Fehlenden IPC-Handler für die gespeicherte Tabanzahl ergänzt.
- Verlust geöffneter Websites beim Verlassen eines Workspace behoben.
- Verlust geöffneter Websites nach einem vollständigen App-Neustart behoben.

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
