import { isPresent } from './nav-util';
import { AnimationOptions, Config, ViewController, Animation } from '../..';
import { Transition } from './transition';
import { NavControllerBase } from './nav';


export class TransitionController {
  private _ids = 0;
  private _trns: {[key: number]: Transition} = {};

  // constructor(public plt: Platform, private _config: Config) {}

  getRootTrnsId(nav: NavControllerBase): number {
    nav = nav.parent;
    while (nav) {
      if (isPresent(nav._trnsId)) {
        return nav._trnsId;
      }
      nav = nav.parent;
    }
    return null;
  }

  nextId() {
    return this._ids++;
  }

  get(trnsId: number, ani: Animation, enteringView: ViewController, leavingView: ViewController): Transition {

    const trns = new Transition(ani, enteringView, leavingView);
    trns.trnsId = trnsId;

    if (!this._trns[trnsId]) {
      // we haven't created the root transition yet
      this._trns[trnsId] = trns;

    } else {
      // we already have a root transition created
      // add this new transition as a child to the root
      this._trns[trnsId].ani.add(trns.ani);
    }

    return trns;
  }

  destroy(trnsId: number) {
    const trans = this._trns[trnsId];
    if (trans) {
      trans.destroy();
      delete this._trns[trnsId];
    }
  }
}
