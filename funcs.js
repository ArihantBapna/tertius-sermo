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
        var possibilities = ["Stevie was here:" + "<!-- >++++++++[<+++++++++>-]<.>++++[<+++++++>-]<+.+++++++..+++.>>++++++[<+++++++>-]<+" + "+.------------.>++++++[<+++++++++>-]<+.<.+++.------.--------.>>>++++[<++++++++>-" + "]<+. -->"];
        return possibilities[Math.floor(Math.random()*possibilities.length)];
    },
    generateTextId: function(length){
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }

}