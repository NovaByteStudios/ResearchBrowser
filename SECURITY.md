# Sicherheitsrichtlinie für Research Browser

Stand: 13. Oktober 2026

## Unterstützte Versionen

Research Browser befindet sich noch in einer frühen Entwicklungs- und Testphase.

| Version | Sicherheitsunterstützung |
|---|---|
| 0.10.3 | Unterstützt |
| Ältere Versionen | Nicht unterstützt |

Sicherheitskorrekturen werden derzeit grundsätzlich nur für die aktuelle veröffentlichte Version bereitgestellt.

Beta-Tester sollten immer die neueste verfügbare Version verwenden.

## Sicherheitsprobleme vertraulich melden

Bitte veröffentliche mögliche Sicherheitslücken nicht als öffentliches GitHub-Issue, nicht in GitHub Discussions und nicht als öffentlichen Pull Request.

Nutze stattdessen eine der folgenden Möglichkeiten:

1. GitHubs Funktion für private Sicherheitsmeldungen, falls diese im Repository aktiviert ist.
2. Eine Nachricht an die Projektadresse:

`contact.novabytestudios@posteo.de`

Vor der öffentlichen Veröffentlichung muss der Platzhalter durch eine erreichbare Projekt-E-Mail-Adresse ersetzt werden.

Es wird empfohlen, eine eigene Projekt-E-Mail-Adresse zu verwenden und nicht die private Hauptadresse des Projektinhabers.

## Welche Informationen ein Bericht enthalten sollte

Ein Sicherheitsbericht sollte möglichst folgende Angaben enthalten:

- betroffene Research-Browser-Version
- verwendete macOS-Version
- Mac-Prozessor beziehungsweise Architektur, wenn bekannt
- Beschreibung des Sicherheitsproblems
- genaue Schritte zum Nachstellen
- erwartetes Verhalten
- tatsächlich beobachtetes Verhalten
- mögliche Auswirkungen
- betroffene Dateien oder Funktionen
- Screenshots, falls diese keine vertraulichen Daten enthalten
- mögliche Lösungsideen, falls vorhanden

Bitte entferne vor dem Übermitteln sämtliche persönlichen oder vertraulichen Informationen.

Dazu gehören insbesondere:

- Passwörter
- API-Schlüssel
- Sitzungsschlüssel
- Cookies
- Anmeldedaten
- private Notizen
- vertrauliche Quellen
- persönliche Rechercheunterlagen
- vollständige Browserprofile
- personenbezogene Daten anderer Personen

## Besonders relevante Sicherheitsbereiche

Sicherheitsmeldungen sind insbesondere bei folgenden Problemen erwünscht:

- unberechtigter Zugriff auf Daten anderer Workspaces
- Vermischung von Cookies oder Website-Anmeldungen zwischen Workspaces
- Verlust oder Offenlegung von Quellen und Notizen
- Ausführung von unsicherem Code aus Webseiten
- unkontrollierter Zugriff der Benutzeroberfläche auf Node.js
- Umgehung der Preload- oder IPC-Sicherheitsgrenzen
- Offenlegung lokal gespeicherter Rechercheinformationen
- unsicheres Löschen von Workspace-Daten
- Speicherung von Geheimnissen im Quellcode
- manipulierte Importe oder Exporte
- unsichere externe Links oder Downloads

## Koordinierte Veröffentlichung

Bitte veröffentliche die Einzelheiten einer noch nicht behobenen Sicherheitslücke nicht öffentlich.

Der Projektinhaber versucht:

1. den Bericht zu bestätigen,
2. die Auswirkungen zu bewerten,
3. eine Korrektur zu entwickeln,
4. eine neue Version bereitzustellen,
5. anschließend eine verständliche Sicherheitsinformation zu veröffentlichen.

Da Research Browser derzeit als Freizeit- und Lernprojekt entwickelt wird, kann keine bestimmte Reaktions- oder Lösungszeit garantiert werden.

## Keine Belohnungen

Für Sicherheitsmeldungen besteht derzeit kein Bug-Bounty-Programm.

Es können keine finanziellen Belohnungen oder anderen Vergütungen garantiert werden.

Hilfreiche und verantwortungsvoll gemeldete Sicherheitsprobleme können nach vorheriger Absprache in den Versionshinweisen erwähnt werden.

## Sicherer Umgang mit der Testversion

Research Browser 0.10.3 ist eine frühe Testversion.

Beta-Tester sollten:

- nur unwichtige Testdaten verwenden,
- regelmäßig Sicherungskopien erstellen,
- keine Passwörter in Notizen speichern,
- keine API-Schlüssel im Programmcode hinterlegen,
- vertrauliche Recherchedaten nicht als einzige Kopie in Research Browser speichern,
- heruntergeladene Dateien vor dem Öffnen prüfen,
- neue Versionen möglichst zeitnah installieren.

## Abhängigkeiten und Drittsoftware

Research Browser verwendet unter anderem Electron, Chromium, Node.js und npm-Abhängigkeiten.

Sicherheitsprobleme können auch aus diesen Komponenten stammen. Solche Probleme werden nach Möglichkeit durch Aktualisierung der betroffenen Abhängigkeiten behoben.

## Änderungen dieser Sicherheitsrichtlinie

Diese Sicherheitsrichtlinie kann mit zukünftigen Versionen angepasst werden.

Wesentliche Änderungen werden im Changelog dokumentiert.