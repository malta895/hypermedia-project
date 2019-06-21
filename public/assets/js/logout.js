$(document).ready(function () {


    $('.logout').click(function () {
        $.post('/api/user/logout', function (res) {
            console.log("Logout succesful!")
        })
            .fail(res => {
                //TODO gestire errore
                console.log(res);
            })
    });




});
