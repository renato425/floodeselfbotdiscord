const Discord = require("discord.js-self")
const bot = new Discord.Client()
const config = require("./config.json")
let preparado = false

bot.on("ready", () => {
	console.log(`ME CONECTEI A CONTA (${bot.user.tag}). CONFIGURANDO SERVIÇOS....`)
	setTimeout(() => {
		preparado = true
		console.log("PREPARADO! PRONTO PARA USAR OS COMANDOS ;)")
	}, 10000)
})

bot.on("message", async message => {
	if (message.author.id !== config.ownerID) return
	if (message.channel.type === "dm") return
	let args = message.content.split(" ").slice(1)
	if (message.content.startsWith("!iniciar")) {
		if (preparado === false) return message.reply("Eu ainda não estou preparado para executar meus comandos!")
		if (args[0] === "flood") {
			setInterval(() => {
				bot.channels.cache.get(config.channelID).send(config.message).catch(err => {
					message.channel.send(`Ops, encontrei um erro.... \`${err}\``)
				})
			}, config.timer)
		} else if (args[0] === "selfbot") {
			message.guild.members.cache.map(m => message.guild.members.cache.get(m.id).send(config.message).catch(err => {
				message.channel.send(`Ops, encontrei um erro... \`${err}\``)
			}))
		} else {
			message.channel.send("você quer iniciar o flood ou o selfbot? diga depois do comando!")
		}
	}
	
	if (message.content.startsWith("!setmessage")) {
		if (preparado === false) return message.reply("Eu ainda não estou preparado para executar meus comandos!")
		if (!args.join(" ")) return message.reply("Informe um argumento depois do comando!")
		config.message = args.join(" ")
		message.channel.send("Alterado com sucesso!")
	}
	if (message.content.startsWith("!memberadd")) {
		if (preparado === false) return message.reply("Eu ainda não estou preparado para executar meus comandos!")
		if (args[0] === "false") {
			config.memberADD = false
			message.channel.send("Alterado com sucesso!")
		} else if (args[0] === "true") {
			config.memberADD = true
			message.channel.send("Alterado com sucesso!")
		} else {
			message.channel.send("Informe os valores entre false e true!")
		}
	}
	if (message.content.startsWith("!memberremove")) {
		if (preparando === false) return message.reply("Eu ainda não estou preparado para executar meus comandos!")
		if (args[0] === "false") {
			config.memberREMOVE = false
			message.channel.send("Alterado com sucesso!")
		} else if (args[0] === "true") {
			config.memberREMOVE = true
			message.channel.send("Informe os valores entre false e true!")
		}
	}
	if (message.content.startsWith("!timer")) {
		if (preparado === false) return message.reply("Eu ainda não estou preparado para executar meus comandos!")
			if (!args[0]) return message.reply("Informe o tempo em milisegundos após o comando!")
		let n = parseInt(args[0], 10)
		config.timer = n
		message.channel.send("Alterado!")
	}
	if (message.content.startsWith("!stop")) {
		message.channel.send("parando...")
		bot.destroy()
	}
})

bot.on("guildMemberAdd", async member => {
	if (config.memberADD === true) {
		member.user.send(config.message)
		console.log(`Mensagem enviada ao usuário ${member.user.tag}!`)
	}
})

bot.on("guildMemberRemove", async member => {
	if (config.memberREMOVE === true) {
			member.user.send(config.message)
			console.log(`Mensagem enviada ao usuário ${member.user.tag}!`)
	}
})

bot.login(config.token).catch(() => {
	console.log("ERRO AO LOGAR NA CONTA!")
})