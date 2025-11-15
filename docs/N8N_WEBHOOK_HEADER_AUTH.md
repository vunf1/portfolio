# n8n Webhook Header Authentication Guide

## Overview

Este documento explica como configurar e usar Header Authentication com webhooks do n8n, e como a nossa implementação do `N8nClient` funciona.

## Como o n8n Webhook Header Auth Funciona

### Configuração no n8n

1. **No nó Webhook do n8n:**
   - Vai ao nó Webhook no seu workflow
   - Em "Authentication", seleciona "Header Auth"
   - Cria ou seleciona credenciais do tipo "Webhook" com Header Auth

2. **Criar Credenciais de Header Auth:**
   - **Header Name**: O nome do header que o n8n vai verificar (ex: `Authorization`, `X-API-Key`, `X-Auth-Token`)
   - **Value**: O valor exato que o header deve ter para autenticação bem-sucedida

### Exemplo de Configuração no n8n

```
Header Name: Authorization
Value: c22901455210a4b05d379e44d41d7d46f12add97c60f0a4a3ffccdf638a54f5d
```

Quando uma requisição chega ao webhook, o n8n verifica se:
- O header especificado existe na requisição
- O valor do header corresponde exatamente ao valor configurado

## Nossa Implementação

### Método Header Auth (Padrão)

O `N8nClient` usa Header Auth por padrão, enviando o token diretamente no header especificado:

```typescript
const client = new N8nClient({
  webhookUrl: 'https://n8n.jmsit.cloud/webhook-test/...',
  authToken: 'c22901455210a4b05d379e44d41d7d46f12add97c60f0a4a3ffccdf638a54f5d',
  authMethod: 'header', // padrão
  authHeaderName: 'Authorization' // padrão
})
```

**Headers enviados:**
```
Content-Type: application/json
Authorization: c22901455210a4b05d379e44d41d7d46f12add97c60f0a4a3ffccdf638a54f5d
```

### Verificação de Compatibilidade

Para que a autenticação funcione, a configuração no n8n deve corresponder:

| Cliente (N8nClient) | n8n Webhook Config |
|---------------------|-------------------|
| `authHeaderName: 'Authorization'` | Header Name: `Authorization` |
| `authToken: 'c22901455210a4b05d379e44d41d7d46f12add97c60f0a4a3ffccdf638a54f5d'` | Value: `c22901455210a4b05d379e44d41d7d46f12add97c60f0a4a3ffccdf638a54f5d` |

## Outros Métodos de Autenticação

### Bearer Auth

Se o n8n estiver configurado para Bearer Auth:

```typescript
const client = new N8nClient({
  webhookUrl: 'https://n8n.jmsit.cloud/webhook-test/...',
  authToken: 'c22901455210a4b05d379e44d41d7d46f12add97c60f0a4a3ffccdf638a54f5d',
  authMethod: 'bearer'
})
```

**Headers enviados:**
```
Content-Type: application/json
Authorization: Bearer c22901455210a4b05d379e44d41d7d46f12add97c60f0a4a3ffccdf638a54f5d
```

**Configuração no n8n:**
- Authentication: Bearer Auth
- Token: `c22901455210a4b05d379e44d41d7d46f12add97c60f0a4a3ffccdf638a54f5d`

### Custom Header Name

Se o n8n estiver configurado para usar um header diferente:

```typescript
const client = new N8nClient({
  webhookUrl: 'https://n8n.jmsit.cloud/webhook-test/...',
  authToken: 'c22901455210a4b05d379e44d41d7d46f12add97c60f0a4a3ffccdf638a54f5d',
  authMethod: 'header',
  authHeaderName: 'X-API-Key' // ou outro nome
})
```

**Headers enviados:**
```
Content-Type: application/json
X-API-Key: c22901455210a4b05d379e44d41d7d46f12add97c60f0a4a3ffccdf638a54f5d
```

**Configuração no n8n:**
- Authentication: Header Auth
- Header Name: `X-API-Key`
- Value: `c22901455210a4b05d379e44d41d7d46f12add97c60f0a4a3ffccdf638a54f5d`

## Troubleshooting

### Erro 403 Forbidden

Se receberes um erro 403, verifica:

1. **Header Name corresponde?**
   - Verifica o nome do header configurado no n8n
   - Verifica o `authHeaderName` no `N8nClient`

2. **Token corresponde exatamente?**
   - O valor do token no n8n deve ser exatamente igual ao enviado
   - Sem espaços extras, sem prefixos (a menos que uses Bearer Auth)

3. **Método de autenticação correto?**
   - Se o n8n está configurado para Bearer Auth, usa `authMethod: 'bearer'`
   - Se o n8n está configurado para Header Auth, usa `authMethod: 'header'`

4. **CORS configurado?**
   - O n8n deve permitir requisições do teu domínio
   - Verifica as configurações de CORS no n8n

### Verificar Headers Enviados

Podes verificar os headers enviados através do console do browser:

```javascript
// Interceptar fetch para ver headers
const originalFetch = window.fetch;
window.fetch = function(...args) {
  if (args[0].includes('n8n.jmsit.cloud')) {
    console.log('Headers:', args[1].headers);
  }
  return originalFetch.apply(this, args);
};
```

## Documentação Oficial n8n

Segundo a [documentação oficial do n8n sobre HTTP Request credentials](https://docs.n8n.io/integrations/builtin/credentials/httprequest/):

### Header Auth (Generic Credential Type)

> "Use this generic authentication if your app or service supports header authentication.
> 
> To configure this credential, enter:
> - The header **Name** you need to pass to the app or service your HTTP request is targeting
> - The **Value** for the header"

### Bearer Auth (Generic Credential Type)

> "Use this generic authentication if your app or service supports bearer authentication. This authentication type is actually just header authentication with the `Name` set to `Authorization` and the `Value` set to `Bearer <token>`.
> 
> To configure this credential, enter:
> - The **Bearer Token** you need to pass to the app or service your HTTP request is targeting"

**Nota importante:** Bearer Auth é uma forma simplificada de Header Auth. Internamente, o n8n converte Bearer Auth para Header Auth com:
- Header Name: `Authorization`
- Value: `Bearer <token>`

### Nossa Implementação vs n8n

A nossa implementação está **100% compatível** com a documentação oficial do n8n:

| n8n Header Auth Config | Nossa Implementação | Status |
|------------------------|---------------------|--------|
| Header Name: `Authorization` | `authHeaderName: 'Authorization'` | ✅ Correto |
| Value: `c22901455210a4b05d379e44d41d7d46f12add97c60f0a4a3ffccdf638a54f5d` | `authToken: 'c22901455210a4b05d379e44d41d7d46f12add97c60f0a4a3ffccdf638a54f5d'` | ✅ Correto |
| Envia: `Authorization: <value>` | Envia: `Authorization: <token>` | ✅ Correto |

## Referências

- [n8n HTTP Request Credentials (Official Docs)](https://docs.n8n.io/integrations/builtin/credentials/httprequest/)
- [n8n Webhook Documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [n8n Webhook Credentials](https://docs.n8n.io/integrations/builtin/credentials/webhook/)

