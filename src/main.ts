import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { networkInterfaces } from 'os';

function getIpAddress() {
  var ifaces = networkInterfaces();

  for (var dev in ifaces) {
    let iface = ifaces[dev];

    for (let i = 0; i < iface.length; i++) {
      let { family, address, internal } = iface[i];

      if (family === 'IPv4' && address !== '127.0.0.1' && !internal) {
        return address;
      }
    }
  }
}

async function bootstrap() {
  const port = 7009;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  await app.listen(port);
  console.log(`Application is running on: http://${getIpAddress()}:${port}`);
}
bootstrap();
