import {
  ChatInputCommandInteraction,
  TextChannel,
  EmbedBuilder,
} from "discord.js";

export async function handleEmbed(interaction: ChatInputCommandInteraction) {
  const sub = interaction.options.getSubcommand();
  if (sub === "create") {
    const channel = interaction.options.getChannel("channel", true);
    const title = interaction.options.getString("title", true);
    const description = interaction.options.getString("description", true);
    const color = interaction.options.getString("color") ?? "#2f3136";

    if (!(channel instanceof TextChannel)) {
      return interaction.reply({
        content: "Bitte wähle einen Text-Channel.",
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(color as any)
      .setTimestamp();

    const msg = await channel.send({ embeds: [embed] });
    await interaction.reply({
      content: `Embed gesendet in ${channel} (ID: ${msg.id})`,
      ephemeral: true,
    });
  } else if (sub === "delete") {
    const channel = interaction.options.getChannel("channel", true);
    const messageId = interaction.options.getString("message_id", true);

    if (!(channel instanceof TextChannel)) {
      return interaction.reply({
        content: "Bitte wähle einen Text-Channel.",
        ephemeral: true,
      });
    }
    try {
      const msg = await channel.messages.fetch(messageId);
      await msg.delete();
      await interaction.reply({
        content: "Embed-Nachricht gelöscht.",
        ephemeral: true,
      });
    } catch {
      await interaction.reply({
        content: "Nachricht nicht gefunden oder konnte nicht gelöscht werden.",
        ephemeral: true,
      });
    }
  }
}
