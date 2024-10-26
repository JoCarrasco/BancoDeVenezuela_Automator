import { Builder, Browser } from "selenium-webdriver";
import { login, logout } from './auth';
import { getBalance, getAllInBankTransactions } from './operations';
import 'dotenv/config';

(async () => {
  let driver;

  try {
    driver = await new Builder().forBrowser(Browser.CHROME).build();
    const username = process.env.BDV_USERNAME;
    const password = process.env.BDV_PASSWORD;
    if (!username || !password) {
      console.error("Please provide a username and password in the ENV file");
      return;
    }
    
    const loginSuccessfully = await login(driver, username, password);
    if (loginSuccessfully) {
      // Do operations
      await getBalance(driver);
      await getAllInBankTransactions(driver);
      await logout(driver);
    }
  } catch (e: any) {
    console.error(e);
  }
})();

