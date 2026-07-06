# Combien de SMIC

Outil web pédagogique qui transforme de grandes sommes d'argent en comparaisons économiques concrètes : années de SMIC net, salaires médians, carrières complètes, loyers, paniers alimentaires, RSA, voitures populaires, immobilier et patrimoine médian.

Le ton est volontairement direct, factuel et chiffré. Le projet évite les slogans : l'objectif est de rendre les ordres de grandeur lisibles.

## Screenshots

Les captures seront à ajouter après déploiement :

- `docs/screenshots/home.png`
- `docs/screenshots/comparateur.png`
- `docs/screenshots/milliardaires.png`

## Stack

- Next.js 16 avec App Router
- TypeScript strict
- Tailwind CSS v4
- Vitest
- Route Handler API interne
- Déploiement Vercel compatible

## Fonctionnalités

- Saisie libre d'une somme : `1000000`, `1 000 000`, `1,000,000`, `1m`, `1 milliard`, `1 billion`
- Comparaison en années/mois/jours de SMIC net
- Comparaison avec salaire médian, RSA, loyers, paniers alimentaires, voitures, immobilier et patrimoine
- Hypothèses configurables : revenu mensuel, durée de carrière, taux d'épargne
- Timeline théorique : année de départ nécessaire au SMIC sans dépense
- Page milliardaires avec recherche et tri
- API JSON : `/api/compare?amount=1000000000`
- Boutons copier/partager
- Pages SEO : `/combien-de-smic-pour-1-million`, `/combien-de-smic-pour-1-milliard`

## Architecture

```txt
src/app/
  page.tsx
  comparateur/page.tsx
  milliardaires/page.tsx
  methodologie/page.tsx
  api/compare/route.ts
src/components/
src/lib/calculations/
src/lib/formatters/
src/data/economicReferences.ts
src/data/billionaires.ts
src/types/
tests/
```

La logique métier est isolée dans `src/lib/calculations` et `src/lib/formatters`. Les composants React ne contiennent pas de valeurs économiques magiques.

## Installation

```bash
npm install
```

## Lancement local

```bash
npm run dev
```

Ouvrir `http://localhost:3000`.

## Tests

```bash
npm test
```

Les tests couvrent le parsing des montants, les années de revenus, les carrières complètes, le taux d'épargne, les très grands nombres, les cas invalides et les formatages.

## Build

```bash
npm run build
```

## Données et méthodologie

Les références sont centralisées dans `src/data/economicReferences.ts`.

Certaines valeurs sont sourcées avec des références publiques récentes :

- SMIC net mensuel : Service Public, montant indicatif au 1er juin 2026
- RSA personne seule : barème CAF 2026
- Patrimoine médian net : INSEE, données de patrimoine 2024 publiées en 2026
- Salaire médian : repère INSEE 2024 à vérifier dans les tableaux détaillés

Certaines valeurs sont volontairement marquées comme placeholders réalistes :

- loyer moyen
- panier alimentaire
- voiture populaire
- prix moyen appartement/maison
- fortunes de milliardaires

Avant usage public sérieux, ces valeurs doivent être vérifiées et remplacées par des sources publiques fiables.

## Limites

- Une épargne à 100 % est irréaliste. Elle sert uniquement de borne théorique minimale.
- Les fortunes estimées varient fortement avec les marchés financiers.
- Revenu, patrimoine et fortune ne mesurent pas la même réalité économique.
- Les loyers et prix immobiliers varient fortement selon le territoire.
- Le site donne des ordres de grandeur, pas un conseil financier.

## API

```bash
curl "http://localhost:3000/api/compare?amount=1000000000"
```

Réponse :

```json
{
  "input": {
    "amount": 1000000000,
    "formattedAmount": "1 000 000 000 €"
  },
  "smicYears": 56377.64,
  "medianSalaryYears": 38051.75,
  "workingLives": 1342.32,
  "rsaMonths": 1534470.45,
  "averageRentMonths": 1315789.47,
  "groceryBaskets": 9090909.09,
  "medianWealthMultiplier": 6752.19,
  "generatedAt": "2026-07-06T00:00:00.000Z",
  "assumptions": {}
}
```

## Roadmap

- Ajout de sources dynamiques
- Graphiques et visualisations temporelles
- Export image partageable
- Comparaison entre deux fortunes
- Internationalisation
- Mise à jour automatisée des données publiques
- Dashboard admin des références économiques

## Déploiement

Le projet peut être déployé tel quel sur Vercel.
