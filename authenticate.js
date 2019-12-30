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