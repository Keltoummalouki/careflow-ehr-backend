# CareFlow EHR

## Description
CareFlow EHR est une application de gestion de dossiers médicaux électroniques (EHR) permettant aux professionnels de santé de gérer les patients, les rendez-vous et les informations médicales de manière sécurisée et efficace.

---

## Technologies utilisées
- **Backend :** Node.js, Express.js  
- **Base de données :** MongoDB  
- **Langages :** JavaScript, JSON  
- **Versionning :** Git  
- **Méthodologie :** Agile  

---

## Fonctionnalités principales (MVP)
- Authentification des utilisateurs (login/signup)  
- Gestion des patients (CRUD)  
- Gestion des rendez-vous  
- Gestion des dossiers médicaux  
- API REST sécurisée  

---

## Installation
1. Cloner le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/careflow-ehr.git
````

2. Se déplacer dans le dossier du projet :

   ```bash
   cd careflow-ehr
   ```
3. Installer les dépendances :

   ```bash
   npm install
   ```
4. Configurer les variables d’environnement dans un fichier `.env` :

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```
5. Démarrer le serveur :

   ```bash
   npm start
   ```

---

## Structure du projet

```
careflow-ehr/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
│
├── frontend/ (optionnel)
│
└── README.md
```

---

## API Endpoints (exemples)

* `POST /api/auth/register` — Créer un nouvel utilisateur
* `POST /api/auth/login` — Authentifier un utilisateur
* `GET /api/patients` — Lister tous les patients
* `POST /api/patients` — Ajouter un patient
* `PUT /api/patients/:id` — Mettre à jour un patient
* `DELETE /api/patients/:id` — Supprimer un patient

---

## Contribuer

Les contributions sont les bienvenues !

1. Forker le dépôt
2. Créer une branche (`git checkout -b feature/nom-feature`)
3. Committer vos changements (`git commit -m 'Ajouter une nouvelle fonctionnalité'`)
4. Pusher la branche (`git push origin feature/nom-feature`)
5. Ouvrir une Pull Request

---

## Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## Contact

Pour toute question ou suggestion : [keltoummalouki@gmail.com](mailto:keltoummalouki@gmail.com)

```
```
