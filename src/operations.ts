
import { By, until, WebDriver, WebElement } from "selenium-webdriver";
import { writeFile } from "fs";
import { DASHBOARD_URL } from "./urls";
import 'dotenv/config';


function getPaginationInfo(str: string) {
  const currentRange = str.split('-');
  const [startRange, currentAndLimitRaw] = currentRange;

  const endRangeAndLimit = currentAndLimitRaw.split('de');
  const [endRange, limit] = endRangeAndLimit;
  return {
    start: parseInt(startRange.trim(), 10),
    endRange: parseInt(endRange.trim(), 10),
    limit: parseInt(limit.trim(), 10)
  }
}

export async function getBalance(driver: WebDriver) {
  await driver.get(DASHBOARD_URL);
  await driver.wait(until.elementsLocated(By.css('.table-saldo-cuenta tr td:last-child mat-icon')), 8000);
  const displayBalanceIcon = await driver.findElement(By.css('.table-saldo-cuenta tr td:last-child mat-icon'));
  await displayBalanceIcon.click();
  await driver.wait(until.elementsLocated(By.css('app-modal-saldo-cuenta table tr td:last-child')), 8000);
  const balanceNumberCell = await driver.findElement(By.css('app-modal-saldo-cuenta table tr td:last-child'));
  await driver.wait(until.elementTextContains(balanceNumberCell, 'Bs'), 8000);
  const rawBalance = await balanceNumberCell.getText();
  console.log("Your current balance is: ", rawBalance);
}

export async function getAllInBankTransactions(driver: WebDriver, sendTransactionsToWebhook: boolean = false) {
  await driver.get(DASHBOARD_URL);
  await driver.wait(until.elementsLocated(By.css('.table-saldo-cuenta tr td:nth-child(3)')), 8000);
  const displayAllTransactionIcon = await driver.findElement(By.css('.table-saldo-cuenta tr td:nth-child(3)'));
  await displayAllTransactionIcon.click();
  await driver.wait(until.elementsLocated(By.css('app-modal-movimientos-cuentas')), 20000);
  await driver.wait(until.elementsLocated(By.css('div.mat-paginator-range-label')), 20000);
  const paginationLabelContainer = await driver.findElement(By.css('div.mat-paginator-range-label'));
  await driver.wait(until.elementTextIs(paginationLabelContainer, '1 - 10 de 100'), 20000);
  const paginatedInfo = getPaginationInfo(await paginationLabelContainer.getText());
  const table = await driver.findElement(By.css('app-modal-movimientos-cuentas mat-table'));
  const transactions = await getPaginatedTransactions(driver, table, paginatedInfo, []);
  console.log("Transactions returned: ", transactions.length);
  console.log("Sending transactions to webhook...");
  if (sendTransactionsToWebhook) {
    fetch(
      process.env.WEBHOOK_URL,
      {
        method: 'POST',
        body: JSON.stringify(transactions),
      }
    ).then(() => {
      console.log("Transactions sent to webhook successfully.");
      // writeTransactionsToFile(transactions);
    }).catch((e) => {
      console.error("Error sending transactions to webhook: ", e);
    });
  }
  console.log("Writting transactions to file...");
  writeFile('file.txt', JSON.stringify(transactions), function (err) {
    if (err) throw err;
    console.log('Transaction file is created successfully.');
  });
}

export async function getPaginatedTransactions(driver: WebDriver, table: WebElement, currentPagination: { start: number; endRange: number; limit: number }, transactions: any[]) {
  const rows = await table.findElements(By.css('mat-row'));
  console.log("Current pagination: ", currentPagination.endRange + " of " + currentPagination.limit);
  console.log("Getting: ", rows.length + " transactions");
  for (const r of rows) {
    const transactionDate = await r.findElement(By.css('mat-cell:nth-child(1)')).getText();
    const transactionId = await r.findElement(By.css('mat-cell:nth-child(2)')).getText();
    const transactionBankDescription = await r.findElement(By.css('mat-cell:nth-child(3)')).getText();
    const transactionType = await r.findElement(By.css('mat-cell:nth-child(4)')).getText();
    const transactionAmount = await r.findElement(By.css('mat-cell:nth-child(5)')).getText();
    const balanceAfterTransaction = await r.findElement(By.css('mat-cell:nth-child(6)')).getText();
    const obj = {
      date: transactionDate,
      id: transactionId,
      description: transactionBankDescription,
      type: transactionType,
      amount: transactionAmount,
      balanceAfterTransaction
    }
    transactions.push(obj);
  }
  if (currentPagination.endRange !== currentPagination.limit) {
    await driver.wait(until.elementsLocated(By.css('button.mat-paginator-navigation-next')), 20000);
    const nextButton = await driver.findElement(By.css('button.mat-paginator-navigation-next'));
    
    await nextButton.click();
    await driver.wait(until.elementsLocated(By.css('div.mat-paginator-range-label')), 20000);
    const paginationLabelContainer = await driver.findElement(By.css('div.mat-paginator-range-label'));
    const paginationInfo = getPaginationInfo(await paginationLabelContainer.getText());
    const table = await driver.findElement(By.css('app-modal-movimientos-cuentas mat-table'));
    return getPaginatedTransactions(driver,table, paginationInfo, transactions);
  }

  return transactions;
}
