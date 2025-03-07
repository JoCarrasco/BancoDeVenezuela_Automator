"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.logout = logout;
var selenium_webdriver_1 = require("selenium-webdriver");
var urls_1 = require("./urls");
function login(driver, username, password) {
    return __awaiter(this, void 0, void 0, function () {
        var submitUsernameButton, usernameTextbox, passwordTextbox, submitCredentialsButton, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 13, , 14]);
                    console.log("Login with username: " + username);
                    console.log("Opening login page");
                    return [4 /*yield*/, driver.get(urls_1.BASE_URL)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, driver.wait(selenium_webdriver_1.until.elementsLocated(selenium_webdriver_1.By.css('.button-login-container button')), 8000)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(selenium_webdriver_1.By.css('.button-login-container button'))];
                case 3:
                    submitUsernameButton = _a.sent();
                    console.log("Typing username...");
                    return [4 /*yield*/, driver.findElement(selenium_webdriver_1.By.css('form input'))];
                case 4:
                    usernameTextbox = _a.sent();
                    return [4 /*yield*/, usernameTextbox.sendKeys(username)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, submitUsernameButton.click()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, driver.wait(selenium_webdriver_1.until.elementsLocated(selenium_webdriver_1.By.css('app-confirmar-acceso form input')), 8000)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(selenium_webdriver_1.By.css('app-confirmar-acceso form input'))];
                case 8:
                    passwordTextbox = _a.sent();
                    return [4 /*yield*/, driver.findElement(selenium_webdriver_1.By.css('app-confirmar-acceso .button-container > button'))];
                case 9:
                    submitCredentialsButton = _a.sent();
                    console.log("Typing password...");
                    return [4 /*yield*/, passwordTextbox.sendKeys(password)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, submitCredentialsButton.click()];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, driver.wait(selenium_webdriver_1.until.urlContains("posicionconsolidada"), 20000)];
                case 12:
                    _a.sent();
                    return [2 /*return*/, true];
                case 13:
                    e_1 = _a.sent();
                    console.error(e_1);
                    return [2 /*return*/, false];
                case 14: return [2 /*return*/];
            }
        });
    });
}
function logout(driver) {
    return __awaiter(this, void 0, void 0, function () {
        var signOutButton;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, driver.get(urls_1.DASHBOARD_URL)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, driver.wait(selenium_webdriver_1.until.elementsLocated(selenium_webdriver_1.By.css('app-navbar .navbar .dropdown button:last-child')), 20000)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, driver.findElement(selenium_webdriver_1.By.css('app-navbar .navbar .dropdown button:last-child'))];
                case 3:
                    signOutButton = _a.sent();
                    return [4 /*yield*/, signOutButton.click()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, driver.quit()];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
