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
        sessionStorage.setItem('user', JSON.stringify(data));
        $.getJSON('/api/cart', function (data) {
            
            $(".navbar-cart > ul").empty();
            if (data.length > 0) {
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
            }
            

            






        });

    })
        .fail(function (res) {
            $('.logout').hide()
            $('.myaccount').hide()
            $('.signin').html('Sign in')
            $('.review').hide()
            $(".navbar-cart").hide();


        
    }
    );
    $('.navbar-search button').on('click', function () {
        console.log('funzia')
        search = $('.navbar-search input').val();
        window.location.href = '../index.html?search=' + search;
    });
    $('.navbar-search input').keypress(function (e) {
        if (e.which == 13) {
            search = $('.navbar-search input').val();
            window.location.href = '../index.html?search=' + search;
            return false;    //<---- Add this line
        }
    });
    $('.logout').click(function (e) {
        e.preventDefault()
        $.post('/api/user/logout', function (res) {
            console.log("Logout succesful!")
            sessionStorage.clear();
            window.location.href = "signin.html"

        })
            .fail(res => {
                //TODO gestire errore
                console.log(res);
            })
    });
        
        


});
