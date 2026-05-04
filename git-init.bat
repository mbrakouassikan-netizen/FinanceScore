@echo off
echo Initialisation de Git pour FinanceScore...
echo.

echo 1. Initialisation du dépôt Git...
git init
echo.

echo 2. Ajout de tous les fichiers...
git add .
echo.

echo 3. Création du premier commit...
git commit -m "FinanceScore initial - Quiz financier complet avec Brevo et Payhip"
echo.

echo 4. Affichage du statut...
git status
echo.

echo Git initialisé avec succès !
echo.
echo Prochaines étapes :
echo - Connecte-toi à GitHub/GitLab
echo - Crée un nouveau repository
echo - Ajoute le remote : git remote add origin <URL>
echo - Push : git push -u origin main
echo.
