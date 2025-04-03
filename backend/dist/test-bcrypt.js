"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
async function testBcrypt() {
    const plaintextPassword = 'tenant1234';
    const wrongPassword = 'wrongPassword';
    const hashedPassword = await bcrypt.hash(plaintextPassword, 10);
    console.log('Hashed Password:', hashedPassword);
    const isMatchCorrect = await bcrypt.compare(plaintextPassword, hashedPassword);
    console.log('Does the correct password match?', isMatchCorrect);
    const isMatchWrong = await bcrypt.compare(wrongPassword, hashedPassword);
    console.log('Does the wrong password match?', isMatchWrong);
}
testBcrypt().catch(console.error);
//# sourceMappingURL=test-bcrypt.js.map