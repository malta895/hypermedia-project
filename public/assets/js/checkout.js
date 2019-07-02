function getFormData($form) {
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function (n, i) {
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

$(document).ready(function () {

    var order = {}
    $('.checkout-steps form').on('submit', function (e) {
        e.preventDefault()
        /*$('.checkout-steps form input').each(function (index) {

            console.log($(this).val())
        });*/
        order.first_name = $(this).find('input[name=first_name]').val();
        order.last_name = $(this).find('input[name=last_name]').val();
        order.addressStreetLine1 = $(this).find('input[name=address]').val();
        order.zip_code = $(this).find('input[name=zip_code]').val();
        order.country = $(this).find('input[name=country]').val();
        order.state = $(this).find('input[name=state]').val();
        order.city = $(this).find('input[name=city]').val();
        json = JSON.stringify(order)
        sessionStorage.setItem('order', json)
        window.location.href= 'checkout-shipping.html'



    });

    

});

