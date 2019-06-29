function getFormData($form) {
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function (n, i) {
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

$(document).ready(function () {


    $('.checkout-steps form').on('submit', function (e) {
        e.preventDefault()
        /*$('.checkout-steps form input').each(function (index) {

            console.log($(this).val())
        });*/
        let formData = JSON.stringify($(this).serializeArray());
        console.log(formData)



    });

    

});

