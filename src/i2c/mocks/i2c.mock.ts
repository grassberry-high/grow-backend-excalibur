// const MHZ16 = 77;
//
// // mhz16
// const IOCONTROL = 0x0e << 3;
// const FCR = 0x02 << 3;
// const LCR = 0x03 << 3;
// const DLL = 0x00 << 3;
// const DLH = 0x01 << 3;
// const THR = 0x00 << 3;
// const RHR = 0x00 << 3;
const TxLVL = 0x08 << 3;
const RxLVL = 0x09 << 3;

export interface MockBus {
  scan();
  readByte();
  writeByte();
  sendByte();
  receiveByte();
  writeI2cBlock();
  readI2cBlock();
}

export class I2cServiceMock {
  open(bus) {
    bus = {
      scan() {
        const devices = [64, 77, 32, 33]; // humidty/temp, co2, relay controller
        return devices;
      },

      readByte(address, command) {
        let bytes = 0;
        if (address === 77) {
          switch (command) {
            case TxLVL:
              bytes = 9;
              break;
            case RxLVL:
              bytes = 9;
              break;
          }
          return bytes;
        }
      },

      writeByte(address, register, byte) {
        return;
      },

      sendByte(address, byte) {
        return;
      },

      receiveByte(address, callback) {
        return setTimeout(() => callback(null, 0)
          , 500);
      },

      writeI2cBlock(address, register, blockLength, block) {
        const buffer = Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8]);
        return  [buffer.length, buffer];
      },

      readI2cBlock(address, register, readLength, readBuffer) {
        readBuffer = Buffer.from([0xff, 0x9c, 0x00, 0x00, 0x05, 0x08, 0x00, 0x00, 0x57]);
        return;
      },
    };
    setTimeout(() => console.log('hey'), 500);
    return bus;
  };

  adressInActiveDevices(address) { return true };

  checkDifference(callback) {
    const differenceLost = [];
    const differenceAdded = [];
    return callback(null, {differenceLost, differenceAdded});
  };

}
