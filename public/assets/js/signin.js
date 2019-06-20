$(document).ready(function () {

    $('.login-form-wrapper > form').on('submit', function (e) {
        e.preventDefault();


        let username = $(this).find('input[name=usermail]').val();
        let password = $(this).find('input[name=password]').val();

        let formData = $(this).serialize();
        $.post('/api/user/login', formData, function (res) {
            console.log(res);

            if(res.status === 200){
                console.log("Succesful Login! Redirecting to Home page...");
                console.log(res.responseText);
                location.href = '/index.html'
            } else if(res.status === 401) {
                console.log("Login Failed!");
                //TODO mostrare errore da qualche parte
            } else if(res.status === 400) {
                console.log("Already logged in!");
            } else {
                console.log("Unknown error!");
            }
        }, 'application/x-www-form-urlencoded')
                    .fail(res => {

                        console.log(res);

                        if(res.status === 200){
                            console.log("Succesful Login! Redirecting to Home page...");
                            console.log(res.responseText);
                            location.href = '/index.html'
                        } else if(res.status === 401) {
                            console.log("Login Failed!");
                            //TODO mostrare errore da qualche parte
                        }  else if(res.status === 400) {
                            console.log("Already logged in!");
                        } else {
                            console.log("Unknown error!");
                        }
                    });





    });
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
