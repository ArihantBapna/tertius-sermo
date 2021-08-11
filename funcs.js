module.exports = {
    checkLog: function (req, loc){
        if(req.session.loggedIn) return loc;
        else return 'pages/login';
    },
    returnSets: function (req){
        if(req.session.loggedIn) return JSON.parse(req.session.sets);
        else return '';
    },
    getSelectedSet: function (req){
        if(req.params.setName && req.session.loggedIn){
            var sets = JSON.parse(req.session.sets);
            var index = sets.findIndex(x => x.name === req.params.setName);
            if(index !== -1){
                return sets[index];
            }else{
                return "404";
            }
        }else{
            return "404";
        }
    },
    getFooterText: function(){
        var possibilities = ["I was bored", "Stop reading this, go study", "Homies >> Women", "*high pitched* Welcome to Hotel California", "Anyone wanna play league with me?", "Code monkey go brrrr", "It's 3 am, go sleep my guy", "Woo! That'll impress her, I'm sure", "Everything mean's nothing if I can't have you", "One rep for one bug, build muscles and sadness together", "My social battery has been running on empty for 18 years", "So like a bird flu going around or something?", "Still mad about the food at homecoming", "Will you do pair programming with me? haha just kidding.. Unless - ", "I said I'll switch to Linux, don't take my kneecaps Mr Torvald", "Oh God I haven't left the house in two years, THIS IS AMAZING"];
        return possibilities[Math.floor(Math.random()*possibilities.length)];
    }

}