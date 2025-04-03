import * as bcrypt from 'bcrypt';

async function testBcrypt() {
  const plaintextPassword = 'admin1234';
  const wrongPassword = 'wrongPassword';
  
  // Hash the password
  const hashedPassword = await bcrypt.hash(plaintextPassword, 10);
  console.log('Hashed Password:', hashedPassword);

  // Test with the correct password
  const isMatchCorrect = await bcrypt.compare(plaintextPassword, hashedPassword);
  console.log('Does the correct password match?', isMatchCorrect); // Should print: true

  // Test with the wrong password
  const isMatchWrong = await bcrypt.compare(wrongPassword, hashedPassword);
  console.log('Does the wrong password match?', isMatchWrong); // Should print: false
}

testBcrypt().catch(console.error);