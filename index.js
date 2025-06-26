require("dotenv").config();

const { REST, Routes } = require("discord.js");
const deployCommands = async () => {
    //Deploy Command Logic
}

const {
    Client, 
    GatewayIntentBits,
    Partials,
    Collection, 
    ActivityType, 
    PresenceUpdateStatus,
    Events
} = require("discord.js");

const client = new Client({
    intent: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
})