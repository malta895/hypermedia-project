$(document).ready(function () {
    $('#modal-alert .btn-primary').click(function () {
        window.location.href = 'signin.html'
    });
    $('#modal-alert .close').click(function () {
        window.location.href = 'signin.html'
    });
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
                        
                    },
                    statusCode: {
                        200: function () {
                            $('#modal-text').html('User registered successfully!')
                            $('#modal-alert .btn-primary').html('Signin & Shop new books')
                            $('#modal-alert').modal();                           
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
