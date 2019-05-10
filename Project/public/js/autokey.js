$(document).ready(function()
{
	$('.autokey').each(function(e){
		num=$(this).attr('length');
		id=$(this).attr('id');
		txt=$(this).attr('answer');
		$(this).hide();
		html='';
		for(i=0;i<num;i++){
			if(txt[i]== ' '){
				html+='<input type="text" class="autokey-input hidden" size="1" maxlength="1" master="field-'+id+'" value=" " />';
			}else{
				html+='<input type="text" class="autokey-input" size="1" maxlength="1" master="field-'+id+'" />';
			}
		}
		$(this).after('<fieldset class="autokey-fieldset" to="'+id+'" id="field-'+id+'">'+html+'</fieldset>');
	});
	$( '.autokey-fieldset' ).on( 'keyup', 'input', function (e) {
		var $field = $( this );
		if ( $field.val().length === 1 ) {
			if ( $field.is( ':last-of-type' ) ) {
			} else {
				$nextfield = $field.next();
				if($nextfield.hasClass('hidden')) $nextfield = $nextfield.next();
				$nextfield.focus().select();
			}
		}else{
            if(e.keyCode==8){
				$nextfield = $field.prev();
				if($nextfield.hasClass('hidden')) $nextfield = $nextfield.prev();
                $nextfield.focus().select();
            }
        }
		toInput=$('#'+$('#'+$field.attr('master')).attr('to'));
		myVal='';
		$('#'+$field.attr('master')).find('input').each(function(e){
			myVal+=$(this).val();
		});
		toInput.val(myVal);
	});
});