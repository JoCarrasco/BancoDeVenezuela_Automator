
import { By, until, WebDriver, WebElement } from "selenium-webdriver";
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
  const logTag = "[operations/getBalance]:";
  console.log(`${logTag} Getting balance...`);
  await driver.get(DASHBOARD_URL);
  console.log(`${logTag} Waiting for balance to be displayed...`);
  await driver.wait(until.elementsLocated(By.css('.table-saldo-cuenta tr td:last-child mat-icon')), 8000);
  const displayBalanceIcon = await driver.findElement(By.css('.table-saldo-cuenta tr td:last-child mat-icon'));
  await displayBalanceIcon.click();
  console.log(`${logTag} Waiting for balance number to be displayed...`);
  await driver.wait(until.elementsLocated(By.css('app-modal-saldo-cuenta table tr td:last-child')), 8000);
  const balanceNumberCell = await driver.findElement(By.css('app-modal-saldo-cuenta table tr td:last-child'));
  await driver.wait(until.elementTextContains(balanceNumberCell, 'Bs'), 8000);
  const rawBalance = await balanceNumberCell.getText();
  console.log(`${logTag} Balance number is: ` + rawBalance);
  return rawBalance;
}

export async function getAllInBankTransactions(driver: WebDriver, sendTransactionsToWebhook: boolean = false) {
  const logTag = "[operations/getAllInBankTransactions]:";
  console.log(`${logTag} Getting all in bank transactions...`);
  await driver.get(DASHBOARD_URL);
  await driver.wait(until.elementsLocated(By.css('.table-saldo-cuenta tr td:nth-child(3)')), 8000);
  console.log(`${logTag} Displaying all transactions...`);
  const displayAllTransactionIcon = await driver.findElement(By.css('.table-saldo-cuenta tr td:nth-child(3)'));
  await displayAllTransactionIcon.click();
  console.log(`${logTag} Waiting for transactions to be displayed...`);
  await driver.wait(until.elementsLocated(By.css('app-modal-movimientos-cuentas')), 20000);
  await driver.wait(until.elementsLocated(By.css('div.mat-paginator-range-label')), 20000);
  const paginationLabelContainer = await driver.findElement(By.css('div.mat-paginator-range-label'));
  console.log(`${logTag} Waiting for pagination label to be displayed...`);
  await driver.wait(until.elementTextIs(paginationLabelContainer, '1 - 10 de 100'), 20000);
  const paginatedInfo = getPaginationInfo(await paginationLabelContainer.getText());
  console.log(`${logTag} Getting transactions...`);
  const table = await driver.findElement(By.css('app-modal-movimientos-cuentas mat-table'));
  const transactions = await getPaginatedTransactions(driver, table, paginatedInfo, []);
  console.log(`${logTag} Transactions: ` + transactions.length);

  if (sendTransactionsToWebhook) {
    console.log(`${logTag} Sending transactions to webhook...`);
    fetch(
      process.env.WEBHOOK_URL,
      {
        method: 'POST',
        body: JSON.stringify(transactions),
      }
    ).then(() => {
      console.log(`${logTag} Transactions sent to webhook.`);
      // writeTransactionsToFile(transactions);
    }).catch((e) => {
      console.error(`${logTag} Error sending transactions to webhook: `, e);
    });
  }
}

export async function getPaginatedTransactions(driver: WebDriver, table: WebElement, currentPagination: { start: number; endRange: number; limit: number }, transactions: any[]) {
  const logTag = "[operations/getPaginatedTransactions]:";
  const rows = await table.findElements(By.css('mat-row'));
  console.log(`${logTag} Current pagination: `, currentPagination.endRange + " of " + currentPagination.limit);
  console.log(`${logTag} Getting: `, rows.length + " transactions");

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
    console.log(`${logTag} Clicking on next button...`);
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
