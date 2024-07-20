
# Documentação da API

## Autenticação

#### Registro

```http
  POST /auth/register
```

| Corpo   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `email` | `string` | **Obrigatório**. Email do usuário |
| `password` | `string` | **Obrigatório**. Senha do usuário |
| `confirmPassword` | `string` | **Obrigatório**. Confirmação de senha |

---

#### Entrar 

```http
  POST /auth/login
```

| Corpo   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `email`      | `string` | **Obrigatório**. Email do usuário |
| `password`      | `string` | **Obrigatório**. Senha do usuário |

---

#### Sair

```http
  GET /auth/logout
```

---

#### Atualizar Token de Acesso

```http
  GET /auth/refresh
```

---

#### Verificar email

```http
  GET /auth/email/verify/${code}
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `code`      | `string` | **Obrigatório**. Codigo recebido ao se registrar para confirmar email |

---

#### Esqueceu Senha

```http
  POST /auth/password/forgot
```

| Corpo   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `email` | `string` | **Obrigatório**. Email do usuário |

---

#### Resetar senha

```http
  POST /auth/password/reset
```

| Corpo   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `verificationCode` | `string` | **Obrigatório**. Código recebido ao abrir o email de reset |
| `password` | `string` | **Obrigatório**. Nova senha |

---

## Sessão

#### Listar sessões

```http
  GET /session
```
---

#### Deletar sessão

```http
  GET /session/${id}
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | **Obrigatório**. Id da sessão |

---

> TODO: adicionar os endpoints