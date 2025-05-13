// src/handlers/ticketHandler.ts
import {
  ChatInputCommandInteraction,
  ChannelType,
  PermissionFlagsBits,
  TextChannel,
  CategoryChannel,
  EmbedBuilder,
  GuildMember,
} from "discord.js";
import {
  TICKET_CATEGORY_PREMIUM_ID,
  TICKET_CATEGORY_VIP_ID,
  PREMIUM_ROLE_ID,
  VIP_ROLE_ID,
  SUPPORT_CHANNEL_GENERAL_ID,
  SUPPORT_CHANNEL_BUG_ID,
  SUPPORT_CHANNEL_FEATURE_ID,
} from "../config/config";

export async function handleCreateTicket(
  interaction: ChatInputCommandInteraction,
  typ: "bug" | "feature" | "other"
) {
  const guild = interaction.guild;
  if (!guild) {
    return interaction.reply({
      content: "Fehler: Kein Guild-Kontext gefunden.",
      ephemeral: true,
    });
  }

  // 1) GuildMember sicherstellen
  let member = interaction.member;
  if (!(member instanceof GuildMember)) {
    member = await guild.members.fetch(interaction.user.id);
  }

  // 2) Rollen prüfen
  const isVIP = member.roles.cache.has(VIP_ROLE_ID);
  const isPremium = member.roles.cache.has(PREMIUM_ROLE_ID);
  if (!isVIP && !isPremium) {
    return interaction.reply({
      content: "Nur Premium- und VIP-Mitglieder können Tickets eröffnen.",
      ephemeral: true,
    });
  }

  // 3) Parent-Category wählen
  const parentCategoryId = isVIP
    ? TICKET_CATEGORY_VIP_ID
    : TICKET_CATEGORY_PREMIUM_ID;

  try {
    // 4) Kategorie laden
    const rawCategory =
      guild.channels.cache.get(parentCategoryId) ??
      (await guild.channels.fetch(parentCategoryId).catch(() => null));

    if (!rawCategory || rawCategory.type !== ChannelType.GuildCategory) {
      return interaction.reply({
        content:
          "Fehler: Ticket-Kategorie nicht gefunden. Bitte Admin benachrichtigen.",
        ephemeral: true,
      });
    }
    const category = rawCategory as CategoryChannel;

    // 5) Ticket-Channel anlegen
    const ticketName = `ticket-${interaction.user.username}`.toLowerCase();
    const channel = (await guild.channels.create({
      name: ticketName,
      type: ChannelType.GuildText,
      parent: category,
      permissionOverwrites: [
        { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
        {
          id: interaction.user.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
          ],
        },
        {
          id: interaction.client.user!.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ManageChannels,
          ],
        },
      ],
    })) as TextChannel;

    // 6) Erste Nachricht im Ticket-Kanal
    await channel.send(
      `Hallo ${interaction.user}, beschreibe hier dein Anliegen.`
    );

    // 7) Einmalige Bestätigung für den Nutzer
    await interaction.reply({
      content: `Dein ${typ.toUpperCase()}-Ticket wurde erstellt: ${channel}`,
      ephemeral: true,
    });

    // 8) Support-Channel je Typ auswählen und benachrichtigen
    const supportChannelId =
      typ === "bug"
        ? SUPPORT_CHANNEL_BUG_ID
        : typ === "feature"
          ? SUPPORT_CHANNEL_FEATURE_ID
          : SUPPORT_CHANNEL_GENERAL_ID;

    try {
      const fetched =
        guild.channels.cache.get(supportChannelId) ??
        (await guild.channels.fetch(supportChannelId).catch(() => null));

      if (fetched instanceof TextChannel) {
        const embed = new EmbedBuilder()
          .setTitle(
            `${isVIP ? "👑 VIP" : "⭐ Premium"} ${
              typ === "bug"
                ? "🐞 Bug"
                : typ === "feature"
                  ? "✨ Feature"
                  : "📋 Sonstiges"
            }-Ticket`
          )
          .addFields(
            { name: "Erstellt von", value: interaction.user.tag, inline: true },
            { name: "Kanal", value: `${channel}`, inline: true },
            {
              name: "Erstellt am",
              value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
              inline: true,
            }
          )
          .setColor(
            typ === "bug" ? "Red" : typ === "feature" ? "Green" : "Grey"
          );

        await fetched.send({ embeds: [embed] });
      } else {
        console.warn(
          `Support-Channel ${supportChannelId} nicht gefunden oder kein TextChannel.`
        );
      }
    } catch (supportErr) {
      console.error("Fehler beim Senden an Support-Channel:", supportErr);
      // Kein weiteres interaction.reply – so gibt es keinen Doppel-Reply-Fehler
    }
  } catch (error) {
    console.error("Fehler im Ticket-Handler:", error);
    // Nur falls noch nicht ge-replyt, ephemeren Fehler zurückmelden
    if (!interaction.replied) {
      await interaction.reply({
        content:
          "Beim Erstellen des Tickets ist ein unerwarteter Fehler aufgetreten.",
        ephemeral: true,
      });
    }
  }
}
