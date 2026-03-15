const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Sets up the full campaign server structure.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const guild = interaction.guild;

    try {

      // ────────────────────────────────────────────
      // 1. CREATE ROLES (bottom → top for correct hierarchy)
      // ────────────────────────────────────────────

      // ── System ──
      const dividerSystem = await guild.roles.create({
        name: '════ System ════',
        permissions: [],
        mentionable: false,
        reason: 'Setup: divider'
      });

      const roleBots = await guild.roles.create({
        name: 'Bots',
        color: 0x5865F2,
        permissions: [],
        mentionable: false,
        reason: 'Setup: Bots role'
      });

      // ── Community ──
      const dividerCommunity = await guild.roles.create({
        name: '════ Community ════',
        permissions: [],
        mentionable: false,
        reason: 'Setup: divider'
      });

      const roleMember = await guild.roles.create({
        name: 'Member',
        color: 0x95A5A6,
        permissions: [],
        mentionable: false,
        reason: 'Setup: Member role'
      });

      const rolePartyMembers = await guild.roles.create({
        name: 'Party Members',
        color: 0x1ABC9C,
        permissions: [],
        mentionable: false,
        reason: 'Setup: Party Members role'
      });

      // ── Campaign Staff ──
      const dividerStaff = await guild.roles.create({
        name: '════ Campaign Staff ════',
        permissions: [],
        mentionable: false,
        reason: 'Setup: divider'
      });

      const roleServerManager = await guild.roles.create({
        name: 'Server Manager',
        color: 0x2ECC71,
        permissions: [
          PermissionFlagsBits.ManageGuild,
          PermissionFlagsBits.ManageChannels,
          PermissionFlagsBits.ManageRoles
        ],
        mentionable: false,
        reason: 'Setup: Server Manager role'
      });

      const roleAdvisor = await guild.roles.create({
        name: 'Advisor',
        color: 0x3498DB,
        permissions: [],
        mentionable: false,
        reason: 'Setup: Advisor role'
      });

      const roleSpokesperson = await guild.roles.create({
        name: 'Spokesperson',
        color: 0x9B59B6,
        permissions: [],
        mentionable: false,
        reason: 'Setup: Spokesperson role'
      });

      const roleCampaignManager = await guild.roles.create({
        name: 'Campaign Manager',
        color: 0xE74C3C,
        permissions: [],
        mentionable: false,
        reason: 'Setup: Campaign Manager role'
      });

      // ── Leadership ──
      const dividerLeadership = await guild.roles.create({
        name: '════ Leadership ════',
        permissions: [],
        mentionable: false,
        reason: 'Setup: divider'
      });

      const roleChiefOfStaff = await guild.roles.create({
        name: 'Chief of Staff',
        color: 0xE67E22,
        permissions: [],
        mentionable: false,
        reason: 'Setup: Chief of Staff role'
      });

      const roleVicePartyLeader = await guild.roles.create({
        name: 'Vice Party Leader',
        color: 0xF1C40F,
        permissions: [],
        mentionable: false,
        reason: 'Setup: Vice Party Leader role'
      });

      const rolePartyLeader = await guild.roles.create({
        name: 'Party Leader',
        color: 0xFFD700,
        permissions: [PermissionFlagsBits.Administrator],
        mentionable: false,
        reason: 'Setup: Party Leader role'
      });

      // ────────────────────────────────────────────
      // 2. CREATE CATEGORIES AND CHANNELS
      // ────────────────────────────────────────────

      const everyoneRole = guild.roles.everyone;

      // ── CITY HALL LOBBY ──
      const catLobby = await guild.channels.create({
        name: 'City Hall Lobby',
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
          { id: everyoneRole.id, allow: [PermissionFlagsBits.ViewChannel] }
        ]
      });

      // #welcome
      await guild.channels.create({
        name: 'welcome',
        type: ChannelType.GuildText,
        parent: catLobby.id,
        permissionOverwrites: [
          { id: everyoneRole.id, allow: [PermissionFlagsBits.ViewChannel] }
        ]
      });

      // #rules — view only, no send
      await guild.channels.create({
        name: 'rules',
        type: ChannelType.GuildText,
        parent: catLobby.id,
        permissionOverwrites: [
          {
            id: everyoneRole.id,
            allow: [PermissionFlagsBits.ViewChannel],
            deny: [PermissionFlagsBits.SendMessages]
          }
        ]
      });

      // #verification — view only, no send
      await guild.channels.create({
        name: 'verification',
        type: ChannelType.GuildText,
        parent: catLobby.id,
        permissionOverwrites: [
          {
            id: everyoneRole.id,
            allow: [PermissionFlagsBits.ViewChannel],
            deny: [PermissionFlagsBits.SendMessages]
          }
        ]
      });

      // #announcements — view for all, send only for leaders/spokesperson
      await guild.channels.create({
        name: 'announcements',
        type: ChannelType.GuildText,
        parent: catLobby.id,
        permissionOverwrites: [
          {
            id: everyoneRole.id,
            allow: [PermissionFlagsBits.ViewChannel],
            deny: [PermissionFlagsBits.SendMessages]
          },
          { id: rolePartyLeader.id, allow: [PermissionFlagsBits.SendMessages] },
          { id: roleVicePartyLeader.id, allow: [PermissionFlagsBits.SendMessages] },
          { id: roleSpokesperson.id, allow: [PermissionFlagsBits.SendMessages] }
        ]
      });

      // ── COMMUNITY ──
      const catCommunity = await guild.channels.create({
        name: 'Community',
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
          {
            id: everyoneRole.id,
            deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
          },
          {
            id: roleMember.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
          },
          {
            id: rolePartyMembers.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
          }
        ]
      });

      const communityChannels = ['general', 'campaign-talk', 'suggestions', 'polls', 'media', 'allies'];
      for (const name of communityChannels) {
        await guild.channels.create({
          name,
          type: ChannelType.GuildText,
          parent: catCommunity.id
        });
      }

      // ── CAMPAIGN STAFF ──
      const staffRoles = [
        roleCampaignManager,
        roleChiefOfStaff,
        roleVicePartyLeader,
        rolePartyLeader,
        roleAdvisor,
        roleSpokesperson,
        roleServerManager
      ];

      const catStaff = await guild.channels.create({
        name: 'Campaign Staff',
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
          { id: everyoneRole.id, deny: [PermissionFlagsBits.ViewChannel] },
          ...staffRoles.map(role => ({
            id: role.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages]
          }))
        ]
      });

      const staffChannels = ['staff-chat', 'campaign-planning', 'advertising', 'events', 'staff-updates'];
      for (const name of staffChannels) {
        await guild.channels.create({
          name,
          type: ChannelType.GuildText,
          parent: catStaff.id
        });
      }

      // ────────────────────────────────────────────
      // 3. DONE
      // ────────────────────────────────────────────
      await interaction.editReply('✅ Campaign server setup completed successfully.');

    } catch (error) {
      console.error('Setup error:', error);
      await interaction.editReply('❌ Setup failed. Check bot permissions and role hierarchy.');
    }
  }
};
