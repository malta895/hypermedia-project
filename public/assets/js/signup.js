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
        console.log(formData);

        $.post('/api/user/register', formData, function(res) {
            console.log(res);
        }, 'application/x-www-form-urlencoded')
            .fail(res => {
                //TODO gestire errore
                console.log(res);
            });

    });



    // $("#register").click(function (e) {
    //     e.preventDefault();

    //     var name = $("#name").val();
    //     var lastName = $("#lastName").val();
    //     var email = $("#email").val();
    //     var bday = $("#bday").val();
    //     var username = $("#username").val();
    //     var password = $("#password").val();

    //     if (name === '' || lastName === '' || bday === '' || email === '' || username === '' || password === '') {
    //         alert("Please fill all fields...!!!!!!");
    //     } else if ((password.length) < 8) {
    //         alert("Password should at least 8 character in length...!!!!!!");
    //     } else {
    //         $.post("/api/user/register", {
    //             username: username,
    //             firstName: name,
    //             surname: lastName,
    //             email: email,
    //             birthDate:bday,
    //             password: password
    //         }, function (data) {
    //                 if (data.message === 'User registered correctly') {
    //                     location.href = "signin.html"
    //                 }
    //             //cos
    //         });
    //     }
    // });
});
