const { Telegraf, Markup } = require('telegraf')
require('dotenv').config()
const helpComm = require('./commHelp')
const pupee = require('puppeteer')


async function parsPart(){
    var brows = await pupee.launch({
        'args' : [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    })
    var page = await brows.newPage()
    await page.goto('https://www.cbr.ru/currency_base/daily/')
    await page.waitForTimeout(5000)
    var euVal = await page.$eval('#content > div > div > div > div.table-wrapper > div > table > tbody > tr:nth-child(13) > td:nth-child(5)',
    el => el.textContent)
    var dolVal = await page.$eval('#content > div > div > div > div.table-wrapper > div > table > tbody > tr:nth-child(12) > td:nth-child(5)',
    el => el.textContent)
    var funtVal = await page.$eval('#content > div > div > div > div.table-wrapper > div > table > tbody > tr:nth-child(30) > td:nth-child(5)',
    el => el.textContent)
    await brows.close()
    MYBOT(dolVal, euVal, funtVal)
}

parsPart()

function MYBOT(dolVal, euVal, funtVal){
    const bot = new Telegraf(process.env.BOT_TOKEN)
    bot.start((ctx) => {
        var fName = ctx.message.from.first_name
        var lName = ctx.message.from.last_name
        ctx.reply(
            lName == undefined ? `Hello, dear ${fName}` : `Hello dear ${fName} ${lName}`
        )
    })
    bot.help((ctx) => ctx.reply(helpComm.commands))
    bot.hears(['hi', 'hello', 'Hi', 'Hello'], (ctx) => ctx.reply('Hey there'))
    bot.command('music', async (ctx) => await ctx.replyWithHTML(
        '<em>Music!</em>', Markup.inlineKeyboard(
            [
                [Markup.button.callback('kotonoha', 'btn_1'),
                Markup.button.callback('He для меня', 'btn_2')],
                [Markup.button.callback('Badand Boujee', 'btn_3'),
                Markup.button.callback('Sky Drawer', 'btn_4')],
                [Markup.button.callback('Zori', 'btn_5'),
                Markup.button.callback('Ghost town', 'btn_6')],

            ]
                )
            )
        )
    bot.command('course', async (ctx) => await ctx.reply('choose currency', Markup.inlineKeyboard(
        [
            [Markup.button.callback('Dollar', 'crsBtn_D'),
            Markup.button.callback('Euro', 'crsBtn_E')],
            [Markup.button.callback('Pound Sterling', 'crsBtn_F')]    
        ]
            )
        )
    )

    bot.on('message', (ctx) => ctx.reply('God love you'))



    bot.action('btn_1', async (ctx) => {
        await ctx.answerCbQuery()
        try{
            await ctx.replyWithAudio({source: 'musBot/nokotonoha.mp3'})
        }catch(e){
            console.log(e)
        }
    })

    bot.action('btn_2', async (ctx) => {
        await ctx.answerCbQuery()
        try{
            await ctx.replyWithAudio({source: 'musBot/NotForMeRF.mp3'})
        }catch(e){
            console.log(e)
        }
    })

    bot.action('btn_3', async (ctx) => {
        await ctx.answerCbQuery()
        try{
            await ctx.replyWithAudio({source: 'musBot/BadandBoujee.mp3'})
        }catch(e){
            console.log(e)
        }
    })

    bot.action('btn_4', async (ctx) => {
        await ctx.answerCbQuery()
        try{
            await ctx.replyWithAudio({source: 'musBot/skyDrawer.mp3'})
        }catch(e){
            console.log(e)
        }
    })

    bot.action('btn_5', async (ctx) => {
        await ctx.answerCbQuery()
        try{
            await ctx.replyWithAudio({source: 'musBot/zori.mp3'})
        }catch(e){
            console.log(e)
        }
    })

    bot.action('btn_6', async (ctx) => {
        await ctx.answerCbQuery()
        try{
            await ctx.replyWithAudio({source: 'musBot/GhostTown.mp3'})
        }catch(e){
            console.log(e)
        }
    })

    bot.action('crsBtn_D', async (ctx) => {
        await ctx.answerCbQuery()
        try{
            ctx.reply(`Dollar: ${dolVal}`)
        }catch(e){
            console.log(e)
        }
    })

    bot.action('crsBtn_E', async (ctx) => {
        await ctx.answerCbQuery()
        try{
            ctx.reply(`Euro: ${euVal}`)
        }catch(e){
            console.log(e)
        }
    })

    bot.action('crsBtn_F', async (ctx) => {
        await ctx.answerCbQuery()
        try{
            ctx.reply(`Pound Sterling UK: ${funtVal}`)
        }catch(e){
            console.log(e)
        }
    })


    bot.launch()



    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))
}
