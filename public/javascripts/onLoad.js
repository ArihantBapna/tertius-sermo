$(document).ready(function() {
    setBodyHeight();
})
$(window).on("resize", function(){
    setBodyHeight();
    console.log(window.innerHeight);
})

function setBodyHeight(){
    var winHeight = window.innerHeight;
    var navHeight = $('#finNavbar').outerHeight();
    var holdHeight = winHeight - navHeight - $('#finFooter').outerHeight();
    $('.holder').css('height',holdHeight);
}