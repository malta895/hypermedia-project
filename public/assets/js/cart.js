$(document).ready(function () {
    $.getJSON('/api/cart', function (data) {  // /api/cart GET CART
             
        total = 0
        var cart = []
        for (i = 0; i < data[0].books.length; i++) {
            book = data[0].books[i].book;
            cart.push(data[0].books[i])
            var id = book.book_id;
            var title = book.title;
            var authors = book.authors;
            var price = book.price;
            var picture = book.picture;
            var genre = book.genres;
            var quantity = data[0].books[i].quantity;
            var singleTot = price * quantity;
            var elem = '';
            elem += '<tr> <td class="col-xs-1"><img src="' + picture + '" alt="" class="img-responsive">';
            elem += '</td> <td class="col-xs-4 col-md-5"><h4><a href="single-product.html?id='+id+'">'+title+'</a><small>M, Black, Esprit</small>';
            elem += '</h4></td> <td class="col-xs-2 text-center"><span>&euro;'+price+'</span></td>';
            elem += '<td class="col-xs-2 col-md-1"><div class="form-group"><input type="text" id='+id+' class="form-control upQuant" value="'+quantity+'">';
            elem += '</div></td> <td class="col-xs-2 text-center"><span><b>&euro;'+singleTot+'</b></span></td>';
            elem += '<td class="col-xs-1 text-center"><a href="" class="btn btn-primary">';
            elem += '<i class="fa fa-times"></i></a></td></tr>';
            total+=singleTot
            $("#cart").append(elem);

        }
        cart = JSON.stringify(cart)
        sessionStorage.setItem('cart', cart)
        $(".total").html('&euro;'+total);
        





    });
    $('.update-cart').on('click', function (e) {
        e.preventDefault()
        cart = JSON.parse(sessionStorage.getItem('cart'))
        console.log(cart)
        $('#cart .upQuant').each(function (index) {
            console.log($(this).attr('id'))
            for (i = 0; i < cart.length; i++) {
                
                idN = $(this).attr('id')
                qN = $(this).val()
                idO = cart[i].book.book_id
                qO = cart[i].quantity
                if (idO == idN) {
                    
                    
                    if (qN === qO) {
                        break;
                    } else if (qN > qO) {
                        let add = qN - qO;
                        $.ajax({
                            url: '/api/cart/add/book/' + idN+'?quantity='+add,
                            type: 'PUT',
                            success: function (response) {

                            }
                        });

                    } else if (qN < qO) {
                        let del = qO-qN;
                        $.ajax({
                            url: '/api/cart/remove/book/' + idN + '?quantity=' + del,
                            type: 'DELETE',
                            success: function (response) {

                            }
                        });

                    }
                }
            }

        });
        

    });

});

