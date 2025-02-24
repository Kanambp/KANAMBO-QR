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
    const imageUrl = "https://files.catbox.moe/dcoxvf.jpg";
    const KANAMBO_MD_TEXT = `
*✅ Session Connected!*

📱 *Join GC Bot Updates:* [Click Here](https://chat.whatsapp.com/Byx7wdqizJXB79RKFKsefb)  
🕹 *Follow GitHub:* [Click Here](https://github.com/Kanambp/dreaded-v2)  
🌐 *For More Info:* [Visit Website](https://kanambotech.com)  
😎 *Made by Kanambo Tech*`;

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
                                    background: black;
                                    overflow: hidden;
                                    font-family: Arial, sans-serif;
                                    position: relative;
                                }
                                .container {
                                    text-align: center;
                                    background: rgba(255, 255, 255, 0.1);
                                    padding: 30px;
                                    border-radius: 15px;
                                    backdrop-filter: blur(10px);
                                    box-shadow: 0px 0px 20px rgba(255, 255, 255, 0.3);
                                    position: relative;
                                    z-index: 2;
                                }
                                .qr-code {
                                    width: 250px;
                                    height: 250px;
                                    padding: 15px;
                                    background: white;
                                    border-radius: 10px;
                                }
                                .refresh-btn {
                                    background: #007bff;
                                    color: white;
                                    padding: 12px 25px;
                                    border: none;
                                    cursor: pointer;
                                    border-radius: 8px;
                                    font-size: 16px;
                                    margin-top: 15px;
                                    transition: 0.3s ease-in-out;
                                }
                                .refresh-btn:hover {
                                    background: #0056b3;
                                }
                                .planet {
                                    position: absolute;
                                    border-radius: 50%;
                                    filter: blur(20px);
                                    opacity: 0.7;
                                }
                                .planet1 {
                                    width: 150px;
                                    height: 150px;
                                    background: radial-gradient(circle, #ff4500, #ff6600);
                                    top: 10%;
                                    left: 15%;
                                    animation: move1 10s infinite alternate ease-in-out;
                                }
                                .planet2 {
                                    width: 100px;
                                    height: 100px;
                                    background: radial-gradient(circle, #00bfff, #007bff);
                                    bottom: 15%;
                                    right: 10%;
                                    animation: move2 12s infinite alternate ease-in-out;
                                }
                                .planet3 {
                                    width: 180px;
                                    height: 180px;
                                    background: radial-gradient(circle, #ffff00, #ffcc00);
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%, -50%);
                                    animation: glow 5s infinite alternate ease-in-out;
                                }
                                @keyframes move1 {
                                    from { transform: translateX(0px); }
                                    to { transform: translateX(30px); }
                                }
                                @keyframes move2 {
                                    from { transform: translateY(0px); }
                                    to { transform: translateY(-30px); }
                                }
                                @keyframes glow {
                                    from { opacity: 0.6; transform: scale(1); }
                                    to { opacity: 1; transform: scale(1.2); }
                                }
                            </style>
                        </head>
                        <body>
                            <div class="planet planet1"></div>
                            <div class="planet planet2"></div>
                            <div class="planet planet3"></div>
                            <div class="container">
                                <h2 style="color: white;">Scan the QR Code</h2>
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

                    try {
                        let sendMessage = await Qr_Code_By_Kanambo_Tech.sendMessage(
                            Qr_Code_By_Kanambo_Tech.user.id, 
                            {
                                image: { url: imageUrl },
                                caption: KANAMBO_MD_TEXT
                            }
                        );
                        console.log("✅ Welcome message sent successfully!");
                    } catch (err) {
                        console.error("❌ Error sending welcome message:", err);
                    }

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
