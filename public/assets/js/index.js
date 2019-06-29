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
}
var routeFilter ='/api/books?limit=20&offset=40&';

$(document).ready(function () {

    $.getJSON('/api/books?limit=20&offset=40', function (data) {  // /api/books GET ALL BOOKS

        for (i = 0; i < data.length; i++) {
            var id = data[i].book_id;
            var title = data[i].title;
            var authors = data[i].authors;
            var price = data[i].price;
            var picture = data[i].picture;
            var genre = data[i].genre;
            var elem = '';
            elem += '<div class="col-sm-4 col-xs-6" id="' + id + '">';
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
                url: '/api/cart/add/book/'+id,
                type: 'PUT',
                success: function (response) {
                    
                }
            });
        });
        $('.widget-genre input:checkbox').on('change',function () {
            value = $(this).val();
            console.log(value);
            if ($(this).is(':checked')) {
                console.log('vero')

                routeFilter += 'genre=' + value + '&';

            } else if (!$(this).is(':checked')) {
                console.log('false')
                
                
                routeFilter=routeFilter.replace('genre=' + value + '&', '');
            }
            
            $.ajax({
                url: routeFilter,
                type: 'GET',
                success: function (data) {
                    $('#products').empty();
                    for (i = 0; i < data.length; i++) {
                        var id = data[i].book_id;
                        var title = data[i].title;
                        var authors = data[i].authors;
                        var price = data[i].price;
                        var picture = data[i].picture;
                        var genre = data[i].genre;
                        var elem = '';
                        elem += '<div class="book col-sm-4 col-xs-6" id="' + id + '">';
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
                        elem += '<div class="buttons"><button class="btn btn-primary btn-sm add-to-cart addCart" id="' + id + '"><i class="fa fa-shopping-cart"></i>Add to cart</a></div>';
                        elem += '</div>';
                        elem += '</div>';
                        elem += '</div>';
                        elem += '</article>';
                        elem += '</div>';


                        $("#products").append(elem);

                    }
                },
                error: function (data) {
                    $('#products').empty();
                    $('#products').html('No Results!');
                }
            });
        });
        /*$('.widget-best input:checkbox').click(function () {
            value = $(this).val();
            console.log(value);
            $.ajax({
                url: '/api/cart/add/book/' + id,
                type: 'GET',
                success: function (response) {
                    //TODO IMPLEMENTARE
                }
            });
        });*/
        $('.widget-themes input:checkbox').on('change', function () {
            value = $(this).val();
            
            if ($(this).is(':checked')) {

                routeFilter += 'themes=' + value + '&';

            } else if (!$(this).is(':checked')) {


                routeFilter =routeFilter.replace('themes=' + value + '&', '');
                console.log(routeFilter)
            }
            $.ajax({
                url: routeFilter,
                type: 'GET',
                success: function (data) {
                    $('#products').empty();
                    for (i = 0; i < data.length; i++) {
                        var id = data[i].book_id;
                        var title = data[i].title;
                        var authors = data[i].authors;
                        var price = data[i].price;
                        var picture = data[i].picture;
                        var genre = data[i].genre;
                        var elem = '';
                        elem += '<div class="col-sm-4 col-xs-6" id="' + id + '">';
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
                        elem += '<div class="buttons"><button class="btn btn-primary btn-sm add-to-cart addCart" id="' + id + '"><i class="fa fa-shopping-cart"></i>Add to cart</a></div>';
                        elem += '</div>';
                        elem += '</div>';
                        elem += '</div>';
                        elem += '</article>';
                        elem += '</div>';


                        $("#products").append(elem);

                    }
                },
                error: function (data) {
                    $('#products').empty();
                    $('#products').html('No Results!');
                }
            });
        });
        $('.search-button').on('click', function () {
            value = $('.search-input').val();
            searchFilter = ''
            if (value !== null) {
                searchFilter += routeFilter
                searchFilter += 'title=' + value + '&';
            }
            $.ajax({
                url: searchFilter,
                type: 'GET',
                success: function (data) {
                    $('#products').empty();
                    for (i = 0; i < data.length; i++) {
                        var id = data[i].book_id;
                        var title = data[i].title;
                        var authors = data[i].authors;
                        var price = data[i].price;
                        var picture = data[i].picture;
                        var genre = data[i].genre;
                        var elem = '';
                        elem += '<div class="col-sm-4 col-xs-6" id="' + id + '">';
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
                        elem += '<div class="buttons"><button class="btn btn-primary btn-sm add-to-cart addCart" id="' + id + '"><i class="fa fa-shopping-cart"></i>Add to cart</a></div>';
                        elem += '</div>';
                        elem += '</div>';
                        elem += '</div>';
                        elem += '</article>';
                        elem += '</div>';
                        $("#products").append(elem);

                    }
                },
                error: function (data) {
                    $('#products').empty();
                    $('#products').html('No Results!');
                }
            });
        });



    });
    $.getJSON('/api/themes', function (data) {

        for (i = 0; i < data.length; i++) {
            var id = data[i].theme_id;
            var name = data[i].name;
            var elem = '';   
            let index = i + 1;
            elem += '<div class="checkbox">';
            elem += '<input id="themes'+index+'" type="checkbox" value="'+id+'">';
            elem += '<label for="themes' + index +'">' + name +'</label></div>';


            $("#theme").append(elem);

        }
    });
    $.getJSON('/api/genres', function (data) {
        for (i = 0; i < data.length; i++) {
            var id = data[i].genre_id;
            var name = data[i].name;
            var elem = '';
            let index=i+1
            elem += '<div class="checkbox">';
            elem += '<input id="genre' + index +'" type="checkbox" value="' + id + '">';
            elem += '<label for="genre' + index +'">' + name + '</label></div>';


            $("#genre").append(elem);

        }
    });
    $.getJSON('/api/me', function (data) {
        $('.logout').html('Logout')
        $('.signin').hide()
        $('.myaccount').html(data.first_name + ' ' + data.surname);
        $.getJSON('/api/cart', function (data) {
            console.log(data)// /api/cart GET CART
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
                elem += '<h4><a href="pages/single-product.html?id=' + id + '">Fusce Aliquam</a></h4>';
                elem += '<p>' + quantity + 'x - &euro;' + price + '</p>';
                elem += '<a href="#" class="remove"><i class="fa fa-times-circle"></i></a>';
                elem += '</div></div></li>';


                $(".navbar-cart > ul").append(elem);

            }
            elem = '<li> <div class="row"> <div class="col-sm-6"> <a href="pages/cart.html" class="btn btn-primary btn-block">View Cart</a> </div> <div class="col-sm-6"> <a href="pages/checkout.html" class="btn btn-primary btn-block">Checkout</a> </div> </div> </li>';
            $(".navbar-cart > ul").append(elem);








        });

    }).fail(function (res) {
        $('.logout').hide()
        $('.myaccount').hide()
        $('.signin').html('Sign in')

    }
    );
    $('.search-button').on('click', function () {

    });
    
    
});

