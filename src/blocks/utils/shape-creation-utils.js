// ABOUTME: Creates randomized falling block shapes and their color assignments.
// ABOUTME: Defines the spawn position and metadata used by the blocks game.

import { DEFAULT_RED_TILE_PERCENTAGE } from '../../config';
import { MODE_ALTERNATE_CELLS, MODE_ALTERNATE_SHAPES } from '../../state/consts';
import {
    SHAPE_TYPES,
    SHAPE_FORMS,
    LEFT_EYE_BOARD_CELL,
    RIGHT_EYE_BOARD_CELL,
} from './consts';

const getRandomCellColor = (redTilePercentage) => {
    if (Math.random() < redTilePercentage / 100) {
        return LEFT_EYE_BOARD_CELL;
    }
    return RIGHT_EYE_BOARD_CELL;
};

const initShapeColors = (coloringMode, redTilePercentage) => {
    switch (coloringMode) {
    case MODE_ALTERNATE_CELLS:
        return [1, 1, 1, 1]
            .map(() => getRandomCellColor(redTilePercentage));
    case MODE_ALTERNATE_SHAPES:
        // eslint-disable-next-line no-case-declarations
        const cell = getRandomCellColor(redTilePercentage);
        return [cell, cell, cell, cell];
    default:
        // do nothing
        return null;
    }
};

const getSpawnY = (type) => {
    const highestCellOffset = Math.max(...SHAPE_FORMS[type][0].map(([, y]) => y));
    return -highestCellOffset - 1;
};

/**
 * Creates new shape object.
 * @param {string} type String that denotes type of the shape. See SHAPE_TYPES.
 * @param {number} columCount Column count of the game border.
 * @param {string} coloringMode Defines coloring of the shapes.
 */
export const createShape = (
    type,
    columCount,
    coloringMode,
    redTilePercentage = DEFAULT_RED_TILE_PERCENTAGE,
) => ({
    // type of the shape T, L ...
    type,
    // sets x - coordinate, new shape must be in the middle of the game field
    x: Math.floor(columCount / 2),
    // set y - coordinate, new shape must be outside the game field
    y: getSpawnY(type),
    // sets basic form of the shape, new shape must not be rotated
    currentShapeFormIndex: 0,
    // hard-dropped shapes are locked until the game loop places them on the board
    isDropped: false,
    // possible rotations of the shape, see SHAPE_FORMS
    possibleShapeForms: [...SHAPE_FORMS[type]],

    colors: initShapeColors(coloringMode, redTilePercentage),
});

/**
 * Creates random shape.
 * @param {number} columCount Column count of the game border.
 * @param {string} coloringMode Defines coloring of the shapes.
 */
export const createRandomShape = (
    columnCount,
    coloringMode,
    redTilePercentage = DEFAULT_RED_TILE_PERCENTAGE,
) => {
    const randomShapeType = SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)];
    return createShape(randomShapeType, columnCount, coloringMode, redTilePercentage);
};
