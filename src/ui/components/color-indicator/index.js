// ABOUTME: Shows the selected eye color as a test block on the game background.
// ABOUTME: Keeps the calibration sample synchronized with color settings.
import { addStateObserver } from '../../../state';
import { createElement, getClassList } from '../../../web-api-polyfills';

export default function (colorExtractor) {
    const stage = createElement('div');
    getClassList(stage).add('color-indicator');
    stage.setAttribute('role', 'img');
    stage.setAttribute('aria-label', 'Selected color block on a black game background');

    const canvas = createElement('canvas');
    getClassList(canvas).add('color-indicator-block');
    canvas.width = 80;
    canvas.height = 80;
    canvas.setAttribute('aria-hidden', 'true');
    stage.appendChild(canvas);

    // bind to state changes
    // we don't know for sure on which properties it should be updated
    // so will sign it on all updates
    addStateObserver([], (state) => {
        const color = colorExtractor(state);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
    return stage;
}
