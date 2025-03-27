export const SOLANA_STEPS = {
  START: "start",
  CONNECT_METAMASK: "connect_metamask",
  METAMASK_SUCCESS: "metamask_success",
  CONNECT_PHANTOM: "connect_phantom",
  PHANTOM_SUCCESS: "phantom_success",
  CONNECT_ACCOUNTS: "connect_accounts",
  COMPLETED: "completed",
  NONE: "none",
};

export const StepperHeading: any = {
  start: "Before you participate you'll need to fill all required information",
  connect_metamask: "Complete all steps",
  metamask_success: "Complete all steps",
  connect_phantom: "Complete all steps",
  phantom_success: "Complete all steps",
  connect_accounts: "Complete all steps",
  completed: "Complete all steps",
};

export const StepperSecondaryHeading: any = {
    start: "",
    connect_metamask: "",
    metamask_success: "Congrats! your wallet was connected",
    connect_phantom: "",
    phantom_success: "Congrats! your wallet was connected",
    connect_accounts: "",
    completed: "All information is filled in, now you can register your interest in this pool",
  };

  export const StepperDropdownHeading: any = {
    mainWallet: "Connect main wallet",
    solanaWallet: "Connect solana wallet",
    tokenAccount: "Enter token information"
  };

  export const StepperAccount: any = {
    METAMASK: "metamask",
    PHANTOM: "phantom",
    NONE: "none",
  };

export const StepperImage: any = {
  start: "/assets/images/solana/get-started.png",
  connect_metamask: "/assets/images/solana/main_wallet.png",
  metamask_success: "/assets/images/solana/main_wallet_connected.png",
  connect_phantom: "/assets/images/solana/solana_wallet.png",
  phantom_success: "/assets/images/solana/solana_wallet_connected.png",
  connect_accounts: "",
  completed: "/assets/images/solana/completed_steps.png",
};

export const StepperButton: any = {
  start: "Lets get Started",
  connect_metamask: "Connect Wallet",
  metamask_success: "Continue",
  connect_phantom: "Connect Wallet",
  phantom_success: "Continue",
  connect_accounts: "Confirm",
  completed: "",
};

export const StepperProgress: any = {
  start: "",
  connect_metamask: [0, 0],
  metamask_success: [1, 0],
  connect_phantom: [1, 0],
  phantom_success: [1, 1],
  completed: [1, 1],
};
