// ABOUTME: Displays live score, line, level, and next-piece game information.
// ABOUTME: Keeps side-panel values synchronized with the shared game state.
import { addStateObserver, getState } from '../../../state';
import { createElement, getClassList } from '../../../web-api-polyfills';
import { LEFT_EYE_BOARD_CELL } from '../../utils/consts';

const createStat = (label, property) => {
    const card = createElement('section');
    getClassList(card).add('game-stat');

    const statLabel = createElement('div');
    getClassList(statLabel).add('game-stat-label');
    statLabel.innerText = label;

    const value = createElement('div');
    getClassList(value).add('game-stat-value');
    value.innerText = getState()[property];

    card.appendChild(statLabel);
    card.appendChild(value);
    addStateObserver([property], (state) => {
        value.innerText = state[property];
    });
    return card;
};

const updateNextPiece = (state, cells) => {
    const { nextShape, leftEyeColor, rightEyeColor } = state;
    const previewCells = [...cells];
    for (let index = 0; index < previewCells.length; index += 1) {
        previewCells[index].style.backgroundColor = 'transparent';
    }

    if (!nextShape) {
        return;
    }

    const shapeCells = nextShape.possibleShapeForms[nextShape.currentShapeFormIndex];
    const minX = Math.min(...shapeCells.map(([x]) => x));
    const minY = Math.min(...shapeCells.map(([, y]) => y));
    shapeCells.forEach(([x, y], shapeCellIndex) => {
        const previewCell = previewCells[(y - minY) * 4 + (x - minX)];
        const cellColor = nextShape.colors[shapeCellIndex];
        previewCell.style.backgroundColor = cellColor === LEFT_EYE_BOARD_CELL
            ? leftEyeColor : rightEyeColor;
    });
};

const createNextPieceCard = () => {
    const card = createElement('section');
    getClassList(card).add('next-piece-card');

    const label = createElement('div');
    getClassList(label).add('game-stat-label');
    label.innerText = 'Next piece';

    const preview = createElement('div');
    getClassList(preview).add('next-piece-grid');
    preview.setAttribute('role', 'img');
    preview.setAttribute('aria-label', 'Preview of the next piece');

    const cells = [];
    for (let index = 0; index < 16; index += 1) {
        const cell = createElement('div');
        getClassList(cell).add('next-piece-cell');
        cells.push(cell);
        preview.appendChild(cell);
    }

    const update = (state) => updateNextPiece(state, cells);
    update(getState());
    addStateObserver(['nextShape', 'gameState'], update);

    card.appendChild(label);
    card.appendChild(preview);
    return card;
};

export default function createGameSidebar() {
    const sidebar = createElement('aside');
    getClassList(sidebar).add('game-sidebar');

    const heading = createElement('div');
    getClassList(heading).add('game-sidebar-heading');
    heading.innerText = 'Run stats';

    const stats = createElement('div');
    getClassList(stats).add('game-stats');
    stats.appendChild(createStat('Score', 'score'));
    stats.appendChild(createStat('Lines cleared', 'linesCleared'));
    stats.appendChild(createStat('Level', 'speedLevel'));

    const note = createElement('div');
    getClassList(note).add('game-stats-note');
    note.innerText = 'Score is points, with bigger rewards for clearing several rows. Lines cleared is your row total.';

    sidebar.appendChild(heading);
    sidebar.appendChild(stats);
    sidebar.appendChild(note);
    sidebar.appendChild(createNextPieceCard());
    return sidebar;
}
