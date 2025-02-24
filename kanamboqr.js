const PastebinAPI = require('pastebin-js'); const pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL'); const { makeid } = require('./id'); const QRCode = require('qrcode'); const express = require('express'); const path = require('path'); const fs = require('fs'); let router = express.Router(); const pino = require("pino");

const { default: Kanambo_Tech, useMultiFileAuthState, jidNormalizedUser, Browsers, delay, makeInMemoryStore } = require("@whiskeysockets/baileys");

function removeFile(FilePath) { if (!fs.existsSync(FilePath)) return false; fs.rmSync(FilePath, { recursive: true, force: true }); }

const { readFile } = require("node:fs/promises");

router.get('/', async (req, res) => { const id = makeid();

async function KANAMBO_MD_QR_CODE() {
    const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);

    try {
        let Qr_Code_By_Kanambo_Tech = Kanambo_Tech({
            auth: state,
            printQRInTerminal: false,
            logger: pino({ level: "silent" }),
            browser: Browsers.firefox("KANAMBOTech"),
        });

        Qr_Code_By_Kanambo_Tech.ev.on('creds.update', saveCreds);
        Qr_Code_By_Kanambo_Tech.ev.on("connection.update", async (s) => {
            const { connection, lastDisconnect, qr } = s;
            if (qr) await res.end(await QRCode.toBuffer(qr));
            
            if (connection == "open") {
                await delay(3000);
                let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                await delay(800);
                let b64data = Buffer.from(data).toString('base64');
                let session = await Qr_Code_By_Kanambo_Tech.sendMessage(
                    Qr_Code_By_Kanambo_Tech.user.id,
                    { text: '' + b64data }
                );

                let KANAMBO_MD_TEXT = `

🌟 Session Successfully Connected via KANAMBO! 👌 ❤️ Built with Passion

📌 Need Help? Find Us Here: ➤ 👤 Owner: Chat Now ➤ 🛠 GitHub Repo: View Project ➤ 🤝 WhatsApp Group: Join Us

💡 Thank you for choosing KANAMBO TECH! 🙏 Please keep your session private. ✨ Don't forget to star my repo on GitHub! ⭐ `;

await Qr_Code_By_Kanambo_Tech.sendMessage(
                    Qr_Code_By_Kanambo_Tech.user.id,
                    { text: KANAMBO_MD_TEXT },
                    { quoted: session }
                );

                await delay(100);
                await Qr_Code_By_Kanambo_Tech.ws.close();
                return await removeFile("temp/" + id);
            } else if (
                connection === "close" &&
                lastDisconnect &&
                lastDisconnect.error &&
                lastDisconnect.error.output.statusCode !== 401
            ) {
                await delay(10000);
                KANAMBO_MD_QR_CODE();
            }
        });
    } catch (err) {
        if (!res.headersSent) {
            await res.json({ code: "Service is Currently Unavailable" });
        }
        console.log(err);
        await removeFile("temp/" + id);
    }
}

return await KANAMBO_MD_QR_CODE();

});

module.exports = router;

