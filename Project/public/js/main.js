String.prototype.endsWith = function(str) 
{
    return (this.match(str+"$")==str);
}
$(document).ready(function()
{
    var question_submited=0;
	var audioElement = document.createElement('audio');
    $('.hint-button').click(function(e) {
            e.preventDefault();
            hint_body=$('#'+$(this).attr('hint-to'));
            hint_body.toggle('fade');
            $(this).children().toggle();
    });
    $('#question').submit(function(e) {
            e.preventDefault();
            if(question_submited==0){
                $.ajax({
                   type: "POST",
                   url: '/q-submit',
                   data: $("#question").serialize(), // serializes the form's elements.
                   success: function(data)
                   {
                       var response = $.parseJSON(data);
                       if($('.skip_result').length){
                       	window.location=window.location;
                       }else if(response['result']==1){
                           $("#result").html('<h3><i class="fa fa-check green"></i> Xin chúc mừng bạn đã trả lời đúng!</h3><p>'+response['text']+'</p>');
						   $("#result").addClass("result-box result-correct");
						   audioElement.setAttribute('src', '/img/correct.wav');
						   audioElement.play();
                       }else{
                           $("#result").html('<h3><i class="fa fa-close red"></i> Rất tiếc bạn đã trả lời sai!</h3><p>'+response['text']+'</p>');
						   $("#result").addClass("result-box result-incorrect");
						   audioElement.setAttribute('src', '/img/incorrect.wav');
						   audioElement.play();
                       }
					   $('.result-extra').show();
                       question_submited=1;
                   }
                });
            }else{
                window.location=window.location;
            }
    });
	$(document).on("keypress", ".qform :input:not(textarea)", function(event) {
    if (event.keyCode == 13) {
        event.preventDefault();
    }
	});
	var first;
	$('.force').find('div.question-detail').each(function(e){
		if($(this).index()>1)
			$(this).addClass('disabled');
		else first=$(this);
		var next=$(this).next();
		if(typeof(next.attr('class'))==='undefined') next='';
		$(this).find('input').each(function(e){
			$(this).on("keypress",function(e){
				if(e.keyCode == 13){
					e.preventDefault();
				}
			});
			var $this = $(this);
			if($this.index()>$this.siblings().size()-1)
			{
				$(this).on("keypress",function(e){
					if(e.keyCode == 13){
                        if($(this).val().toLowerCase()==$(this).attr('answer').toLowerCase()){
                            if(next!=''){
                                next.removeClass('disabled');
                                next.find('input').first().focus();
                            }else{
                                $('#question').submit();
                            }
                        }else{
                            $('#question').submit();
                        }
                        $(this).parent().parent().addClass('disabled hastext');
                        $(this).blur();
					}
				});
			}	
		});
	});
	$('.single-question input').on("keypress",function(e){
		if(e.keyCode == 13){
			$('#question').submit();
		}
	});
    $( ".tabs" ).tabs();
	
	$(".report").click(function(e){
		e.preventDefault();
		var q=$(this).attr('q');
		var q_record_id=$(this).attr('q_record_id');
		var reason = prompt("Bạn vui lòng cho biết lỗi xảy ra", "");
		if(reason==null) return false;
		if(reason!==''){
			$.ajax({
                   type: "POST",
				   url: '/report',
				   data: { 'q': q, 'reason': reason, 'q_record_id': q_record_id }
			});
			window.alert('Thông báo của bạn đã được ghi nhận, xin cám ơn!');
			window.location = '/skip_q/?q='+q+'&q_record_id='+q_record_id;
		}else{
			window.alert('Bạn không thể bỏ trống lý do thông báo lỗi!');
		}
		return false;
	});
	
	$(".skip").click(function(e){
		e.preventDefault();
		var q=$(this).attr('q');
		var q_record_id=$(this).attr('q_record_id');
		if(confirm("Bạn có muốn bỏ qua câu hỏi này?")){
			window.location = '/skip_q/?q='+q+'&q_record_id='+q_record_id;
		}
		else
			return false;
		return false;
	});
	
	$(".end-question").click(function(e){
		e.preventDefault();
		var q_record_id=$(this).attr('q_record_id');
		return end_q(q_record_id, '/exam/'+$(this).attr('q_exam'), '');
	});
	
	$(".type2-chooser .chooser").click(function(e){
		if($(this).hasClass("selected")){
			$(this).removeClass("selected");
		}else{
			$(this).addClass("selected");
		}
		var types = [];
		$('.type2-chooser .chooser').each(function(){
			if($(this).hasClass('selected'))
				types.push($(this).attr('my-id'));
		});
		if(types.length == 0 ){
			$('#exam-lnk').attr('href','javascript:alert("Bạn phải chọn ít nhất 1 loại câu hỏi!")');
		}else{
			$('#exam-lnk').attr('href',$('.type2-chooser').attr('url')+types.join(','));
		}
	});
	$(".type2-chooser .selectall").click(function(e){
		if($(this).hasClass("selected")){
			$(this).removeClass("selected");
			$(".type2-chooser .chooser").removeClass("selected");
		}else{
			$(this).addClass("selected");
			$(".type2-chooser .chooser").addClass("selected");
		}
		var types = [];
		$('.type2-chooser .chooser').each(function(){
			if($(this).hasClass('selected'))
				types.push($(this).attr('my-id'));
		});
		if(types.length == 0 ){
			$('#exam-lnk').attr('href','javascript:alert("Bạn phải chọn ít nhất 1 loại câu hỏi!")');
		}else{
			$('#exam-lnk').attr('href',$('.type2-chooser').attr('url')+types.join(','));
		}
	});
	$(".sortable2").each(function(){
		$(this).after('<div class="sortable2_target"></div>');
		$(this).find('span').each(function(){
			$(this).click(function(){
				if($(this).parent().attr('class') == 'sortable2'){
					var ele = $(this).detach();
					$('.sortable2_target').append(ele);
				}else{
					var ele = $(this).detach();
					$('.sortable2').append(ele);
				}
			});
		});
	});
	$(".t2-type1 audio").each(function(){
		var this_audio = $(this).attr('id');
		$(this).parent().append('<div class="audio-play" target="'+this_audio+'"><i class="fa fa-volume-up" aria-hidden="true"></i></div>');
		$(this).hide();
	});
	$(".audio-play").click(function(){
		$('#'+$(this).attr('target')).get(0).play();
	});
	$(".t2-type3 input:radio").change(function(){
		$(".t2-type3 .row").removeClass('selected');
		$(this).parent().parent().addClass('selected');
	});
});

function end_q(q_record_id, redirect, redirect_false){
	var reason = confirm("Bạn có muốn kết thúc bài học này?");
	if(reason){
		$.ajax({
			   type: "POST",
			   url: '/end_q',
			   data: { 'q_record_id': q_record_id }
		});
		window.location = redirect;
	}else{
		if(redirect_false != ''){
			window.location = redirect;
		}
	}
	return false;
}