$(document).ready(function () {
    $.getJSON('/api/cart', function (data) {  // /api/cart GET CART
        console.log(data)
        /*
        for (i = 0; i < data.length; i++) {
            var id = data[i].user_id;
            var name = data[i].name;
            var surname = data[i].surname;
            var picture = data[i].picture;
            var elem = '';
            elem += '<div class="col-sm-3 col-xs-6"> <article class="product-item"> <div class="row"> <div class="col-sm-3"> <div class="product-overlay"> <div class="product-mask"></div>'
            elem += '<a href="single-author.html?id' + id + '" class="product-permalink"></a>';
            elem += '<img src="' + picture + '" class="img-responsive" alt="">';
            elem += '</div> </div> <div class="col-sm-9"> <div class="product-body">';
            elem += '<h3>' + name + ' ' + surname + '</h3> </div> </div> </div> </article></div>';
            $("#products").append(elem);

        }
        */





    });

});

