# Vertical promo reel (9:16, 31 s)

Output: `assets/reel-thorelle-9x16.mp4` (1080×1920, 30 fps, H.264 + AAC) and `assets/reel-thorelle-poster-9x16.jpg`.
For Instagram/Facebook Reels, Stories, TikTok, YouTube Shorts, LinkedIn.

| Time | Scene |
|---|---|
| 0–4 s | The crest, with a light passing over the gold; Cabinet Thorelle Conseils, Risk & Management |
| 4–8 s | Motto: *Anticiper les risques, c'est préserver ce qui compte.* |
| 8–11 s | Le fondateur: Emmanuel Thorelle |
| 11–15 s | Entreprises: three services |
| 15–18 s | Particuliers: three services |
| 18–22 s | Accompagnement, with Evelyne Thorelle |
| 22–26 s | Nos valeurs, one at a time |
| 26–31 s | End card: crest, "Parlons de ce qui compte pour vous.", 06 13 73 42 52, thorellesurete.fr |

The soundtrack is synthesised by `soundtrack.py` (original, no licence needed).

## Re-render

```bash
python3 -m http.server 4321            # from the repo root, keep running
python3 promo/reel-9x16/soundtrack.py /tmp/sound.wav
node promo/reel-9x16/render.js /tmp/master.mp4 30 /tmp/sound.wav
ffmpeg -i /tmp/master.mp4 -c:v libx264 -preset slow -b:v 6M -pass 1 -an -f null /dev/null
ffmpeg -i /tmp/master.mp4 -c:v libx264 -preset slow -b:v 6M -maxrate 8M -bufsize 12M -pass 2 \
  -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart assets/reel-thorelle-9x16.mp4
```

Preview in a browser: http://localhost:4321/promo/reel-9x16/?play (or `?t=12` for one frame).
Texts, timings and photos are all in `index.html`.
