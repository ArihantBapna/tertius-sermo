$(document).ready(function() {
    var winHeight = $(document).height();
    var navHeight = $('#finNavbar').outerHeight();
    var holdHeight = winHeight - navHeight - $('#finFooter').height();
    $('.holder').css('height',holdHeight);
})