import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SpelunkerModule } from 'nestjs-spelunker';

async function boot() {
  const app = await NestFactory.create(AppModule);
  if (process.env.LOG_DEPENDENCIES === 'true') {
    SpelunkerModule.explore(app);
  }

  // set prefix for routes, for easier nginx int.
  app.setGlobalPrefix('core');

  // enable cors and setup for angular
  app.enableCors({
    credentials: true, origin: true
  });

  await app.listen(3000);
}

try {
  boot().then(() => console.log('booted'))
} catch (err) {
  console.log('err', err)
}

// (next) => {
//   debugBoot('-->launchLogger<--');
//   addMongoDBTransport((err) => {
//     return next(err);
//   });
// },
//   (next) => {
//     debugBoot('-->Seed<--');
//     startSeeding(next);
//   },

//   (next) => {
//     debugBoot('-->Setting timezone<--');
//     setTimeZone(next);
//   },
//   (next) => {
//     debugBoot('-->Socket Messenger<--');
//     const io = require('socket.io')(server);
//     initSocketListener(io);
//     startSeeding(next);
//   },
//   (next) => {
//     debugBoot('-->License<--');
//     const options = {};
//     getLicenseInformation(options, (err) => {
//       if (err) {
//         console.error(err);
//       }
//       return next();
//     });
//   },
//   (next) => {
//     debugBoot('-->I2C<--');
//     bootI2C(next);
//   },
//   (next) => {
//     debugBoot('-->Sensors & Relays<--');
//     const bootOptions = {};
//     bootSensorsAndRelays(bootOptions, next);
//   },
