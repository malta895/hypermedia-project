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
    var street_line2 = ',';
    $.getJSON('/api/events/' + id, function (data) {  // GET BOOK BY ID /api/book/{bookId}    
        console.log(data);
        
            var event_id = data.event_id;
            var name = data.name;
            var id = data.id;
        var date = data.date_time;
        let dateObj = new Date(date);
        let dateString = dateObj.toLocaleDateString();
        let timeString = dateObj.toLocaleTimeString();
        
        date = dateString + ' ' + timeString;
            //LOCATION
        var location = data.location;
        if (location.street_line2 !== null) street_line2 = ','+location.street_line2+','
        var address = location.street_line1 + street_line2 +location.country+','+location.province+location.city;
            //BOOK
            var book = data.book;
            var title = book.title;
            var picture = book.picture;
            var authors = book.authors;
            a = '';
            for (y = 0; y < authors.length; y++) {
                a += authors[y].name;
            }
            
            var elem = '';

            $("#title").html('Presentation:'+title);
            $("#date").html(date);
            $("#authors").html(a);
            $("#where").html(address);
            $("#name").html(name);
            var img = '<div class="item"><img src="' + picture + '" id="img" class="img-responsive" alt=""></div>';
            $("#pic").append(img);
        







    });
});

    var map;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 45.463781, lng: 9.189432 },
            zoom: 8
        });
    }
