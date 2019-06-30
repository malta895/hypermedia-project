$(document).ready(function () {
    $.getJSON('/api/events', function (data) {  // /api/books GET ALL EVENTS

        for (let i = 0; i < data.length; i++) {
            var id = data[i].event_id;
            var date = data[i].date;
            var location = data[i].location;

            var book = data[i].presented_book;
            var title = book.title;
            var picture = book.picture_path;
            var authors = book.authors.reduce(function(acc, currVal){
                return acc === '' ? currVal : ', ' + currVal;
            }, '');
            var genre = book.genre.name;
            var elem = '';
            elem += '<div class="col-sm-12 col-xs-6"> <article class="product-item"> <div class="row"> <div class="col-sm-3"> <div class="product-overlay"> <div class="product-mask"></div>';
            elem += '<a href="single-event.html?id=' + id + '" class="product-permalink"></a>';
            elem += '<img src="" class="img-responsive" alt="">';
            elem += ' </div> </div> <div class="col-sm-9"> <div class="product-body">';
            elem += '<h3>Presentation:'+title+' (Authors: '+authors+')</h3> <h4>Date:</h4> <p>'+date+'</p> <h4>Where:</h4> <p>'+address+'</p> <h4>Plot:</h4> <p>Mini Plot</p>';
            elem += ' </div> </div> </div> </article> </div>';

            $("#events").append(elem);

        }

    });
});

