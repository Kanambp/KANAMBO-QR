const PastebinAPI = require('pastebin-js'), pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL'); const { makeid } = require('./id'); const express = require('express'); const fs = require('fs'); let router = express.Router(); const pino = require("pino"); const { default: Kanambo_Tech, useMultiFileAuthState, delay, makeCacheableSignalKeyStore, Browsers } = require("maher-zubair-baileys");

function removeFile(FilePath) { if (!fs.existsSync(FilePath)) return false; fs.rmSync(FilePath, { recursive: true, force: true }); }

router.get('/', async (req, res) => { const id = makeid(); let num = req.query.number;

async function KANAMBO_MD_PAIR_CODE() {
    const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);

    try {
        let Pair_Code_By_Kanambo_Tech = Kanambo_Tech({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
            },
            printQRInTerminal: false,
            logger: pino({ level: "fatal" }).child({ level: "fatal" }),
            browser: ["Chrome (linux)", "", ""]
        });

        if (!Pair_Code_By_Kanambo_Tech.authState.creds.registered) {
            await delay(1000);
            num = num.replace(/[^0-9]/g, '');
            const code = await Pair_Code_By_Kanambo_Tech.requestPairingCode(num);
            if (!res.headersSent) {
                await res.send({ code });
            }
        }

        Pair_Code_By_Kanambo_Tech.ev.on('creds.update', saveCreds);
        Pair_Code_By_Kanambo_Tech.ev.on("connection.update", async (s) => {
            const { connection, lastDisconnect } = s;

            if (connection === "open") {
                console.log("Connection open. Sending session message...");

                let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                let b64data = Buffer.from(data).toString('base64');
                let session = await Pair_Code_By_Kanambo_Tech.sendMessage(Pair_Code_By_Kanambo_Tech.user.id, { text: `kanamb_session_${b64data}` });

                const imageUrl = "https://files.catbox.moe/dcoxvf.jpg";
                let KANAMBO_MD_TEXT = `\nSession Connected\n\n📱 Join GC bot updates: https://chat.whatsapp.com/Byx7wdqizJXB79RKFKsefb\n\n🕹 Follow GitHub: https://github.com/Kanambp/dreaded-v2\n\n🌐 More info: https://kanambotech.com\n\n😎 Made by Kanambo Tech`;

                const messageOptions = {
                    image: { url: imageUrl },
                    caption: KANAMBO_MD_TEXT
                };

                await Pair_Code_By_Kanambo_Tech.sendMessage(Pair_Code_By_Kanambo_Tech.user.id, messageOptions, { quoted: session });
                await delay(100);
                await Pair_Code_By_Kanambo_Tech.ws.close();
                return await removeFile('./temp/' + id);
            } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode !== 401) {
                console.log("Reconnecting for new user...");
                await removeFile('./temp/' + id);
                KANAMBO_MD_PAIR_CODE();
            }
        });
    } catch (err) {
        console.log("Service restarted");
        await removeFile('./temp/' + id);
        if (!res.headersSent) {
            await res.send({ code: "Service Unavailable" });
        }
    }
}

return await KANAMBO_MD_PAIR_CODE();

});

module.exports = router;

                
