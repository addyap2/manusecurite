# Cabinet Thorelle Conseils

Site vitrine (une page, en français) du Cabinet Thorelle Conseils — Risk & Management, accompagnement de sûreté.

Direction artistique : voir `docs/DIRECTION-CREATIVE.md` (« La Veille »).

Site statique, sans build. Pages :

| URL | Fichier |
|---|---|
| `/` | `index.html` (accueil, « La Veille ») |
| `/entreprises/`, `/particuliers/`, `/cabinet/`, `/contact/` | `<page>/index.html` |
| `/journal/` + articles | `journal/index.html`, `journal/<slug>/index.html` |
| `/questions/` (FAQ) | `questions/index.html` |
| `/mentions-legales/` | `mentions-legales/index.html` |
| page introuvable | `404.html` |

Styles communs : `styles.css`. Script commun : `script.js`. Polices hébergées dans `fonts/`. En-têtes de sécurité et cache : `vercel.json`. L'en-tête, le menu et le pied de page sont répétés dans chaque page : les modifier partout.

### Ajouter un article au journal

1. Copier un dossier de `journal/` et le renommer (le nom devient l'URL).
2. Modifier le titre, la description, la date et le texte.
3. L'ajouter dans la liste de `journal/index.html`, dans « À lire aussi » des autres articles, et dans `sitemap.xml`.

## Aperçu local

```bash
python3 -m http.server 4321
```

Puis ouvrir http://localhost:4321.

## Mise en ligne

Fonctionne tel quel sur Vercel, Netlify ou GitHub Pages (dossier racine).

## À compléter avant la mise en ligne

- [ ] CNAPS : si Emmanuel détient l'autorisation, ajouter son numéro (mentions légales + pages services) avant de proposer « protection rapprochée » et « contre-filature » (volontairement absents du site pour l'instant)
- [ ] Photo d'hélicoptère : demander le fichier original (la version actuelle vient d'une photo d'écran)

Voir la checklist complète dans `docs/LAUNCH-AUDIT.md`.


- [ ] Compléter `mentions-legales/index.html` (forme juridique, SIRET, adresse, CNAPS si applicable)
- [ ] Faire relire les articles du journal et les réponses de la FAQ par Emmanuel Thorelle
- [x] Nom de domaine : www.thorellesurete.fr (thorellesurete.fr redirige vers www)
- [ ] Zone d'intervention (ville / région)
- [ ] Photo et parcours d'Emmanuel Thorelle
- [ ] Logo en haute résolution (actuel extrait de la carte de visite)
- [ ] Nom de domaine et adresse e-mail professionnelle
- [ ] Remplacer le formulaire `mailto:` par un service d'envoi (Formspree, Netlify Forms…) si souhaité

## Formulaire de contact (Resend)

Le formulaire (accueil et /contact/) envoie la demande à `api/contact.js`, une fonction Vercel qui l'expédie par e-mail via Resend. Si l'envoi échoue, ou tant que Resend n'est pas configuré, le site ouvre la messagerie du visiteur avec la demande pré-remplie.

Variables d'environnement Vercel :
- `RESEND_API_KEY` (obligatoire)
- `CONTACT_TO` : destinataire(s), séparés par des virgules (défaut : contact.bodyguard@gmail.com)
- `CONTACT_FROM` : expéditeur, sur un domaine vérifié dans Resend (défaut : `Site Thorelle <contact@thorellesurete.fr>`)
