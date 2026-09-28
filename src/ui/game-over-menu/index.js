// ABOUTME: Presents the final run stats and game-over actions.
// ABOUTME: Lets players start another game or return to the main menu.
import { addStateObserver, getState } from '../../state';
import { MAIN_MENU_STATE } from '../../state/consts';
import { goto } from '../../utils';
import { startNewGame } from '../../blocks/utils/game-utils';

import {
    createMenu,
    createMenuItem,
    createMenuTitle,
    createMenuItemText,
} from '../utils';

const getLevelMenuTitle = (speedLevel) => `Level: ${speedLevel}`;
const getScoreMenuTitle = (score) => `Score: ${score}`;

export default function () {
    const { score: currentScore, speedLevel: currentSpeedLevel } = getState();
    const scoreTitle = createMenuItemText(getScoreMenuTitle(currentScore));
    const speedLevelTitle = createMenuItemText(getLevelMenuTitle(currentSpeedLevel));

    addStateObserver(['score', 'speedLevel'], ({ score, speedLevel }) => {
        scoreTitle.innerHTML = getScoreMenuTitle(score);
        speedLevelTitle.innerHTML = getLevelMenuTitle(speedLevel);
    });

    return createMenu([
        createMenuTitle('Game over'),
        scoreTitle,
        speedLevelTitle,
        createMenuItem('New game', startNewGame),
        createMenuItem('Back', () => goto(MAIN_MENU_STATE)),
    ]);
}
