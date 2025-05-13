// src/index.ts

import { Client, GatewayIntentBits, Collection } from "discord.js";
import { DISCORD_TOKEN } from "./config/config";
import { TicketCommand } from "./commands/ticket";
import { CloseCommand } from "./commands/close";
import { onReady } from "./events/ready";
import { onInteractionCreate } from "./events/InteractionCreate";

// 1) Shape Deines Command-Objekts (data als any, execute strikt typisiert)
type Command = {
  data: any; // hier landen die SlashCommandBuilder-Objekte
  execute: (interaction: any) => Promise<any>;
};

// 2) Erweitere Client um .commands
type BotClient = Client & { commands: Collection<string, Command> };

// 3) Client erstellen und casten
const client = new Client({ intents: [GatewayIntentBits.Guilds] }) as BotClient;

// 4) Command-Registry anlegen
client.commands = new Collection<string, Command>();
[TicketCommand, CloseCommand].forEach((cmd) =>
  client.commands.set(cmd.data.name, cmd)
);

// 5) Events binden
client.once("ready", () => onReady(client, [TicketCommand, CloseCommand]));
client.on("interactionCreate", (interaction) =>
  onInteractionCreate(interaction, client)
);

// 6) Bot einloggen
client.login(DISCORD_TOKEN);
