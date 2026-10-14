// ABOUTME: Maps touch swipes on the game canvas to shape movement actions.
// ABOUTME: Uses the bundled Hammer.js library, so it works without a network connection.
import Hammer from 'hammerjs';

import { getState } from '../../state';

import {
    fireDown,
    moveShapeLeft,
    moveShapeRight,
    rotateShape,
} from './shape-movement-utils';

const handleAction = (callback) => {
    const { gameBoard, currentShape } = getState();
    callback(currentShape, gameBoard);
};

/**
 * @param {HTMLCanvasElement} canvas A canvas that will handle swipes.
 */
// eslint-disable-next-line import/prefer-default-export
export const registerTouchEventListener = (canvas) => {
    const hammertime = new Hammer(canvas);

    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    hammertime.on('swipeup', () => handleAction(rotateShape));
    hammertime.on('swipeleft', () => handleAction(moveShapeLeft));
    hammertime.on('swiperight', () => handleAction(moveShapeRight));
    hammertime.on('swipedown', () => handleAction(fireDown));
};
