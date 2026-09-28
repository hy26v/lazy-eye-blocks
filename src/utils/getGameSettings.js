// ABOUTME: Selects user-configurable game preferences from application state.
// ABOUTME: Defines the settings stored and restored by browser persistence.
/**
 * Extracts game related settings from the provided state.
 * @param {Object} state Current state object.
 */
export default function (state) {
    const {
        rows,
        columns,
        gridEnabled,
        coloringMode,
        leftEyeColor,
        rightEyeColor,
        increaseSpeedLevel,
        speedLevel,
        redTilePercentage,
    } = state;

    return {
        rows,
        columns,
        gridEnabled,
        coloringMode,
        leftEyeColor,
        rightEyeColor,
        increaseSpeedLevel,
        speedLevel,
        redTilePercentage,
    };
}
