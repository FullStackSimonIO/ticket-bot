// src/handlers/closeHandler.ts
import { ChatInputCommandInteraction, TextChannel } from "discord.js";

export async function handleCloseTicket(
  interaction: ChatInputCommandInteraction
) {
  const channel = interaction.channel;

  // 1) Als TextChannel typengenau prüfen
  if (
    !(channel instanceof TextChannel) ||
    !channel.name.startsWith("ticket-")
  ) {
    return interaction.reply({
      content: "Dieses Kommando kannst du nur in einem Ticket-Kanal nutzen.",
      ephemeral: true,
    });
  }

  // 2) Bestätigung
  await interaction.reply({
    content: "Ticket wird geschlossen…",
    ephemeral: true,
  });

  // 3) Kanal nach 3 Sekunden löschen
  setTimeout(() => channel.delete().catch(() => {}), 3000);
}
