$(document).ready(function () {
    $.getJSON('/api/events', function (data) {  // /api/books GET ALL EVENTS

        for (let i = 0; i < data.length; i++) {
            var id = data[i].event_id;
            var date = data[i].date_time;
            var location = data[i].location;
            var address = location.street_line1 + ',' + location.street_line2 + ',' + location.city;

            var book = data[i].book;
            var title = book.title;
            var picture = book.picture;
            var abstract = book.abstract;

            var authors = book.authors.reduce(function(acc, currVal){
                return (acc === '' ? '' : (acc + ', ')) + currVal.name;
            }, '');

            let dateObj = new Date(date);
            let dateString = dateObj.toLocaleDateString();
            let timeString = dateObj.toLocaleTimeString();

            date = dateString + ' ' + timeString;

            var elem = '';
            elem += '<div class="col-sm-12 col-xs-6"> <article class="product-item"> <div class="row"> <div class="col-sm-3"> <div class="product-overlay"> <div class="product-mask"></div>';
            elem += '<a href="single-event.html?id=' + id + '" class="product-permalink"></a>';
            elem += '<img src="'+picture+'" class="img-responsive" alt="">';
            elem += ' </div> </div> <div class="col-sm-9"> <div class="product-body">';
            elem += '<h3>Presentation:'+title+' (Authors: '+authors+')</h3> <h4>Date:</h4> <p>'+date+'</p> <h4>Where:</h4> <p>'+address+'</p> <h4>Plot:</h4> <p>'+abstract+'</p>';
            elem += ' </div> </div> </div> </article> </div>';

            $("#events").append(elem);

        }

    });
});

