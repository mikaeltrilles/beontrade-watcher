#!/bin/bash
set -e

echo "Construction de l'application React avec Vite..."
npm run build

echo "Déploiement sur o2switch en cours..."
rsync -avz --delete dist/ vote1550@109.234.165.174:/home/vote1550/beontrade.tmktools.com/

echo "Déploiement terminé avec succès !"
