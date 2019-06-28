$(document).ready(function () {
    /*
    // Save data to sessionStorage
    sessionStorage.setItem('key', 'value');

    // Get saved data from sessionStorage
    let data = sessionStorage.getItem('key');

    // Remove saved data from sessionStorage
    sessionStorage.removeItem('key');

    // Remove all saved data from sessionStorage
    sessionStorage.clear();


*/
    $.getJSON('/api/me', function (data) {
        $('.logout').html('Logout')
        $('.signin').hide()
        $('.myaccount').html(data.first_name + ' ' + data.surname);
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
                elem += '<img src="'+picture+'" class="img-responsive" alt="">';
                elem += '</div><div class="col-sm-9">';
                elem += '<h4><a href="single-product.html?id='+id+'">Fusce Aliquam</a></h4>';
                elem += '<p>' + quantity +'x - &euro;'+price+'</p>';
                elem += '<a href="#" class="remove"><i class="fa fa-times-circle"></i></a>';
                elem += '</div></div></li>';                


                $(".dropdown-menu").append(elem);

            }
            elem = '<li> <div class="row"> <div class="col-sm-6"> <a href="cart.html" class="btn btn-primary btn-block">View Cart</a> </div> <div class="col-sm-6"> <a href="checkout.html" class="btn btn-primary btn-block">Checkout</a> </div> </div> </li>';
            $(".dropdown-menu").append(elem);

            






        });

    }).fail(function (res) {
        $('.logout').hide()
        $('.myaccount').hide()
        $('.signin').html('Sign in')

    }
    );

 
        
        


});
