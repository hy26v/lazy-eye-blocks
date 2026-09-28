// ABOUTME: Builds controls for the red and blue tile spawn percentages.
// ABOUTME: Updates the saved red tile percentage while keeping the split at 100%.
import { getState, setState, addStateObserver } from '../../state';
import { createElement, getClassList } from '../../web-api-polyfills';
import {
    createMenu,
    createMenuItem,
    createMenuItemText,
    createMenuTitle,
} from '../utils';
import { SETTINGS_MENU_STATE } from '../../state/consts';
import { goto } from '../../utils';

const PERCENTAGE_STEP = 5;

const createDistributionControl = () => {
    const control = createElement('div');
    getClassList(control).add('plus-minus-button');

    const decreaseButton = createElement('button');
    decreaseButton.innerText = '−';
    decreaseButton.setAttribute('aria-label', 'Decrease red tile percentage');
    decreaseButton.onclick = () => {
        const { redTilePercentage } = getState();
        setState({ redTilePercentage: Math.max(0, redTilePercentage - PERCENTAGE_STEP) });
    };

    const percentageLabel = createElement('div');
    const updatePercentageLabel = ({ redTilePercentage }) => {
        percentageLabel.innerText = `Red: ${redTilePercentage}% / Blue: ${100 - redTilePercentage}%`;
    };
    updatePercentageLabel(getState());
    addStateObserver(['redTilePercentage'], updatePercentageLabel);

    const increaseButton = createElement('button');
    increaseButton.innerText = '+';
    increaseButton.setAttribute('aria-label', 'Increase red tile percentage');
    increaseButton.onclick = () => {
        const { redTilePercentage } = getState();
        setState({ redTilePercentage: Math.min(100, redTilePercentage + PERCENTAGE_STEP) });
    };

    control.appendChild(decreaseButton);
    control.appendChild(percentageLabel);
    control.appendChild(increaseButton);
    return control;
};

export default function createTileColorDistributionMenu() {
    return createMenu([
        createMenuTitle('Red / blue tile mix'),
        createMenuItemText('Spawn chance per tile'),
        createDistributionControl(),
        createMenuItem('Back', () => goto(SETTINGS_MENU_STATE)),
    ]);
}
