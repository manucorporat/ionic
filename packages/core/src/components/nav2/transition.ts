import { ViewController } from './view-controller';
import { AnimationOptions, Animation } from '../..';

/**
 * @hidden
 *
 * - play
 * - Add before classes - DOM WRITE
 * - Remove before classes - DOM WRITE
 * - Add before inline styles - DOM WRITE
 * - set inline FROM styles - DOM WRITE
 * - RAF
 * - read toolbar dimensions - DOM READ
 * - write content top/bottom padding - DOM WRITE
 * - set css transition duration/easing - DOM WRITE
 * - RAF
 * - set inline TO styles - DOM WRITE
 */
export class Transition {
  _trnsStart: Function;

  parent: Transition;
  trnsId: number;

  constructor(
    public ani: Animation,
    public enteringView: ViewController,
    public leavingView: ViewController,
    ) {}

  registerStart(trnsStart: Function) {
    this._trnsStart = trnsStart;
  }

  start() {
    this._trnsStart && this._trnsStart();
    this._trnsStart = null;

    // bubble up start
    this.parent && this.parent.start();
  }

  destroy() {
    this.ani.destroy();
    this.ani = this.parent = this._trnsStart = null;
  }

}
