$(document).ready(function () {
    /*
    // Save data to sessionStorage
    sessionStorage.setItem('key', 'value');

    // Get saved data from sessionStorage
    let data = sessionStorage.getItem('key');

    // Remove saved data from sessionStorage
    sessionStorage.removeItem('key');

    // Remove all saved data from sessionStorage
    sessionStorage.clear();


*/
    $.getJSON('/api/me', function (data) {
        $('.logout').html('Logout')
        $('.signin').hide()
        $('.myaccount').html(data.first_name + ' ' + data.surname);
        $.getJSON('/api/cart', function (data) {  // /api/cart GET CART
            console.log(data)
            






        });

    }).fail(function (res) {
        $('.logout').hide()
        $('.myaccount').hide()
        $('.signin').html('Sign in')

    }
    );

 
        
        


});
