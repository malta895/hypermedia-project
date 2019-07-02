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

var order_id = getUrlParameter('id');

$(document).ready(function () {
    $.getJSON('/api/orders/' + order_id, function (data) {
        let order = data;

        //INDIRIZZO
        let a = order.shipment_address;
        $('#addr-first-name').html(a.first_name);
        $('#addr-last-name').html(a.last_name);
        $('#addr-complete-name').html(`${a.first_name} ${a.last_name}`);
        $('#addr-street-line1').html(a.street_line1);
        $('#addr-street-line2').html(a.street_line2);
        $('#addr-city').html(a.city);
        $('#addr-zip-code').html(a.zip_code);
        $('#addr-province').html(a.province);
        $('#addr-country').html(a.country);

        //PAGAMENTO
        $('#payment_method').html(order.payment_method);
        $('#shipping_method').html(order.shipping_method);
        $('#total').html('&euro;'+order.total_amount);

        //LISTA LIBRI
        for (var k = 0; k < order.books.length; k++) {
            let book = order.books[k].book;

            var id = book.book_id;
            var title = book.title;
            var authors = book.authors;
            var price = book.price;
            var picture = book.picture;
            var genre = book.genres;
            let quantity = order.books[k].quantity;
            var singleTot = price * quantity;
            var elem = '';
            elem += '<tr><td class="col-xs-1"><img src="' + picture + '" alt="" class="img-responsive">';
            elem += '</td> <td class="col-xs-4 col-md-5"><h4><a href="single-product.html?id=' + id + '">' + title + '</a><small>' + book.authors.reduce(function(acc, au){return (acc === '' ? '' : (acc + ', ')) + au.name;}, '') + '</small>';
            elem += '</h4></td> <td class="col-xs-2 text-center"><span>&euro;' + price + '</span></td>';
            elem += '<td class="col-xs-2 col-md-1 text-center"><span><b>' + quantity + 'x</b></span>';
            elem += '</td> <td class="col-xs-2 text-center"><span><b>&euro;' + singleTot + '</b></span></td></tr>';

            $("#cart").append(elem);

        }

      

    });

});
