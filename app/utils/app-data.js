import jetpack from 'fs-jetpack';

var app;
if (process.type === 'renderer') {
    app = require('electron').remote.app;
} else {
    app = require('electron').app;
}

const appData = jetpack.cwd(app.getPath('userData'));

export default appData;