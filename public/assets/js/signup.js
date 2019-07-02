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

        
        let formData = $(this).serialize(); 
        $.get('/api/user/emailAvailable/' + email, function (res) {
            $.get('/api/user/usernameAvailable/'+username, function (res1) {
                               
                
                $.ajax({
                    url: '/api/user/register',
                    type: 'POST',
                    data: formData,
                    contentType: 'application/x-www-form-urlencoded',
                    success: function (data) {
                        window.location.href = "signin.html";
                    },
                    statusCode: {
                        200: function(){
                           window.location.href = "signin.html";
                        }
                    }
                    
                });
            })
                .fail(res => {
                    $('.feedback').html('Username is not available')
                });
        })
            .fail(res => {
                $('.feedback').html('Email is not available')
            });
        

        

    });



});
