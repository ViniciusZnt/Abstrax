# API Documentation - Abstrax

## Índice
- [Autenticação](#autenticação)
- [Artes](#artes)
- [Álbuns](#álbuns)
- [Logs](#logs)

## Autenticação

Todas as rotas (exceto registro e login) requerem autenticação via token JWT.
O token deve ser enviado no header `Authorization` no formato:
```
Authorization: Bearer seu_token_jwt
```

### Rotas de Autenticação

#### Registro de Usuário
```http
POST /api/auth/register
Content-Type: application/json

{
    "name": "Nome do Usuário",
    "email": "usuario@email.com",
    "password": "senha123"
}
```
**Resposta**: Status 201
```json
{
    "id": "user_id",
    "name": "Nome do Usuário",
    "email": "usuario@email.com"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "usuario@email.com",
    "password": "senha123"
}
```
**Resposta**: Status 200
```json
{
    "token": "jwt_token",
    "user": {
        "id": "user_id",
        "name": "Nome do Usuário",
        "email": "usuario@email.com"
    }
}
```

## Artes

### Criar Arte
```http
POST /api/arts
Authorization: Bearer jwt_token
Content-Type: application/json

{
    "name": "Nome da Arte",
    "description": "Descrição da arte",
    "isPublic": true
}
```
**Resposta**: Status 201
```json
{
    "id": "art_id",
    "name": "Nome da Arte",
    "description": "Descrição da arte",
    "imageUrl": "url_da_imagem",
    "isPublic": true,
    "creator": {
        "id": "user_id",
        "name": "Nome do Criador"
    }
}
```

### Obter Arte Específica
```http
GET /api/arts/:id
Authorization: Bearer jwt_token
```
**Resposta**: Status 200
```json
{
    "id": "art_id",
    "name": "Nome da Arte",
    "description": "Descrição da arte",
    "imageUrl": "url_da_imagem",
    "isPublic": true,
    "creator": {
        "id": "user_id",
        "name": "Nome do Criador"
    }
}
```

### Atualizar Arte
```http
PUT /api/arts/:id
Authorization: Bearer jwt_token
Content-Type: application/json

{
    "name": "Novo Nome",
    "description": "Nova descrição",
    "isPublic": false
}
```
**Resposta**: Status 200
```json
{
    "id": "art_id",
    "name": "Novo Nome",
    "description": "Nova descrição",
    "isPublic": false,
    "creator": {
        "id": "user_id",
        "name": "Nome do Criador"
    }
}
```

### Deletar Arte
```http
DELETE /api/arts/:id
Authorization: Bearer jwt_token
```
**Resposta**: Status 200
```json
{
    "message": "Arte deletada com sucesso"
}
```

### Listar Artes do Usuário
```http
GET /api/arts/user/arts
Authorization: Bearer jwt_token
```
**Resposta**: Status 200
```json
[
    {
        "id": "art_id",
        "name": "Nome da Arte",
        "description": "Descrição",
        "isPublic": true,
        "creator": {
            "id": "user_id",
            "name": "Nome do Criador"
        }
    }
]
```

## Álbuns

### Criar Álbum
```http
POST /api/albums
Authorization: Bearer jwt_token
Content-Type: application/json

{
    "title": "Nome do Álbum",
    "description": "Descrição do álbum",
    "tags": ["tag1", "tag2"]
}
```
**Resposta**: Status 201
```json
{
    "id": "album_id",
    "title": "Nome do Álbum",
    "description": "Descrição do álbum",
    "tags": ["tag1", "tag2"],
    "creator": {
        "id": "user_id",
        "name": "Nome do Criador"
    }
}
```

### Obter Álbum Específico
```http
GET /api/albums/:id
Authorization: Bearer jwt_token
```
**Resposta**: Status 200
```json
{
    "id": "album_id",
    "title": "Nome do Álbum",
    "description": "Descrição",
    "tags": ["tag1", "tag2"],
    "creator": {
        "id": "user_id",
        "name": "Nome do Criador"
    },
    "arts": [
        {
            "id": "art_id",
            "name": "Nome da Arte"
        }
    ]
}
```

### Atualizar Álbum
```http
PUT /api/albums/:id
Authorization: Bearer jwt_token
Content-Type: application/json

{
    "title": "Novo Nome",
    "description": "Nova descrição",
    "tags": ["nova_tag"]
}
```
**Resposta**: Status 200
```json
{
    "id": "album_id",
    "title": "Novo Nome",
    "description": "Nova descrição",
    "tags": ["nova_tag"],
    "creator": {
        "id": "user_id",
        "name": "Nome do Criador"
    }
}
```

### Deletar Álbum
```http
DELETE /api/albums/:id
Authorization: Bearer jwt_token
```
**Resposta**: Status 200
```json
{
    "message": "Álbum deletado com sucesso"
}
```

### Listar Álbuns do Usuário
```http
GET /api/albums/user/albums
Authorization: Bearer jwt_token
```
**Resposta**: Status 200
```json
[
    {
        "id": "album_id",
        "title": "Nome do Álbum",
        "description": "Descrição",
        "tags": ["tag1", "tag2"],
        "creator": {
            "id": "user_id",
            "name": "Nome do Criador"
        },
        "arts": [
            {
                "id": "art_id",
                "name": "Nome da Arte"
            }
        ]
    }
]
```

### Mover Arte para Álbum
```http
POST /api/albums/art/:artId/move
Authorization: Bearer jwt_token
Content-Type: application/json

{
    "albumId": "album_id"  // ou null para remover do álbum
}
```
**Resposta**: Status 200
```json
{
    "id": "art_id",
    "name": "Nome da Arte",
    "albumId": "album_id",
    "album": {
        "id": "album_id",
        "title": "Nome do Álbum"
    }
}
```

### Listar Artes de um Álbum
```http
GET /api/albums/:id/arts
Authorization: Bearer jwt_token
```
**Resposta**: Status 200
```json
[
    {
        "id": "art_id",
        "name": "Nome da Arte",
        "description": "Descrição",
        "creator": {
            "id": "user_id",
            "name": "Nome do Criador"
        }
    }
]
```

## Logs

### Obter Logs do Usuário
```http
GET /api/logs/user
Authorization: Bearer jwt_token
```
**Resposta**: Status 200
```json
[
    {
        "id": "log_id",
        "action": "CREATE",
        "entityType": "ART",
        "entityId": "art_id",
        "details": {
            "name": "Nome da Arte",
            "isPublic": true
        },
        "createdAt": "2024-03-21T10:00:00.000Z",
        "user": {
            "id": "user_id",
            "name": "Nome do Usuário"
        },
        "art": {
            "id": "art_id",
            "name": "Nome da Arte"
        }
    }
]
```

### Obter Logs de uma Entidade
```http
GET /api/logs/:entityType/:entityId
Authorization: Bearer jwt_token
```
Onde `:entityType` pode ser `ART` ou `ALBUM`

**Resposta**: Status 200
```json
[
    {
        "id": "log_id",
        "action": "UPDATE",
        "entityType": "ART",
        "entityId": "art_id",
        "details": {
            "name": "Novo Nome",
            "updatedFields": ["name", "description"]
        },
        "createdAt": "2024-03-21T10:00:00.000Z",
        "user": {
            "id": "user_id",
            "name": "Nome do Usuário"
        },
        "art": {
            "id": "art_id",
            "name": "Novo Nome"
        }
    }
]
```

## Códigos de Erro

- **400** - Bad Request (dados inválidos)
- **401** - Não autenticado
- **403** - Não autorizado (sem permissão)
- **404** - Recurso não encontrado
- **500** - Erro interno do servidor

## Observações

1. Todas as datas são retornadas no formato ISO 8601
2. O campo `isPublic` controla a visibilidade da arte
3. Apenas o criador ou um administrador pode:
   - Atualizar uma arte/álbum
   - Deletar uma arte/álbum
   - Mover uma arte entre álbuns
4. Os logs registram todas as ações importantes no sistema
5. As tags dos álbuns são armazenadas como um array JSON 