require('dotenv').config()

const TeleBot = require('telebot');

const BUTTONS = {
    showMyFeeds: {
        label: 'Show My Feeds',
        command: '/show'
    },
    subscribeShortNews: {
        label: 'Subscribe to Short News Feed',
        command: '/subscribe_short'
    },
    subscribeBreakingNews: {
        label: 'Subscribe to Breaking News Feed',
        command: '/subscribe_breaking'
    },
    unsubscribeShortNews: {
        label: 'Unsubscribe from Short News Feed',
        command: '/unsubscribe_short'
    },
    unsubscribeBreakingNews: {
        label: 'Unsubscribe from Breaking News Feed',
        command: '/unsubscribe_breaking'
    },
    noThanks: {
        label: 'No, Thanks',
        command: '/no_action'
    }
}

const bot = new TeleBot({
    token: process.env.TELEGRAM_BOT_API_KEY, // Required. Telegram Bot API token. Considered a SECRET.
    polling: { // Optional. Use polling.
        interval: 1000, // Optional. How often check updates (in ms).
        timeout: 0, // Optional. Update polling timeout (0 - short polling).
        limit: 100, // Optional. Limits the number of updates to be retrieved.
        retryTimeout: 5000, // Optional. Reconnecting timeout (in ms).
    },
    //webhook: { // Optional. Use webhook instead of polling.
        //key: 'somekey.key', // Optional. Private key for server.
        //cert: 'somecert.pem', // Optional. Public key.
        //url: 'https://my.webhook.location', // HTTPS url to send updates to.
        //host: '0.0.0.0', // Webhook server host.
        //port: 443, // Server port.
        //maxConnections: 40 // Optional. Maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery
    //},
    allowedUpdates: [], // Optional. List the types of updates you want your bot to receive. Specify an empty list to receive all updates.
    usePlugins: ['askUser', 'namedButtons'], // Optional. Use user plugins from pluginFolder.
    pluginFolder: '../plugins/', // Optional. Plugin folder location.
    pluginConfig: { // Optional. Plugin configuration.
        namedButtons: {
            buttons: BUTTONS
        }
    }
});

bot.on(['/start', '/help'], (msg) => {
    let replyMarkup = bot.keyboard([
        [BUTTONS.noThanks.label, BUTTONS.showMyFeeds.label],
        [BUTTONS.subscribeShortNews.label, BUTTONS.subscribeBreakingNews.label],
        [BUTTONS.unsubscribeShortNews.label, BUTTONS.unsubscribeBreakingNews.label]
    ], {resize: true, once: true});

    return bot.sendMessage(msg.from.id, 'Greetings, would you like to update your news subscriptions?', {replyMarkup});
});

bot.on('/show', (msg) => { msg.reply.text('We will show your subscriptions here soon.') }); //TODO

bot.on('/subscribe_short', (msg) => { subscribe(msg, 'short') });

bot.on('/subscribe_breaking', (msg) => { subscribe(msg, 'breaking') });

bot.on('/unsubscribe_short', (msg) => { unsubscribe(msg, 'short') });

bot.on('/unsubscribe_breaking', (msg) => { unsubscribe(msg, 'breaking') });

bot.on('/no_action', (msg) => { msg.reply.text('You may bring up options again at any time by clicking the button on the bottom right.') });

const subscribe = (msg, feed) => {
    const chatId = msg.chat.id;
    // Add chat ID to subscriber table here if not already there
    msg.reply.text(`You are now subscribed to the ${feed} feed! You will receive notices each day. (Chat Id: ${chatId})`);
};

const unsubscribe = (msg, feed) => {
    const chatId = msg.chat.id;
    // Remove chat ID from subscriber table here if it exists
    msg.reply.text(`We are sad to see you go but you are now unsubscribed from the ${feed} notices. (Chat Id: ${chatId})`);
}

bot.start();
