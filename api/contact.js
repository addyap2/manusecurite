// Contact form → email, through Resend (https://resend.com).
//
// Vercel environment variables:
//   RESEND_API_KEY  required. Without it the endpoint answers 503 and the site falls back to the mail app.
//   CONTACT_TO      where requests are delivered (default: contact.bodyguard@gmail.com and providencecotedazur@gmail.com)
//   CONTACT_FROM    sender, on a domain verified in Resend (default: Cabinet Thorelle Conseils <contact@thorellesurete.fr>)

const emails = require('./_emails');

const MAX = { nom: 120, coord: 200, message: 5000 };
const PROFILS = ['Entreprise', 'Particulier'];

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
  const digits = coord.replace(/[^\d+]/g, '');
  const phoneDigits = !isEmail && digits.replace(/\D/g, '').length >= 9 ? digits : '';
  const receivedAt = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Europe/Paris' }).format(new Date());
  const from = process.env.CONTACT_FROM || 'Cabinet Thorelle Conseils <contact@thorellesurete.fr>';
  const to = (process.env.CONTACT_TO || 'contact.bodyguard@gmail.com,providencecotedazur@gmail.com').split(',').map((s) => s.trim()).filter(Boolean);

  const send = (payload) => fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, ...payload }),
  });

  try {
    const n = emails.notification({ nom, profil, coord, message, isEmail, phoneDigits, receivedAt });
    const r = await send({ to, subject: n.subject, html: n.html, text: n.text, ...(isEmail ? { reply_to: coord } : {}) });
    if (!r.ok) {
      console.error('Resend error', r.status, await r.text());
      return res.status(502).json({ ok: false, error: 'send_failed' });
    }

    // Confirmation to the visitor. Never echoes their message, and drops the name if it looks like a link,
    // so the form can't be used to send arbitrary content to strangers.
    if (isEmail) {
      const safeName = /https?:|www\.|[<>@]|\.[a-z]{2,}\b/i.test(nom) ? '' : nom.split(/\s+/).slice(0, 3).join(' ').slice(0, 40);
      const c = emails.confirmation({ greetingName: safeName, profil });
      try {
        const rc = await send({ to: [coord], subject: c.subject, html: c.html, text: c.text, reply_to: to[0] });
        if (!rc.ok) console.error('Confirmation not sent', rc.status, await rc.text());
      } catch (err) { console.error('Confirmation request failed', err); }
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Resend request failed', err);
    return res.status(502).json({ ok: false, error: 'send_failed' });
  }
};
