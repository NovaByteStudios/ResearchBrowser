# Hinweise zu Drittsoftware

Stand: 13. Oktober 2026

Research Browser verwendet Software, Bibliotheken und Komponenten Dritter.

Für diese Bestandteile gelten die jeweiligen Lizenzen und Copyright-Hinweise der ursprünglichen Rechteinhaber. Die Research Browser Source-Available License gilt ausschließlich für den selbst entwickelten Research-Browser-Code und ersetzt keine Lizenz von Drittsoftware.

## Electron

Research Browser wird mit Electron entwickelt.

Projekt:

https://www.electronjs.org/

Quellcode:

https://github.com/electron/electron

Lizenz:

MIT License

Copyright (c) Electron contributors  
Copyright (c) 2013-2020 GitHub Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

## Chromium

Electron enthält Chromium als Browser-Engine.

Projekt:

https://www.chromium.org/

Quellcode:

https://chromium.googlesource.com/chromium/src/

Chromium besteht aus zahlreichen Komponenten mit unterschiedlichen
Open-Source-Lizenzen.

Die vollständigen Copyright- und Lizenzhinweise der im jeweiligen
Electron-Build enthaltenen Chromium-Komponenten befinden sich in den von
Electron bereitgestellten Lizenzdateien und müssen bei der Verteilung des
fertigen App-Pakets beibehalten werden.

## Node.js

Electron enthält Node.js.

Projekt:

https://nodejs.org/

Quellcode:

https://github.com/nodejs/node

Node.js und mitgelieferte Komponenten stehen unter verschiedenen
Open-Source-Lizenzen.

Die vollständigen Hinweise befinden sich in den offiziellen Lizenzdateien
des jeweiligen Node.js- beziehungsweise Electron-Pakets.

## npm-Abhängigkeiten

Research Browser verwendet npm zur Verwaltung seiner Entwicklungs- und
Laufzeitabhängigkeiten.

Die tatsächlich verwendeten Pakete und Versionen sind in folgenden Dateien
dokumentiert:

- `package.json`
- `package-lock.json`

Jedes npm-Paket unterliegt der Lizenz des jeweiligen Rechteinhabers.

Vor jeder öffentlichen Veröffentlichung eines ausführbaren App-Pakets
müssen die tatsächlich eingebundenen Abhängigkeiten und deren Lizenzen
erneut geprüft werden.

## Eigene Symbole und Projektbestandteile

Die speziell für Research Browser erstellten Workspace-Symbole und
Oberflächenbestandteile gehören zum Research-Browser-Projekt, sofern in der
jeweiligen Datei kein anderer Hinweis angegeben ist.

Dazu gehören derzeit insbesondere:

- `assets/icons/workspace.svg`
- `assets/icons/workspace-add.svg`
- `assets/icons/more.svg`
- `assets/icons/rename.svg`
- `assets/icons/delete.svg`

Für diese eigenen Bestandteile gilt die Research Browser Source-Available
License.

## Webseiten und fremde Inhalte

Research Browser kann Webseiten und Dokumente fremder Anbieter anzeigen.

Das Anzeigen einer Webseite innerhalb von Research Browser bedeutet nicht,
dass deren Inhalte Bestandteil des Research-Browser-Projekts sind.

Für Inhalte, Marken, Logos, Bilder, Texte und sonstige Bestandteile
aufgerufener Webseiten gelten die Bedingungen und Rechte der jeweiligen
Anbieter.

## Vollständigkeit der Hinweise

Diese Datei beschreibt die wichtigsten derzeit bekannten Drittkomponenten.

Vor dem Erstellen und Verteilen eines öffentlichen App-Pakets wird eine
erneute Prüfung der tatsächlich enthaltenen Softwarebestandteile
durchgeführt.

Falls ein erforderlicher Hinweis fehlt oder fehlerhaft ist, kann dies über
die im Projekt angegebenen Kontakt- oder Sicherheitswege gemeldet werden.