export default [
  {
    _id: '588a427d617fff11d79b3049',
    address: 67,
    model: 'hdc1000',
    technology: 'i2c',
    detectors: [
      {
        _id: '5bc45695d557b57ae40e94fc',
        type: 'temperature',
        label: 'Temperature (67)',
        name: 'Temperature (Left)',
        unit: 'C',
      },
      {
        _id: '5bc45695d557b57ae40e94fb',
        type: 'humidity',
        label: 'Humidity (67)',
        name: 'Humidity (Left)',
        unit: 'RF',
      },
    ],
  },
  {
    _id: '588a427d617fff11d79b304a',
    address: 64,
    model: 'hdc1000',
    technology: 'i2c',
    detectors: [
      {
        _id: '5bc45695d557b57ae40e94fe',
        type: 'temperature',
        label: 'Temperature (64)',
        name: 'Temperature (Right)',
        unit: 'C',
      },
      {
        _id: '5bc45695d557b57ae40e94fd',
        type: 'humidity',
        label: 'Humidity (64)',
        name: 'Humidity (Right)',
        unit: 'RF',
      },
    ],
  },
  {
    _id: '588a427d617fff11d79b304e',
    uuid: '13e76392d22f4bde9c8033c02a868a89',
    address: '',
    model: 'sensorTag',
    technology: 'ble',
    detectors: [
      {
        _id: '5bc45695d557b57ae40e9503',
        type: 'temperature',
        label: 'Temperature',
        name: 'Temperature (Sensor Tag)',
        unit: 'C',
      },
      {
        _id: '5bc45695d557b57ae40e9502',
        type: 'humidity',
        label: 'Humidity',
        name: 'Humidity (Sensor Tag)',
        unit: 'RF',
      },
    ],
  },
];
