import { Animation, AnimationOptions } from '../../../index';
import { isDef } from '../../../utils/helpers';
import { ViewController } from '../view-controller';

const TRANSLATEY = 'translateY';
const OFF_BOTTOM = '40px';
const CENTER = '0px';
// const SHOW_BACK_BTN_CSS = 'show-back-button';

export default function mdTransitionAnimation(Animation: Animation, enteringView: ViewController, leavingView: ViewController, opts: AnimationOptions): Promise<Animation> {

  const ionPageElement = getIonPageElement(enteringView.element);

  const rootTransition = new Animation();
  rootTransition.addElement(ionPageElement);
  rootTransition.beforeRemoveClass('hide-page');

  const backDirection = (opts.direction === 'back');
  if (enteringView) {

    // animate the component itself
    if (backDirection) {
      rootTransition.duration(isDef(opts.duration) ? opts.duration : 200).easing('cubic-bezier(0.47,0,0.745,0.715)');
    } else {
      rootTransition.duration(isDef(opts.duration) ? opts.duration : 280).easing('cubic-bezier(0.36,0.66,0.04,1)');

      rootTransition
      .fromTo(TRANSLATEY, OFF_BOTTOM, CENTER, true)
      .fromTo('opacity', 0.01, 1, true);
    }

    // Animate toolbar if it's there
    const enteringToolbarEle = ionPageElement.querySelector('ion-toolbar');
    if (enteringToolbarEle) {

      const enteringToolBar = new Animation();
      enteringToolBar.addElement(enteringToolbarEle);
      rootTransition.add(enteringToolBar);

      const enteringBackButton = new Animation();
      enteringBackButton.addElement(enteringToolbarEle.querySelector('.back-button'));
      rootTransition.add(enteringBackButton);
      // if (canNavGoBack(enteringView.nav, enteringView)) {
      //   enteringBackButton.beforeAddClass(SHOW_BACK_BTN_CSS);
      // } else {
      //   enteringBackButton.beforeRemoveClass(SHOW_BACK_BTN_CSS);
      // }
    }
  }

  // setup leaving view
  if (leavingView && backDirection) {
    // leaving content
    rootTransition.duration(opts.duration || 200).easing('cubic-bezier(0.47,0,0.745,0.715)');
    const leavingPage = new Animation();
    leavingPage.addElement(getIonPageElement(leavingView.element));
    rootTransition.add(leavingPage.fromTo(TRANSLATEY, CENTER, OFF_BOTTOM).fromTo('opacity', 1, 0));
  }

  return Promise.resolve(rootTransition);
}

function getIonPageElement(element: HTMLElement) {
  if (element.tagName.toLowerCase() === 'ion-page') {
    return element;
  }
  const ionPage = element.querySelector('ion-page');
  if (ionPage) {
    return ionPage;
  }

  // idk, return the original element so at least something animates and we don't have a null pointer
  return element;
}
