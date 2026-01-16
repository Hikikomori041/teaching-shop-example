# Définition des variables d'environnement
$env:POSTGRES_DATABASE = "school"
$env:POSTGRES_USER = "root"
$env:POSTGRES_PASSWORD = "root"
$env:APP_URL = "http://localhost:8080"
$env:DEBUG = "true"

Write-Host "Lancement de l'environnement de dev..." -ForegroundColor Cyan

# 1. Lancer le BACKEND dans une nouvelle fenêtre
# On navigue dans backend/core et on lance uv
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend/core; uv run python manage.py runserver localhost:8000"

# 2. Lancer le FRONTEND dans une nouvelle fenêtre
# On navigue dans frontend et on lance npm
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev -- --port 8080"

Write-Host "Succès ! Le Frontend et le Backend tournent dans deux fenêtres séparées." -ForegroundColor Green