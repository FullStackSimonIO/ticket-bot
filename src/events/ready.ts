import { Client } from "discord.js";
import { GUILD_ID } from "../config/config";

export const onReady = async (client: Client, commands: any[]) => {
  if (!client.application?.owner) await client.application?.fetch();
  await client.application?.commands.set(
    commands.map((c) => c.data),
    GUILD_ID
  );
  console.log(`Eingeloggt als ${client.user?.tag}`);
};
