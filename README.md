# Prêt à Rouler

Bienvenue dans le projet Prêt à Rouler. Ce projet comprend un frontend en React.js et un backend en Python, tous deux orchestrés via Docker.

## Prérequis

- [Docker](https://www.docker.com/get-started) doit être installé sur votre machine.

## Installation et Lancement

1. **Clonez le dépôt :**

   Ouvrez un terminal et exécutez la commande suivante pour cloner le dépôt :

    ```bash
    git clone https://github.com/farkza/pretarouler.git

2. **Accédez au répertoire du projet :**

    ```bash
    cd pretarouler
    ```

3. **Lancez l'application avec Docker Compose :**

Exécutez la commande suivante pour démarrer les services frontend et backend :

    ```bash
    docker-compose up
    ```

Cette commande va construire les images Docker et lancer les conteneurs nécessaires pour le frontend et le backend.

**Accès aux Services**

Frontend (React.js) : http://localhost:3000
Backend (Node.js) : http://localhost:8000
Documentation API : http://localhost:8000/docs

**Arrêt de l'Application**

Pour arrêter les services en cours d'exécution, utilisez Ctrl+C dans le terminal où Docker Compose est en cours d'exécution.

**Aide**

Pour toute question ou problème, veuillez consulter la documentation de Docker ou ouvrir une issue sur le dépôt GitHub.

Merci d'utiliser Prêt à Rouler !
