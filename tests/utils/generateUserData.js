import { faker } from '@faker-js/faker';

export function generateUserData() {
  return {
    email: faker.internet.email(),
    name: faker.person.firstName(),
    surname: faker.person.lastName(),
    password: 'Password123' 
  };
}
