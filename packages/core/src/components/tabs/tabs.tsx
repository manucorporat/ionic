import { Component, Element, Event, EventEmitter, Listen, Method, Prop, State } from '@stencil/core';
import { Config, NavOutlet } from '../../index';

import { asyncRaf } from '../../utils/helpers';


@Component({
  tag: 'ion-tabs',
  styleUrl: 'tabs.scss'
})
export class Tabs implements NavOutlet {
  private ids = -1;
  private tabsId: number = (++tabIds);
  initialized = false;

  @Element() el: HTMLElement;

  @State() tabs: HTMLIonTabElement[] = [];
  @State() selectedTab: HTMLIonTabElement | undefined;

  @Prop({ context: 'config' }) config: Config;

  /**
   * The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color: string;

  /**
   * A unique name for the tabs
   */
  @Prop() name: string;

  /**
   * If true, the tabbar
   */
  @Prop() tabbarHidden = false;

  /**
   * Set the tabbar layout: `icon-top`, `icon-start`, `icon-end`, `icon-bottom`, `icon-hide`, `title-hide`.
   */
  @Prop({ mutable: true }) tabbarLayout: string;

  /**
   * Set position of the tabbar: `top`, `bottom`.
   */
  @Prop({ mutable: true }) tabbarPlacement: string;

  /**
   * If true, show the tab highlight bar under the selected tab.
   */
  @Prop({ mutable: true }) tabbarHighlight: boolean;

  /**
   * If true, adds transparency to the tabbar.
   * Note: In order to scroll content behind the tabbar, the `fullscreen`
   * attribute needs to be set on the content.
   * Only affects `ios` mode. Defaults to `false`.
   */
  @Prop() translucent = false;

  @Prop() scrollable = false;

  /**
   * Emitted when the tab changes.
   */
  @Event() ionChange: EventEmitter;
  @Event() ionNavChanged: EventEmitter<any>;

  componentDidLoad() {
    this.loadConfig('tabsPlacement', 'bottom');
    this.loadConfig('tabsLayout', 'icon-top');
    this.loadConfig('tabsHighlight', true);

    this.initTabs().then(() => this.initSelect());
    // const promises: Promise<any>[] = [];
    // promises.push(this.initTabs());
    // promises.push(ensureExternalRounterController());
    // return Promise.all(promises).then(([_, externalRouterController]) => {
    //   return (externalRouterController as HTMLIonExternalRouterControllerElement).getExternalNavOccuring();
    // }).then((externalNavOccuring) => {
    //   if (!externalNavOccuring) {
    //     return this.initSelect();
    //   }
    //   return null;
    // }).then(() => {
    //   this.initialized = true;
    // });
  }

  componentDidUnload() {
    this.tabs.length = 0;
    this.selectedTab = undefined;
  }

  @Listen('ionTabbarClick')
  // @Listen('ionSelect')
  protected tabChange(ev: CustomEvent) {
    const selectedTab = ev.detail as HTMLIonTabElement;
    this.select(selectedTab);
  }

  /**
   * @param {number|Tab} tabOrIndex Index, or the Tab instance, of the tab to select.
   */
  @Method()
  select(tabOrIndex: number | HTMLIonTabElement): Promise<any> {
    const selectedTab = (typeof tabOrIndex === 'number' ? this.getByIndex(tabOrIndex) : tabOrIndex);
    if (!selectedTab) {
      return Promise.resolve();
    }

    // Reset rest of tabs
    for (const tab of this.tabs) {
      if (selectedTab !== tab) {
        tab.selected = false;
      }
    }
    selectedTab.selected = true;

    const leavingTab = this.selectedTab;
    this.selectedTab = selectedTab;


    return selectedTab.prepareActive()
      .then(() => selectedTab.active = true)
      .then(() => asyncRaf())
      .then(() => {
        if (leavingTab) {
          leavingTab.active = false;
        }
        this.ionChange.emit(selectedTab);
        this.ionNavChanged.emit({isPop: false});
      });
  }

  /**
   * @param {number} index Index of the tab you want to get
   * @returns {HTMLIonTabElement} Returns the tab who's index matches the one passed
   */
  @Method()
  getByIndex(index: number): HTMLIonTabElement {
    return this.tabs[index];
  }

  /**
   * @return {HTMLIonTabElement} Returns the currently selected tab
   */
  @Method()
  getSelected(): HTMLIonTabElement | undefined {
    return this.selectedTab;
  }

  @Method()
  getIndex(tab: HTMLIonTabElement): number {
    return this.tabs.indexOf(tab);
  }

  @Method()
  getTabs(): HTMLIonTabElement[] {
    return this.tabs;
  }

  @Method()
  setRouteId(id: any): Promise<boolean> {
    if (this.selectedTab && this.selectedTab.getRouteId() === id) {
      return Promise.resolve(false);
    }
    const tab = this.tabs.find(t => id === t.getRouteId());
    return this.select(tab).then(() => true);
  }


  @Method()
  getRouteId(): string|null {
    if (this.selectedTab) {
      return this.selectedTab.getRouteId();
    }
    return null;
  }


  @Method()
  getContentElement(): HTMLElement {
    return this.selectedTab;
  }

  private initTabs() {
    const tabs = this.tabs = Array.from(this.el.querySelectorAll('ion-tab'));
    const tabPromises = tabs.map(tab => {
      const id = `t-${this.tabsId}-${++this.ids}`;
      tab.btnId = 'tab-' + id;
      tab.id = 'tabpanel-' + id;
      return tab.componentOnReady();
    });

    return Promise.all(tabPromises);
  }

  private initSelect() {
    if (document.querySelector('ion-router')) {
      return Promise.resolve();
    }
    // find pre-selected tabs
    const selectedTab = this.tabs.find(t => t.selected) ||
      this.tabs.find(t => t.show && !t.disabled);

    // reset all tabs none is selected
    for (const tab of this.tabs) {
      if (tab !== selectedTab) {
        tab.selected = false;
      }
    }
    const promise = selectedTab ? selectedTab.prepareActive() : Promise.resolve();
    return promise.then(() => {
      this.selectedTab = selectedTab;
      if (selectedTab) {
        selectedTab.selected = true;
      }
    });
  }

  private loadConfig(attrKey: string, fallback: any) {
    const val = (this as any)[attrKey];
    if (typeof val === 'undefined') {
      (this as any)[attrKey] = this.config.get(attrKey, fallback);
    }
  }

  render() {
    const dom = [
      <div class='tabs-inner'>
        <slot></slot>
      </div>
    ];

    if (!this.tabbarHidden) {
      dom.push(
        <ion-tabbar
          tabs={this.tabs}
          color={this.color}
          selectedTab={this.selectedTab}
          highlight={this.tabbarHighlight}
          placement={this.tabbarPlacement}
          layout={this.tabbarLayout}
          translucent={this.translucent}
          scrollable={this.scrollable}>
        </ion-tabbar>
      );
    }
    return dom;
  }
}

let tabIds = -1;


