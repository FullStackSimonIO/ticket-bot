import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
} from "discord.js";
import { handleCloseTicket } from "../handlers/closeHandler";

export const CloseCommand = {
  data: new SlashCommandBuilder()
    .setName("close")
    .setDescription("Schließe dieses Ticket")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  async execute(interaction: ChatInputCommandInteraction) {
    await handleCloseTicket(interaction);
  },
};
