var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

$(window).on("load", function () {
    var id = getUrlParameter('id');
    $.getJSON('/api/events/' + id, function (data) {  // GET BOOK BY ID /api/book/{bookId}    
        console.log(data);
        for (i = 0; i < data.length; i++) {
            var id = data[i].id;
            var date = data[i].date;
            var location = data[i].location;
            var address = location.street_line1 + ',' + location.street_line2 + ',' + location.city;
            var book = data[i].presented_book;
            var title = book.title;
            var picture = book.picture_path;
            var authors = book.authors[0];
            var genre = data[i].genre;
            var elem = '';
            elem += '<br /> <h3>Presentation: ' + title + ' (Author: ' + authors + ')</h3> <h4>Date:</h4> <p>' + date + '</p> <h4>Where:</h4> <p>' + address + '</p> <h4>Plot:</h4> <p>Mini Plot</p>';
            var img = '<div class="item"><img src="' + picture + '" id="img" class="img - responsive" alt=""></div>';
            $("#pic").append(img);
        }







    });
    //get review by book id
    //get similar_books by book_id
});

    var map;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 45.463781, lng: 9.189432 },
            zoom: 8
        });
    }
