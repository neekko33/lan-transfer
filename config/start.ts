const { networkInterfaces } = require('os');
const { writeFileSync } = require('fs');
const { join } = require('path');

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

const ip = getIpAddress();
const data = `export const IP = '${ip}'`;
writeFileSync(join(__dirname, 'config.ts'), data);
console.log('IP地址写入完成');
