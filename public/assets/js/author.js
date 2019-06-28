
$(document).ready(function () {
    $.getJSON('/api/authors?limit=20&offset=40', function (data) {  // /api/books GET ALL EVENTS

        for (i = 0; i < data.length; i++) {
            var id = data[i].author_id;
            var name = data[i].name;
            var surname = data[i].surname;
            var picture = data[i].picture;
            var elem = '';
            elem += '<div class="col-sm-3 col-xs-6"> <article class="product-item"> <div class="row"> <div class="col-sm-3"> <div class="product-overlay"> <div class="product-mask"></div>'
            elem += '<a href="single-author.html?id='+id+'" class="product-permalink"></a>';
            elem += '<img src="' + picture + '" class="img-responsive" alt="">';
            elem += '</div> </div> <div class="col-sm-9"> <div class="product-body">';
            elem += '<h3>'+name+'</h3> </div> </div> </div> </article></div>';
            $("#products").append(elem);

        }






    });

    $('.update-cart').click(function () {
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

