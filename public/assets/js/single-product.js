var currencies = {
    EUR: '&euro;',
    USD: '$'
};

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

$(window).on("load",function () {
    var id = getUrlParameter('id');
    $.getJSON('/api/books/'+id, function (data) {  // GET BOOK BY ID /api/book/{bookId}    
        console.log(data);
        for (i = 0; i < data.length; i++) {
            var id = data[i].book_id;
            var title = data[i].title;
            var isbn = data[i].isbn;

            var authors = data[i].authors;
            a=''
            for (y = 0; y < authors.length; y++) {
                a += authors[y].name
            }
            var price = data[i].price;
            var picture = data[i].picture;
            var genre = data[i].genres;
            g=''
            for (k = 0; k < genre.length; k++) {
                g+=genre[k]
            }
            
            var elem = '';
            $("#title").html(title);
            $("#author").html("<span>Author</span>"+a);
            $("#price").html(price +'\u20AC');
            $("#isbn").html("<span>ISBN</span>"+isbn);
            $("#genre").html("<span>Genre</span>" + genre);
            var img = '<div class="item"><img src="' + picture + '" id="img" class="img - responsive" alt=""></div>';
            $("#product-carousel").append(img);
            $('.addCart').click(function () {
                console.log('remove');
                $.ajax({
                    url: '/api/cart/add/book/' + id,
                    type: 'PUT',
                    success: function (response) {
                        //...
                    }
                });
            });

        }
        






    });
    //get review by book id
    $.getJSON('/api/books/' + id + '/reviews', function (data) { //get similar_books by book_id   
        console.log(data);
        for (i = 0; i < data.length; i++) {
            var review = data[i];
            var id = data[i].review_id;
            var title = data[i].title;
            var book = data[i].book;
            var user = data[i].user;
            var rating = data[i].rating;
            var elem = '';
            elem += '<div class="media"> <div class="media-left"> <img class="media-object" alt="" src="../assets/images/default-avatar.png">';
            elem += '</div> <div class="media-body"> <h3 class="media-heading">'+user.username+'</h3>';
            elem += '<div class="meta"> <span class="date">' + review.date + '</span> <a data-toggle="modal" data-target="#add-review">Reply</a> </div>';
            elem += '<p>' + review.text + '</p> </div> </div>';
            $("#comments").append(elem);
        }







    });
    $.getJSON('/api/books/' + id+'/related', function (data) { //get similar_books by book_id   
        console.log(data);
        for (i = 0; i < data.length; i++) {
            var id = data[i].book_id;
            var title = data[i].title;
            var authors = data[i].authors;
            var price = data[i].price;
            var picture = data[i].picture;
            var genre = data[i].genre;
            var elem = '';
            elem += '<div class="col-sm-3 col-xs-6" id="' + id + '">';
            elem += '<article class="product-item">';
            elem += '<div class="row">';
            elem += '<div class="col-sm-3">';
            elem += '<div class="product-overlay">';
            elem += '<div class="product-mask"></div>';
            elem += '<a href="pages/single-product.html?id=' + id + '" class="product-permalink"></a><img src="' + picture + '" width="262.5" height="350" class="img-responsive" alt="">';
            elem += '<img src="' + picture + '" class="img-responsive product-image-2" alt="" width="262.5" height="350"></div></div>';
            elem += '<div class="col-sm-9"><div class="product-body">';
            elem += '<h3>' + title + '</h3>';
            elem += '<div class="product-rating"><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i></div>';
            elem += '<span class="price"><ins><span class="amount">' + currencies.EUR + price + '</span></ins></span>';
            elem += '<div class="buttons"><a href="" class="btn btn-primary btn-sm add-to-cart"><i class="fa fa-shopping-cart"></i>Add to cart</a><a href="" class="btn btn-primary btn-sm"><i class="fa fa-heart"></i></a></div>';
            elem += '</div>';
            elem += '</div>';
            elem += '</div>';
            elem += '</article';
            elem += '</div>';
            $("#products").append(elem);
        }







    });
});