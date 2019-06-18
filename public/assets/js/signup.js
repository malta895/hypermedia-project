$(document).ready(function () {
    $("#register").click(function (e) {
        e.preventDefault();
        var name = $("#name").val();
        var lastName = $("#lastName").val();
        var email = $("#email").val();
        var bday = $("#bday").val();
        var username = $("#username").val();
        var password = $("#password").val();
        console.log('qui');
        if (name === '' || lastName === '' || bday === '' || email === '' || username === '' || password === '') {
            alert("Please fill all fields...!!!!!!");
        } else if ((password.length) < 8) {
            alert("Password should atleast 8 character in length...!!!!!!");
        } else {
            $.post("/api/user/register", {
                username: username,
                firstName: name,
                surname: lastName,
                email: email,
                birthDate:bday,
                password: password
            }, function (data) {
                    if (data.message === 'User registered correctly') {
                        location.href = "signin.html"
                    }
                //cos
            });
        }
    });
});
