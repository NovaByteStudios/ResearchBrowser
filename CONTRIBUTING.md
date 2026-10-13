# Mitwirken am Research Browser

Vielen Dank für das Interesse am Research Browser.

Research Browser ist ein öffentlich einsehbares Source-Available-Projekt. Beiträge zum offiziellen Projekt sind willkommen. Die öffentliche Verteilung eigener oder veränderter Research-Browser-Versionen ist jedoch nicht erlaubt.

Für den Quellcode gelten die Bedingungen aus `LICENSE.md`.

## Möglichkeiten zur Mitwirkung

Du kannst das Projekt unterstützen durch:

- verständliche Fehlerberichte,
- Vorschläge für neue Funktionen,
- Verbesserungsvorschläge für die Bedienung,
- Korrekturen an der Dokumentation,
- getestete Fehlerbehebungen,
- Pull Requests für das offizielle Projekt,
- verantwortungsvolle Sicherheitsmeldungen,
- Tests auf unterschiedlichen Macs und macOS-Versionen.

## Fehler melden

Für normale Fehler darf ein öffentliches GitHub-Issue erstellt werden.

Ein guter Fehlerbericht sollte möglichst enthalten:

- verwendete Research-Browser-Version,
- verwendete macOS-Version,
- Mac-Prozessor oder Architektur, falls bekannt,
- genaue Schritte bis zum Fehler,
- erwartetes Verhalten,
- tatsächlich beobachtetes Verhalten,
- vollständige Fehlermeldung,
- Screenshot, falls keine vertraulichen Daten sichtbar sind,
- Information, ob der Fehler nach einem Neustart weiterhin auftritt.

Bitte prüfe vor dem Erstellen eines neuen Issues, ob der Fehler bereits gemeldet wurde.

## Keine vertraulichen Daten veröffentlichen

Veröffentliche in Issues, Discussions oder Pull Requests niemals:

- Passwörter,
- API-Schlüssel,
- Cookies,
- Anmeldedaten,
- Sitzungsschlüssel,
- private Notizen,
- vertrauliche Quellen,
- vollständige Browserprofile,
- persönliche Rechercheunterlagen,
- private Kontaktdaten anderer Personen.

Screenshots und Protokolle müssen vor dem Hochladen auf vertrauliche Informationen geprüft werden.

## Sicherheitsprobleme

Sicherheitsprobleme dürfen nicht als öffentliches Issue veröffentlicht werden.

Verwende stattdessen die in `SECURITY.md` beschriebenen vertraulichen Meldewege.

## Änderungen am Code vorbereiten

Vor einer Änderung solltest du:

1. die aktuelle Version des Projekts verwenden,
2. die vorhandene Dokumentation lesen,
3. prüfen, ob bereits ein passendes Issue existiert,
4. die Anwendung vor der Änderung testen,
5. eine Sicherung des funktionierenden Standes erstellen.

## Forks

Ein GitHub-Fork ist erlaubt, wenn dieser hauptsächlich zur Vorbereitung eines Beitrags für das offizielle Research-Browser-Projekt verwendet wird.

Ein Fork darf nicht:

- als eigene Research-Browser-Version veröffentlicht werden,
- als unabhängiges Produkt beworben werden,
- eigene Releases oder fertige App-Pakete anbieten,
- unter einem anderen Produktnamen weitergeführt werden,
- verkauft oder kostenpflichtig angeboten werden,
- als öffentlich bereitgestellter Konkurrenzdienst verwendet werden.

Die genauen Bedingungen befinden sich in `LICENSE.md`.

## Pull Requests

Änderungen sollen möglichst über einen Pull Request an das offizielle Repository geschickt werden.

Ein Pull Request sollte:

- nur ein klar abgegrenztes Problem oder Feature behandeln,
- einen verständlichen Titel besitzen,
- die Änderung kurz erklären,
- beschreiben, wie die Änderung getestet wurde,
- keine persönlichen Dateien oder lokalen App-Daten enthalten,
- keine unnötigen Änderungen an fremden Dateien enthalten,
- keine neuen Abhängigkeiten ohne Begründung hinzufügen,
- vorhandene Funktionen nicht unbeabsichtigt entfernen.

## Pull-Request-Beschreibung

Eine Pull-Request-Beschreibung sollte möglichst diesem Aufbau folgen:

### Beschreibung

Was wurde geändert?

### Grund

Warum ist die Änderung notwendig oder nützlich?

### Test

Wie wurde die Änderung geprüft?

### Betroffene Bereiche

Welche Dateien oder Funktionen sind betroffen?

### Screenshots

Screenshots können ergänzt werden, wenn eine sichtbare Änderung vorgenommen wurde.

## Entwicklungsprinzipien

Bei Änderungen am Research Browser gelten folgende Grundsätze:

- Die Anwendung soll nach jedem Entwicklungsschritt startfähig bleiben.
- Vor größeren Änderungen soll ein Git-Commit erstellt werden.
- Bestehende Funktionen dürfen nicht ohne Begründung entfernt werden.
- Workspaces müssen weiterhin voneinander getrennt bleiben.
- Quellen, Notizen und Tags dürfen nicht versehentlich zwischen Workspaces vermischt werden.
- Die Benutzeroberfläche darf keinen direkten unkontrollierten Node.js-Zugriff erhalten.
- IPC-Schnittstellen sollen so klein und eindeutig wie möglich bleiben.
- Neue Eingaben müssen geprüft und sicher als Text dargestellt werden.
- Persönliche App-Daten dürfen nicht in Git gespeichert werden.
- Neue Funktionen sollen verständlich dokumentiert werden.

## Versionsnummern

Research Browser verwendet Versionsnummern nach dem Schema:

`MAJOR.MINOR.PATCH`

Beispiele:

- `0.10.1`
- `0.10.2`
- `0.10.3`

Dabei gilt:

- `MAJOR`: große inkompatible Änderung,
- `MINOR`: neue größere Funktion,
- `PATCH`: kleinere Funktion, Verbesserung oder Fehlerbehebung.

Version `1.0.0` soll die erste stabile und grundsätzlich veröffentlichungsfähige Hauptversion darstellen.

Entwicklungsstände können in Commit-Nachrichten zusätzlich mit `-dev` gekennzeichnet werden. Ein solcher Stand ist noch keine fertige Veröffentlichung.

## Commit-Nachrichten

Commit-Nachrichten des offiziellen Projekts verwenden dieses Format:

`VERSION - Änderung`

Beispiele:

- `0.10.1 - Notizen mit Quellen verknüpft`
- `0.10.2 - Tags für Notizen hinzugefügt`
- `0.10.3 - Tags für Quellen hinzugefügt`

Vor einem offiziellen Commit wird zuerst `CHANGELOG.md` aktualisiert.

## Changelog

Neue Funktionen, wichtige Verbesserungen und Fehlerbehebungen müssen in `CHANGELOG.md` dokumentiert werden.

Die Einträge werden einer passenden Version zugeordnet und nach Kategorien wie diesen gegliedert:

- Hinzugefügt
- Verbessert
- Behoben
- Entfernt
- Sicherheit

## Tests

Vor dem Einreichen eines Pull Requests sollten mindestens folgende Prüfungen durchgeführt werden:

1. Anwendung mit `npm start` starten.
2. Workspace öffnen.
3. vorhandene Tabs wiederherstellen.
4. neuen Tab erstellen.
5. Webseite öffnen.
6. Workspace wechseln und zurückwechseln.
7. Quellen öffnen und speichern.
8. Notizen öffnen und speichern.
9. Tags prüfen, falls betroffen.
10. Anwendung vollständig beenden und neu starten.

Für geänderte JavaScript-Dateien sollte zusätzlich eine Syntaxprüfung durchgeführt werden.

Beispiel:

`node --check src/renderer.js`

Der Dateiname wird entsprechend der geänderten Datei angepasst.

## Abhängigkeiten

Neue npm-Abhängigkeiten dürfen nur hinzugefügt werden, wenn diese wirklich notwendig sind.

Bei einer neuen Abhängigkeit müssen mindestens geprüft werden:

- Zweck der Abhängigkeit,
- aktuelle Wartung,
- Lizenz,
- Sicherheitslage,
- Paketgröße,
- Auswirkungen auf das fertige App-Paket.

Neue Abhängigkeiten müssen in `package.json`, `package-lock.json` und gegebenenfalls `THIRD_PARTY_NOTICES.md` berücksichtigt werden.

## Beiträge und Nutzungsrechte

Mit dem Einreichen eines Beitrags bestätigst du:

- dass du den Beitrag selbst erstellt hast oder zur Einreichung berechtigt bist,
- dass der Beitrag keine Rechte Dritter verletzt,
- dass der Projektinhaber den Beitrag prüfen, verändern, ablehnen und als Bestandteil des Research Browsers verwenden darf,
- dass der Beitrag unter den Bedingungen der Research Browser Source-Available License veröffentlicht werden darf.

Das Einreichen eines Beitrags garantiert nicht, dass der Beitrag übernommen wird.

## Verhalten im Projekt

Beiträge und Diskussionen sollen sachlich, respektvoll und auf das Projekt bezogen bleiben.

Nicht akzeptiert werden:

- Beleidigungen,
- Drohungen,
- Belästigung,
- Veröffentlichung privater Informationen,
- absichtliche Schadsoftware,
- absichtlich irreführende Fehlerberichte,
- Spam,
- Beiträge, die gegen geltendes Recht oder die Projektlizenz verstoßen.

## Fragen

Allgemeine Fragen können über die dafür vorgesehenen GitHub-Bereiche gestellt werden.

Sicherheitsfragen müssen über die in `SECURITY.md` beschriebenen vertraulichen Wege gestellt werden.