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
var order_id = getUrlParameter('id');

$(document).ready(function () {
    $.getJSON('/api/orders', function (data) {  // /api/cart GET CART
        for (i = 0; i < data.length; i++) {
            console.log('1 ' + order_id + ' ' + data[i].order_id)
            if (data[i].order_id == order_id) {
                console.log('2')
                order = data[i]
                $('.name').html(order.shipment_address.first_name + ' ' + order.shipment_address.last_name)
                $('.address').html(order.shipment_address.street_line1)
                $('.zipcity').html(order.shipment_address.zip_code + ' ' + order.shipment_address.city)
                $('.country').html(order.shipment_address.country)
                $('.payment_method').html(order.payment_method)
                $('.shipping_method').html(order.shipping_method)
                $('.total').html('&euro;'+order.total_amount)

                for (k = 0; k < order.books.length; k++) {
                    book = order.books[k];
                    var id = book.book_id;
                    var title = book.title;
                    var authors = book.authors;
                    var price = book.price;
                    var picture = book.picture;
                    var genre = book.genres;
                    //var quantity = data[0].books[i].quantity;
                    var quantity = 3;
                    var singleTot = price * quantity;
                    var elem = '';
                    elem += '<tr><td class="col-xs-1"><img src="' + picture + '" alt="" class="img-responsive">';
                    elem += '</td> <td class="col-xs-4 col-md-5"><h4><a href="single-product.html?id=' + id + '">' + title + '</a><small>M, Black, Esprit</small>';
                    elem += '</h4></td> <td class="col-xs-2 text-center"><span>&euro;' + price + '</span></td>';
                    elem += '<td class="col-xs-2 col-md-1 text-center"><span><b>' + quantity + ' item</b></span>';
                    elem += '</td> <td class="col-xs-2 text-center"><span><b>&euro;' + singleTot + '</b></span></td></tr>';
                    
                    $("#cart").append(elem);

                }


                
            }
        }
        
        
       /* total = 0
        for (i = 0; i < order.books.length; i++) {
            book = order.books[i].book;
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
            elem += '</td> <td class="col-xs-4 col-md-5"><h4><a href="single-product.html?id=' + id + '">' + title + '</a><small>M, Black, Esprit</small>';
            elem += '</h4></td> <td class="col-xs-2 text-center"><span>&euro;' + price + '</span></td>';
            elem += '<td class="col-xs-2 col-md-1 text-center"><div class="form-group"><span><b>' + quantity + ' item</b></span>';
            elem += '</div></td> <td class="col-xs-2 text-center"><span><b>&euro;' + singleTot + '</b></span></td>';
            total += singleTot
            $("#cart").append(elem);

        }*/

       
        






    });



});

