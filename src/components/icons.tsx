import type { SVGProps } from "react";
import { Landmark, Users, Gem, Swords, ScanQrCode, Trophy, User } from 'lucide-react'

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" {...props}>
      <path fill="none" d="M0 0h256v256H0z" />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
        d="M168 88.00005c0-22.09139-32-40-40-40s-40 17.90861-40 40c0 22.09135 17.90861 40 40 40h40c22.09139 0 40 17.90861 40 40s-17.90861 40-40 40-40-17.90861-40-40"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
        d="M88 168.00005c0 22.09139-32-40-40-40s-40-17.90861-40-40 17.90861-40 40-40h40c22.09139 0 40-17.90861 40-40s-17.90861-40-40-40-40 17.90861-40 40"
      />
    </svg>
  ),
  leaderboard: Trophy,
  profile: User,
  home: Landmark,
  puzzle: Swords,
};
