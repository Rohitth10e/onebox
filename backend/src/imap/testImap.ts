// import { ImapFlow } from "imapflow";
// import dotenv from "dotenv";
// dotenv.config();

// async function test() {
//   const client = new ImapFlow({
//     host: process.env.IMAP_HOST!,
//     port: Number(process.env.IMAP_PORT!),
//     secure: true,
//     auth: {
//       user: process.env.IMAP_USER_1!,
//       pass: process.env.IMAP_PASS_1!,
//     },
//   });

//   console.log("Connecting to IMAP...");

//   await client.connect();

//   console.log("Connected!");
//   console.log("Opening INBOX...");

//   await client.mailboxOpen("INBOX");

//   console.log("Fetching last 5 emails...");

//   const seq = (await client.search({ all: true }, { uid: true })) || [];
//   const last5 = seq.length ? seq.slice(-5) : [];

//   for await (let msg of client.fetch(last5, { envelope: true })) {
//     console.log("Email:", msg.envelope.subject);
//   }

//   await client.logout();
// }

// test();
