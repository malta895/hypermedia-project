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
var id = getUrlParameter('id');
$(window).on("load",function () {
    
    $.getJSON('/api/books/'+id, function (data) {  // GET BOOK BY ID /api/book/{bookId}    
        console.log(data);
        for (i = 0; i < data.length; i++) {
            var id = data[i].book_id;
            var title = data[i].title;
            var isbn = data[i].isbn;
            var rating = data[i].average_rating
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
            d = '';
            for (i = 1; i <= 5; i++) {
                if (i <= rating) {
                    d += '<i class="fa fa-star"></i>';
                } else {
                    d += '<i class="fa fa-star-o"></i>'
                }

            }
            
            $(".product-rating").html(d);
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
                        addCart()
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
            var d = '';                
            for (i = 1; i <=5; i++) {
                if (i <= rating) {
                    d += '<i class="fa fa-star"></i>'
                } else {
                    d +='<i class="fa fa-star-o"></i>'
                }

            }
            elem += '<div class="media">';
            elem += '<div class="media-body"> <h3 class="media-heading">'+d+' '+title+'</h3>';
            elem += '<div class="meta"> <span class="date">' + review.date_published + '</span></div>';
            elem += '<p>' + review.text + '</p> </div> </div>';
            $(".comments").append(elem);
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

    $('.modal-body > form').on('submit', function (e) {
        e.preventDefault();


        let formData = $(this).serialize();
        $.post('/api/books/' + id + '/reviews/add', formData, function (res) {

            addReview()
            $('.modal').modal('hide');
            

            


        }, 'json')
            .fail(res => {

                console.log('FAIL!');

                if (res.status === 401) {
                    console.log("Login Failed!");
                    //TODO mostrare errore da qualche parte
                } else if (res.status === 400) {
                    console.log("Already logged in!");
                } else {
                    console.log("Unknown error!");
                }

                //TODO GESTIRE ERRORE
            });





    });

});

function addReview() {
    $.getJSON('/api/books/' + id, function (data) {  // GET BOOK BY ID /api/book/{bookId}    
        console.log(data);
        for (i = 0; i < data.length; i++) {
            var id = data[i].book_id;
            var title = data[i].title;
            var isbn = data[i].isbn;
            var rating = data[i].average_rating
            var authors = data[i].authors;
            a = ''
            for (y = 0; y < authors.length; y++) {
                a += authors[y].name
            }
            var price = data[i].price;
            var picture = data[i].picture;
            var genre = data[i].genres;
            g = ''
            for (k = 0; k < genre.length; k++) {
                g += genre[k]
            }
            d = '';
            for (i = 1; i <= 5; i++) {
                if (i <= rating) {
                    d += '<i class="fa fa-star"></i>';
                } else {
                    d += '<i class="fa fa-star-o"></i>'
                }

            }

            $(".product-rating").html(d);
            $("#title").html(title);
            $("#author").html("<span>Author</span>" + a);
            $("#price").html(price + '\u20AC');
            $("#isbn").html("<span>ISBN</span>" + isbn);
            $("#genre").html("<span>Genre</span>" + genre);
            var img = '<div class="item"><img src="' + picture + '" id="img" class="img - responsive" alt=""></div>';
            $("#product-carousel").html(img);
            

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
            var d = '';
            for (i = 1; i <= 5; i++) {
                if (i <= rating) {
                    d += '<i class="fa fa-star"></i>'
                } else {
                    d += '<i class="fa fa-star-o"></i>'
                }

            }
            elem += '<div class="media">';
            elem += '<div class="media-body"> <h3 class="media-heading">' + d + ' ' + title + '</h3>';
            elem += '<div class="meta"> <span class="date">' + review.date_published + '</span></div>';
            elem += '<p>' + review.text + '</p> </div> </div>';
            $(".comments").append(elem);
        }







    });
    $.getJSON('/api/books/' + id + '/related', function (data) { //get similar_books by book_id   
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
}
function addCart() {

    $.getJSON('/api/cart', function (data) {
        console.log(data)// /api/cart GET CART
        $(".dropdown-menu").empty();
        for (i = 0; i < data[0].books.length; i++) {
            console.log(data[0].books[i])
            book = data[0].books[i].book;
            var id = book.book_id;
            var title = book.title;
            var authors = book.authors;
            var price = book.price;
            var picture = book.picture;
            var genre = book.genres;
            var quantity = data[0].books[i].quantity;
            var elem = '';
            elem += '<li><div class="row"><div class="col-sm-3">';
            elem += '<img src="' + picture + '" class="img-responsive" alt="">';
            elem += '</div><div class="col-sm-9">';
            elem += '<h4><a href="single-product.html?id=' + id + '">Fusce Aliquam</a></h4>';
            elem += '<p>' + quantity + 'x - &euro;' + price + '</p>';
            elem += '<a href="#" class="remove"><i class="fa fa-times-circle"></i></a>';
            elem += '</div></div></li>';


            $(".dropdown-menu").append(elem);

        }
        elem = '<li> <div class="row"> <div class="col-sm-6"> <a href="cart.html" class="btn btn-primary btn-block">View Cart</a> </div> <div class="col-sm-6"> <a href="checkout.html" class="btn btn-primary btn-block">Checkout</a> </div> </div> </li>';
        $(".dropdown-menu").append(elem);








    });
}