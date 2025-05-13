import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
import { TicketCommand } from "./commands/ticket";
import { CloseCommand } from "./commands/close";

dotenv.config();

console.log("›› DISCORD_TOKEN:", process.env.DISCORD_TOKEN ? "OK" : "MISSING");
console.log("›› CLIENT_ID:", process.env.CLIENT_ID);
console.log("›› GUILD_ID:", process.env.GUILD_ID);

const commands = [TicketCommand.data.toJSON(), CloseCommand.data.toJSON()];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    console.log("⌛ Befehle werden registriert…");
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID!, // das ist deine Bot-Client-ID
        process.env.GUILD_ID!
      ),
      { body: commands }
    );
    console.log("✅ Slash-Commands erfolgreich registriert.");
  } catch (error) {
    console.error("❌ Fehler beim Registrieren der Commands:", error);
  }
})();
