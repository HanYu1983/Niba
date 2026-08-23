/**
 * Character JSON Schema Validator
 * Validates all character JSON files in the characters/ directory
 * Run: node tests/validate-characters.js
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const CHARACTERS_DIR = path.join(__dirname, '..', 'characters');

// Track test results
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
let errors = [];

// ============================================================
// Schema Definition
// ============================================================

const characterSchema = {
  // Root level
  character: {
    type: 'object',
    required: true,
    fields: {
      // Basic info (12 fields, order matters)
      id: { type: 'string', required: true, pattern: /^[a-z][a-z0-9_]*$/ },
      name: { type: 'string', required: true, minLength: 1 },
      englishName: { type: 'string', required: true, minLength: 1 },
      title: { type: 'string', required: true, minLength: 1 },
      era: { type: 'string', required: true },
      birthYear: { type: 'number', required: true },
      deathYear: { type: 'number', required: true },
      lifespan: { type: 'number', required: true, min: 0, max: 1000 },
      region: { type: 'string', required: true },
      role: { type: 'string', required: true },
      status: { type: 'string', required: true },

      // Appearance
      appearance: {
        type: 'object',
        required: true,
        fields: {
          description: { type: 'string', required: true, minLength: 1 },
          height: { type: 'string', required: true, minLength: 1 },
          build: { type: 'string', required: true, minLength: 1 },
        },
      },

      // Personality
      personality: {
        type: 'object',
        required: true,
        fields: {
          coreTraits: { type: 'array', required: true, minItems: 3 },
          strengths: { type: 'array', required: true, minItems: 2 },
          weaknesses: { type: 'array', required: true, minItems: 2 },
        },
      },

      // Background
      background: {
        type: 'object',
        required: true,
        fields: {
          origin: { type: 'string', required: true, minLength: 1 },
          motivation: { type: 'string', required: true, minLength: 1 },
          discovery: {
            type: 'object',
            required: true,
            fields: {
              event: { type: 'string', required: true, minLength: 1 },
              year: { type: 'number', required: true },
              location: { type: 'string', required: true, minLength: 1 },
              description: { type: 'string', required: true, minLength: 1 },
              significance: { type: 'string', required: true, minLength: 1 },
            },
          },
        },
      },

      // Relationships
      relationships: {
        type: 'object',
        required: true,
      },

      // Legacy
      legacy: {
        type: 'object',
        required: true,
        fields: {
          culturalImpact: { type: 'array', required: true, minItems: 3 },
          historicalDebate: { type: 'array', required: true, minItems: 1 },
        },
      },

      // Historical Significance
      historicalSignificance: {
        type: 'object',
        required: true,
        fields: {
          energySystem: { type: 'string', required: true, minLength: 1 },
          civilization: { type: 'string', required: true, minLength: 1 },
          philosophy: { type: 'string', required: true, minLength: 1 },
          timeline: { type: 'string', required: true, minLength: 1 },
        },
      },

      // Historical Context
      historicalContext: {
        type: 'object',
        required: true,
        fields: {
          era: { type: 'string', required: true, minLength: 1 },
          worldState: { type: 'string', required: true, minLength: 1 },
          parallelEvents: { type: 'array', required: true, minItems: 2 },
          significance: { type: 'string', required: true, minLength: 1 },
        },
      },

      // Artifacts
      artifacts: {
        type: 'array',
        required: true,
      },

      // Quotes
      quotes: {
        type: 'array',
        required: true,
        minItems: 1,
        itemSchema: {
          text: { type: 'string', required: true, minLength: 1 },
          context: { type: 'string', required: true, minLength: 1 },
          significance: { type: 'string', required: true, minLength: 1 },
        },
      },
    },
  },
};

// ============================================================
// Validation Functions
// ============================================================

function assert(condition, message, file) {
  totalTests++;
  if (condition) {
    passedTests++;
  } else {
    failedTests++;
    errors.push(`  ❌ [${file}] ${message}`);
  }
}

function validateType(value, expectedType, fieldName, file) {
  const typeMap = {
    string: (v) => typeof v === 'string',
    number: (v) => typeof v === 'number' && !isNaN(v),
    boolean: (v) => typeof v === 'boolean',
    object: (v) => typeof v === 'object' && v !== null && !Array.isArray(v),
    array: (v) => Array.isArray(v),
  };

  const validator = typeMap[expectedType];
  if (validator) {
    assert(validator(value), `${fieldName} 應為 ${expectedType} 類型，實際為 ${typeof value}`, file);
  }
}

function validateField(value, schema, fieldName, file) {
  if (value === undefined || value === null) {
    if (schema.required) {
      assert(false, `缺少必填欄位: ${fieldName}`, file);
    }
    return;
  }

  // Type check
  validateType(value, schema.type, fieldName, file);

  // String validations
  if (schema.type === 'string' && typeof value === 'string') {
    if (schema.minLength) {
      assert(value.length >= schema.minLength, `${fieldName} 長度至少為 ${schema.minLength}，實際為 ${value.length}`, file);
    }
    if (schema.pattern) {
      assert(schema.pattern.test(value), `${fieldName} 格式不符，應符合 ${schema.pattern}`, file);
    }
  }

  // Number validations
  if (schema.type === 'number' && typeof value === 'number') {
    if (schema.min !== undefined) {
      assert(value >= schema.min, `${fieldName} 應 >= ${schema.min}，實際為 ${value}`, file);
    }
    if (schema.max !== undefined) {
      assert(value <= schema.max, `${fieldName} 應 <= ${schema.max}，實際為 ${value}`, file);
    }
  }

  // Array validations
  if (schema.type === 'array' && Array.isArray(value)) {
    if (schema.minItems) {
      assert(value.length >= schema.minItems, `${fieldName} 至少需要 ${schema.minItems} 個項目，實際為 ${value.length}`, file);
    }
    if (schema.itemSchema && value.length > 0) {
      value.forEach((item, index) => {
        Object.entries(schema.itemSchema).forEach(([key, fieldSchema]) => {
          if (fieldSchema.required && (!item[key] || (fieldSchema.type === 'string' && item[key].length === 0))) {
            assert(false, `${fieldName}[${index}] 缺少必填欄位: ${key}`, file);
          }
        });
      });
    }
  }

  // Object validations
  if (schema.type === 'object' && typeof value === 'object' && value !== null && !Array.isArray(value)) {
    if (schema.fields) {
      Object.entries(schema.fields).forEach(([key, fieldSchema]) => {
        validateField(value[key], fieldSchema, `${fieldName}.${key}`, file);
      });
    }
  }
}

function validateCharacterData(data, file) {
  // Validate against schema
  validateField(data.character, characterSchema.character, 'character', file);

  const char = data.character;

  // Cross-field validations
  if (typeof char.birthYear === 'number' && typeof char.deathYear === 'number') {
    assert(char.birthYear < char.deathYear, `birthYear (${char.birthYear}) 應小於 deathYear (${char.deathYear})`, file);
  }

  if (typeof char.birthYear === 'number' && typeof char.deathYear === 'number' && typeof char.lifespan === 'number') {
    const calculatedLifespan = char.deathYear - char.birthYear;
    assert(calculatedLifespan === char.lifespan, `lifespan (${char.lifespan}) 應等於 deathYear - birthYear (${calculatedLifespan})`, file);
  }

  // ID uniqueness check (will be done after loading all files)
  if (char.id) {
    assert(/^[a-z][a-z0-9_]*$/.test(char.id), `id 格式應為蛇形命名法（snake_case），以小寫字母開頭，實際為 ${char.id}`, file);
  }

  // Check that arrays are not empty if they exist
  if (char.achievements && Array.isArray(char.achievements)) {
    assert(char.achievements.length > 0, 'achievements 不應為空陣列', file);
  }

  // Check quotes format if exists
  if (char.quotes && Array.isArray(char.quotes)) {
    char.quotes.forEach((quote, index) => {
      if (quote.text) {
        assert(quote.text.length > 0, `quotes[${index}].text 不應為空`, file);
      }
      if (quote.context) {
        assert(quote.context.length > 0, `quotes[${index}].context 不應為空`, file);
      }
    });
  }
}

// ============================================================
// Main Test Runner
// ============================================================

function runTests() {
  console.log(`\n${colors.cyan}========================================`);
  console.log('  Character JSON Schema Validator');
  console.log('========================================\n');

  // Check if characters directory exists
  if (!fs.existsSync(CHARACTERS_DIR)) {
    console.log(`${colors.red}❌ 找不到 characters 目錄: ${CHARACTERS_DIR}${colors.reset}`);
    process.exit(1);
  }

  // Get all JSON files
  const jsonFiles = fs.readdirSync(CHARACTERS_DIR)
    .filter(file => file.endsWith('.json'))
    .sort();

  if (jsonFiles.length === 0) {
    console.log(`${colors.yellow}⚠️  找不到任何角色 JSON 文件${colors.reset}`);
    process.exit(0);
  }

  console.log(`${colors.blue}找到 ${jsonFiles.length} 個角色文件：${jsonFiles.join(', ')}${colors.reset}\n`);

  const characterIds = new Set();

  // Validate each file
  jsonFiles.forEach(file => {
    const filePath = path.join(CHARACTERS_DIR, file);
    console.log(`${colors.cyan}📄 驗證 ${file}...${colors.reset}`);

    // Test 1: Valid JSON
    let data;
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      data = JSON.parse(content);
      assert(true, 'JSON 格式正確', file);
    } catch (e) {
      assert(false, `JSON 解析失敗: ${e.message}`, file);
      return; // Skip further tests if JSON is invalid
    }

    // Test 2: Has character root object
    assert(typeof data.character === 'object' && data.character !== null, '應包含 character 物件', file);

    // Test 3: Validate all fields
    validateCharacterData(data, file);

    // Test 4: Check ID uniqueness
    if (data.character && data.character.id) {
      if (characterIds.has(data.character.id)) {
        assert(false, `重複的 character id: ${data.character.id}`, file);
      } else {
        characterIds.add(data.character.id);
        assert(true, `character id 唯一: ${data.character.id}`, file);
      }
    }

    console.log(`   ✅ ${file} 驗證完成\n`);
  });

  // Print results
  console.log(`${colors.cyan}========================================`);
  console.log('  測試結果');
  console.log('========================================\n');

  console.log(`  總測試數: ${totalTests}`);
  console.log(`  ${colors.green}✅ 通過: ${passedTests}${colors.reset}`);
  console.log(`  ${colors.red}❌ 失敗: ${failedTests}${colors.reset}\n`);

  if (errors.length > 0) {
    console.log(`${colors.red}錯誤詳情：${colors.reset}`);
    errors.forEach(err => console.log(err));
    console.log('');
  }

  if (failedTests > 0) {
    console.log(`${colors.red}❌ 驗證失敗！請修正上述錯誤後再提交。${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`${colors.green}✅ 所有角色 JSON 格式驗證通過！${colors.reset}`);
    process.exit(0);
  }
}

// Run tests
runTests();
