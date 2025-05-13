import { Interaction } from "discord.js";

export const onInteractionCreate = async (
  interaction: Interaction,
  client: any
) => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "Fehler beim Ausführen des Commands.",
      ephemeral: true,
    });
  }
};
