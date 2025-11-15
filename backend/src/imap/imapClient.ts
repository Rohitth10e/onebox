import { ImapFlow } from "imapflow";
import { ImapAccount } from "./imapAccountConfig";

export function createImapClient(account: ImapAccount) {
  return new ImapFlow({
    host: process.env.IMAP_HOST!,
    port: Number(process.env.IMAP_PORT!),
    secure: true,
    auth: {
      user: account.user,
      pass: account.pass,
    },
    logger: false,
  });
}