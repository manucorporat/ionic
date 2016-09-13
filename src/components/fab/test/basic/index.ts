import { Component } from '@angular/core';
import { ionicBootstrap } from '../../../../../src';


@Component({
  templateUrl: 'main.html'
})
class E2EPage {
  array: number[] = [];

  add() {
    this.array.push(1);
  }

  clickMainFAB() {
    console.log('Clicked open social menu');
  }

  openSocial(network: string) {
    console.log('Share in ' + network);
  }
}

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
class E2EApp {
  rootPage = E2EPage;
}


ionicBootstrap(E2EApp);
