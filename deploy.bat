@echo off
set PATH=C:\Program Files\nodejs;%PATH%
echo Début du build et déploiement sur Vercel...
echo.
echo 1. Installation des dépendances...
npm install
echo.
echo 2. Build du projet...
npm run build
echo.
echo 3. Déploiement sur Vercel...
vercel --prod
echo.
echo Déploiement terminé !
