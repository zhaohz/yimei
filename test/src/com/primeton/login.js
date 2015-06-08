$(function(){
	if($('#loginDiv')[0]!=undefined&&$('#h_userName').text()!=""){
		$('#loginDiv').hide();
	}
	$('#submit').click(formSubmit);
	if (document.addEventListener) { // 如果是Firefox
		document.addEventListener("keypress", fireFoxHandler, true);
	} else {
		document.attachEvent("onkeypress", ieHandler);
	}
	
});

function fireFoxHandler(evt) { // 如果是Firefox
	if (evt.keyCode == 13) {
		var id=$("input:focus").attr("id");
		if(id=='userName'){
			$('#tx').focus();
		}else if(id=='password'){
			formSubmit();
		}
		else if(id=='verifycode'){
			formSubmit();
		}
	}
}

function ieHandler(evt) {
	if (evt.keyCode == 13) {
		var id=$("input:focus").attr("id");
		if(id=='userName'){
			$('#password').focus();
		}else if(id=='password'){
			formSubmit();
		}
	}
}

function formSubmit(){
	var userName=$('#userName').val();
	var password=$('#password').val();
	var verifycode=$('#verifycode').val();
	switch (validation(userName,'账号')) {
		case "null":
			return;
		case "short":
			return;
	}
	switch (validation(password,'密码')) {
		case "null":
			return;
		case "short":
			return;
	}
	
	if(verifycode==""||null==verifycode){
		$('#errorStr').text('验证码'+"不能为空!").show();
		return;
	}
//	var inputVali=$("#verifycode").val();
//	var hiddenVali=$(".myValiCodeH").val();
//	alert("输入的"+inputVali+"session里面的"+hiddenVali);
	var autosession=$("input[name='autosession']").is(':checked');
	$.ajax({
		type:"POST",
		url:address+"login.action",
		data:"userName="+userName+"&password="+password+"&autosession="+autosession+"&verifycode="+verifycode,
		dataType:"text",
		success: function(data) {
			var res = data.split("#");
			switch(res[0]){
				case  "-1" :$('#errorStr').text('邮箱不存在!').show(); break;
				case  "-2" : $('#errorStr').text('手机号不存在!').show(); break;
				case  "-3" :  $('#errorStr').text('账号不存在!').show();break;
				case  "-4" : $('#errorStr').text('密码错误!').show(); break;
				case  "-5" : $('#errorStr').text('请重新登录!').show(); break;
				case  "-6" : $('#errorStr').text('验证码输入错误!').show(); break;
				case  "-99" : $('#errorStr').text('账号已被锁定请稍后再试!').show(); break;
				default:
					if(res[1] !='') {
						window.location.href=res[1];
					}else {
						window.location.href=address+'accountInfo.action';
					}
					break;
			}
			coderefresh();
		}
		
	});
}

function validation(str,msg){
	if($.trim(str).length==0||$.trim(str)=='手机号/用户名/邮箱'){
		$('#errorStr').text(msg+"不能为空!").show();
		return "null";
	}
	if($.trim(str).length<2){
		$('#errorStr').text(msg+"长度过短").show();
		return "short";
	}
	return false;
}



