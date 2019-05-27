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
    //var id = getUrlParameter('id');
    $.getJSON('/book.json', function (data) {  // GET BOOK BY ID /api/book/{bookId}    
        console.log(data);
            var id = data.id;
            var title = data.title;
            var authors = data.authors[0];
            var price = data.price.value;
            var picture = data.picture_path;
            var genre = data.genre;
            var elem = '';
            $("#title").html(title);
            $("#author").html(authors);
            $("#price").html(price);
            $("#genre").html(genre.name);
            $("#theme").html(theme.name);

        






    });
    //get review by book id
    //get similar_books by book_id
});