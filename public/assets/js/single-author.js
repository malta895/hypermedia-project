
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
    $.getJSON('/api/authors/' + id, function (data) {  // GET AUTHOR BY ID   
        console.log(data);
        for (i = 0; i < data.length; i++) {
            var id = data[i].id;
            var name = data[i].name;
            var surname = data[i].surname;
            var picture = data[i].picture;
            var bio = data[i].biography;
            var elem = '';
            $("#name").html(name);
            $("#bio").html(bio);
            $("#pic img").attr('src', img);
        }







    });
    $.getJSON('/api/books?authors=' + id, function (data) {  // GET AUTHOR BY ID   
        console.log(data);
        for (let i = 0; i < data.length; i++) {
            $('#products').html();
            var id = data[i].book_id;
            var title = data[i].title;
            var surname = data[i].surname;
            var picture = data[i].picture;
            var price = data[i].price;
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
            elem += '<div class="col-sm-3 col-xs-6"> <article class="product-item"> <div class="row"> <div class="col-sm-3"> <div class="product-overlay"> <div class="product-mask"></div> <a href="single-product.html?id=' + id + '" class="product-permalink"></a>';
            elem += '<img src="' + picture + '" class="img-responsive" alt=""> </div> </div> <div class="col-sm-9"> <div class="product-body">';
            elem += '<h3>' + title + '</h3>';
            elem += '<div class="product-rating">' + d + '</div >';
            elem+='<span class="price"> <ins><span class="amount">&euro;'+price+'</span></ins> </span >';
            
            elem += '<div class="buttons"><a href="" id="' + id +'" class="btn btn-primary btn-sm add-to-cart-related"><i class="fa fa-shopping-cart"></i>Add to cart</a></div> </div> </div> </div> </article> </div>';
            $('#products').append(elem)
        }
        $('.add-to-cart-related').click(function (e) {
            console.log('qui')
            e.preventDefault()
            if (!sessionStorage.userId) {
                $('#cart-modal-text').html('Signin to purchase new books!')
                $('#modal-alert .btn-primary').html('Signin')
                $('#modal-alert').modal();
            } else {
                addToCart($(this).attr('id'));
            }


        });







    });

   

    
});

function addToCart(id) {
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
                elem = '<li> <div class="row"> <div class="col-sm-6"> <a href="cart.html" class="btn btn-primary btn-block">View Cart</a> </div> <div class="col-sm-6"> <a href="/pages/checkout.html" class="btn btn-primary btn-block">Checkout</a> </div> </div> </li>';
                $(".navbar-cart > ul").append(elem);
            });
        },
        statusCode: {
            200: function () {
                $('#cart-modal-text').html('Book added to cart!')
                $('#modal-alert .btn-primary').hide()
                $('#modal-alert .btn-secondary').html('Continue shopping')
                $('#modal-alert').modal();
                $.getJSON('/api/cart', function (data) {
                    console.log(data);// /api/cart GET CART
                    $(".navbar-cart > ul").remove();

                    ul = $('<ul class="dropdown-menu"></ul>');
                    $(".navbar-cart").append(ul);
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
                    elem = '<li> <div class="row"> <div class="col-sm-6"> <a href="cart.html" class="btn btn-primary btn-block">View Cart</a> </div> <div class="col-sm-6"> <a href="/pages/checkout.html" class="btn btn-primary btn-block">Checkout</a> </div> </div> </li>';
                    $(".navbar-cart > ul").append(elem);
                });
            }
        }
    });
}
