module.exports.checkLog = function checkLog(req, loc){
    if(req.session.loggedIn) return loc;
    else return 'pages/login';
}