// ABOUTME: Assembles the blocks game interface and starts game handlers.
// ABOUTME: Places the playfield, navigation controls, and live stats in the game view.
import {
    getClassList,
    createElement,
} from '../web-api-polyfills';

import {
    createBackButton,
    createGameCanvas,
    createPlayPauseButton,
    createRestartGameButton,
} from './components';

import initGame from './game';
import { registerTouchEventListener } from './utils';
import createGameSidebar from './components/game-sidebar/index';
import createActionButton from './components/action-button';
import { setState } from '../state';
import {
    BLOCKS_GAME_PAUSE,
    BLOCKS_STATE,
    SETTINGS_MENU_STATE,
} from '../state/consts';

const openSettings = () => {
    setState({
        appState: SETTINGS_MENU_STATE,
        gameState: BLOCKS_GAME_PAUSE,
        settingsReturnState: BLOCKS_STATE,
    });
};

/**
 * Inits the game itself. Setups various handlers.
 */
export default function () {
    const canvas = createGameCanvas();
    registerTouchEventListener(canvas);

    const actionButtons = createElement('div');
    getClassList(actionButtons).add('game-toolbar-actions');
    actionButtons.appendChild(createPlayPauseButton());
    actionButtons.appendChild(createRestartGameButton());
    actionButtons.appendChild(createActionButton('Settings', openSettings));
    actionButtons.appendChild(createBackButton());

    const toolbar = createElement('header');
    getClassList(toolbar).add('action-button-row');
    const title = createElement('div');
    getClassList(title).add('game-toolbar-title');
    title.innerText = 'Lazy eye blocks';
    toolbar.appendChild(title);
    toolbar.appendChild(actionButtons);

    const layout = createElement('div');
    getClassList(layout).add('game-layout');
    layout.appendChild(canvas);
    layout.appendChild(createGameSidebar());

    const container = createElement('div');
    getClassList(container).add('game-container');
    container.appendChild(toolbar);
    container.appendChild(layout);

    initGame();
    return container;
}
