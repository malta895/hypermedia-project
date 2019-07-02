$(document).ready(function() {

    //get personal info
    $.getJSON('/api/me', function (data) {
        let f = $('#modify-profile-form');
        let u = data;

        f.find('input[name=first_name]').val(u.first_name);
        f.find('input[name=surname]').val(u.surname);
        f.find('input[name=email]').val(u.email);
        f.find('input[name=username]').val(u.username);

        let dO = new Date(u.birth_date);
        console.log(dO);
        let dateString = dO.getFullYear() +  '-' + (dO.getMonth()+1 < 10 ? '0':'')+(dO.getMonth()+1) + '-' + (dO.getDate() < 10 ? '0':'')+dO.getDate();

        console.log(dateString);
        f.find('input[name=birth_date]').val(dateString);

    });




    $('#modify-profile-form').submit(function(e){
        e.preventDefault();
        let formData = $(this).serialize();
        $.ajax({
            url: '/api/user/update',
            data: formData,
            type: 'PUT',
            contentType: 'application/x-www-form-urlencoded',
            success: function() {
                $('#modal-server-success .modal-body p').html("User data updated successfully");
                $("#modal-server-success").modal();
            }
        });
    });

    $('#change-password-form').submit(function(e){
        e.preventDefault();
        let formData = $(this).serialize();
        $.ajax({
            url: '/api/user/update/password',
            data: formData,
            type: 'PUT',
            contentType: 'application/x-www-form-urlencoded',
            success: function() {
                $('#modal-server-success .modal-body p').html("Password updated succesfully!");
                $("#modal-server-success").modal();
                $('.form-error-text').addClass('hidden');
            }
        })
            .fail(function(response){
                $('.form-error-text').addClass('hidden');
                switch(response.status){
                case 400:
                    $('input[name=confirm_new_password]').next().removeClass('hidden');
                    break;
                case 401:
                    $('input[name=old_password]').next().removeClass('hidden');
                    break;
                case 200:
                    console.log(response.status);
                    
                    $('#modal-server-success .modal-body p').html("Password updated succesfully!");
                    $("#modal-server-success").modal();
                    $('.form-error-text').addClass('hidden');
                    break;

                }
            });
    });




});
