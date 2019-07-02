
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

$(window).on("load", function () {
    var id = getUrlParameter('id');
    $.getJSON('/api/authors/' + id, function (data) {  // GET AUTHOR BY ID   
        console.log(data);
        for (i = 0; i < data.length; i++) {
            var id = data[i].id;
            var name = data[i].name;
            var surname = data[i].surname;
            var picture = data[i].picture;
            var bio = data[i].biography;
            var elem = '';
            $("#name").html(name);   
            $("#bio").html(bio);               
            var img = '<div class="item"><img src="' + picture + '" id="img" class="img-responsive" alt=""></div>';
            $("#pic").append(img);
        }







    });
    $.getJSON('/api/books?authors=' + id, function (data) {  // GET AUTHOR BY ID   
        console.log(data);
        for (i = 0; i < data.length; i++) {
            $('#products').html()
            var id = data[i].book_id;
            var title = data[i].title;
            var surname = data[i].surname;
            var picture = data[i].picture;
            var price = data[i].price;
            var rating = data[i].average_rating
            let d = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= rating) {
                    d += '<i class="fa fa-star"></i>';
                } else {
                    d += '<i class="fa fa-star-o"></i>';
                }

            }
            var elem = '';
            elem += '<div class="col-sm-3 col-xs-6"> <article class="product-item"> <div class="row"> <div class="col-sm-3"> <div class="product-overlay"> <div class="product-mask"></div> <a href="single-product.html?id=' + id + '" class="product-permalink"></a>';
            elem += '<img src="' + picture + '" class="img-responsive" alt=""> </div> </div> <div class="col-sm-9"> <div class="product-body">';
            elem += '<h3>' + title + '</h3>';
            elem += '<div class="product-rating">' + d + '</div >';
            elem+='<span class="price"> <ins><span class="amount">&euro;'+price+'</span></ins> </span >';
            
            elem += '<div class="buttons buttons-simple"> <a href=""><i class="fa fa-shopping-cart"></i></a> </div> </div> </div> </div> </article> </div>';
            $('#products').append(elem)
        }







    });

    
});