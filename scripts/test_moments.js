const fs = require('fs');
const vm = require('vm');

try {
    const code = fs.readFileSync('assets/js/modules/moments.module.js', 'utf8');
    const sandbox = {
        window: {},
        console: console,
        document: {
            getElementById: () => null
        }
    };
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox);
    console.log("SUCCESS: MomentsModule parsed and executed in sandbox successfully!");
    console.log("Keys on window.MomentsModule:", Object.keys(sandbox.window.MomentsModule || {}));
} catch (err) {
    console.error("PARSING/EXECUTION ERROR:", err);
}
