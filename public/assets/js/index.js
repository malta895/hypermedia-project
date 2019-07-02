var currencies = {
    EUR: '&euro;',
    USD: '$'
};

function generateRouteFilter(offset ){
    return '/api/books?limit=9&offset='+offset+'&';
}
function generateFromData(data) {
    for (let i = 0; i < data.length; i++) {
        var id = data[i].book_id;
        var title = data[i].title;
        var authors = data[i].authors;
        var price = data[i].price;
        var picture = data[i].picture;
        var genre = data[i].genre;
        var rating=data[i].average_rating
        let d = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                d += '<i class="fa fa-star"></i>';
            } else {
                d += '<i class="fa fa-star-o"></i>';
            }

        }
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
        elem += '<div class="product-rating">' + d + '</div>';
        elem += '<span class="price"><ins><span class="amount">' + currencies.EUR + price + '</span></ins></span>';
        elem += '<div class="buttons"><button class="btn btn-primary btn-sm add-to-cart addCart" id="' + id + '"><i class="fa fa-shopping-cart"></i>Add to cart</a></div>';
        elem += '</div>';
        elem += '</div>';
        elem += '</div>';
        elem += '</article>';
        elem += '</div>';


        $("#products").append(elem);


    }
}
function add(offset) {
    $.ajax({
        url: generateRouteFilter(offset),
        type: 'GET',
        success: function (data) {
            generateFromData(data)
            $(window).trigger("scroll");
        },
        error: function (data) {
            $('#products').empty();
            $('#products').html('No Results!');
            $(window).trigger("scroll");
        }
    });
}


var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName;

    for (let i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return undefined;
};


var offset=0;


$(document).ready(function () {
    let titleS='';
    if (getUrlParameter('search')) {
        titleS = 'title=' + getUrlParameter('search') + '&';
    }


    $.getJSON('/api/books?limit=9&offset='+offset+'&' + titleS, function (data) {  // /api/books GET ALL BOOKS

        generateFromData(data)
               
        $('.addCart').click(function () {
            console.log('remove');
            id = $(this).attr('id');
            $.ajax({
                url: '/api/cart/add/book/'+id,
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
                            elem = '<li> <div class="row"> <div class="col-sm-6"> <a href="pages/cart.html" class="btn btn-primary btn-block">View Cart</a> </div> <div class="col-sm-6"> <a href="checkout.html" class="btn btn-primary btn-block">Checkout</a> </div> </div> </li>';
                            $(".navbar-cart > ul").append(elem);

                        });
                    }
                },
                success: function (response) {

                }
            });
        });


        var routeFilter = generateRouteFilter(offset);

        $('.widget-genre input:checkbox').on('change',function () {
            let value = $(this).val();
            // console.log(value);
            if ($(this).is(':checked')) {
                console.log('vero')

                routeFilter += 'genre=' + value + '&';

            } else {
                console.log('false')

                routeFilter=routeFilter.replace('genre=' + value + '&', '');
            }

            $.ajax({
                url: routeFilter,
                type: 'GET',
                success: function (data) {
                    $('#products').empty();
                    generateFromData(data)
                    $(window).trigger("scroll");
                },
                error: function (data) {
                    $('#products').empty();
                    $(window).trigger("scroll");
                    $('#products').html('No Results!');
                }
            });
        });

        $('.widget-themes input:checkbox').on('change', function () {
            value = $(this).val();

            if ($(this).is(':checked')) {

                routeFilter += 'themes=' + value + '&';

            } else if (!$(this).is(':checked')) {


                routeFilter =routeFilter.replace('themes=' + value + '&', '');
                console.log(routeFilter);
            }
            $.ajax({
                url: routeFilter,
                type: 'GET',
                success: function (data) {
                    $('#products').empty();
                    generateFromData(data)
                    $(window).trigger("scroll");
                },
                error: function (data) {
                    $('#products').empty();
                    $('#products').html('No Results!');
                    $(window).trigger("scroll");
                }
            });
        });


        $('.search-button').on('click', function () {
            search();
        });
        $('.search-input').keypress(function (e) {
            if (e.which == 13) { //tasto invio
                search();
                return false;
            }
        });
        function search() {
            let value = $('.search-input').val();
            let searchFilter = '';
            if (value !== null) {
                searchFilter += routeFilter;
                searchFilter += 'title=' + value + '&';
            }
            $.ajax({
                url: searchFilter,
                type: 'GET',
                success: function (data) {
                    $('#products').empty();
                    generateFromData(data)
                },
                error: function (data) {
                    $('#products').empty();
                    $('#products').html('No Results!');
                }
            });

        }



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
            let index=i+1;
            elem += '<div class="checkbox">';
            elem += '<input id="genre' + index +'" type="checkbox" value="' + id + '">';
            elem += '<label for="genre' + index +'">' + name + '</label></div>';


            $("#genre").append(elem);

        }
    });

    $.getJSON('/api/me', function (data) {
        $('.logout').html('Logout');
        $('.signin').hide();
        $('.myaccount').html(data.first_name + ' ' + data.surname);
        sessionStorage.setItem('user', JSON.stringify(data));
        $.getJSON('/api/cart', function (data) {
            console.log(data);// /api/cart GET CART
            $(".navbar-cart > ul").empty();
            for (let i = 0; i < data[0].books.length; i++) {
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
                elem += '<h4><a href="pages/single-product.html?id=' + id + '">'+title+'</a></h4>';
                elem += '<p>' + quantity + 'x - &euro;' + price + '</p>';
                elem += '<a href="#" class="remove"><i class="fa fa-times-circle"></i></a>';
                elem += '</div></div></li>';


                $(".navbar-cart > ul").append(elem);

            }
            elem = '<li> <div class="row"> <div class="col-sm-6"> <a href="pages/cart.html" class="btn btn-primary btn-block">View Cart</a> </div> <div class="col-sm-6"> <a href="pages/checkout.html" class="btn btn-primary btn-block">Checkout</a> </div> </div> </li>';
            $(".navbar-cart > ul").append(elem);


        });

    })
        .fail(function (res) {
            $('.logout').hide();
            $('.myaccount').hide();
            $('.signin').html('Sign in');
            $(".navbar-cart").hide();

        }
             );
    $('.logout').click(function (e) {
        e.preventDefault();
        $.post('/api/user/logout', function (res) {
            console.log("Logout succesful!");
            sessionStorage.clear();
            window.location.href = "pages/signin.html";

        })
            .fail(res => {
                //TODO gestire errore
                console.log(res);
            });
    });

    $(window).on("scroll", function () {
        console.log('scroll');
        var scrollHeight = $(document).height();
        var scrollPosition = $(window).height() + $(window).scrollTop();
        if ((scrollHeight - scrollPosition) / scrollHeight <=0.001) {
            offset += 10;
            add(offset);
        }
    });

});




