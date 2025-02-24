const express = require('express');
const path = require('path');
const QRCode = require('qrcode');
const pino = require("pino");
const {
  default: Kanambo_Tech,
  useMultiFileAuthState,
  jidNormalizedUser,
  Browsers
} = require("@whiskeysockets/baileys");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

const logger = pino({ level: "info" });

// Initialize WhatsApp client
async function initializeClient() {
  const { state, saveCreds } = await useMultiFileAuthState('auth');
  const client = Kanambo_Tech({
    auth: state,
    browser: ["KANAMBOTech", "Firefox", "1.0"],
  });

  client.ev.on('creds.update', saveCreds);
  return client;
}

let clientPromise = initializeClient();

app.get('/kanamboqr', async (req, res) => {
  try {
    const client = await clientPromise;
    let sentQR = false;

    client.ev.on('connection.update', async (update) => {
      const { qr, connection } = update;

      if (qr && !sentQR) {
        sentQR = true;
        const qrImage = await QRCode.toDataURL(qr);
        res.send(`
          <html>
          <head>
            <title>Kanambo QR Code</title>
            <style>
              body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                background: radial-gradient(circle, #141E30, #243B55);
                color: white;
                text-align: center;
                font-family: Arial, sans-serif;
              }
              .container {
                padding: 20px;
                border-radius: 15px;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(15px);
                box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
              }
              img { 
                width: 400px; 
                height: 400px; 
                border-radius: 10px;
                box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
              }
              button {
                margin-top: 15px;
                padding: 12px 25px;
                border: none;
                background: #ff9800;
                color: white;
                font-size: 18px;
                cursor: pointer;
                border-radius: 8px;
                transition: 0.3s;
              }
              button:hover {
                background: #e68900;
                transform: scale(1.05);
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Scan to Connect</h2>
              <img src="${qrImage}" alt="QR Code">
              <br>
              <button onclick="window.location.reload()">🔄 Refresh QR Code</button>
            </div>
          </body>
          </html>
        `);
      }

      if (connection === 'open') {
        console.log("✅ WhatsApp session connected");

        const phoneNumber = req.query.phone || 'default-number@whatsapp.net';

        client.sendMessage(jidNormalizedUser(phoneNumber), {
          text: `
          ✅ Session Connected

          📱 Join GC bot updates: https://chat.whatsapp.com/Byx7wdqizJXB79RKFKsefb
          🕹 Follow GitHub: https://github.com/Kanambp/dreaded-v2
          🌐 More info: https://kanambotech.com
          😎 Made by Kanambo Tech
          `,
        });
      }
    });

  } catch (error) {
    console.error("QR Code Generation Error:", error);
    res.status(500).send("Error generating QR code. Check logs for details.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
