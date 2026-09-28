// ABOUTME: Sizes the game canvas to its responsive playfield container.
// ABOUTME: Keeps canvas pixels sharp and preserves the board's display scale.
import { getState } from '../../state';

// percent of the wrapper space to take
const FACTOR = 0.9;

/**
 * Adjust canvas size according to its outer container.
 * This method helps avoid "blurred" drawing on a canvas.
 */
export default function () {
    const { gameCanvas } = getState();
    const wrapper = document.querySelector('.game-canvas-wrapper');
    const { width, height } = wrapper.getBoundingClientRect();
    gameCanvas.setAttribute('width', width * FACTOR);
    gameCanvas.setAttribute('height', height * FACTOR);
    gameCanvas.style.width = `${width * FACTOR}px`;
    gameCanvas.style.height = `height: ${height * FACTOR}px`;
}
