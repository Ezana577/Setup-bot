require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const http = require('http');
const setupCommand = require('./commands/setup');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();
client.commands.set(setupCommand.data.name, setupCommand);

client.once('ready', async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    console.log('Registering slash commands...');
    const guilds = await client.guilds.fetch();
    for (const [guildId] of guilds) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
        { body: [setupCommand.data.toJSON()] }
      );
    }
    console.log('✅ Slash commands registered.');
  } catch (err) {
    console.error('Failed to register commands:', err);
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: '❌ An error occurred.', ephemeral: true });
  }
});

client.login(process.env.TOKEN);

// ── Keep Render Web Service alive ──
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end('Bot is running!');
});

server.listen(process.env.PORT || 3000, () => {
  console.log('✅ HTTP server alive on port', process.env.PORT || 3000);
});
