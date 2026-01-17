# Setup Supabase via MCP (Model Context Protocol)

Vous avez configuré MCP Supabase avec votre projet:
- **Project Ref**: `kfymqhujigtzlzvxmdwi`

## Configuration MCP

Votre configuration MCP est prête dans votre fichier de configuration Cursor:
```json
{
  "mcpServers": {
    "supabase": {
      "url": "https://mcp.supabase.com/mcp?project_ref=kfymqhujigtzlzvxmdwi"
    }
  }
}
```

## Utilisation

### Option 1: Via l'interface Cursor (si MCP est actif)

Si le serveur MCP Supabase est activé dans Cursor, vous pouvez me demander:
- "Crée les tables Supabase via MCP"
- "Exécute le schéma SQL sur mon projet Supabase"

Et je pourrai exécuter le SQL directement via l'API MCP.

### Option 2: Via SQL Editor de Supabase (Recommandé pour l'instant)

En attendant que MCP soit pleinement fonctionnel:

1. Allez sur: https://app.supabase.com/project/kfymqhujigtzlzvxmdwi/sql
2. Ouvrez une nouvelle requête
3. Copiez tout le contenu de `supabase/schema.sql`
4. Collez et exécutez

### Option 3: Via les scripts existants

```bash
# Script simple
npm run setup:supabase

# Script automatique (nécessite DATABASE_URL)
node scripts/setup-supabase-direct.js
```

## Vérification

Après avoir créé les tables, vérifiez dans Supabase:
- **Table Editor**: https://app.supabase.com/project/kfymqhujigtzlzvxmdwi/editor
- Vérifiez que vous voyez les 8 tables principales

## Note sur MCP

MCP Supabase permet d'interagir avec votre projet Supabase directement depuis Cursor. Si le serveur MCP est actif, je pourrai:
- Exécuter du SQL
- Voir les tables
- Gérer la base de données

Si MCP n'est pas encore actif, utilisez les méthodes alternatives ci-dessus.
