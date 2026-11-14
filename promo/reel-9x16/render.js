// Renders promo/reel-9x16/index.html to video, frame by frame, piped into ffmpeg.
// Start a server at the repo root first:  python3 -m http.server 4321
// Video:   node promo/reel-9x16/render.js <out.mp4> [fps] [audio.wav]
// Stills:  node promo/reel-9x16/render.js --stills <dir> t1 t2 ...
const { chromium } = require('playwright');
const { spawn } = require('child_process');

(async () => {
  const args = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto('http://localhost:4321/promo/reel-9x16/?t=0');
  await page.evaluate(() => window.ready);

  if (args[0] === '--stills') {
    for (const t of args.slice(2)) {
      await page.evaluate(t => window.render(t), +t);
      await page.screenshot({ path: `${args[1]}/t${String(t).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 85 });
    }
    await browser.close();
    return;
  }

  const out = args[0], fps = +(args[1] || 30), audio = args[2];
  const dur = await page.evaluate(() => window.DURATION);
  const ff = spawn('ffmpeg', [
    '-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    ...(audio ? ['-i', audio] : []),
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart',
    ...(audio ? ['-c:a', 'aac', '-b:a', '192k', '-shortest'] : []),
    out,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });

  const n = Math.round(dur * fps);
  for (let i = 0; i < n; i++) {
    await page.evaluate(t => window.render(t), i / fps);
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 90 === 0) console.log(`frame ${i}/${n}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await browser.close();
})();
