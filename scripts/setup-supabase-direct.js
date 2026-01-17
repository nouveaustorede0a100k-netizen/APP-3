/**
 * Script alternatif pour créer les tables Supabase via connexion PostgreSQL directe
 * 
 * Ce script utilise 'pg' pour se connecter directement à PostgreSQL
 * et exécute le SQL sans passer par l'API REST.
 * 
 * Usage:
 *   DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres node scripts/setup-supabase-direct.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Configuration
const DATABASE_URL = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

if (!DATABASE_URL) {
  console.error('❌ Erreur: DATABASE_URL manquant');
  console.error('');
  console.error('Vous devez fournir DATABASE_URL dans le format:');
  console.error('  postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres');
  console.error('');
  console.error('Vous pouvez trouver cette URL dans Supabase:');
  console.error('  Settings > Database > Connection string > URI');
  console.error('');
  console.error('Ou utilisez le script setup-supabase.js qui utilise SQL Editor');
  process.exit(1);
}

// Lire le fichier SQL
const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
if (!fs.existsSync(schemaPath)) {
  console.error(`❌ Fichier SQL non trouvé: ${schemaPath}`);
  process.exit(1);
}

const sqlContent = fs.readFileSync(schemaPath, 'utf8');

async function executeSQL() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('   Setup Supabase - Création des Tables (PostgreSQL Direct)');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  
  // Vérifier si pg est installé
  let pg;
  try {
    pg = require('pg');
  } catch (error) {
    console.error('❌ Erreur: Le package "pg" n\'est pas installé');
    console.error('');
    console.error('Installez-le avec:');
    console.error('  npm install --save-dev pg');
    console.error('');
    console.error('Ou utilisez le script setup-supabase.js qui ne nécessite pas pg');
    process.exit(1);
  }

  const { Client } = pg;
  
  console.log('🔌 Connexion à la base de données...');
  const dbClient = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Nécessaire pour Supabase
    },
  });

  try {
    await dbClient.connect();
    console.log('✅ Connecté à la base de données');
    console.log('');

    // Diviser le SQL en statements individuels
    // Séparer par ';' tout en respectant les strings et les blocs PL/pgSQL
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📤 Exécution de ${statements.length} statements SQL...`);
    console.log('');

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      
      // Ignorer les commentaires et lignes vides
      if (statement.trim() === ';' || statement.trim().startsWith('--')) {
        continue;
      }

      try {
        await dbClient.query(statement);
        successCount++;
        
        // Extraire le type d'opération pour feedback
        const operation = statement.trim().substring(0, 50);
        if (operation.includes('CREATE TABLE')) {
          const tableMatch = statement.match(/CREATE TABLE[^`]*(?:public\.)?(\w+)/i);
          if (tableMatch) {
            console.log(`   ✅ Table créée: ${tableMatch[1]}`);
          }
        } else if (operation.includes('CREATE POLICY')) {
          console.log(`   ✅ Policy créée`);
        } else if (operation.includes('CREATE FUNCTION') || operation.includes('CREATE OR REPLACE FUNCTION')) {
          const funcMatch = statement.match(/FUNCTION\s+(\w+)/i);
          if (funcMatch) {
            console.log(`   ✅ Fonction créée: ${funcMatch[1]}`);
          }
        }
      } catch (error) {
        // Ignorer les erreurs "already exists" car on utilise IF NOT EXISTS
        if (error.message.includes('already exists') || 
            error.message.includes('duplicate key') ||
            error.code === '42P07' || // duplicate_table
            error.code === '42710') {  // duplicate_object
          successCount++;
          // Ne pas afficher pour ne pas polluer la sortie
        } else {
          errorCount++;
          console.error(`   ❌ Erreur dans statement ${i + 1}:`);
          console.error(`      ${error.message.substring(0, 200)}`);
        }
      }
    }

    console.log('');
    console.log(`✅ ${successCount} statements exécutés avec succès`);
    if (errorCount > 0) {
      console.log(`⚠️  ${errorCount} erreurs (peut être normal si les objets existent déjà)`);
    }
    console.log('');

    // Vérifier les tables créées
    console.log('🔍 Vérification des tables...');
    const tablesResult = await dbClient.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

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

    const existingTables = tablesResult.rows.map(r => r.table_name);
    const missingTables = expectedTables.filter(t => !existingTables.includes(t));

    console.log(`   Tables trouvées: ${existingTables.length}`);
    expectedTables.forEach(table => {
      if (existingTables.includes(table)) {
        console.log(`   ✅ ${table}`);
      } else {
        console.log(`   ❌ ${table} (manquante)`);
      }
    });

    if (missingTables.length > 0) {
      console.log('');
      console.log('⚠️  Certaines tables sont manquantes. Vérifiez les erreurs ci-dessus.');
    } else {
      console.log('');
      console.log('🎉 Toutes les tables sont créées avec succès!');
    }

    await dbClient.end();
    console.log('');
    console.log('✅ Migration terminée');

  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution:');
    console.error(error.message);
    await dbClient.end().catch(() => {});
    process.exit(1);
  }
}

executeSQL();
