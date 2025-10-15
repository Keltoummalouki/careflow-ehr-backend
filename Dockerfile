# ✅ 1. Choisir une image Node officielle légère
FROM node:20-alpine

# ✅ 2. Installer les outils nécessaires pour compiler les dépendances (comme bcrypt)
RUN apk add --no-cache python3 make g++

# ✅ 3. Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# ✅ 4. Copier les fichiers package.json
COPY package*.json ./

# ✅ 5. Installer toutes les dépendances
RUN npm install

# ✅ 6. Copier le reste du code dans le conteneur
COPY . .

# ✅ 7. Créer un utilisateur non-root pour la sécurité
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs

# ✅ 8. Donner les bons droits
RUN chown -R nodejs:nodejs /usr/src/app

# ✅ 9. Passer à l’utilisateur non-root
USER nodejs

# ✅ 10. Ouvrir le port 3001
EXPOSE 3001

# ✅ 11. Commande de lancement
CMD ["npm", "run", "dev"]
