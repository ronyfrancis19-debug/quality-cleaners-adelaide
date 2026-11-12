Quality Cleaners — service videos
=================================

Drop one MP4 file for each service page, using these exact filenames
(in this folder, videos/):

  domestic-cleaning.mp4
  commercial-cleaning.mp4
  end-of-lease-cleaning.mp4
  carpet-shampooing.mp4
  steam-cleaning.mp4
  general-deep-cleaning.mp4

Each service page already points at that file, for example:

  services/domestic-cleaning.html  →  videos/domestic-cleaning.mp4

Until a file is in place, the page shows a “Video coming soon” placeholder.
Once you add the MP4, the video player appears automatically — no code
changes are needed. A short landscape (16:9) MP4 works best.

Do not rename the files or put them in a subfolder.

Homepage hero (already in this folder)
--------------------------------------

  hero.mp4     1920×1080 H.264, no audio, faststart
  hero.webm    1280×720 VP9, no audio (optional fallback)

Do not rename these files. The homepage looks for them at videos/hero.mp4
and videos/hero.webm, with images/hero-poster.jpg as the poster frame.

Now in this folder
------------------

  commercial-cleaning.mp4   1280×720 H.264 + AAC, faststart
  steam-cleaning.mp4        1280×720 H.264 + AAC, faststart

Posters for those pages live at images/commercial-cleaning-poster.jpg
and images/steam-cleaning-poster.jpg.
