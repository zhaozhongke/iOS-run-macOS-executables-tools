// 使用 frida 进行注入，还不完善

// bypass_watchdog.js
const kIOMasterPortDefault = 0;

const IOServiceMatching = new NativeFunction(
    Module.findExportByName('IOKit', 'IOServiceMatching'),
    'pointer',
    ['pointer']
);

const IOServiceGetMatchingService = new NativeFunction(
    Module.findExportByName('IOKit', 'IOServiceGetMatchingService'),
    'pointer',
    ['uint', 'pointer']
);

const IOServiceOpen = new NativeFunction(
    Module.findExportByName('IOKit', 'IOServiceOpen'),
    'uint',
    ['pointer', 'uint', 'uint', 'pointer']
);

const IOConnectCallScalarMethod = new NativeFunction(
    Module.findExportByName('IOKit', 'IOConnectCallScalarMethod'),
    'uint',
    ['pointer', 'uint', 'pointer', 'uint', 'pointer', 'pointer']
);

const CFStringCreateWithCString = new NativeFunction(
    Module.findExportByName('CoreFoundation', 'CFStringCreateWithCString'),
    'pointer',
    ['pointer', 'pointer', 'uint']
);

const kCFAllocatorDefault = Module.findExportByName('CoreFoundation', 'kCFAllocatorDefault');

function disable_watchdog() {
    console.log('Attempting to disable watchdog...');

    const serviceName = CFStringCreateWithCString(kCFAllocatorDefault, Memory.allocUtf8String('IOWatchdog'), 0);
    console.log(serviceName)

    const matchingDict = IOServiceMatching(serviceName);
    const service = IOServiceGetMatchingService(kIOMasterPortDefault, matchingDict);

    if (service.isNull()) {
        console.error('Failed to discover watchdog service');
        return;
    }


    const connection = Memory.alloc(Process.pointerSize);
    const result = IOServiceOpen(service, mach_task_self(), 1, connection);

    if (result !== 0) {
        console.error('IOServiceOpen failed with error: ' + result);
        return;
    }

    const connectionValue = connection.readPointer();
    const inputScalar = Memory.alloc(Process.pointerSize);
    inputScalar.writeInt(0);

    const resultMethod = IOConnectCallScalarMethod(connectionValue, 3, inputScalar, 0, NULL, NULL);

    if (resultMethod !== 0) {
        console.error('Failed to disable watchdog: ' + resultMethod);
    } else {
        console.log('Watchdog disabled successfully');
    }
}

setImmediate(disable_watchdog);
