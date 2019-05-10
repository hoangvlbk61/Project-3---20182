function login_init(the_form, the_notification){
	$( '#'+the_form ).submit(function( event ) {
		the_form_dom=$('#'+the_form);
		the_notification_dom=$('#'+the_notification);
		the_notification_dom.html('<span>Vui lòng chờ...</span>');
		$.post('/check_login', the_form_dom.serialize(), function(data){
			var response = $.parseJSON(data);
			if(response['code']=='200'){
				the_notification_dom.html('<span class="green">Đăng nhập thành công, vui lòng đợi!</span>');
				location.reload();
			}else if(response['code']=='403'){
                if(response['text']=='')
                    the_notification_dom.html('<span class="red">Sai username/password!<br />Bạn vui lòng kiểm tra lại</span>');
                else
                    the_notification_dom.html('<span class="red">'+response['text']+'</span>');
			}
			else{
				the_notification_dom.html('<span class="red">Có lỗi xảy ra ('+response['text']+'), vui lòng liên hệ với ban quản trị qua form contact hoặc email!</span>');
			}
		});
		event.preventDefault();
	});
}
function reg_init(the_form, the_notification){
	modal_reg_success=$('#modal_reg_success').dialog({
      autoOpen: false,
      modal: true,
      height: 200,
      width: 600
    });
	$( '#'+the_form ).submit(function( event ) {
		event.preventDefault();
		var formData = new FormData(this);
		the_notification_dom=$('#'+the_notification);
		the_notification_dom.html('<span>Vui lòng chờ...</span>');
		$.ajax({
			type: "POST",
			cache: false,
			url: '/check_reg',
			enctype: 'multipart/form-data',
			data: new FormData(this),
			processData: false,
			contentType: false,
			success: function (data) {
				var response = $.parseJSON(data);
				if(response['code']=='200'){
					the_notification_dom.html('<span class="green">Đăng ký thành công, vui lòng đợi!</span>');
					$( '#'+the_form ).trigger('reset');
					modal_reg.dialog('close');
					modal_reg_success.dialog('open');
					the_notification_dom.html('');
				}else if(response['code']=='500'){
					the_notification_dom.html('<span class="red">'+response['text']+'</span>');
				}
				else{
					the_notification_dom.html('<span class="red">Có lỗi xảy ra ('+response['text']+'), vui lòng liên hệ với ban quản trị qua form contact hoặc email!</span>');
				}
			},
			error: function () {
				alert(data.error);
			}

		});

		return false;
	});
}
$(document).ready(function()
{
    modal_login=$('#modal_login').dialog({
      autoOpen: false,
      modal: true,
      height: 400,
      width: 600,
	  open: function(){
            jQuery('.ui-widget-overlay').bind('click',function(){
                jQuery('#modal_login').dialog('close');
            })
        }
    });
    $('.login_open_modal').click(function(event){
        event.preventDefault();
        modal_login.dialog('open');
    });
	//for register
	modal_reg=$('#modal_reg').dialog({
      autoOpen: false,
      modal: true,
      height: 700,
      width: 600,
	  open: function(){
            jQuery('.ui-widget-overlay').bind('click',function(){
                jQuery('#modal_reg').dialog('close');
            })
        }
    });
    $('.reg_open_modal').click(function(event){
        event.preventDefault();
        modal_reg.dialog('open');
    });
});