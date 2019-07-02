var currencies = {
    EUR: '&euro;',
    USD: '$'
};
$(document).ready(function () {
    $.getJSON('../assets/favourite.json', function (data) {  // /api/books GET ALL EVENTS

        for (i = 0; i < data.length; i++) {
            var id = data[i].book_id;
            var title = data[i].title;
            var authors = data[i].authors;
            var price = data[i].price;
            var picture = data[i].picture;
            var genre = data[i].genre;
            var rating = data[i].average_rating
            let d = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= rating) {
                    d += '<i class="fa fa-star"></i>';
                } else {
                    d += '<i class="fa fa-star-o"></i>';
                }

            }
            var elem = '';
            elem += '<div class="col-sm-3 col-xs-6" id="' + id + '">';
            elem += '<article class="product-item">';
            elem += '<div class="row">';
            elem += '<div class="col-sm-3">';
            elem += '<div class="product-overlay">';
            elem += '<div class="product-mask"></div>';
            elem += '<a href="single-product.html?id=' + id + '" class="product-permalink"></a><img src="' + picture + '" width="262.5" height="350" class="img-responsive" alt="">';
            elem += '<img src="' + picture + '" class="img-responsive product-image-2" alt="" width="262.5" height="350"></div></div>';
            elem += '<div class="col-sm-9"><div class="product-body">';
            elem += '<h3>' + title + '</h3>';
            elem += '<div class="product-rating">'+d+'</div>';
            elem += '<span class="price"><ins><span class="amount">' + currencies.EUR + price + '</span></ins></span>';
            elem += '<div class="buttons"><button class="btn btn-primary btn-sm add-to-cart addCart" id="' + id + '"><i class="fa fa-shopping-cart"></i>Add to cart</a></div>';
            elem += '</div>';
            elem += '</div>';
            elem += '</div>';
            elem += '</article>';
            elem += '</div>';


            $("#products").append(elem);

        }

        //add event listener to the buttons


        $('.addCart').click(function () {
            console.log('remove');
            id = $(this).attr('id');
            $.ajax({
                url: '/api/cart/add/book/' + id,
                type: 'PUT',
                statusCode: {
                    200: function () {
                        $.getJSON('/api/cart', function (data) {

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
                                elem += '<h4><a href="single-product.html?id=' + id + '">' + title + '</a></h4>';
                                elem += '<p>' + quantity + 'x - &euro;' + price + '</p>';
                                elem += '<a href="#" class="remove"><i class="fa fa-times-circle"></i></a>';
                                elem += '</div></div></li>';


                                $(".navbar-cart > ul").append(elem);

                            }
                            elem = '<li> <div class="row"> <div class="col-sm-6"> <a href="cart.html" class="btn btn-primary btn-block">View Cart</a> </div> <div class="col-sm-6"> <a href="checkout.html" class="btn btn-primary btn-block">Checkout</a> </div> </div> </li>';
                            $(".navbar-cart > ul").append(elem);

                        });
                    }
                },
                success: function (response) {
                    console.log(response)// /api/cart GET CART

                }
            });
        });







    });

});

