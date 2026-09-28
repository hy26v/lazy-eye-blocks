// ABOUTME: Builds the settings menu and its available preference controls.
// ABOUTME: Routes users to settings pages and preference actions.
import { createMenu, createMenuItem, createMenuTitle } from '../utils';
import {
    createGridButton,
    createSaveSettingsButton,
    createColoringModeButton,
    createLoadSettingsButton,
} from '../components';

import {
    BLOCKS_GAME_PLAYING,
    BLOCKS_STATE,
    MAIN_MENU_STATE,
    SPEED_SETTINGS_MENU_STATE,
    LEFT_EYE_COLOR_PICKER_MENU_STATE,
    RIGHT_EYE_COLOR_PICKER_MENU_STATE,
    BOARD_SIZE_SETTINGS_STATE,
    TILE_COLOR_DISTRIBUTION_STATE,
} from '../../state/consts';
import { getState, setState } from '../../state';
import { goto } from '../../utils';

const returnFromSettings = () => {
    const { settingsReturnState } = getState();
    if (settingsReturnState === BLOCKS_STATE) {
        setState({
            appState: BLOCKS_STATE,
            gameState: BLOCKS_GAME_PLAYING,
            settingsReturnState: MAIN_MENU_STATE,
        });
        return;
    }

    setState({ appState: MAIN_MENU_STATE, settingsReturnState: MAIN_MENU_STATE });
};

/**
 * Creates and configures settings menu.
 */
export default function () {
    return createMenu([
        createMenuTitle('Settings'),
        createGridButton(),
        createColoringModeButton(),
        createMenuItem('Speed level', () => goto(SPEED_SETTINGS_MENU_STATE)),
        createMenuItem('Left eye color', () => goto(LEFT_EYE_COLOR_PICKER_MENU_STATE)),
        createMenuItem('Right eye color', () => goto(RIGHT_EYE_COLOR_PICKER_MENU_STATE)),
        createMenuItem('Board size', () => goto(BOARD_SIZE_SETTINGS_STATE)),
        createMenuItem('Red / blue tile mix', () => goto(TILE_COLOR_DISTRIBUTION_STATE)),
        createSaveSettingsButton(),
        createLoadSettingsButton(),
        createMenuItem('Back', returnFromSettings),
    ]);
}
