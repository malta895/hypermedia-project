$(document).ready(function () {

    $('.login-form-wrapper > form').on('submit', function (e) {
        e.preventDefault();


        let username = $(this).find('input[name=usermail]').val();
        let password = $(this).find('input[name=password]').val();

        let formData = $(this).serialize();
        $.post('/api/user/login', formData, function (res) {
            console.log(res)
            location.href = "index.html";
        }, 'application/x-www-form-urlencoded')
            .success(res=>{
                console.log('success!')
            })
                    .fail(res => {
                        //TODO gestire errore
                        console.log(res);
                    });
          




    });
    $('.logout').click(function () {
        $.post('/api/user/logout', function (res) {
        })
            .fail(res => {
                //TODO gestire errore
                console.log(res);
            })
    });




});
