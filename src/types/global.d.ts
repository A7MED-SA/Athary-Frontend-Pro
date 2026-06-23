interface GoogleAccountsId {
  initialize(config: {
    client_id: string;
    callback: (response: { credential: string }) => void;
  }): void;
  prompt(): void;
}

interface GoogleAccounts {
  id: GoogleAccountsId;
}

interface GoogleAPI {
  accounts: GoogleAccounts;
}

declare global {
  interface Window {
    google?: GoogleAPI;
  }
}

export {};
