export interface ImapAccount {
    label: string,
    user: string,
    pass: string,
}

export const accounts: ImapAccount[] = [
  {
    label: "account1",
    user: process.env.IMAP_USER_1!,
    pass: process.env.IMAP_PASS_1!,
  },
  {
    label: "account2",
    user: process.env.IMAP_USER_2!,
    pass: process.env.IMAP_PASS_2!,
  }
];