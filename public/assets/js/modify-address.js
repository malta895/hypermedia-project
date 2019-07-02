$(document).ready(function () {

    //get personal info
    $.getJSON('/api/me', function (data) {

        if (data.address) {
            $('input[name=address]').val();
            let a = data.address;
            $('input[name=first_name]').val(a.first_name);
            $('input[name=last_name]').val(a.last_name);
            $('input[name=addressStreetLine1]').val(a.street_line1);
            $('input[name=addressStreetLine2]').val(a.street_line2);
            $('input[name=city]').val(a.city);
            $('input[name=country]').val(a.country);
            $('input[name=province]').val(a.province);
            $('input[name=zip_code]').val(a.zip_code);
        }
    });

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
                    success: function (responsen) {

                        $('#modal-server-success').modal();
                    }
                });
            }

        });
    });
    $('.modal-redirect').on('click', function (e) {
        window.location.href = 'my-account.html';
    });

});
