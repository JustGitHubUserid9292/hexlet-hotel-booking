import { userData } from "../utils/loginData";

export async function login(page) {
    
    await page.click('.profile');
  
    await page.waitForSelector('.modal-overlay.show .registration-form'); 
  
    await page.click('.registration-form .reg-check a'); 

    await page.waitForSelector('.modal-overlay.show .signin-form'); 

    await page.fill('.signin-form input[name="email"]', userData.email); 
    await page.fill('.signin-form input[name="password"]', userData.password);   
  
    await page.click('.signin-form button.signin-confirm');
  
    await page.waitForSelector('.modal-overlay.show', { state: 'hidden' });
  }