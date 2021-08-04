$(document).ready(function() {
    setBodyHeight();
})
$(window).on("resize", function(){
    setBodyHeight();
})

function setBodyHeight(){
    var winHeight = $(document).outerHeight();
    var navHeight = $('#finNavbar').outerHeight();
    var holdHeight = winHeight - navHeight - $('#finFooter').outerHeight();
    $('.holder').css('height',holdHeight);
}