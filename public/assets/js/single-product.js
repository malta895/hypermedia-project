var currencies = {
    EUR: '&euro;',
    USD: '$'
};

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

$(window).on("load",function () {
    var id = getUrlParameter('id');
    $.getJSON('/api/books/'+id, function (data) {  // GET BOOK BY ID /api/book/{bookId}    
        console.log(data);
        for (i = 0; i < data.length; i++) {
            var id = data[i].id;
            var title = data[i].title;
            var isbn = data[i].isbn;

            var authors = data[i].authors;
            var price = data[i].price;
            var picture = data[i].picture;
            var genre = data[i].genre;
            var elem = '';
            $("#title").html(title);
            $("#author").html("<span>Author</span>"+authors);
            $("#price").html(price);
            $("#isbn").html("<span>ISBN</span>"+isbn);
            $("#genre").html("<span>Genre</span>" + genre);
            var img = '<div class="item"><img src="' + picture + '" id="img" class="img - responsive" alt=""></div>';
            $("#product-carousel").append(img);
        }
        






    });
    //get review by book id
    //get similar_books by book_id
});