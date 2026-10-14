// ABOUTME: Fills a heading element with the Lazy Eye Blocks logo and game name.
// ABOUTME: Reuses the site-wide .brand-mark styles, which match the site header and the app icon.
import { createElement, getClassList } from '../../../web-api-polyfills';

export const GAME_NAME = 'Lazy Eye Blocks';

/**
 * Adds the 2x2 block logo and the game name to an element.
 * @param {HTMLElement} element Heading element to fill.
 * @returns {HTMLElement} The same element.
 */
export default function (element) {
    const mark = createElement('span');
    getClassList(mark).add('brand-mark');
    mark.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 4; i += 1) {
        mark.appendChild(createElement('span'));
    }

    const name = createElement('span');
    name.innerText = GAME_NAME;

    getClassList(element).add('brand-title');
    element.appendChild(mark);
    element.appendChild(name);
    return element;
}
