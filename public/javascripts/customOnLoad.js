$(document).ready(function() {
    setBodyHeight();
})
$(window).on("resize", function(){
    setBodyHeight();
})
function setBodyHeight(){
    var winHeight = window.innerHeight;
    var navHeight = $('#finNavbar').outerHeight();
    var holdHeight = winHeight - navHeight - $('#finFooter').outerHeight() - $('#finProg').outerHeight();
    $('.holder').css('height',holdHeight);
}