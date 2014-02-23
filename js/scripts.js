$(document).ready(function() {

	$('#feedbackForm').submit(function(event){
				
		var formData = new FormData($(this)[0]);
		
		$.ajax({

			url:'/feedback',
			type: 'POST',
			data: formData,
			async: false,

			success: function(data){

				localStorage.feedback = 'true';
				
				$('#feedback h2').html("Thanks for your feedback");

				$('#feedback form').css('display','none');
			},

			cache: false,
			contentType: false,
			processData: false
		});

		return false;
	});

	if(localStorage.feedback == 'true'){

		$('#feedback h2').html("Thanks for your feedback");

		$('#feedback form').css('display','none');
	}

});