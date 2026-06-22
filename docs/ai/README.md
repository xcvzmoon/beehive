# AI API

Beehive exposes a tenant-scoped API under `/api/v1`. Management routes use a Better Auth session; inference routes use a Beehive API key in the `Authorization: Bearer` header.

## Routes

| Route                                                   | Authentication                      | Description                                                                                                             |
| ------------------------------------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `POST /api/v1/organizations`                            | Session                             | Creates an organization and assigns the caller as its owner.                                                            |
| `POST /api/v1/organizations/:organizationId/workspaces` | Organization admin                  | Creates a workspace and assigns the caller as its owner.                                                                |
| `POST /api/v1/organizations/:organizationId/api-keys`   | Organization admin                  | Creates a scoped API key for a workspace. The plaintext key is returned once.                                           |
| `POST /api/v1/workspaces/:workspaceId/configurations`   | Workspace owner                     | Sets the workspace's default AI provider and model configuration.                                                       |
| `POST /api/v1/api-keys/:apiKeyId/revoke`                | Organization admin                  | Revokes an API key.                                                                                                     |
| `GET /api/v1/models`                                    | API key with `models:read`          | Lists enabled models available to the key's workspace.                                                                  |
| `POST /api/v1/responses`                                | API key with `inference:responses`  | Sends an OpenAI-compatible Responses request to the workspace's default provider and records chat, messages, and usage. |
| `POST /api/v1/embeddings`                               | API key with `inference:embeddings` | Reserved endpoint; currently returns `501 Not Implemented`.                                                             |

## Process

1. Create an organization while authenticated. The caller becomes its organization owner.
2. Create a workspace in that organization. The caller becomes its workspace owner.
3. Seed the provider catalog and, for Ollama, synchronize its installed models.
4. Configure the workspace's default provider and chat model. Only enabled provider/model pairs can be selected.
5. Create an API key for that workspace with the required scopes. Store the returned plaintext key securely; only its hash is stored.
6. Call `/models` to discover models or `/responses` to run inference. API-key middleware verifies the key is present, unrevoked, unexpired, and scoped for the route.
7. A successful response is persisted as an AI chat, user/assistant messages, and a usage event.

## Usage example

After obtaining a session cookie through the auth endpoint, create a tenant and inference configuration in this order:

```sh
curl -X POST http://localhost:3000/api/v1/organizations \
  -H 'content-type: application/json' \
  -H 'cookie: <session-cookie>' \
  -d '{"name":"Acme","slug":"acme"}'

curl -X POST http://localhost:3000/api/v1/organizations/<organization-id>/workspaces \
  -H 'content-type: application/json' \
  -H 'cookie: <session-cookie>' \
  -d '{"name":"Production","slug":"production"}'

curl -X POST http://localhost:3000/api/v1/workspaces/<workspace-id>/configurations \
  -H 'content-type: application/json' \
  -H 'cookie: <session-cookie>' \
  -d '{"providerKey":"ollama","modelName":"llama3.2"}'

curl -X POST http://localhost:3000/api/v1/organizations/<organization-id>/api-keys \
  -H 'content-type: application/json' \
  -H 'cookie: <session-cookie>' \
  -d '{"name":"production inference","workspaceId":"<workspace-id>","scopes":["models:read","inference:responses"]}'
```

Use the returned `key` to call inference:

```sh
curl http://localhost:3000/api/v1/models \
  -H 'authorization: Bearer <api-key>'

curl -X POST http://localhost:3000/api/v1/responses \
  -H 'content-type: application/json' \
  -H 'authorization: Bearer <api-key>' \
  -d '{"input":"Explain repository patterns in one sentence."}'
```

Errors use a standard HTTP `statusText` such as `Unauthorized`, `Not Found`, or `Conflict`; the `message` field provides actionable detail.
