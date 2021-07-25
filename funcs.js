module.exports = {
    checkLog: function (req, loc){
        if(req.session.loggedIn) return loc;
        else return 'pages/login';
    },
    returnSets: function (req){
        if(req.session.loggedIn) return JSON.parse(req.session.sets);
        else return '';
    }

}