const config = require("./config");

class FurryBotServer {
    constructor(cnf) {
        this.config = config;
        this.cnf = cnf || this.config.serverOptions;
        this.express = require("express");
        this.logger = require("morgan");
        this.https = require("https");
        this.fs = require("fs");
        this.r = require("rethinkdbdash")(this.config.db.main);
        //this.ro = require("rethinkdbdash")(this.config.db.other);
    }

    load(client) {
        this.server = this.express();
        this.checkAuth = ((req,res,next)=>{
            if(!next) return !((!req.headers.authorization || req.headers.authorization !== this.config.serverOptions.apiKey) && (!req.query.auth || req.query.auth !== this.config.serverOptions.apiKey));
            if((!req.headers.authorization || req.headers.authorization !== this.config.serverOptions.apiKey) && (!req.query.auth || req.query.auth !== this.config.serverOptions.apiKey)) return res.status(401).json({
                success: false,
                error: "invalid credentials"
            });
            next();
        });
        this.server.use(async(req,res,next)=>{
            // return res.status(403).json({success:false,error:"invalid credentials"});
            next();
        })
        .use(this.logger("dev"))
        .get("/stats",async(req,res)=>{
            var userCount = 0;
            var largeGuildCount=0;
            var rq = await client.request(`https://api.uptimerobot.com/v2/getMonitors`,{
                method: "POST",
                headers: {
                    "Cache-Control": "no-cache",
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                form: {
                    api_key: this.config.apis.uptimeRobot.apiKey,
                    format: "json"
                }
            });
            var st = JSON.parse(rq.body);
            
            var srv=Array.from(client.guilds.values());
            for(let i=0;i<srv.length;i++) {
                if(!srv[i].unavailable) {
                    if(srv[i].large) {
                        largeGuildCount++;
                    }
                } else {
                    console.log(`Guild Unavailable: ${srv[i].name} (${srv[i].id})`);
                }
            }
            client.guilds.forEach((g)=>userCount+=g.memberCount);
            var d = new Date();
            var date = `${d.getMonth().toString().length > 1 ? d.getMonth()+1 : `0${d.getMonth()+1}`}-${d.getDate().toString().length > 1 ? d.getDate() : `0${d.getDate()}`}-${d.getFullYear()}`;
            var a = await this.r.table("dailyjoins").getAll(date);
            var dailyJoins = a.length >= 1 ? a[0].count : null;
            return res.status(200).json({
                success:true,
                clientStatus: client.user.presence.status,
                guildCount: client.guilds.size,userCount,
                shardCount: client.options.shardCount,
                memoryUsage: {
                    process: {
                        used: client.getUsedMemory(),
                        total: client.getTotalMemory()
                    },
                    server: {
                        used: client.getSYSUsed(),
                        total: client.getSYSTotal()
                    }
                },
                largeGuildCount,
                apiVersion: this.config.bot.apiVersion,
                botVersion: this.config.bot.version,
                discordjsVersion: client.Discord.version,
                nodeVersion: process.version,
                dailyJoins,
                monitors: {
                    website: st.monitors.filter(m=>m.id===parseInt(this.config.uptimeRobot.monitors.website),10)[0].status,
                    cdn: st.monitors.filter(m=>m.id===parseInt(this.config.uptimeRobot.monitors.cdn,10))[0].status
                },
				commandCount: Object.keys(this.config.commandList.fullList).length,
				messageCount: await this.r.table("stats").get("messageCount")("count"),
				dmMessageCount: await this.r.table("stats").get("messageCount")("dmCount")
            });
        })
        .get("/stats/guilds",async(req,res)=>{
            var jsn = {
                success: true,
                guildCount: client.guilds.size
            }
            if(this.checkAuth(req,res,false)) {
                jsn.guilds = client.guilds.map(g=>({[g.id]:{name:g.name,memberCount:g.memberCount}}));
            }
            res.status(200).json(jsn);
        })
        .get("/stats/ping",async(req,res)=>{
            return res.status(200).json({
                success: true,
                ping:Math.round(client.ws.ping)
            });
        })
        .get("/commands",async(req,res)=>{
            const commands = require("./commands");
            var cmds = {};

            commands.map(c=>c.name.toLowerCase()).forEach((c)=>{
                cmds[c] = {};
            });

            commands.map(c=>c.commands).forEach((cmd)=>{
                cmd.forEach((c)=>{

                });
            })
            commands.forEach((category)=>{
                category.commands.forEach((cmd)=>{
                    delete cmd.run;
                    cmds[category.name.toLowerCase()][cmd.triggers[0]] = cmd;
                })
            });
            return res.status(200).json({success:true,list:cmds});
        })
        .get("/status",async(req,res)=>{
            return res.status(200).json({
                success: true,
                clientStatus: client.user.presence.status
            });
        })
        .get("/checkauth",this.checkAuth,async(req,res)=>{
            res.status(200).json({success:true});
        })
        if(![undefined,null,""].includes(this.cnf.ssl) && this.cnf.ssl === true) {
            if(this.cnf.port === 80) throw new Error("ssl server cannot be ran on insecure port");
            var privateKey = this.fs.readFileSync(`${this.config.rootDir}/ssl/ssl.key`);
            var certificate = this.fs.readFileSync(`${this.config.rootDir}/ssl/ssl.crt`);

            return this.https.createServer({
                key: privateKey,
                cert: certificate
            }, this.server).listen(this.cnf.port,this.cnf.bindIp,(()=>{client.logger.log("listening")}));
        } else {
            return this.server.listen(this.cnf.port,this.cnf.bindIp,(()=>{client.logger.log("listening")}));
        }
    }
}

module.exports = FurryBotServer;