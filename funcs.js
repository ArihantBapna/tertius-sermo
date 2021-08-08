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

}