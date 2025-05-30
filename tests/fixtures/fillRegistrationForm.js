export async function fillRegistrationForm(page, data = {}) {
    const {
        name = 'Test',
        surname = 'User',
        email = 'valid-email@mail.ru',
        password = 'Password123'
      } = data;
    await page.fill('#root .modal-overlay .registration-form input[name="name"]', name);
    await page.fill('#root .modal-overlay .registration-form input[name="surname"]', surname);
    await page.fill('#root .modal-overlay .registration-form input[name="email"]', email);
    await page.fill('#root .modal-overlay .registration-form input[name="password"]', password);
    await page.fill('#root .modal-overlay .registration-form input[name="confirm"]', password);
  }