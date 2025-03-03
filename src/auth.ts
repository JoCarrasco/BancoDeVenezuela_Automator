import { By, until, WebDriver } from "selenium-webdriver";
import { BASE_URL, DASHBOARD_URL } from "./urls";

export async function login(driver: WebDriver, username: string, password: string): Promise<boolean> {
	const logTag = "[auth/login]:";
	try {
		console.log(`${logTag} Logging in...`);
		console.log(`${logTag} Login with username:` + username);
		console.log(`${logTag} Opening login page"`);
		await driver.get(BASE_URL);
		await driver.wait(until.elementsLocated(By.css('.button-login-container button')), 10000);
		const submitUsernameButton = await driver.findElement(By.css('.button-login-container button'))
		console.log(`${logTag} Typing username..."`);
		const usernameTextbox = await driver.findElement(By.css('form input'));
		await usernameTextbox.sendKeys(username);
		await submitUsernameButton.click();
		await driver.wait(until.elementsLocated(By.css('app-confirmar-acceso form input')), 10000);
		const passwordTextbox = await driver.findElement(By.css('app-confirmar-acceso form input'))
		const submitCredentialsButton = await driver.findElement(By.css('app-confirmar-acceso .button-container > button'))
		console.log(`${logTag} Typing password..."`);
		await passwordTextbox.sendKeys(password);
		await submitCredentialsButton.click();
		console.log(`${logTag} Waiting for redirection... to: ` + DASHBOARD_URL);
		await driver.wait(until.urlContains("posicionconsolidada"), 20000);
		return true;
	} catch (e: any) {
		console.error(e);
		return false;
	}
}

export async function logout(driver: WebDriver) {
	const logTag = "[auth/logout]:";
	console.log(`${logTag} Logging out..."`);
	await driver.get(DASHBOARD_URL);
	console.log(`${logTag} Opening dropdown..."`);
	await driver.wait(until.elementsLocated(By.css('app-navbar .navbar .dropdown button:last-child')), 20000);
	const signOutButton = await driver.findElement(By.css('app-navbar .navbar .dropdown button:last-child'));
	console.log(`${logTag} Clicking on sign out button..."`);
	await signOutButton.click();
	console.log(`${logTag} Waiting for redirection..."`);
	await driver.quit();
}
