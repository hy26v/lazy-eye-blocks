// ABOUTME: Builds the right-eye color calibration screen.
// ABOUTME: Updates the right-eye color while displaying a live test block.
import { setState } from '../../state';
import { colorPicker, colorIndicator } from '../components';
import {
    createMenu, createMenuItem, createMenuItemText, createMenuTitle,
} from '../utils';

import { SETTINGS_MENU_STATE } from '../../state/consts';
import { goto } from '../../utils';

export default function () {
    return createMenu([
        createMenuTitle('Right eye color'),
        createMenuItemText('With glasses on, make the block disappear through your left lens while keeping it visible through your right.'),
        colorIndicator((state) => state.rightEyeColor),
        colorPicker((color) => setState({ rightEyeColor: color })),
        createMenuItem('Back', () => goto(SETTINGS_MENU_STATE)),
    ]);
}
