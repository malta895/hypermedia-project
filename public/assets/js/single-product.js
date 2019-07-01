//"use strict";

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
    return undefined;
};
var id = getUrlParameter('id');
$(window).on("load",function () {

    $.getJSON('/api/books/'+id, function (book) {  // GET BOOK BY ID /api/book/{bookId}
        console.log(book);
        var id = book.book_id;
        var title = book.title;
        var isbn = book.isbn;
        var rating = book.average_rating;
        var authors = book.authors.reduce(function(acc, currValue){
            return (acc === '' ? '' : (acc + ', ')) + currValue.name;
        }, '');
        console.log(authors);
        var price = book.price;
        var picture = book.picture;
        var genre = book.genres.join(', ');
        var themes = book.themes.join(', ');
        let d = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                d += '<i class="fa fa-star"></i>';
            } else {
                d += '<i class="fa fa-star-o"></i>';
            }

        }

        $(".product-rating").html(d);

        $("#title").html(title);
        $("#summary2").html(book.abstract);
        $("#author").html("<span>Author</span>"+ authors);
        $("#price").html(price +'\u20AC');
        $("#isbn").html("<span>ISBN</span>"+isbn);
        $("#genre").html("<span>Genre</span>" + genre);
        $("#theme").html("<span>Themes</span>" + themes);
        var img = '<div class="item"><img src="' + picture + '" id="img" class="img - responsive" alt=""></div>';
        $("#product-carousel").append(img);
        $('.addCart').click(function () {
            $.ajax({
                url: '/api/cart/add/book/' + id,
                type: 'PUT',
                success: function (response) {
                    $.getJSON('/api/cart', function (data) {
                        console.log(data);// /api/cart GET CART
                        $(".navbar-cart > ul").empty();
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


                            $(".navbar-cart > ul").append(elem);

                        }
                        elem = '<li> <div class="row"> <div class="col-sm-6"> <a href="cart.html" class="btn btn-primary btn-block">View Cart</a> </div> <div class="col-sm-6"> <a href="checkout.html" class="btn btn-primary btn-block">Checkout</a> </div> </div> </li>';
                        $(".navbar-cart > ul").append(elem);
                    });
                }
            });
        });
    });
    //get review by book id
    $.getJSON('/api/books/'+ id +'/reviews', function (data) { //get similar_books by book_id
        console.log(data);
        for (let i = 0; i < data.length; i++) {
            var review = data[i];
            var id = data[i].review_id;
            var title = data[i].title;
            var book = data[i].book;
            var user = data[i].user;
            var rating = data[i].rating;
            let dateTimePublished = new Date(review.date_published);
            let dateString = dateTimePublished.toLocaleDateString();
            var elem = '';
            var d = '';
            for (let j = 1; j <=5; j++) {
                if (j <= rating) {
                    d += '<i class="fa fa-star"></i>';
                } else {
                    d +='<i class="fa fa-star-o"></i>';
                }

            }
            elem += '<div class="">';
            elem += '<div class=""> <h3 class="media-heading">'+d+' '+title+'</h3>';
            elem += '<div class="meta"> <span class="date">' + dateString + ' - ' + user.first_name + '</span></div>';
            elem += '<p>' + review.text + '</p> </div> </div>';
            $(".comments").append(elem);
        }

    }).fail(res => {
        console.log(res);

        switch (res.status) {
            case 404:
                $(".comments").html('<p><b>There are no reviews for this book</b></p>');

                break;
        }

        //TODO GESTIRE ERRORE

    });;
    var userId=JSON.parse(sessionStorage.getItem('userId')).userId;
    $.getJSON('/api/user/'+userId+'/reviews', function (data) {
        console.log(data)
        for (i = 0; i < data.length;i++) {
            if (data[i].book == id) {
                $('.review').hide()
            }
        }
    });
    $.getJSON('/api/books/' + id+'/related', function (data) { //get similar_books by book_id
        console.log(data);
        for (let i = 0; i < data.length; i++) {
            var id = data[i].book_id;
            var title = data[i].title;
            var authors = data[i].authors.reduce(function(acc, au) {
                return (acc === '' ? '' : (acc + ', ')) + au.name;
            }, '');
            var price = data[i].price;
            var picture = data[i].picture;
            var genres = data[i].genres.join(', ');
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

            location.reload();


        }, 'json')
            .fail(res => {
                console.log(res);

                switch(res.code){
                case 409:

                    break;
                }

                //TODO GESTIRE ERRORE

            });





    });
    
});


function addCart() {

    $.getJSON('/api/cart', function (data) {
        console.log(data);// /api/cart GET CART
        $(".dropdown-menu").empty();
        for (i = 0; i < data[0].books.length; i++) {
            console.log(data[0].books[i]);
            let book = data[0].books[i].book;
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
