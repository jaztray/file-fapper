import { app, BrowserWindow, globalShortcut, Menu } from 'electron';
import * as path from "path";
import * as url from "url";
import __basedir from '../basepath';

let mainWindow: BrowserWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		title: "File Fapper",
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
			webSecurity: false,
			nodeIntegration: true
		},
		show: false
	});

	mainWindow.once('ready-to-show', () => {
		mainWindow.show()
		mainWindow.maximize();
	});

	mainWindow.loadFile("dist/renderer/index.html");

	mainWindow.on('closed', function () {
		mainWindow.destroy();
	});

	globalShortcut.register('f5', function() {
		mainWindow.reload();
	});

	globalShortcut.register("f9", () => {
		mainWindow.webContents.toggleDevTools();
	});
}

Menu.setApplicationMenu(null);

(process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] as any) = true;

app.on('ready', createWindow);

app.on('activate', function () {
	if (mainWindow === null) createWindow()
});
