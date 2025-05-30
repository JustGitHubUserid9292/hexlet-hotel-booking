export async function fillLoginForm(page, data = {}) {
    const {
        email = 'dan_kapustin@mail.ru',
        password = 'gotothehellplz'
      } = data;
    
    await page.fill('#root .modal-overlay .signin-form input[name="email"]', email);
    await page.fill('#root .modal-overlay .signin-form input[name="password"]', password);
  }