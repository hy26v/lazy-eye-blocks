// ABOUTME: Starts the Lazy Eye Blocks browser application.
// ABOUTME: Loads user preferences before creating the initial application view.
import './icon.ico';
import './main.scss';

// generate pages from templates (see val-loader in the webpack configuration)
import './handlebars/pages/help/help.hjs';
import './handlebars/pages/home/index.hjs';
import './handlebars/pages/about/about.hjs';
import './handlebars/pages/exercise-page/exercise.hjs';

import {
    createSpeedMenu,
    createSettingsMenu,
    initStateViewManager,
    createLeftEyeColorPickerMenu,
    createRightEyeColorPickerMenu,
    createMainMenu,
    createBoardSizeSettingsMenu,
    createGameOverMenu,
    createTileColorDistributionMenu,
} from './ui';

import {
    MAIN_MENU_STATE,
    SETTINGS_MENU_STATE,
    SPEED_SETTINGS_MENU_STATE,
    LEFT_EYE_COLOR_PICKER_MENU_STATE,
    RIGHT_EYE_COLOR_PICKER_MENU_STATE,
    BOARD_SIZE_SETTINGS_STATE,
    TILE_COLOR_DISTRIBUTION_STATE,
    BLOCKS_STATE,
    GAME_OVER_STATE,
} from './state/consts';

import createBlocksCanvas from './blocks';
import initializeSettingsStorage from './utils/settings-storage';

window.onload = () => {
    initializeSettingsStorage();
    initStateViewManager(MAIN_MENU_STATE, {
        [MAIN_MENU_STATE]: createMainMenu(),
        [SETTINGS_MENU_STATE]: createSettingsMenu(),
        [SPEED_SETTINGS_MENU_STATE]: createSpeedMenu(),
        [LEFT_EYE_COLOR_PICKER_MENU_STATE]: createLeftEyeColorPickerMenu(),
        [RIGHT_EYE_COLOR_PICKER_MENU_STATE]: createRightEyeColorPickerMenu(),
        [BOARD_SIZE_SETTINGS_STATE]: createBoardSizeSettingsMenu(),
        [TILE_COLOR_DISTRIBUTION_STATE]: createTileColorDistributionMenu(),
        [BLOCKS_STATE]: createBlocksCanvas(),
        [GAME_OVER_STATE]: createGameOverMenu(),
    });
};
