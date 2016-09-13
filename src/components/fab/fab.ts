import { Attribute, Component, ContentChild, ContentChildren, HostListener, QueryList, ChangeDetectionStrategy, Directive, ElementRef, Input, Renderer, ViewEncapsulation } from '@angular/core';

import { Button } from '../button/button';
import { Config } from '../../config/config';
import { closest } from '../../util/dom';
import { UIEventManager } from '../../util/ui-event-manager';

import { isTrueProperty } from '../../util/util';

@Component({
  selector: '[ion-fab]',
  template: '<span class="button-inner"><ng-content></ng-content></span><ion-button-effect></ion-button-effect>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class FabButton {
  constructor(
    private _elementRef: ElementRef,
    private _renderer: Renderer
  ) {}

  /**
   * @private
   */
  ngAfterContentInit() {
    this.setCssClass('button', true);
  }

  /**
   * @private
   */
  setCssClass(className: string, add: boolean) {
    this._renderer.setElementClass(this._elementRef.nativeElement, className, add);
  }

  /**
   * @private
   */
  getNativeElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }
}

/**
  * @name Fab
  * @module ionic
  *
  * @demo /docs/v2/demos/fab/
  * @see {@link /docs/v2/components#fab Fab Component Docs}
 */

@Directive({
  selector: 'ion-fab-list',
  host: {
    '[class.ion-fab-list-visible]': '_visible'
  }
})
export class FabList {
  private _buttons: FabButton[];
  private _visible: boolean = false;

  /**
   * @private
   */
  setVisible(val: boolean) {
    let visible = isTrueProperty(val);
    if (visible === this._visible) {
      return;
    }

    if (visible) {
      let i = 1;
      this._buttons.forEach((fab: any) => {
        setTimeout(() => {
          fab.setCssClass('ion-fab-visible', true);
        }, i * 20);
        i++;
      });

    } else {
      this._buttons.forEach((fab: any) => {
        fab.setCssClass('ion-fab-visible', false);
      });
    }

    this._visible = visible;
  }

  toggle() {
    this.setVisible(!this._visible);
  }

  @ContentChildren(FabButton)
  private set _setbuttons(queue: any) {
    this._buttons = queue.toArray();
  }
}

@Directive({
  selector: 'ion-fab',
})
export class Fab {
  private _events: UIEventManager = new UIEventManager();
  @ContentChild(FabButton) actionButton: FabButton;
  @ContentChild(FabList) fabList: FabList;

  constructor(private _elementRef: ElementRef) { }

  ngAfterContentInit() {
    this._events.pointerEvents({
      elementRef: this._elementRef,
      pointerDown: this.pointerDown.bind(this)
    });
  }

  pointerDown(ev: any) {
    if (this.fabList && this.actionButton) {
      let ele = closest(ev.target, 'ion-fab>button');
      if (ele && ele === this.actionButton.getNativeElement()) {
        this.toggleList();
      }
    }
    return false;
  }

  toggleList() {
    this.fabList && this.fabList.toggle();
  }

  ngOnDestroy() {
    this._events.unlistenAll();
  }
}
