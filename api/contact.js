// Contact form → email, through Resend (https://resend.com).
//
// Vercel environment variables:
//   RESEND_API_KEY  required. Without it the endpoint answers 503 and the site falls back to the mail app.
//   CONTACT_TO      where requests are delivered (default: providencecotedazur@gmail.com)
//   CONTACT_FROM    sender, on a domain verified in Resend (default: Site Thorelle <contact@thorellesurete.fr>)

const MAX = { nom: 120, coord: 200, message: 5000 };
const PROFILS = ['Entreprise', 'Particulier'];

const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clean = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method' });
  }

  let body = req.body || {};
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }

  // Honeypot: real visitors never see or fill this field
  if (clean(body.site, 200)) return res.status(200).json({ ok: true });

  const nom = clean(body.nom, MAX.nom);
  const coord = clean(body.coord, MAX.coord);
  const message = clean(body.message, MAX.message);
  const profil = PROFILS.includes(body.profil) ? body.profil : 'Non précisé';
  if (!nom || !coord) return res.status(400).json({ ok: false, error: 'missing' });

  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(503).json({ ok: false, error: 'not_configured' });

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(coord);
  const subject = `Demande de contact (${profil}) : ${nom}`;
  const text = `Nom : ${nom}\nProfil : ${profil}\nContact : ${coord}\n\n${message || '(pas de message)'}`;
  const html =
    `<p><strong>Nom :</strong> ${esc(nom)}<br><strong>Profil :</strong> ${esc(profil)}<br>` +
    `<strong>Contact :</strong> ${esc(coord)}</p>` +
    `<p style="white-space:pre-wrap">${message ? esc(message) : '<em>(pas de message)</em>'}</p>` +
    `<p style="color:#888;font-size:12px">Envoyé depuis le formulaire de www.thorellesurete.fr</p>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || 'Site Thorelle <contact@thorellesurete.fr>',
        to: (process.env.CONTACT_TO || 'providencecotedazur@gmail.com').split(',').map((s) => s.trim()),
        subject,
        text,
        html,
        ...(isEmail ? { reply_to: coord } : {}),
      }),
    });
    if (!r.ok) {
      console.error('Resend error', r.status, await r.text());
      return res.status(502).json({ ok: false, error: 'send_failed' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend request failed', err);
    return res.status(502).json({ ok: false, error: 'send_failed' });
  }
};
