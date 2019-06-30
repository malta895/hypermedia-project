$(document).ready(function(){
    $('#form-modify-address').on('submit', function(e){
        e.preventDefault();
        let selects = $('#form-modify-address select').toArray();
        let res = selects.reduce(function(acc, currVal){
            return acc + currVal.val();
        }, '?');
        console.log(res);
    });

});
