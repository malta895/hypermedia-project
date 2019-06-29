$(document).ready(function () {


    $('.logout').click(function (e) {
        e.preventDefault()
        $.post('/api/user/logout', function (res) {
            console.log("Logout succesful!")
            sessionStorage.clear();
            window.location.href = "pages/signin.html"

        })
            .fail(res => {
                //TODO gestire errore
                console.log(res);
            })
    });




});
