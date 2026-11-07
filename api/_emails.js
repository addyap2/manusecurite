// Email templates for the contact form. Files starting with "_" are not exposed as endpoints by Vercel.
// Built with tables and inline styles so they render the same in Gmail, Outlook and Apple Mail.

const SITE = 'https://www.thorellesurete.fr';
const PHONE = '06 13 73 42 52';
const PHONE_TEL = '+33613734252';

const C = {
  night: '#0a1628', page: '#ece6da', card: '#fbf8f2', ink: '#1d2633', muted: '#5f6877',
  gold: '#b8924a', goldLight: '#d4b066', line: '#e2d9c6',
};
const SERIF = "Georgia, 'Times New Roman', serif";
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const nl2br = (s) => esc(s).replace(/\r?\n/g, '<br>');

function button(href, label) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 12px 12px 0;display:inline-table"><tr>
    <td style="background:${C.night};border-radius:2px">
      <a href="${esc(href)}" style="display:inline-block;padding:14px 26px;font-family:${SANS};font-size:13px;letter-spacing:1.5px;text-transform:uppercase;color:${C.goldLight};text-decoration:none;font-weight:600">${esc(label)}</a>
    </td></tr></table>`;
}

function layout({ preheader, eyebrow, title, body, footerNote }) {
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light">
<style>@media (max-width:480px){.px{padding-left:24px!important;padding-right:24px!important}.h1{font-size:26px!important}}</style>
<title>${esc(title.replace(/<[^>]+>/g, ''))}</title></head>
<body style="margin:0;padding:0;background:${C.page};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.page}">
<tr><td align="center" style="padding:32px 12px">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px">
    <!-- Header -->
    <tr><td align="center" style="background:${C.night};padding:36px 24px 30px">
      <a href="${SITE}/" style="text-decoration:none">
        <img src="${SITE}/assets/email-crest.png" width="72" height="59" alt="" style="display:block;margin:0 auto 16px;border:0">
        <div style="font-family:${SERIF};font-size:15px;letter-spacing:5px;text-transform:uppercase;color:${C.goldLight}">Cabinet Thorelle</div>
        <div style="font-family:${SERIF};font-style:italic;font-size:14px;color:#a7b0bf;margin-top:6px">Conseils · Risk &amp; Management</div>
      </a>
    </td></tr>
    <tr><td style="background:${C.goldLight};height:2px;line-height:2px;font-size:0">&nbsp;</td></tr>
    <!-- Body -->
    <tr><td class="px" style="background:${C.card};padding:44px 44px 36px">
      <div style="font-family:${SANS};font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:${C.gold};margin-bottom:14px">${esc(eyebrow)}</div>
      <h1 class="h1" style="margin:0 0 22px;font-family:${SERIF};font-weight:normal;font-style:italic;font-size:30px;line-height:1.25;color:${C.ink}">${title}</h1>
      ${body}
    </td></tr>
    <!-- Footer -->
    <tr><td class="px" style="background:${C.night};padding:28px 44px;font-family:${SANS};font-size:12px;line-height:1.7;color:#a7b0bf">
      <div style="font-family:${SERIF};font-style:italic;font-size:15px;color:#f0dca6;margin-bottom:10px">Anticiper les risques, c'est préserver ce qui compte.</div>
      <a href="tel:${PHONE_TEL}" style="color:#a7b0bf;text-decoration:none">${PHONE}</a> &nbsp;·&nbsp;
      <a href="${SITE}/" style="color:#a7b0bf;text-decoration:none">thorellesurete.fr</a>
      ${footerNote ? `<div style="margin-top:14px;font-size:11px;color:#7d8696">${footerNote}</div>` : ''}
    </td></tr>
  </table>
</td></tr></table>
</body></html>`;
}

function row(label, valueHtml) {
  return `<tr>
    <td valign="top" style="padding:12px 0;border-bottom:1px solid ${C.line};font-family:${SANS};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${C.muted};width:120px">${esc(label)}</td>
    <td valign="top" style="padding:12px 0;border-bottom:1px solid ${C.line};font-family:${SANS};font-size:15px;color:${C.ink}">${valueHtml}</td>
  </tr>`;
}

const p = (html) => `<p style="margin:0 0 18px;font-family:${SANS};font-size:15px;line-height:1.7;color:${C.ink}">${html}</p>`;

/* ---------- Notification to the cabinet ---------- */
function notification({ nom, profil, coord, message, isEmail, phoneDigits, receivedAt }) {
  const contactLink = isEmail
    ? `<a href="mailto:${esc(coord)}" style="color:${C.ink}">${esc(coord)}</a>`
    : phoneDigits
      ? `<a href="tel:${esc(phoneDigits)}" style="color:${C.ink}">${esc(coord)}</a>`
      : esc(coord);

  const actions = [
    isEmail && button(`mailto:${coord}?subject=${encodeURIComponent('Votre demande au Cabinet Thorelle Conseils')}`, 'Répondre par e-mail'),
    phoneDigits && button(`tel:${phoneDigits}`, 'Appeler'),
  ].filter(Boolean).join('');

  const body = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;border-top:1px solid ${C.line}">
      ${row('Nom', esc(nom))}
      ${row('Profil', esc(profil))}
      ${row('Contact', contactLink)}
      ${row('Reçue le', esc(receivedAt))}
    </table>
    <div style="font-family:${SANS};font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:${C.gold};margin-bottom:10px">Son besoin</div>
    <div style="border-left:2px solid ${C.goldLight};padding:4px 0 4px 18px;margin:0 0 32px;font-family:${SERIF};font-size:17px;line-height:1.65;color:${C.ink}">
      ${message ? nl2br(message) : `<span style="color:${C.muted};font-style:italic">Aucun message, simple demande de rappel.</span>`}
    </div>
    ${actions ? `<div>${actions}</div>` : ''}`;

  return {
    subject: `Nouvelle demande · ${profil} · ${nom}`,
    html: layout({
      preheader: `${nom} (${profil}) souhaite être recontacté : ${coord}`,
      eyebrow: `Nouvelle demande · ${profil}`,
      title: `${esc(nom)} souhaite un premier échange.`,
      body,
      footerNote: 'Demande envoyée depuis le formulaire de contact du site.',
    }),
    text:
      `Nouvelle demande (${profil})\n\nNom : ${nom}\nProfil : ${profil}\nContact : ${coord}\nReçue le : ${receivedAt}\n\n` +
      `Son besoin :\n${message || '(aucun message, simple demande de rappel)'}\n\n— Formulaire de ${SITE}`,
  };
}

/* ---------- Confirmation to the visitor ---------- */
function confirmation({ greetingName, profil }) {
  const hello = greetingName ? `Merci, ${esc(greetingName)}.` : 'Merci pour votre demande.';
  const step = (n, t, d) => `<tr>
    <td valign="top" style="width:44px;padding:0 0 18px;font-family:${SERIF};font-style:italic;font-size:22px;color:${C.gold}">${n}</td>
    <td valign="top" style="padding:2px 0 18px;font-family:${SANS};font-size:15px;line-height:1.6;color:${C.ink}"><strong style="font-weight:600">${t}</strong><br><span style="color:${C.muted}">${d}</span></td>
  </tr>`;

  const body = `
    ${p('Votre demande a bien été reçue. Emmanuel Thorelle la lit personnellement et vous recontacte rapidement, dans la plus stricte confidentialité.')}
    <div style="font-family:${SANS};font-size:11px;letter-spacing:2.5px;text-transform:uppercase;color:${C.gold};margin:30px 0 16px">La suite</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 14px">
      ${step('I', 'Un premier échange', 'Par téléphone ou de vive voix, pour comprendre votre situation. Sans engagement.')}
      ${step('II', 'Une analyse de vos besoins', profil === 'Entreprise' ? 'Vos sites, vos équipes, vos déplacements : ce qui compte vraiment pour votre activité.' : 'Votre domicile, vos habitudes, vos déplacements : ce qui compte vraiment pour vous.')}
      ${step('III', 'Une proposition sur mesure', 'Claire, proportionnée, et adaptée à ce que vous souhaitez protéger.')}
    </table>
    <div style="background:${C.page};padding:20px 22px;margin:8px 0 30px;font-family:${SANS};font-size:14px;line-height:1.6;color:${C.ink}">
      <strong style="font-weight:600">Une situation urgente&nbsp;?</strong> Appelez directement le
      <a href="tel:${PHONE_TEL}" style="color:${C.ink};font-weight:600">${PHONE}</a>.
    </div>
    <p style="margin:0;font-family:${SERIF};font-style:italic;font-size:20px;color:${C.ink}">Emmanuel Thorelle</p>
    <p style="margin:4px 0 0;font-family:${SANS};font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:${C.muted}">Fondateur, Cabinet Thorelle Conseils</p>`;

  return {
    subject: 'Votre demande est bien reçue · Cabinet Thorelle Conseils',
    html: layout({
      preheader: 'Emmanuel Thorelle vous recontacte rapidement, en toute confidentialité.',
      eyebrow: 'Demande reçue',
      title: hello,
      body,
      footerNote: `Vous recevez ce message car une demande a été envoyée depuis ${SITE.replace('https://', '')} avec cette adresse. Si vous n'en êtes pas à l'origine, ignorez simplement cet e-mail.`,
    }),
    text:
      `${greetingName ? `Merci, ${greetingName}.` : 'Merci pour votre demande.'}\n\n` +
      `Votre demande a bien été reçue. Emmanuel Thorelle la lit personnellement et vous recontacte rapidement, dans la plus stricte confidentialité.\n\n` +
      `La suite :\nI. Un premier échange, sans engagement.\nII. Une analyse de vos besoins.\nIII. Une proposition sur mesure.\n\n` +
      `Une situation urgente ? Appelez le ${PHONE}.\n\nEmmanuel Thorelle\nFondateur, Cabinet Thorelle Conseils\n${SITE}`,
  };
}

module.exports = { notification, confirmation };
