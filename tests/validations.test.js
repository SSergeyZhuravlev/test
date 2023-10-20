import { isValidEmail } from './validations.js';

test('testing valid email', () => {
  expect(isValidEmail('email@email.com')).toBe(true);
});
