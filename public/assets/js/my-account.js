$(document).ready(function () {
    $.getJSON('/api/me', function (data) {
        // /api/books GET ALL BOOKS
        $('#first_name').html(data.first_name);
        $('#name').html(data.first_name+' '+data.surname);
        $('#surname').html(data.surname);
        $('#username').html(data.username);
        $('#email').html(data.email);
        $('#bday').html(new Date(data.birth_date).toLocaleDateString());
        if(data.address){
            let a = data.address;
            $('#addr-first-name').html(a.first_name);
            $('#addr-last-name').html(a.last_name);
            $('#addr-complete-name').html(`${a.first_name} ${a.last_name}`);
            $('#addr-street-line1').html(a.addressStreetLine1);
            $('#addr-street-line2').html(a.addressStreetLine2);
            $('#addr-city').html(a.city);
            $('#addr-zip-code').html(a.zip_code);
            $('#addr-province').html(a.province);
            $('#addr-country').html(a.country);
            $('.address-box ul').removeClass('hidden');
        } else {
            $('.address-box a').removeClass('hidden');
        }
    });




});

