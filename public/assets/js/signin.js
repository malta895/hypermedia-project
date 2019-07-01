$(document).ready(function () {

    $('.login-form-wrapper > form').on('submit', function (e) {
        e.preventDefault();


        let username = $(this).find('input[name=usermail]').val();
        let password = $(this).find('input[name=password]').val();

        let formData = $(this).serialize();
        $.post('/api/user/login', formData, function (res) {

            console.log('SUCCESS');

            console.log(res);

            if(res.userId){
                console.log("Succesful Login! Redirecting to Home page..."); +
                    sessionStorage.setItem('userId', JSON.stringify(res));
                
                console.log(res.responseText);
                location.href = '/index.html';
            }


        }, 'json')
            .fail(res => {

                console.log('FAIL!');

                if(res.status === 401) {
                    console.log("Login Failed!");
                    $('.feedback').html('Login Failed:Wrong combination of username/password')
                } else if(res.status === 400) {
                    $('.feedback').html('You aready logged in')
                } else {
                    console.log("Unknown error!");
                    $('.feedback').html('Something went wrong')
                }

                //TODO GESTIRE ERRORE
            });





    });





});
