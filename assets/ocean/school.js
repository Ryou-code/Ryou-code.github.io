import { OceanEngine } from './engine.js';
// Each shark inhabits one band of the document. Offscreen bands pause independently.
const sizes = [1,.93,.85,.78];
document.querySelectorAll('.shark-water canvas').forEach((canvas,i) => {
  new OceanEngine(canvas,[{kind:'hammerhead',size:sizes[i]}]);
});
