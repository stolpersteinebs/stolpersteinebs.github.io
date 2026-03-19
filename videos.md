---
layout: default
title: "Videos"
permalink: /videos/
---
Hier kannst du Videos zur Ausstellung einfügen.

## Video als Datei hochladen

1. Lege die Videodatei im Ordner `assets/videos/` ab (z. B. `ausstellung.mp4`).
2. Passe im Beispiel unten den Dateinamen bei `src` an.
3. Optional: Ergänze weitere `<source>`-Dateien (z. B. `webm`) für bessere Browser-Kompatibilität.

<video controls preload="metadata" style="width:100%;max-width:960px;border-radius:12px;">
  <source src="/assets/videos/ausstellung.mp4" type="video/mp4">
  Dein Browser unterstützt das Video-Element nicht.
</video>

> Tipp: Du kannst mehrere Videos einfügen, indem du den `<video>`-Block mehrfach kopierst.
