// ble-simulator.js
const TARGET_URL = 'http://localhost:5000/api/ble/telemetry';

// These MAC addresses exactly match the ones we seeded in your database!
const sampleData = {
    gateway_id: "SIMULATOR_ESP32",
    beacons: [
        { mac: "AA:BB:CC:11:22:33", rssi: -60 }, // Jalaj Maheshwari
        { mac: "AA:BB:CC:44:55:66", rssi: -65 }, // Harman Jassal
        { mac: "AA:BB:CC:77:88:99", rssi: -55 }  // Gauri
    ]
};

console.log("🚀 Starting BLE Hardware Simulator...");
console.log(`📡 Sending data to: ${TARGET_URL}\n`);

setInterval(async () => {
    try {
        // Randomize the RSSI (signal strength) slightly so the dashboard looks "alive"
        const payload = {
            gateway_id: sampleData.gateway_id,
            beacons: sampleData.beacons.map(b => ({
                mac: b.mac,
                rssi: b.rssi + Math.floor(Math.random() * 10) - 5
            }))
        };

        const response = await fetch(TARGET_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            console.log("✅ Simulated Ping Sent -> Server Response: 200 OK");
        } else {
            console.log(`❌ Simulated Ping Sent -> Server Response: ${response.status}`);
        }
    } catch (error) {
        console.error("⚠️ Connection Refused - Is the backend running?");
    }
}, 2000); // Sends a ping every 2 seconds