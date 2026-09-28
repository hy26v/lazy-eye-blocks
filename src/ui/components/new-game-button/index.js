// ABOUTME: Creates the action that starts a fresh blocks game.
// ABOUTME: Routes directly into play and refreshes the game state.
import { createMenuItem } from '../../utils';
import { startNewGame } from '../../../blocks/utils/game-utils';

export default function () {
    return createMenuItem('New game', startNewGame);
}
