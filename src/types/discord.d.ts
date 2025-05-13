// src/types/discord.d.ts
import { Client, Collection } from "discord.js";
import type { SlashCommandBuilder } from "@discordjs/builders";

declare module "discord.js" {
  export interface Client {
    /** Key: Command-Name, Value: Command-Objekt */
    commands: Collection<
      string,
      { data: SlashCommandBuilder; execute: Function }
    >;
  }
}
