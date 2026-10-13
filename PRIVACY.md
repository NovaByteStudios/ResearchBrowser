# Datenschutz bei Research Browser

Stand: 13. Oktober 2026

## 1. Allgemeines

Research Browser ist eine lokale Desktop-Anwendung zur Organisation von Recherchen.

Diese Datenschutzerklärung beschreibt, welche Daten Research Browser verarbeitet, wo diese Daten gespeichert werden und welche Daten nicht automatisch an den Projektinhaber übertragen werden.

Version 0.10.3 ist eine frühe Testversion. Research Browser darf nicht als einzige Ablage für wichtige, vertrauliche oder unersetzliche Informationen verwendet werden.

## 2. Verantwortlichkeit und Kontakt

Projekt: Research Browser

Projektinhaber: Felix Michel

Kontakt für Datenschutz- und Sicherheitsfragen:

`contact.novabytestudios@posteo.de`


## 3. Lokal gespeicherte Daten

Research Browser speichert seine Anwendungsdaten grundsätzlich lokal auf dem Computer der nutzenden Person.

Dazu können gehören:

- Workspaces und Workspace-Namen
- geöffnete Browser-Tabs
- URLs und Titel geöffneter Webseiten
- zuletzt aktiver Tab
- gespeicherte Quellen
- Titel, URL und Domain gespeicherter Quellen
- Speicherzeitpunkte von Quellen
- Notizen und deren Inhalte
- Verknüpfungen zwischen Quellen und Notizen
- Tags für Quellen und Notizen
- Cookies
- Website-Anmeldungen
- Cache-Daten
- Local Storage und IndexedDB von Webseiten
- Website-Berechtigungen
- weitere Chromium-Sitzungsdaten

Die Recherche- und Browserdaten werden in einem von Electron bereitgestellten Anwendungsordner auf dem jeweiligen Gerät gespeichert.

## 4. Trennung nach Workspaces

Research Browser trennt Tabs, Quellen, Notizen und Tags nach Workspaces.

Jeder Workspace verwendet außerdem eine eigene persistente Chromium-Sitzung. Dadurch werden unter anderem Cookies, Website-Anmeldungen, Cache und Website-Speicher verschiedener Workspaces voneinander getrennt.

Tabs innerhalb desselben Workspaces können dieselbe Browser-Sitzung verwenden.

## 5. Keine automatische Übertragung an den Projektinhaber

Research Browser besitzt in Version 0.10.3:

- keine eigene Benutzerregistrierung,
- keinen eigenen Cloud-Dienst,
- keine automatische Synchronisierung,
- keine Telemetrie,
- keine Nutzungsanalyse,
- keine Werbung,
- kein automatisches Fehlertracking,
- keine integrierte externe KI,
- keine automatische Übertragung von Workspaces, Quellen oder Notizen an den Projektinhaber.

Der Projektinhaber erhält die lokal gespeicherten Recherche- und Browserdaten nicht automatisch.

## 6. Kommunikation mit besuchten Webseiten

Research Browser basiert auf Electron und Chromium und kann Webseiten aus dem Internet laden.

Beim Aufrufen einer Webseite kommuniziert der Computer direkt mit den Servern der jeweiligen Website. Dabei können die Website und deren eingebundene Dienste beispielsweise folgende Daten verarbeiten:

- IP-Adresse
- Zeitpunkt des Aufrufs
- aufgerufene URL
- Browser- und Geräteinformationen
- Cookies
- Anmeldedaten
- Formulareingaben
- weitere von der Website verarbeitete Informationen

Für diese Verarbeitung gelten die Datenschutzbestimmungen der jeweiligen Website. Der Projektinhaber von Research Browser hat darauf grundsätzlich keinen Einfluss.

Research Browser verhindert nicht automatisch Tracking, Werbung oder andere Datenverarbeitungen durch besuchte Webseiten.

## 7. Gespeicherte Quellen

Beim Speichern einer Webseite als Quelle speichert Research Browser lokal unter anderem:

- den Seitentitel,
- die vollständige URL,
- die Domain,
- den Speicherzeitpunkt,
- zugehörige Tags,
- die ID des zugehörigen Workspaces.

Das Speichern einer Quelle überträgt diese Informationen nicht automatisch an den Projektinhaber.

## 8. Notizen und Tags

Notizen, Notizinhalte, Quellenverknüpfungen und Tags werden lokal gespeichert.

Nutzende Personen sind selbst dafür verantwortlich, welche Informationen in Notizen eingetragen werden. In der Testversion sollten keine besonders sensiblen personenbezogenen Daten oder vertraulichen Zugangsdaten in Notizen gespeichert werden.

## 9. Löschen von Daten

Einzelne Quellen und Notizen können innerhalb der Anwendung gelöscht werden.

Beim Löschen eines Workspace versucht Research Browser, die dazugehörigen Daten zu entfernen. Dazu gehören insbesondere:

- gespeicherte Tabs,
- gespeicherte Quellen,
- gespeicherte Notizen,
- Tags,
- Cookies,
- Cache,
- Authentifizierungsdaten,
- Website-Speicher der Workspace-Sitzung.

Technische Sicherungskopien des Betriebssystems oder des Dateisystems können gelöschte Daten gegebenenfalls weiterhin enthalten. Darauf hat Research Browser keinen unmittelbaren Einfluss.

## 10. Beta-Feedback und GitHub

Wenn Fehler oder Vorschläge über GitHub gemeldet werden, verarbeitet GitHub die dort eingegebenen Daten nach den eigenen Nutzungs- und Datenschutzbestimmungen.

Tester sollten keine Passwörter, Cookies, privaten Rechercheunterlagen, vollständigen Browserprofile oder andere vertrauliche Daten in öffentliche GitHub-Issues einfügen.

Screenshots und Protokolle sollten vor dem Hochladen auf persönliche oder vertrauliche Informationen geprüft werden.

## 11. Externe KI-Dienste

Version 0.10.3 enthält keine Verbindung zu Groq oder einem anderen externen KI-Dienst.

Falls später eine externe KI-Funktion ergänzt wird, muss diese Datenschutzerklärung vor der Veröffentlichung der entsprechenden Version aktualisiert werden.

Dabei muss insbesondere erklärt werden:

- welcher Anbieter verwendet wird,
- welche Inhalte an den Anbieter übertragen werden,
- zu welchem Zweck die Übertragung erfolgt,
- auf welcher Grundlage die Verarbeitung stattfindet,
- wie lange Daten gespeichert werden,
- wie die KI-Funktion deaktiviert werden kann.

## 12. Datensicherheit

Research Browser befindet sich in einer frühen Entwicklungsphase. Trotz getrennter Workspaces und lokaler Speicherung kann nicht garantiert werden, dass keine Fehler, Sicherheitsprobleme oder Datenverluste auftreten.

Nutzende Personen sollten:

- regelmäßig Sicherungskopien wichtiger Daten erstellen,
- die Anwendung nicht als Passwortmanager verwenden,
- keine unersetzlichen Daten ausschließlich in Research Browser speichern,
- vor dem Teilen von Fehlerberichten persönliche Informationen entfernen,
- neue Versionen zunächst mit unwichtigen Testdaten ausprobieren.

## 13. Änderungen dieser Datenschutzerklärung

Diese Datenschutzerklärung kann angepasst werden, wenn neue Funktionen hinzukommen oder sich die Datenverarbeitung ändert.

Die jeweils aktuelle Fassung wird zusammen mit dem Research-Browser-Projekt veröffentlicht.

Wesentliche Änderungen werden im Changelog dokumentiert.
