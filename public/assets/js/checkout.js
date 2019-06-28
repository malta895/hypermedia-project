$(document).ready(function () {


    $('.clearfix > a').on('click', function (e) {
        

        let formData = $(this).serialize();
        sessionStorage.setItem('formData', formData);




    });

    

});

