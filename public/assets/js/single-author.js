
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
            var img = '<div class="item"><img src="' + picture + '" id="img" class="img - responsive" alt=""></div>';
            $("#pic").append(img);
        }







    });
    $.getJSON('/api/books?authors=' + id, function (data) {  // GET AUTHOR BY ID   
        console.log(data);/*
        for (i = 0; i < data.length; i++) {
            var id = data[i].id;
            var name = data[i].name;
            var surname = data[i].surname;
            var picture = data[i].picture;
            var bio = data[i].biography;
            var elem = '';
            $("#name").html(name);
            $("#bio").html(bio);
            var img = '<div class="item"><img src="' + picture + '" id="img" class="img - responsive" alt=""></div>';
            $("#pic").append(img);
        }*/







    });

    
});