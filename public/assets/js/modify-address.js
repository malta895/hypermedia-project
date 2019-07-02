$(document).ready(function(){
    $('#form-modify-address').on('submit', function(e){
        e.preventDefault();
        let formData = $(this).serialize();
        $.ajax({
            url: '/api/user/add/address',
            data: formData,
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            success: function (response) {
                $('#modal-server-success').modal();

            }
        }).fail(function (response) {
            if (response.status == 400) {
                $.ajax({
                    url: '/api/user/update/address',
                    data: formData,
                    type: 'PUT',
                    contentType: 'application/x-www-form-urlencoded',
                    success: function (response) {

                        $('#modal-server-success').modal();
                    }
                })
            }

        });
    });
    $('.modal-redirect').on('click', function (e) {
        window.location.href='my-account.html'
    });

});
