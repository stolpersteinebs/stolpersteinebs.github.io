---
layout: default
title: "Videos"
permalink: /en/videos/
---
Here you can add exhibition videos.

## Upload a video file

1. Place your video file in `assets/videos/` (for example `exhibition.mp4`).
2. Update the filename in the `src` attribute below.
3. Optionally add more `<source>` files (such as `webm`) for better browser compatibility.

<video controls preload="metadata" style="width:100%;max-width:960px;border-radius:12px;">
  <source src="/assets/videos/exhibition.mp4" type="video/mp4">
  Your browser does not support the video element.
</video>

> Tip: You can add multiple videos by copying the `<video>` block.
