const localtunnel = require('localtunnel');
const { spawn } = require('child_process');
const path = require('path');

const serverPath = path.join(__dirname, 'server', 'server.js');

const server = spawn('node', [serverPath], {
  stdio: 'inherit',
  env: { ...process.env, PORT: '5000' },
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

console.log('Waiting for server to start...');
setTimeout(async () => {
  try {
    const tunnel = await localtunnel({ port: 5000 });
    console.log('\n========================================');
    console.log('  DevTrack is LIVE at:');
    console.log(`  ${tunnel.url}`);
    console.log('========================================');
    console.log('  Share this URL with anyone!');
    console.log('  Press Ctrl+C to stop\n');
    console.log('  First visit may show a warning page.');
    console.log('  Click "Click to Continue" to proceed.\n');

    tunnel.on('close', () => {
      console.log('Tunnel closed');
      server.kill();
      process.exit(0);
    });
  } catch (err) {
    console.error('Tunnel error:', err.message);
    console.log('App is still running at http://localhost:5000');
  }
}, 5000);

process.on('SIGINT', () => {
  server.kill();
  process.exit(0);
});
