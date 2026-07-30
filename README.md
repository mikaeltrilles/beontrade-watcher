# Beontrade Watcher

Application de tableau de bord pour suivre le top 250 des cryptomonnaies en temps réel, propulsée par l’API publique CoinGecko.

## Fonctionnalités

- **Top 250 cryptomonnaies** classées par capitalisation boursière.
- **Dashboard** avec cartes de statistiques globales : Market Cap total, Volume 24h, dominance BTC.
- **Treemap** interactive des 50 premières cryptos colorées selon la variation 24h.
- **Tableau dynamique** avec :
  - Recherche rapide par nom ou symbole.
  - Tri dynamique au clic sur les entêtes de colonnes.
  - Entête sticky pour faciliter le défilement.
  - Skeleton loaders pendant le chargement.
  - Sparklines des variations sur 7 jours.
  - Filtre des stablecoins.
  - Liste des favoris persistée dans le navigateur.
- **Graphique détaillé** par crypto (1 jour à Max) affiché dans une fenêtre modale.
- **Sélecteur de devise** : USD ou EUR.
- **Interface moderne** en mode sombre orientée trading/finance.

## Stack technique

- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Query (React Query)](https://tanstack.com/query/)
- [Recharts](https://recharts.org/)
- [Lucide React](https://lucide.dev/)
- API [CoinGecko](https://www.coingecko.com/)

## Prérequis

- [Node.js](https://nodejs.org/) >= 18
- npm ou un gestionnaire de paquets compatible

## Installation

Clonez le dépôt et installez les dépendances :

```bash
git clone git@github.com:mikaeltrilles/beontrade-watcher.git
cd beontrade-watcher
npm install
```

## Développement

Lancez le serveur de développement avec Hot Module Replacement :

```bash
npm run dev
```

L’application est accessible par défaut sur [http://localhost:3000](http://localhost:3000).

## Construction de production

Générez les fichiers statiques optimisés dans le dossier `dist/` :

```bash
npm run build
```

Pour prévisualiser le build localement :

```bash
npm run preview
```

## Déploiement sur o2switch

Le projet inclut un script de déploiement `deploy.sh` qui construit l’application puis synchronise le dossier `dist/` sur le serveur o2switch.

```bash
./deploy.sh
```

Le script exécute automatiquement :

1. La commande `npm run build`.
2. La synchronisation vers `vote1550@109.234.165.174:/home/vote1550/beontrade.tmktools.com/`.

Sur macOS / Linux, il utilise `rsync`. Sur Windows, si `rsync` n’est pas disponible, il passe automatiquement par `ssh` + `scp`.

## Configuration

Les variables d’environnement suivantes peuvent être définies dans un fichier `.env` (voir `.env.example`) :

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `VITE_COINGECKO_API_URL` | URL de base de l’API CoinGecko | `https://api.coingecko.com/api/v3` |
| `VITE_DEFAULT_CURRENCY` | Devise par défaut (`usd` ou `eur`) | `usd` |
| `VITE_TOP_LIMIT` | Nombre de cryptomonnaies récupérées | `250` |

## Notes

- Les données proviennent de l’API gratuite CoinGecko, soumise à des limites de taux. L’application rafraîchit automatiquement les données toutes les 60 secondes.
- Les favoris sont stockés localement dans le navigateur via `localStorage`.

## Auteur

Développé par Mikael Trilles.
