// src/commands/embed.ts
import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import { handleEmbed } from "../handlers/embedHandler";

export const EmbedCommand = {
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Verwalte Embed-Nachrichten für Info-Kanäle")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((sub) =>
      sub
        .setName("create")
        .setDescription("Erstellt eine Embed-Nachricht in einem Kanal")
        .addChannelOption((opt) =>
          opt
            .setName("channel")
            .setDescription("Ziel-Channel für das Embed")
            .setRequired(true)
        )
        .addStringOption((opt) =>
          opt
            .setName("title")
            .setDescription("Überschrift des Embeds")
            .setRequired(true)
        )
        .addStringOption((opt) =>
          opt
            .setName("description")
            .setDescription("Inhalt des Embeds")
            .setRequired(true)
        )
        .addStringOption((opt) =>
          opt
            .setName("color")
            .setDescription("Farbe in Hex (z.B. #FF0000)")
            .setRequired(false)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("delete")
        .setDescription("Löscht eine bestehende Embed-Nachricht")
        .addStringOption((opt) =>
          opt
            .setName("message_id")
            .setDescription("ID der zu löschenden Nachricht")
            .setRequired(true)
        )
        .addChannelOption((opt) =>
          opt
            .setName("channel")
            .setDescription("Channel, in dem die Nachricht steht")
            .setRequired(true)
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await handleEmbed(interaction);
  },
};

// src/handlers/embedHandler.ts
