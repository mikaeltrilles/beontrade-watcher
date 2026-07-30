#!/bin/bash
set -e

SERVER="vote1550@109.234.165.174"
REMOTE_DIR="/home/vote1550/beontrade.tmktools.com/"

echo "Construction de l'application React avec Vite..."
npm run build

echo "Déploiement sur o2switch en cours..."

# Vérifie si rsync est disponible (macOS / Linux)
if command -v rsync > /dev/null 2>&1; then
  rsync -avz --delete dist/ "${SERVER}:${REMOTE_DIR}"
else
  # Fallback Windows : nettoyage distant puis copie via scp
  echo "rsync non disponible, utilisation de ssh + scp..."
  ssh "${SERVER}" "rm -rf ${REMOTE_DIR}*"
  scp -r dist/* "${SERVER}:${REMOTE_DIR}"
fi

echo "Déploiement terminé avec succès !"
