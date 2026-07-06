# Combien de SMIC

Outil web pédagogique qui compare une situation personnelle à des fortunes d'ultra-riches : salaire net mensuel, épargne totale, fraction de fortune, années de salaire, carrières à 20% d'épargne, patrimoines médians et repères alimentaires.

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
- Motion pour les animations UI
- Vitest
- Route Handler API interne
- Déploiement Vercel compatible

## Fonctionnalités

- Expérience principale “moi vs ultra-riches” : salaire net mensuel, épargne totale, fortune sélectionnée
- Camembert de fraction pour afficher la part réelle d'une fortune estimée
- Comparaison en années de salaire, carrières à 20% d'épargne, patrimoines médians et repas solidaires théoriques
- Page milliardaires avec recherche, tri, portraits et comparaison personnelle
- Mode secondaire de saisie libre d'une somme : `1000000`, `1 000 000`, `1,000,000`, `1m`, `1 milliard`, `1 billion`
- Comparaison d'une somme libre en SMIC net, salaire médian, RSA, loyers, paniers alimentaires, immobilier et patrimoine
- Timeline théorique : année de départ nécessaire au SMIC sans dépense
- API JSON : `/api/compare?amount=1000000000`
- API JSON personnelle : `/api/personal-compare?salary=2000&savings=10000&billionaire=elon-musk`
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

Les tests couvrent le parsing des montants, les années de revenus, les carrières complètes, les fractions de fortune, le taux d'épargne à 20%, les très grands nombres, les cas invalides, les API et les formatages.

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

L'hypothèse principale de comparaison personnelle est une épargne de 20% du revenu net. L'épargne à 100% reste uniquement utilisée dans le comparateur de somme comme borne théorique.

## Limites

- Une épargne à 20% reste une hypothèse simplifiée. Elle ne remplace pas une analyse budgétaire réelle.
- Une épargne à 100% est irréaliste. Elle sert uniquement de borne théorique minimale dans le mode somme libre.
- Les fortunes estimées varient fortement avec les marchés financiers.
- Revenu, patrimoine et fortune ne mesurent pas la même réalité économique.
- Les loyers et prix immobiliers varient fortement selon le territoire.
- Les repas solidaires et paniers alimentaires sont des équivalents budgétaires théoriques, pas une promesse de solution publique.
- Le site donne des ordres de grandeur, pas un conseil financier.

## API

Comparer une somme libre :

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

Comparer une situation personnelle :

```bash
curl "http://localhost:3000/api/personal-compare?salary=2000&savings=10000&billionaire=elon-musk"
```

Réponse abrégée :

```json
{
  "input": {
    "salaryMonthly": 2000,
    "savingsTotal": 10000,
    "billionaire": "elon-musk"
  },
  "billionaire": {
    "slug": "elon-musk",
    "name": "Elon Musk",
    "formattedNetWorth": "420 000 000 000 €"
  },
  "comparison": {
    "percentage": 0.000002380952380952381,
    "salaryYears": 17500000,
    "careersAt20PercentSavings": 2083333.33
  },
  "assumptions": {
    "defaultSavingsRate": 0.2,
    "careerYears": 42
  }
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
