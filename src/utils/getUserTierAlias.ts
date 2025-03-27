export enum UserTier {
  Start = '-' ,
  Bronze = 'Ape',
  Silver = 'Chad',
  Gold = 'Shark',
  Diamond = 'Whale'
}

export type userTiers = Extract<UserTier,
  UserTier.Gold |
  UserTier.Silver |
  UserTier.Bronze |
  UserTier.Start |
  UserTier.Diamond
>

export const userTierByNumber: { [key: number]: { text: userTiers, icon?: string } } = {
  0: {
    text: UserTier.Start,
    icon: '/assets/images/icons/rocket.svg'
  },
  1: {
    text: UserTier.Bronze,
    icon: '/assets/images/icons/bronze-medal.svg'
  },
  2: {
    text: UserTier.Silver,
    icon: '/assets/images/icons/silver-medal.svg',
  },
  3: {
    text: UserTier.Gold,
    icon: '/assets/images/icons/golden-medal.svg'
  },
  4: {
    text: UserTier.Diamond,
    icon: '/assets/images/icons/diamond.svg'
  },
}

export const getUserTierAlias = (tier: number) => {
  return userTierByNumber[tier];
}
