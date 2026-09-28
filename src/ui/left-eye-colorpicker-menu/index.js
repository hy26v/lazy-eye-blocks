// ABOUTME: Builds the left-eye color calibration screen.
// ABOUTME: Updates the left-eye color while displaying a live test block.
import { setState } from '../../state';
import { colorPicker, colorIndicator } from '../components';
import {
    createMenu, createMenuItem, createMenuItemText, createMenuTitle,
} from '../utils';
import { goto } from '../../utils';

import { SETTINGS_MENU_STATE } from '../../state/consts';

export default function () {
    return createMenu([
        createMenuTitle('Left eye color'),
        createMenuItemText('With glasses on, make the block disappear through your right lens while keeping it visible through your left.'),
        colorIndicator((state) => state.leftEyeColor),
        colorPicker((color) => setState({ leftEyeColor: color })),
        createMenuItem('Back', () => goto(SETTINGS_MENU_STATE)),
    ]);
}
