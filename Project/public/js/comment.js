$(document).ready(function()
{
	modal_reply=$('#modal-reply-for').dialog({
      autoOpen: false,
      modal: true,
      height: 400,
      width: 600
    });
	$('.new_comment').submit(function(e) {
		e.preventDefault();
		this_form=$(this);
		$.ajax({
		   type: "POST",
		   url: '/comment-submit',
		   data: $(this).serialize(), // serializes the form's elements.
		   success: function(data)
		   {
			   var response = $.parseJSON(data);
			   if(response['code']==200){
				   this_form[0].reset();
				   modal_reply.dialog('close');
				   alert('Thông tin của bạn đã được gửi đi, và sẽ xuất hiện sau khi được xét duyệt!');
			   }else{
				   alert('Có lỗi xảy ra khi gửi thông tin! Bạn vui lòng kiểm tra lại hoặc refresh lại trang web!');
			   }
		   }
		});
	});
	
	$('.reply-for').click(function(e){
		e.preventDefault();
		$('#reply-form')[0].reset();
		var_replyfor=$(this).attr('reply-for');
		var_section=$(this).attr('section');
		$('#modal-reply-for').find('input[name=reply_for]').val(var_replyfor);
		$('#modal-reply-for').find('input[name=section]').val(var_section);
		modal_reply.dialog('open');
	});
});