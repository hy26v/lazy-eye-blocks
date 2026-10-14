// ABOUTME: Builds the game's main menu with the logo title, New game and Settings.
// ABOUTME: Only creates the menu elements; state changes go through goto().
import {
    addBrandTitle,
    createMenu,
    createMenuItem,
    createMenuTitle,
} from '../utils';
import { goto } from '../../utils';

import { createNewGameButton } from '../components';

import { SETTINGS_MENU_STATE } from '../../state/consts';

export default function () {
    const mainMenu = createMenu();
    mainMenu.appendChild(addBrandTitle(createMenuTitle('')));
    mainMenu.appendChild(createNewGameButton());
    mainMenu.appendChild(createMenuItem('Settings', () => goto(SETTINGS_MENU_STATE)));
    return mainMenu;
}
