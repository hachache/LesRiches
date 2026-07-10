# L'Écart

Outil web pédagogique qui compare un salaire net ou une épargne à des fortunes extrêmes. Le site affiche le temps théorique nécessaire, le ratio réel, des repères physiques, puis cinq familles d'équivalents concrets : alimentation, éducation, santé, logement et accès à l'eau.

Le ton est direct, factuel et non militant. L'objectif est de rendre les ordres de grandeur compréhensibles sans transformer l'interface en simulateur économique.

## Stack

- Next.js 16 avec App Router
- TypeScript strict
- Tailwind CSS v4
- Motion pour les animations UI
- Vitest
- Route Handlers API
- Compatible Vercel

## Fonctionnalités

- Parcours principal : deux modes, `Salaire net` ou `Épargne`, plus une fortune de référence.
- Formats acceptés : `10000`, `10 000`, `1,000,000`, `1m`, `1 million`, `1 milliard`, `1 billion`.
- Résultats lisibles : temps théorique en mode salaire, ratio et multiplicateur en mode épargne.
- Repères d'échelle : salaires mensuels, vies de 83 ans et distance physique si le point de départ mesure 1 mm.
- Simulation théorique sur 1% d'une variation annuelle estimée, jamais sur toute la fortune par défaut.
- Repères concrets optionnels : enfants nourris, écoles, hôpitaux, logements et points d'eau théoriques.
- Expérience animée avec transitions Motion, parallax du hero, spotlight réactif et respect de `prefers-reduced-motion`.
- Page fortunes avec recherche, tri, cartes compactes et un seul détail ouvert.
- APIs JSON : `/api/personal-compare`, `/api/tax-scenario`, `/api/compare` en compatibilité historique.
- Boutons copier, partager et générer une carte sociale 1080x1350.

## Architecture

```txt
src/app/
  page.tsx
  comparateur/page.tsx
  milliardaires/page.tsx
  methodologie/page.tsx
  api/compare/route.ts
  api/personal-compare/route.ts
  api/tax-scenario/route.ts
src/components/
  PersonalFortuneComparator.tsx
  ImpactExplorer.tsx
  HomeImpactHero.tsx
  MotionReveal.tsx
  SiteNav.tsx
src/lib/calculations/
src/lib/formatters/
src/data/economicReferences.ts
src/data/billionaires.ts
src/types/
tests/
```

La logique métier est isolée dans `src/lib/calculations` et `src/lib/formatters`. Les valeurs économiques sont centralisées dans `src/data`.

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

## Build

```bash
npm run build
```

## APIs

Comparer une somme à une fortune :

```bash
curl "http://localhost:3000/api/personal-compare?amount=1%20million&billionaire=elon-musk"
```

Réponse abrégée :

```json
{
  "amount": { "value": 1000000, "formatted": "1 000 000 €" },
  "billionaire": { "slug": "elon-musk", "name": "Elon Musk" },
  "ratio": { "denominator": 420000, "formatted": "1 / 420 000" },
  "percentage": { "formatted": "0,0002381 %" },
  "multiplier": { "formatted": "420 000 fois" },
  "annualVariationOnePercent": { "base": "annualVariationEstimate" },
  "concreteEquivalents": {
    "formatted": {
      "childrenFedOneYear": "1,6 million",
      "schoolsBuilt": "100",
      "localHospitalsBuilt": "8"
    }
  }
}
```

Simulation sur variation annuelle estimée :

```bash
curl "http://localhost:3000/api/tax-scenario?billionaire=elon-musk&rate=1"
```

Compatibilité historique :

```bash
curl "http://localhost:3000/api/compare?amount=1%20milliard"
```

## Données

Les fortunes et variations annuelles dans `src/data/billionaires.ts` sont marquées comme estimations indicatives. Avant publication éditoriale sérieuse, elles doivent être remplacées par des valeurs datées issues de Forbes, Bloomberg ou d'une source publique équivalente.

Les repères concrets dans `src/data/economicReferences.ts` mélangent sources publiques et hypothèses pédagogiques. Les hypothèses sont explicitement signalées dans la méthodologie.

## Limites

- Les fortunes estimées varient avec les marchés.
- Une variation annuelle de fortune n'est pas un salaire.
- Les scénarios fiscaux sont des simulations ponctuelles sur variation annuelle estimée, pas une proposition fiscale.
- Les écoles, hôpitaux et repas sont des équivalents budgétaires théoriques, pas des effets garantis.
- Le site donne des ordres de grandeur, pas un conseil financier.

## Roadmap

- Remplacer les estimations indicatives par des sources vérifiées et datées.
- Ajouter un format de carte sociale paysage.
- Ajouter une comparaison entre deux fortunes.
- Ajouter une mise à jour automatisée des références publiques.
- Ajouter un mode internationalisation.
