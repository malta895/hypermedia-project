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
            var event_id = data[i].event_id;
            var name = data[i].name;
            var id = data[i].id;
            var date = data[i].date;
            //LOCATION
            var location = data[i].location;
            var address = location.street_line1 + ',' + location.street_line2 + ',' + location.city;
            //BOOK
            var book = data[i].presented_book;
            var title = book.title;
            var picture = book.picture_path;
            var authors = book.authors;
            a = '';
            for (y = 0; y < authors.length; y++) {
                a += authors[y].name;
            }
            var genre = data[i].genre;
            var elem = '';

            $("#title").html('Presentation:'+title+'(Authors:'+a+')');
            $("#date").html(date);
            $("#where").html(address);
            var img = '<div class="item"><img src="' + picture + '" id="img" class="img - responsive" alt=""></div>';
            $("#pic").append(img);
        }







    });
});

    var map;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 45.463781, lng: 9.189432 },
            zoom: 8
        });
    }
