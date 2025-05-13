// src/commands/ticket.ts
import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { handleCreateTicket } from "../handlers/ticketHandler";

export const TicketCommand = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Erstelle ein neues Support-Ticket")
    .addStringOption((opt) =>
      opt
        .setName("typ")
        .setDescription("Kategorie deines Anliegens")
        .setRequired(true)
        .addChoices(
          { name: "🐞 Bug", value: "bug" },
          { name: "✨ Feature", value: "feature" },
          { name: "📋 Sonstiges", value: "other" }
        )
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    const typ = interaction.options.getString("typ", true) as
      | "bug"
      | "feature"
      | "other";
    await handleCreateTicket(interaction, typ);
  },
};
