const PastebinAPI = require('pastebin-js'),
pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const QRCode = require('qrcode');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const {
    default: Kanambo_Tech,
    useMultiFileAuthState,
    Browsers,
    delay,
} = require("@whiskeysockets/baileys");

function removeFile(FilePath) {
    if (fs.existsSync(FilePath)) {
        fs.rmSync(FilePath, { recursive: true, force: true });
    }
}

router.get('/', async (req, res) => {
    const id = makeid();

    async function generateQRCode() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);

        try {
            let Qr_Code_By_Kanambo_Tech = Kanambo_Tech({
                auth: state,
                printQRInTerminal: false,
                logger: pino({ level: "silent" }),
                browser: ["Firefox", "KANAMBOTech", "1.0"]
            });

            Qr_Code_By_Kanambo_Tech.ev.on('creds.update', saveCreds);
            Qr_Code_By_Kanambo_Tech.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect, qr } = s;

                if (qr) {
                    let qrImage = await QRCode.toDataURL(qr);
                    let htmlContent = `
                        <html>
                        <head>
                            <title>Scan QR Code</title>
                            <style>
                                body {
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    height: 100vh;
                                    background: linear-gradient(135deg, #1e3c72, #2a5298);
                                    font-family: Arial, sans-serif;
                                }
                                .container {
                                    text-align: center;
                                    background: white;
                                    padding: 20px;
                                    border-radius: 10px;
                                    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
                                }
                                .qr-code {
                                    margin: 20px auto;
                                    border-radius: 10px;
                                    padding: 10px;
                                    background: #f9f9f9;
                                }
                                .refresh-btn {
                                    background: #007bff;
                                    color: white;
                                    padding: 10px 20px;
                                    border: none;
                                    cursor: pointer;
                                    border-radius: 5px;
                                    margin-top: 10px;
                                }
                                .refresh-btn:hover {
                                    background: #0056b3;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <h2>Scan the QR Code</h2>
                                <img class="qr-code" src="${qrImage}" alt="QR Code"/>
                                <button class="refresh-btn" onclick="refreshQR()">Refresh QR Code</button>
                            </div>
                            <script>
                                function refreshQR() {
                                    window.location.reload();
                                }
                                setTimeout(refreshQR, 30000); // Auto-refresh QR every 30 seconds
                            </script>
                        </body>
                        </html>
                    `;

                    res.send(htmlContent);
                }

                if (connection === "open") {
                    console.log("Successfully logged in!");
                    await delay(2000);
                    await removeFile("temp/" + id);
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode !== 401) {
                    console.log("Reconnecting...");
                    await delay(5000);
                    generateQRCode();
                }
            });
        } catch (err) {
            console.error("Error:", err);
            res.json({ code: "Service Unavailable" });
            await removeFile("temp/" + id);
        }
    }

    return await generateQRCode();
});

router.get('/favicon.ico', (req, res) => res.status(204));

module.exports = router;
