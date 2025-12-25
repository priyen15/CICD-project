// Simple test file
console.log('🧪 Running tests...');

// Test 1: Check if Express is available
try {
  require('express');
  console.log('✅ Test 1: Express module loaded successfully');
} catch (error) {
  console.error('❌ Test 1 Failed: Express module not found');
  process.exit(1);
}

// Test 2: Check environment variables
const PORT = process.env.PORT || 3000;
const VERSION = process.env.VERSION || '1.0.0';
console.log(`✅ Test 2: Environment variables loaded (PORT: ${PORT}, VERSION: ${VERSION})`);

// Test 3: Simple logic test
const sum = (a, b) => a + b;
if (sum(2, 3) === 5) {
  console.log('✅ Test 3: Basic logic test passed');
} else {
  console.error('❌ Test 3 Failed: Basic logic test failed');
  process.exit(1);
}

console.log('');
console.log('🎉 All tests passed!');
process.exit(0);