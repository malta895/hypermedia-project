$(document).ready(function () {
    $.getJSON('/api/me', function (data) {
        // /api/books GET ALL BOOKS
        $('#first_name').html(data.first_name);
        $('#name').html(data.first_name+' '+data.surname);
        $('#surname').html(data.surname);
        $('#username').html(data.username);
        $('#email').html(data.email);
        $('#birth_data').html(data.birth_date);
        $('#birth_data').html(data.birth_date);

    });




});

