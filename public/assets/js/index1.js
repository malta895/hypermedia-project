var currencies = {
    EUR: '&euro;',
    USD: '$'
};

var filterObject = {
    limit: 6,
    offset: 0
};

function pushFilter(key, val) {
    if (filterObject[key] === undefined) {
        filterObject[key] = [val];
        console.log(filterObject);
        return true;
    } else {
        filterObject[key].push(val);
        return true;
    }
}

function popFilter(key) {
    if (filterObject[key] === undefined)
        return undefined;

    if (filterObject[key].length) {
        let res = filterObject[key].pop();
        if (filterObject[key].length === 0)
            delete filterObject[key];
        return res;
    } else {
        delete filterObject[key];
        return undefined;
    }
}

function setFilter(key, val) {
    filterObject[key] = val;
}

function deleteFilter(key, val) {
    delete filterObject[key];
}


function renderData(data) {
    //refresh
    $('#products').empty();
    for (let i = 0; i < data.length; i++) {
        var id = data[i].book_id;
        var title = data[i].title;
        var authors = data[i].authors;
        var price = data[i].price;
        var picture = data[i].picture;
        var genre = data[i].genre;
        var rating = data[i].average_rating;
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

        $('#products').append(elem);

    }
}

function retrieveData(offset){
    console.log(filterObject);
    if(offset !== undefined)
        filterObject.offset = offset;
    let count = 101; //TODO recuperare da server!
    $.ajax({
        url: '/api/books?' + $.param(filterObject, true),
        type: 'GET',
        success: function (data) {
            console.log(data);
            renderData(data);
            $('.addCart').off();
            $('.addCart').click(function () {

                let id = $(this).attr('id');
                addToCart(id);
            });
            $(window).trigger("scroll");
        },
        error: function (data) {
            $('#products').empty();
            $('#products').html('No Results!');
            $(window).trigger("scroll");
        }
    });
}



function addToCart(id) {
    $.ajax({
        url: '/api/cart/add/book/' + id,
        type: 'PUT',
        statusCode: {
            200: function () {
                $.getJSON('/api/cart', function (data) {

                    $(".navbar-cart > ul").empty();
                    for (i = 0; i < data[0].books.length; i++) {
                        console.log(data[0].books[i]);
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
}

$(document).ready(function(){
    retrieveData(0);


        $.getJSON('/api/themes', function (data) {

        for (let i = 0; i < data.length; i++) {
            var id = data[i].theme_id;
            var name = data[i].name;
            var elem = '';   
            let index = i + 1;
            elem += '<div class="checkbox">';
            elem += '<input id="themes'+id+'" type="checkbox" value="'+id+'">';
            elem += '<label for="themes' + id +'">' + name +'</label></div>';


            $("#theme").append(elem);

            //eventi su cambio
            $('#themes' + id).change(function(){
                if($(this).is(':checked')){
                    pushFilter('themes', $(this).val());
                } else {
                    popFilter('themes');

                }
                retrieveData();
            });


        }
    });
    $.getJSON('/api/genres', function (data) {
        for (let i = 0; i < data.length; i++) {
            var id = data[i].genre_id;
            var name = data[i].name;
            var elem = '';
            let index=i+1;
            elem += '<div class="checkbox">';
            elem += '<input id="genre' + id +'" type="checkbox" value="' + id + '">';
            elem += '<label for="genre' + id +'">' + name + '</label></div>';



            $("#genre").append(elem);

            //eventi su cambio
            $('#genre' + id).change(function(){
                if($(this).is(':checked')){
                    pushFilter('genre', $(this).val());
                } else {
                    popFilter('genre');
                }
                retrieveData();
            });


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
        })
            .fail(res => {
                //TODO gestire errore
                console.log(res);
            });
    });
});
