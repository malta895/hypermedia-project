$(document).ready(function() {
    $.getJSON('/api/cart', function(data) { // /api/cart GET CART


        var cart = data[0];
        let total = cart.total_amount;
        for (let i = 0; i < cart.books.length; i++) {
            let book = cart.books[i].book;
            var id = book.book_id;
            var title = book.title;
            var authors = book.authors.reduce(function(acc, currVal) {
                return (acc === '' ? '' : (acc + ', ')) + currVal.name;
            }, '');
            var price = book.price;
            var picture = book.picture;
            var genre = book.genres;
            var quantity = cart.books[i].quantity;
            var singleTot = price * quantity;
            var elem = '';
            elem += '<tr> <td class="col-xs-1"><img src="' + picture + '" alt="" class="img-responsive">';
            elem += '</td> <td class="col-xs-4 col-md-5"><h4><a href="single-product.html?id=' + id + '">' + title + '</a><small>' + authors + '</small>';
            elem += '</h4></td> <td class="col-xs-2 text-center"><span>&euro;<span class="item-price">' + price + '</span></span></td>';
            elem += '<td class="col-xs-2 col-md-1"><div class="form-group"><input type="number" id=' + id + ' class="form-control upQuant" value="' + quantity + '">';
            elem += '</div></td> <td class="col-xs-2 text-center"><span><b>&euro;<span class="single-total">' + singleTot + '</span></b></span></td>';
            elem += '<td class="col-xs-1 text-center"><a href="" class="btn btn-primary">';
            elem += '<i class="fa fa-times"></i></a></td></tr>';


            $("#cart").append(elem);

        }
        $("#total").html('&euro;' + total);

        $('.upQuant').change(function(e) {
            //e.prevent Default()
            console.log($(this).attr('id'));

            let newQuantity = $(this).val();
            let bookId = $(this).attr('id');

            let outerColumn = $(this).parents('tr');
            let unitPrice = outerColumn.find('.item-price');

            $.ajax({
                url: '/api/cart/setQuantity/book/' + bookId + '?quantity=' + newQuantity,
                type: 'PUT',
                success: function(response) {
                    if(newQuantity <= 0)
                        outerColumn.remove();
                    total = 0;
                    let rows = $('#cart tr').each(function(){
                        console.log(this);
                        let q = $(this).find('.upQuant').val();
                        let p = $(this).find('.item-price').html();
                        let singleTotalPrice = q*p;
                        $(this).find('.single-total').html(singleTotalPrice);
                        total += singleTotalPrice;
                    });

                    $('#total').html('&euro;' + total);

                }
            })
                .fail(function(){

                });


        });


    });


});
