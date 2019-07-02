$(document).ready(function() {

    $('#button-empty-cart').click(function(e){
        e.preventDefault();

        $('#cart-modal-text').html("Are you sure you want to remove all items from the cart?");

        $('#modal-confirm-delete-cart').modal();


        $('#modal-confirm-delete-cart .modal-footer .btn-primary').off();

        $('#modal-confirm-delete-cart .modal-footer .btn-primary').click(function(){
            $.ajax({
                url: '/api/cart/empty',
                type: 'DELETE',
                statusCode: {
                    200: function(response) {
                        $('#cart tr').remove();
                        $('#empty-cart').removeClass('hidden');
                        $('.shopping-cart-form').addClass('hidden');
                    }
                }
            })
                .fail(function(response){
                    if(response.status !== 200){
                        $('.modal').modal('hide');
                        setTimeout(function(){$('#modal-server-error').modal();}, 200);
                    }
                });
        });






    });



    $.getJSON('/api/cart', function(data) { // /api/cart GET CART

        if(data.length === 0){
            $('#empty-cart').removeClass('hidden');
            return;
        }

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
            elem += '<td class="col-xs-1 text-center"><button class="btn btn-primary" data-toggle="modal" data-target="#modal-confirm-delete-cart" id="button' + id + '">';
            elem += '<i class="fa fa-times"></i></button></td></tr>';


            $("#cart").append(elem);

            $("#button" + id).click(function(e){
                e.preventDefault();
                let bookId = $(this).attr('id').slice(6);

                let outerColumn = $(this).parents('tr');
                $('#cart-modal-text').html(`Do you really confirm to remove all copies of <i>${outerColumn.find('h4 a').html()}</i> from the cart?`);
                $('#modal-confirm-delete-cart .modal-footer .btn-primary').off('click');
                $('#modal-confirm-delete-cart .modal-footer .btn-primary').click(function(){
                    $.ajax({
                        url: '/api/cart/setQuantity/book/' + bookId + '?quantity=0',
                        type: 'PUT',
                        success: function(response) {
                            outerColumn.remove();
                            if(!$('#cart tr').length){
                                $('#empty-cart').removeClass('hidden');
                                $('.shopping-cart-form').addClass('hidden');
                            }
                            let total = 0;
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
                            $('.modal').modal('hide');
                            setTimeout(function(){$('#modal-server-error').modal();}, 200);
                        });
                });
            });

        }

        if(data.length !== 0){
            $('#empty-cart').addClass('hidden');
            $('.shopping-cart-form').removeClass('hidden');
        } else {
            $('#empty-cart').removeClass('hidden');
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
                    if(newQuantity <= 0){
                        outerColumn.remove();
                        if(!$('#cart tr').length){
                            $('#empty-cart').removeClass('hidden');
                            $('.shopping-cart-form').addClass('hidden');
                        }
                    }

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
                    $('#modal-server-error').modal();
                });

        });


    });


});
