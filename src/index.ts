import { Builder, Browser } from "selenium-webdriver";
import { login, logout } from './auth';
import { getBalance, getAllInBankTransactions } from './operations';
import { Request, Response} from "express";
import 'dotenv/config';
import { Options } from "selenium-webdriver/chrome";

const app = require("express")();
const port = process.env.PORT || 3000;

app.get("/health", (req: Request, res: Response) => {
  res.send("Healthy");
});

app.get("/", async (req: Request, res: Response) => {
  let driver;
  const options = new Options();
  options.addArguments(
    "--headless=new",
  );
  try {
    driver = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .build();
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
      console.log("Successfully completed operations");
    }
  } catch (e: any) {
    console.error(e);
  }
  res.send("Success");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
