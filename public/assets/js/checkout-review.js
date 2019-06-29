$(document).ready(function () {
    $.getJSON('/api/cart', function (data) {  // /api/cart GET CART
        var order = JSON.parse(sessionStorage.getItem('order'))
        $('.name').html(order.first_name + ' ' + order.last_name)
        $('.address').html(order.addressStreetLine1)
        $('.zipcity').html(order.zip_code + ' ' + order.city)
        $('.country').html(order.country)
        $('.payment_method').html(order.payment_method)
        $('.shipping_method').html(order.shipping_method)
        total = 0
        for (i = 0; i < data[0].books.length; i++) {
            book = data[0].books[i].book;
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

        }

        $(".total").html('&euro;' + total);
        $('.checkout-steps form').on('submit', function (e) {
            e.preventDefault()
            var formData = new FormData();
            formData.append('first_name', order.first_name);
            formData.append('last_name', order.last_name);
            formData.append('addressStreetLine1', order.addressStreetLine1);
            formData.append('city', order.city);
            formData.append('zip_code ', order.zip_code );
            formData.append('province', order.state);
            formData.append('country', order.country);
            formData.append('payment_method', order.payment_method);
            formData.append('shipping_method', order.shipping_method);
            order.province=order.state
            console.log(order)
            console.log(formData)
            //formData=formData.serialize(); 
            $.post('/api/orders/create', order, function (data) { }, 'application/x-www-form-urlencoded');


        });






    });



});

