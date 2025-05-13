import dotenv from "dotenv";
dotenv.config();

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN!;
export const CLIENT_ID = process.env.CLIENT_ID!;
export const GUILD_ID = process.env.GUILD_ID!;

// Ticket-Channel-IDs
export const TICKET_CATEGORY_PREMIUM_ID =
  process.env.TICKET_CATEGORY_PREMIUM_ID!;
export const TICKET_CATEGORY_VIP_ID = process.env.TICKET_CATEGORY_VIP_ID!;

// Rollen
export const PREMIUM_ROLE_ID = process.env.PREMIUM_ROLE_ID!;
export const VIP_ROLE_ID = process.env.VIP_ROLE_ID!;

// Support-Channel je Typ
export const SUPPORT_CHANNEL_GENERAL_ID =
  process.env.SUPPORT_CHANNEL_GENERAL_ID!;
export const SUPPORT_CHANNEL_BUG_ID = process.env.SUPPORT_CHANNEL_BUG_ID!;
export const SUPPORT_CHANNEL_FEATURE_ID =
  process.env.SUPPORT_CHANNEL_FEATURE_ID!;
