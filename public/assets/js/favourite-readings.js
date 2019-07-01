var currencies = {
    EUR: '&euro;',
    USD: '$'
};
$(document).ready(function () {
    $.getJSON('../assets/favourite.json', function (data) {  // /api/books GET ALL EVENTS

        for (i = 0; i < data.length; i++) {
            var id = data[i].book_id;
            var title = data[i].title;
            var authors = data[i].authors;
            var price = data[i].price;
            var picture = data[i].picture;
            var genre = data[i].genre;
            var elem = '';
            elem += '<div class="col-sm-3 col-xs-6" id="' + id + '">';
            elem += '<article class="product-item">';
            elem += '<div class="row">';
            elem += '<div class="col-sm-3">';
            elem += '<div class="product-overlay">';
            elem += '<div class="product-mask"></div>';
            elem += '<a href="single-product.html?id=' + id + '" class="product-permalink"></a><img src="' + picture + '" width="262.5" height="350" class="img-responsive" alt="">';
            elem += '<img src="' + picture + '" class="img-responsive product-image-2" alt="" width="262.5" height="350"></div></div>';
            elem += '<div class="col-sm-9"><div class="product-body">';
            elem += '<h3>' + title + '</h3>';
            elem += '<div class="product-rating"><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star"></i><i class="fa fa-star-o"></i><i class="fa fa-star-o"></i></div>';
            elem += '<span class="price"><ins><span class="amount">' + currencies.EUR + price + '</span></ins></span>';
            elem += '<div class="buttons"><button class="btn btn-primary btn-sm add-to-cart addCart" id="' + id + '"><i class="fa fa-shopping-cart"></i>Add to cart</a></div>';
            elem += '</div>';
            elem += '</div>';
            elem += '</div>';
            elem += '</article>';
            elem += '</div>';


            $("#products").append(elem);

        }

        //add event listener to the buttons


        $('.addCart').click(function () {
            console.log('remove');
            id = $(this).attr('id');
            $.ajax({
                url: '/api/cart/add/book/' + id,
                type: 'PUT',
                success: function (response) {

                }
            });
        });







    });

});

