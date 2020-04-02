import Sensor from '../sensor';

export class Hdc1000Sensor extends Sensor{
  // constructor(options) {
  //   super(options);
  // }

  initHdc1000(options) {
    console.log('Real hdc1000', options.name);
  }
}
