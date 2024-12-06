import { Builder, Browser } from "selenium-webdriver";
import { login, logout } from './auth';
import { getBalance, getAllInBankTransactions } from './operations';
import { Request, Response } from "express";
const express = require('express')
import 'dotenv/config';


const app = express();
const port = process.env.PORT || 3000;

app.get("/", async (req: Request, res: Response) => {
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
      await getAllInBankTransactions(driver, true);
      await logout(driver);
    }
  } catch (e: any) {
    console.error(e);
  }
  res.send("Success");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
