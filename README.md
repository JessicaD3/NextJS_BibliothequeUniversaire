# NEXTJS | Rest API - Bibliothèque universitaire

Application web Next.js + MySQL pour la gestion d'une bibliothèque universitaire
Déployée sur Vercel, et hébergée sur Aiven pour la base MySQL 

- **Lien du site vercel:** https://next-js-bibliotheque-universaire.vercel.app/

## Prérequis

Avant de lancer le projet, il faut avoir installé :

- **Node.js** (version 20 recommandée)
- **npm**
- **MySQL Workbench**

---

# 1. Lancement en local 

## Étape 1 — Extraire le projet
Décompresser le fichier `.zip` dans un dossier local.

---

## Étape 2 — Installer les dépendances
Ouvrir un terminal à la racine du projet puis exécuter :

```bash
npm install
```
## Étape 3 — Configurer les variables d'environnements 
Créer un fichier: .env

Avec le contenu suivant:
```bash
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/bibliotheque"

DATABASE_HOST="HOST"
DATABASE_PORT="PORT"
DATABASE_USER="USER"
DATABASE_PASSWORD="PASSWORD"
DATABASE_NAME="bibliotheque"

JWT_ACCESS_SECRET="change-me-access-secret"
JWT_REFRESH_SECRET="change-me-refresh-secret"

JWT_ACCESS_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

NODE_ENV="development"
```

## Étape 4 — Générer le client Prisma  
```bash
npx prisma generate
```

## Étape 5 —Appliquer les migrations
```bash
npx prisma migrate deploy
```

## Étape 6 — Ajouter les données de démonstration  
```bash
npx prisma db seed
```

## Étape 7 — Ajouter les données de démonstration  
```bash
npm run dev
```

L’application sera accessible à l’adresse :
```bash
http://localhost:3000
```
==============================================
===============================================
## Fonctionalités: 
**Authentification**
- Inscription utilisateur
- Connexion
- Gestion de sessions avec JWT

**Catalogue**
- Liste de livres
- Recherche par titre ou auteur
- filtrage par catégorie
- pagination 

**Emprunts de Livres**
Règles métiers:
- Un utilisateur peut emprunter maximum 3 livres
- Un emprunt dure 14 jours
- Un livre indisponible ne peut pas être emprunté

**Historique**
- Liste des emprunts
- Statut: En cours | Rendu | En retard
- Possibilité de retourner un livre 

===================================================
## Technologies utilisées
- NextJS
- React
- TypeScript
- Prisma
- MySQL
- Tailwind CSS
- Vercel
- Aiven 

