// ABOUTME: Persists user-selected game settings in browser local storage.
// ABOUTME: Restores settings at startup and saves them whenever they change.
import { LOCAL_STORAGE_SETTINGS_KEY } from '../config';
import { getState, setStateSilently, addStateObserver } from '../state';
import { getGameTicksInterval } from '../blocks/utils/game-utils';
import { loadItem, saveItem } from '../web-api-polyfills';
import getGameSettings from './getGameSettings';

const saveSettings = () => {
    const settings = getGameSettings(getState());
    saveItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
};

export default function initializeSettingsStorage() {
    const savedSettings = loadItem(LOCAL_STORAGE_SETTINGS_KEY);
    if (savedSettings != null) {
        try {
            const settings = JSON.parse(savedSettings);
            if (settings && typeof settings === 'object' && !Array.isArray(settings)) {
                const currentSettings = getGameSettings(getState());
                const restoredSettings = {};
                Object.keys(currentSettings).forEach((key) => {
                    if (Object.prototype.hasOwnProperty.call(settings, key)) {
                        restoredSettings[key] = settings[key];
                    }
                });

                if (typeof restoredSettings.speedLevel === 'number'
                    && Number.isFinite(restoredSettings.speedLevel)
                    && restoredSettings.speedLevel >= 0) {
                    restoredSettings.gameLogicTicksInterval = getGameTicksInterval(
                        restoredSettings.speedLevel,
                    );
                }
                setStateSilently(restoredSettings);
            }
        } catch (error) {
            // Ignore invalid stored data and continue with the default settings.
        }
    }

    addStateObserver(Object.keys(getGameSettings(getState())), saveSettings);
}
