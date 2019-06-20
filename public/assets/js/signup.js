$(document).ready(function () {

    $('.signup-form-wrapper > form').on('submit', function(e){
        e.preventDefault();


        let email = $(this).find('input[name=email]').val();
        let username = $(this).find('input[name=username]').val();
        let password = $(this).find('input[name=password]').val();

        console.log(email);
        console.log(username);
        console.log(password);
        console.log(this);

        //TODO mettere qui eventuali controlli su:
        // esistenza/validità email (get su /user/emailAvailable/{email})
        // esistenza username (get se /user/email/usernameAvailable/{username})
        // password?
        let formData = $(this).serialize(); 
        $.get('/api/user/emailAvailable/' + email, function (res) {
            $.get('/api/user/usernameAvailable/'+username, function (res1) {
                               
                $.post('/api/user/register', formData, function (res2) {
                    console.log('reg')
                    location.href = "signin.html";
                }, 'application/x-www-form-urlencoded')
                    .fail(res => {
                        //TODO gestire errore
                        console.log(res);
                    });
            })
                .fail(res => {
                    //TODO gestire errore
                    console.log(res);
                });
        })
            .fail(res => {
                //TODO gestire errore
                console.log(res);
            });
        

        

    });



});
