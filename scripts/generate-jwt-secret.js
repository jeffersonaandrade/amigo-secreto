#!/usr/bin/env node

/**
 * Script para gerar uma chave JWT secreta aleatória
 * Execute: node scripts/generate-jwt-secret.js
 */

const crypto = require('crypto');

const secret = crypto.randomBytes(32).toString('hex');

console.log('\n🔐 Chave JWT gerada:');
console.log(secret);
console.log('\n📋 Adicione esta linha no seu arquivo .env:');
console.log(`JWT_SECRET=${secret}\n`);

