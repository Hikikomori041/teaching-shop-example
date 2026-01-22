# Déployer sur mon serveur avec docker compose

## Checklist de déploiement

- [ ] Installer docker sur le serveur
- [ ] Build une image dans CI/CD
- [ ] Pousser l'image dans GHCR depuis CI/CD
- [ ] Authentification au serveur vers GHCR
  - [ ] SSH dans le serveur depuis CI/CD grâce à `ssh -i /chemin/vers/secret admin@ip`
- [ ] `docker pull` sur le serveur
- [ ] `docker compose up` sur le serveur
