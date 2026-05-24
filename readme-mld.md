# MLD Merise - Base de données API Esport

## MLD de la méthode Merise en mermaid (ER)
https://mermaid.ai/open-source/syntax/entityRelationshipDiagram.html 

```mermaid
erDiagram
    USERS {
        ObjectId _id PK
        String firstname
        String lastname
        String email
        String avatar
        String[] role
        String password
        ObjectId favorite_game FK
        String team_role
        Date year_joining_team
        String nationality
        String[] specialty
        ObjectId team_id FK
    }

    TEAMS {
        ObjectId _id PK
        String name
        ObjectId[] favorite_game FK
        ObjectId[] teammates FK
        ObjectId[] managers FK
        Date creation_date
        String nationality
    }

    GAMES {
        ObjectId _id PK
        String name
        Date release_date
        String[] genres
        String[] platforms
        String publisher
        Number max_player
    }

    TOURNAMENTS {
        ObjectId _id PK
        String name
        String place_name
        Object capacity
        String[] equipment
        Date start_date
        Date end_date
        String status
        ObjectId specialized_game FK
    }

    PARTICIPANTS {
        ObjectId _id PK
        ObjectId user_id FK
        ObjectId team_id FK
        String role
        Date inscription_date
    }

    REWARDS {
        ObjectId _id PK
        ObjectId tournament_id FK
        ObjectId team_id FK
        String reward
        Number estimated_value
    }

    NOTATIONS {
        ObjectId _id PK
        ObjectId team_id FK
        ObjectId player_id FK
        ObjectId jury_id FK
        ObjectId game_id FK
        ObjectId tournament_id FK
        Map criteria
        String comment
        Number total_score
        Date notation_date
    }

    JOIN_REQUESTS {
        ObjectId _id PK
        ObjectId user_id FK
        ObjectId team_id FK
        String status
        Date requestedAt
        Date respondedAt
    }

    USERS }|--o{ TEAMS : "membre de"
    TEAMS }|--o{ USERS : "contient"
    USERS }|--o{ JOIN_REQUESTS : "fait"
    TEAMS }|--o{ JOIN_REQUESTS : "reçoit"

    USERS }|--o{ PARTICIPANTS : "participe"
    TEAMS }|--o{ PARTICIPANTS : "participe"
    TOURNAMENTS ||--o{ PARTICIPANTS : "accueille"

    TEAMS ||--o{ REWARDS : "gagne"
    TOURNAMENTS ||--o{ REWARDS : "décerne"

    USERS ||--o{ NOTATIONS : "émet"
    TEAMS ||--o{ NOTATIONS : "évalué"
    GAMES ||--o{ NOTATIONS : "évalué"
    TOURNAMENTS ||--o{ NOTATIONS : "concerne"

    GAMES ||--o{ TOURNAMENTS : "spécialisé dans"
    GAMES }|..|{ TEAMS : "favori"
    GAMES ||--o{ USERS : "favori"
```

## Remarques
- Les relations `PARTICIPANTS` et `JOIN_REQUESTS` sont des entités d'association importantes pour modéliser les inscriptions et les demandes.
- `TEAMS.favorite_game`, `TEAMS.teammates` et `TEAMS.managers` sont des tableaux de références vers d'autres entités.
- L'entité `NOTATIONS` relie l'évaluation d'une équipe/joueur à un jury, une partie et un tournoi.
