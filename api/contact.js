// Contact form → email, through Resend (https://resend.com).
//
// Vercel environment variables:
//   RESEND_API_KEY  required. Without it the endpoint answers 503 and the site falls back to the mail app.
//   CONTACT_TO      where requests are delivered (default: providencecotedazur@gmail.com)
//   CONTACT_BCC     optional hidden copy of every request (comma-separated)
//   CONTACT_FROM    sender, on a domain verified in Resend (default: Cabinet Thorelle Conseils <contact@thorellesurete.fr>)

const crypto = require('crypto');
const emails = require('./_emails');

// ---------- Protections ----------
// 1. Same-site only: the request must come from the site itself (Origin check + JSON content type).
// 2. Form token: the page fetches a signed, time-stamped token first. A request without a valid token,
//    sent less than 2 seconds after the token was issued, or with a token older than 2 hours is refused.
// 3. Honeypot field that only bots fill in.
// 4. Rate limits per IP address, and per address for the confirmation email.
// 5. Strict validation: lengths, a real email or phone number, no line breaks in single-line fields,
//    and messages stuffed with links are refused.
// Note: rate limits live in the function's memory, so they reset when Vercel starts a new instance.
// For a hard limit, add a Vercel Firewall rate-limit rule on /api/contact (see README).

const MAX = { nom: 120, coord: 200, message: 5000, body: 12000 };
const PROFILS = ['Entreprise', 'Particulier'];
const TOKEN_MIN_AGE = 2 * 1000;
const TOKEN_MAX_AGE = 2 * 60 * 60 * 1000;
const LIMITS = { perIp: { max: 5, windowMs: 10 * 60 * 1000 }, tokensPerIp: { max: 30, windowMs: 10 * 60 * 1000 }, confirmPerAddress: { max: 2, windowMs: 60 * 60 * 1000 } };

const clean = (v, max) => (typeof v === 'string' ? v.normalize('NFC').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2066-\u2069]/g, '').trim().slice(0, max) : '');
const oneLine = (v) => v.replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ');

function allowedOrigin(origin) {
  if (!origin) return false;
  try {
    const u = new URL(origin);
    if (u.protocol === 'https:' && (u.hostname === 'www.thorellesurete.fr' || u.hostname === 'thorellesurete.fr')) return true;
    if (u.protocol === 'https:' && process.env.VERCEL_ENV !== 'production' && u.hostname.endsWith('.vercel.app')) return true;
    if (process.env.VERCEL_ENV !== 'production' && (u.hostname === 'localhost' || u.hostname === '127.0.0.1')) return true;
  } catch { /* invalid origin */ }
  return false;
}

const buckets = new Map();
function limited(kind, id) {
  const { max, windowMs } = LIMITS[kind];
  const k = kind + ':' + id, now = Date.now();
  const hits = (buckets.get(k) || []).filter((t) => now - t < windowMs);
  if (hits.length >= max) { buckets.set(k, hits); return true; }
  hits.push(now); buckets.set(k, hits);
  if (buckets.size > 5000) for (const [key, v] of buckets) if (!v.some((t) => now - t < 60 * 60 * 1000)) buckets.delete(key);
  return false;
}

const secret = () => process.env.FORM_SECRET || process.env.RESEND_API_KEY || '';
const sign = (ts) => crypto.createHmac('sha256', secret()).update('contact-form:' + ts).digest('base64url');
function issueToken() { const ts = Date.now().toString(36); return ts + '.' + sign(ts); }
function checkToken(token) {
  if (typeof token !== 'string' || token.length > 100) return 'token';
  const [ts, sig] = token.split('.');
  if (!ts || !sig) return 'token';
  const a = Buffer.from(sig), b = Buffer.from(sign(ts));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return 'token';
  const age = Date.now() - parseInt(ts, 36);
  if (!(age >= TOKEN_MIN_AGE)) return 'too_fast';
  if (age > TOKEN_MAX_AGE) return 'expired';
  return '';
}

const clientIp = (req) => String(req.headers['x-real-ip'] || (req.headers['x-forwarded-for'] || '').split(',')[0] || 'unknown').trim();
const fail = (res, code, error) => res.status(code).json({ ok: false, error });

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  const ip = clientIp(req);

  if (req.method === 'GET') {
    // The form asks for a token when it comes into view
    const sameSite = req.headers['sec-fetch-site'] === 'same-origin' || allowedOrigin(req.headers.origin) ||
      allowedOrigin((String(req.headers.referer || '').match(/^https?:\/\/[^/]+/) || [''])[0]);
    if (!sameSite || req.headers['sec-fetch-site'] === 'cross-site') return fail(res, 403, 'origin');
    if (!secret()) return fail(res, 503, 'not_configured');
    if (limited('tokensPerIp', ip)) return fail(res, 429, 'rate_limited');
    return res.status(200).json({ ok: true, token: issueToken() });
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return fail(res, 405, 'method');
  }

  if (!allowedOrigin(req.headers.origin)) return fail(res, 403, 'origin');
  if (!/^application\/json\b/i.test(req.headers['content-type'] || '')) return fail(res, 415, 'content_type');
  if (Number(req.headers['content-length'] || 0) > MAX.body) return fail(res, 413, 'too_large');

  const key = process.env.RESEND_API_KEY;
  if (!key) return fail(res, 503, 'not_configured');

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return fail(res, 400, 'invalid');

  // Honeypot: pretend it worked so bots don't learn anything
  if (clean(body.site, 200)) return res.status(200).json({ ok: true });

  const tokenError = checkToken(body.token);
  if (tokenError) return fail(res, 400, tokenError);

  if (limited('perIp', ip)) return fail(res, 429, 'rate_limited');

  const nom = oneLine(clean(body.nom, MAX.nom));
  const coord = oneLine(clean(body.coord, MAX.coord));
  const message = clean(body.message, MAX.message);
  const profil = PROFILS.includes(body.profil) ? body.profil : 'Non précisé';
  if (!nom || !coord) return fail(res, 400, 'missing');
  if (nom.length < 2) return fail(res, 400, 'invalid');

  const looksEmail = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i.test(coord);
  const looksPhone = /^\+?[\d\s.()-]{9,20}$/.test(coord) && coord.replace(/\D/g, '').length >= 9;
  if (!looksEmail && !looksPhone) return fail(res, 400, 'contact');

  const links = (message.match(/https?:\/\/|www\./gi) || []).length + (nom.match(/https?:\/\/|www\./gi) || []).length;
  if (links > 2 || /https?:\/\//i.test(nom)) return fail(res, 400, 'spam');

  const isEmail = looksEmail;
  const digits = coord.replace(/[^\d+]/g, '');
  const phoneDigits = !isEmail && digits.replace(/\D/g, '').length >= 9 ? digits : '';
  const receivedAt = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full', timeStyle: 'short', timeZone: 'Europe/Paris' }).format(new Date());
  const from = process.env.CONTACT_FROM || 'Cabinet Thorelle Conseils <contact@thorellesurete.fr>';
  const to = (process.env.CONTACT_TO || 'providencecotedazur@gmail.com').split(',').map((s) => s.trim()).filter(Boolean);

  const bcc = (process.env.CONTACT_BCC || '').split(',').map((s) => s.trim()).filter((s) => s && s !== 'none');

  const send = (payload) => fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, ...payload }),
  });

  try {
    const n = emails.notification({ nom, profil, coord, message, isEmail, phoneDigits, receivedAt });
    const r = await send({ to, ...(bcc.length ? { bcc } : {}), subject: n.subject, html: n.html, text: n.text, ...(isEmail ? { reply_to: coord } : {}) });
    if (!r.ok) {
      console.error('Resend error', r.status, await r.text());
      return res.status(502).json({ ok: false, error: 'send_failed' });
    }

    // Confirmation to the visitor. Never echoes their message, and drops the name if it looks like a link,
    // so the form can't be used to send arbitrary content to strangers.
    if (isEmail && !limited('confirmPerAddress', coord.toLowerCase())) {
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
