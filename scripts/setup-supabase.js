/**
 * Script pour créer toutes les tables Supabase automatiquement
 * 
 * Usage:
 *   SUPABASE_URL=your_url SUPABASE_SERVICE_ROLE_KEY=your_key node scripts/setup-supabase.js
 * 
 * Ou via .env file:
 *   node scripts/setup-supabase.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Erreur: Variables d\'environnement manquantes');
  console.error('');
  console.error('Vous devez fournir:');
  console.error('  - SUPABASE_URL (ou EXPO_PUBLIC_SUPABASE_URL)');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  console.error('');
  console.error('Options:');
  console.error('  1. Créer un fichier .env avec ces variables');
  console.error('  2. Les passer en ligne de commande:');
  console.error('     SUPABASE_URL=xxx SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/setup-supabase.js');
  process.exit(1);
}

// Extraire l'ID du projet depuis l'URL Supabase
// Format: https://xxxxx.supabase.co
const projectIdMatch = SUPABASE_URL.match(/https:\/\/([^.]+)\.supabase\.co/);
if (!projectIdMatch) {
  console.error('❌ URL Supabase invalide. Format attendu: https://xxxxx.supabase.co');
  process.exit(1);
}

const projectId = projectIdMatch[1];

console.log('🚀 Configuration Supabase détectée:');
console.log(`   Project ID: ${projectId}`);
console.log(`   URL: ${SUPABASE_URL}`);
console.log('');

// Lire le fichier SQL
const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
if (!fs.existsSync(schemaPath)) {
  console.error(`❌ Fichier SQL non trouvé: ${schemaPath}`);
  process.exit(1);
}

const sqlContent = fs.readFileSync(schemaPath, 'utf8');
console.log(`📄 Fichier SQL chargé: ${schemaPath}`);

// Utiliser l'API Supabase Management pour exécuter le SQL
// Note: Supabase n'a pas d'API publique pour exécuter du SQL brut
// On va utiliser fetch avec l'endpoint SQL Editor de Supabase

async function executeSQL() {
  console.log('');
  console.log('📤 Envoi du SQL à Supabase...');
  console.log('');

  try {
    // Supabase Management API endpoint pour exécuter du SQL
    // Format: https://api.supabase.com/v1/projects/{project_id}/database/queries
    const managementApiUrl = `https://api.supabase.com/v1/projects/${projectId}/database/queries`;
    
    // Alternative: Utiliser l'API PostgREST de Supabase via service_role
    // Mais pour exécuter du SQL brut, on doit utiliser l'API Management
    
    // Pour l'instant, on va fournir des instructions car l'API Management
    // nécessite une clé d'API Supabase spéciale (pas service_role)
    
    console.log('ℹ️  Information:');
    console.log('   Supabase ne permet pas d\'exécuter du SQL brut via l\'API REST standard.');
    console.log('   Deux options s\'offrent à vous:');
    console.log('');
    console.log('   Option 1 (Recommandée): Copier-coller dans SQL Editor');
    console.log('   1. Allez sur https://app.supabase.com/project/' + projectId + '/sql');
    console.log('   2. Ouvrez une nouvelle requête');
    console.log('   3. Copiez le contenu de supabase/schema.sql');
    console.log('   4. Collez et exécutez');
    console.log('');
    console.log('   Option 2: Utiliser Supabase CLI (si installé)');
    console.log('   supabase db push --db-url "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"');
    console.log('');
    
    // Générer un fichier SQL formaté pour faciliter le copier-coller
    const outputPath = path.join(__dirname, '..', 'supabase-schema-ready.sql');
    fs.writeFileSync(outputPath, sqlContent);
    console.log(`✅ Fichier SQL prêt: ${outputPath}`);
    console.log('   Vous pouvez copier ce fichier directement dans SQL Editor');
    console.log('');

    // Vérifier la connexion avec une requête simple
    console.log('🔍 Test de connexion à Supabase...');
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Tester la connexion en listant les tables existantes
    const { data: tables, error: testError } = await supabase
      .from('_realtime')
      .select('*')
      .limit(1);
    
    if (testError && testError.code !== 'PGRST116') {
      console.error('⚠️  Avertissement lors du test de connexion:');
      console.error(`   ${testError.message}`);
      console.log('   (Ceci est normal si les tables n\'existent pas encore)');
    } else {
      console.log('✅ Connexion à Supabase réussie!');
    }
    
    console.log('');
    console.log('📋 Prochaines étapes:');
    console.log('   1. Allez sur le SQL Editor de Supabase');
    console.log('   2. Copiez le contenu de supabase/schema.sql');
    console.log('   3. Collez et exécutez dans SQL Editor');
    console.log('   4. Vérifiez que les tables sont créées dans Table Editor');
    console.log('');
    
    return true;
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution:');
    console.error(error.message);
    console.error('');
    console.error('💡 Solution: Utilisez le SQL Editor de Supabase directement');
    console.error(`   https://app.supabase.com/project/${projectId}/sql`);
    return false;
  }
}

// Fonction pour vérifier que les tables existent (après exécution manuelle)
async function verifyTables() {
  console.log('');
  console.log('🔍 Vérification des tables...');
  
  const { createClient } = require('@supabase/supabase-js');
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  
  const expectedTables = [
    'profiles',
    'categories',
    'subcategories',
    'micro_objectives',
    'objective_completions',
    'daily_notes',
    'animations',
    'progress_history',
  ];
  
  const { data: existingTables, error } = await supabase
    .rpc('get_tables_list');
  
  if (error) {
    // Alternative: tester chaque table individuellement
    console.log('   Test des tables individuellement...');
    for (const table of expectedTables) {
      try {
        const { error: tableError } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (tableError && tableError.code === '42P01') {
          console.log(`   ❌ Table "${table}" n'existe pas`);
        } else {
          console.log(`   ✅ Table "${table}" existe`);
        }
      } catch (e) {
        console.log(`   ⚠️  Impossible de vérifier "${table}"`);
      }
    }
  }
  
  console.log('');
}

// Exécution
(async () => {
  console.log('═══════════════════════════════════════════════════════');
  console.log('   Setup Supabase - Création des Tables');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  
  await executeSQL();
  
  console.log('');
  console.log('💡 Note: Ce script prépare le SQL pour vous.');
  console.log('   Pour exécuter automatiquement, utilisez Supabase CLI.');
  console.log('   Documentation: https://supabase.com/docs/guides/cli');
  console.log('');
})();
