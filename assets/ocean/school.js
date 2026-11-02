import { OceanEngine } from './engine.js';

const sharks = [1, .93, .85, .78].map(size => ({kind: 'hammerhead', size}));
new OceanEngine(document.querySelector('.shark-water canvas'), sharks);

