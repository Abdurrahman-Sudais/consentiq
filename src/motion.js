import {startFx} from './fx.js';
// Site-specific interaction settings; the visual treatment lives in styles.css.
export function startMotion() { startFx({cursor: 'marker', prefix: 'cq', tilt: 0, magnet: 0.2}); }
