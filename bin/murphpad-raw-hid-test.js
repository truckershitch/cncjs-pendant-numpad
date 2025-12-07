    const HID = require('node-hid');

    // Replace with your keyboard's Vendor ID and Product ID
    const VENDOR_ID = 0x6d77; // e.g., 0x1803 for some QMK keyboards
    const PRODUCT_ID = 0x1705; // e.g., 0x0004 for some QMK keyboards
    const USAGEPAGE = 0xff60;
    const USAGE = 0x61;

    let device;

    try {
        // Find the HID device based on Vendor ID and Product ID
        const devices = HID.devices();
        const targetDevice = devices.find(
            d => d.vendorId === VENDOR_ID &&
            d.productId === PRODUCT_ID &&
            d.usagePage === USAGEPAGE &&
            d.usage === USAGE
        );

        if (!targetDevice) {
            console.error('QMK keyboard not found. Ensure it is connected and Raw HID is enabled.');
            process.exit(1);
        }

        device = new HID.HID(targetDevice.path);

        console.log('Connected to QMK keyboard.');

        // Listen for data from the keyboard
        device.on('data', (data) => {
            console.log('Received data from keyboard:', data);
            // Process received data
        });

        device.on('error', (err) => {
            console.error('HID error:', err);
        });

        // Example: Sending data to the keyboard
        // The data length should match what your QMK firmware expects (e.g., 32 bytes)
        function formatNum(num, fullstring='') {
            return new Promise((resolve) => {
                const padLength = 3;

                let wholePart = String(Math.trunc(num)).padStart(padLength, ' ');
                let decimalPart = num.toString().split('.')[1];
                if (typeof(decimalPart) === undefined) {
                    decimalPart = '000';
                }  
            
                resolve(fullstring + wholePart + '.' + decimalPart);
            });
        }
        // const pos = "X " + formatNum(222.124) + "Y " + formatNum(452.332) + "Z " + formatNum(55.002);
        
        // console.log("pos: ", pos);

        // let posVertical = "";
        // for (let i = 0; i < 9; i++) {
        //     posVertical += pos[i] + pos[i + 9] + pos[i + 18];
        // }
        // console.log("posVertical: ", posVertical);

        // const dataToSend = Buffer.alloc(33);
        // dataToSend.write(posVertical, 1, posVertical.length, 'utf8');
        // device.write(dataToSend);
        // console.log('Sent data to keyboard:', dataToSend);

        formatNum(222.124, '')
            .then((result) => formatNum(452.332, result))
            .then((result) => formatNum(55.002, result))
            .then((result) => console.log(result));

        // console.log("pos: ", pos);
    
    } catch (error) {
        console.error('Error connecting to HID device:', error);
    } finally {
        // Ensure the device is closed when the application exits
        process.on('exit', () => {
            if (device) {
                device.close();
                console.log('HID device closed.');
            }
        });
    }