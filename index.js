const Discord = require('discord.js'); 
var client = new Discord.Client();

const key = require ("./google_key");
const token = key.discord.token;

// Authenticates the member
function authenticate (member) {
    console.log ("AUTHENTICATING MEMBER");
  
    // Sends the member the authentication link
    let authLink = new Discord.RichEmbed()
        .setDescription ("Please open this tab, you may close it once you're done with verification:\nhttps://peddiediscord.glitch.me");
    if (member.member)
        member = member.member;
    member.send(authLink);

    let express = require ('express');
    let app = express();
    
    let passport = require ("passport");
    let GoogleStrategy = require ("passport-google-oauth20");
    
    let open = require ('open');

    // Opens the browser tap to localhost:3000
    open ("http://localhost:3000/");

    try {
        server.close(() => { });
        setImmediate(function(){server.emit('close')});
    }
    catch (err) { }
    server = app.listen (3000, () => {  })
    
    // Creates the google authentication passport
    passport.use (
        new GoogleStrategy ( {
            callbackURL: "/google",
            clientID: key.web.client_id,
            clientSecret: key.web.client_secret,
        }, (accessToken, refreshToken, profile, email, done) => {
            if (checkEmail(email))
                verify(member, email);
            else
                reject(member);
            server.close(() => { });
            setImmediate(function(){server.emit('close')});
        })
    )
    
    app.get ("/", passport.authenticate('google', {scope: ["profile", "email"]}))
    
    app.get ("/google", passport.authenticate('google'), (req, res) => {
        res.send();
    })
}

// Checks to see if the email is a Peddie email
function checkEmail (email) {
    let emailString = email._json.email;
    if (emailString.endsWith ("@peddie.org"))
        return true;
    else
        return false;
}

// Verifies the member
function verify (member, email) {
    // Adds the role for student
    if (member.member)
        member = member.member;
    let role = member.guild.roles.find(role => role.name === "student");
    member.addRole(role);
    let welcome = new Discord.RichEmbed()
        .setDescription ("Welcome to the Peddie Server!");
    member.send(welcome);

    // Adds or creates a role for the year of the student
    let _email = email._json.email;
    let year = "'" + _email.substring (_email.indexOf ("-") + 1, _email.indexOf("@"));

    let yearRole = member.guild.roles.find(role => role.name === year);

    if (yearRole)
        member.addRole(yearRole);
    else {
        member.guild.createRole({
            name: `${year}`,
        }).then(role => member.addRole(role))
    }
}
// Rejects the member
function reject (member) {
    if (member.member)
        member = member.member;
    let authLink = new Discord.RichEmbed()
        .setDescription ("Sorry, but you did not pass the Google Authentication.\nYou must have a Peddie email to join.\nIf you feel this is a mistake, let AntarcticRuler#1529 know.");
    member.send (authLink);
}

// Boots up the bot
client.on("ready", () => {
    try {
        console.log ("AUTHENTICATION UP AND RUNNING!");
    } 
    catch (err) {
        console.error(err);
    }
})

// Checks to see if the member was added on the specific server
client.on ("guildMemberAdd", member => {
    try {
        if (member.guild.id == "657687402617503744")
            authenticate(member);
    } 
    catch (err) {
        console.error(err);
    }
}); 

// Checks to see if the !verify command was used on the Peddie Discord server in the specific #verify channel
client.on ("message", message => {
    if (message.content == "!verify" && message.channel.id == "657734859883806740")
        authenticate(message);
})

client.login(token);