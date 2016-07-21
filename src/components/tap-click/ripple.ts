import { Activator } from './activator';
import { App } from '../app/app';
import { Coordinates, CSS, hasPointerMoved, nativeRaf, pointerCoord, rafFrames } from '../../util/dom';
import { Config } from '../../config/config';


/**
 * @private
 */
export class RippleActivator extends Activator {

  constructor(app: App, config: Config) {
    super(app, config);
  }

  downAction(ev: UIEvent, activatableEle: HTMLElement, startCoord: Coordinates) {
    if (this.disableActivated(ev)) {
      return;
    }

    // queue to have this element activated
    this._queue.push(activatableEle);

    //nativeRaf(() => {
      for (var i = 0; i < this._queue.length; i++) {
        var queuedEle = this._queue[i];
        if (queuedEle && queuedEle.parentNode) {
          this._active.push(queuedEle);

          // DOM WRITE
          queuedEle.classList.add(this._css);

          var j = queuedEle.childElementCount;
          while (j--) {
            var rippleEle: any = queuedEle.children[j];
            if (rippleEle.tagName === 'ION-BUTTON-EFFECT') {
              // DOM READ
              var clientRect = activatableEle.getBoundingClientRect();
              rippleEle.$top = clientRect.top;
              rippleEle.$left = clientRect.left;
              rippleEle.$width = clientRect.width;
              rippleEle.$height = clientRect.height;
              break;
            }
          }
        }
      }
      this._queue = [];
    //});
  }

  upAction(ev: UIEvent, activatableEle: HTMLElement, startCoord: Coordinates) {
    if (hasPointerMoved(6, startCoord, pointerCoord(ev))) {
      return;
    }
    let i = activatableEle.childElementCount;
    while (i--) {
      var rippleEle: any = activatableEle.children[i];
      if (rippleEle.tagName === 'ION-BUTTON-EFFECT') {
        this.startRippleEffect(rippleEle, activatableEle, startCoord);
        break;
      }
    }

    super.upAction(ev, activatableEle, startCoord);
  }

  startRippleEffect(rippleEle: any, activatableEle: HTMLElement, startCoord: Coordinates) {
    let clientPointerX = (startCoord.x - rippleEle.$left);
    let clientPointerY = (startCoord.y - rippleEle.$top);

    let x = Math.max(Math.abs(rippleEle.$width - clientPointerX), clientPointerX) * 2;
    let y = Math.max(Math.abs(rippleEle.$height - clientPointerY), clientPointerY) * 2;
    let diameter = Math.min(Math.max(Math.hypot(x, y), 64), 240);

    if (activatableEle.hasAttribute('ion-item')) {
      diameter = Math.min(diameter, 140);
    }

    clientPointerX -= diameter / 2;
    clientPointerY -= diameter / 2;

    // Reset ripple
    rippleEle.style.opacity = '';
    rippleEle.style[CSS.transform] = `translate3d(${clientPointerX}px, ${clientPointerY}px, 0px) scale(0.001)`;
    rippleEle.style[CSS.transition] = '';

    // Start ripple animation
    let radius = Math.sqrt(rippleEle.$width + rippleEle.$height);
    let scaleTransitionDuration = Math.max(1600 * Math.sqrt(radius / TOUCH_DOWN_ACCEL) + 0.5, 260);
    let opacityTransitionDuration = scaleTransitionDuration * 0.7;
    let opacityTransitionDelay = scaleTransitionDuration - opacityTransitionDuration;

    let transform = `translate3d(${clientPointerX}px, ${clientPointerY}px, 0px) scale(1)`;
    let transition = `transform ${scaleTransitionDuration}ms,opacity ${opacityTransitionDuration}ms`;

    rafFrames(2, () => {
      // DOM WRITE
      rippleEle.style.width = rippleEle.style.height = diameter + 'px';
      rippleEle.style.opacity = '0';
      rippleEle.style[CSS.transform] = transform;
      rippleEle.style[CSS.transition] = transition;
    });
  }

  deactivate() {
    // remove the active class from all active elements
    let self = this;
    self._queue = [];

    rafFrames(2, function() {
      for (var i = 0; i < self._active.length; i++) {
        self._active[i].classList.remove(self._css);
      }
      self._active = [];
    });
  }

}

const TOUCH_DOWN_ACCEL = 300;

