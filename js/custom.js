$(document).ready(function(){

    $(window).scroll(function(){
        
        //if scrolled down more than the header’s height
        if ($(window).scrollTop() < 100) {
            $("#h_bar").hide();
            $("#h_img").css('opacity',80/$(window).scrollTop());             
            
        } else if ($(window).scrollTop() < 300) {
            $("#h_img").show();                        
            $("#h_bar").show();
            $("#h_bar").css('opacity',1-100/($(window).scrollTop()));
            $("#h_img").css('opacity',50/$(window).scrollTop());  
        } else {
            $("#h_bar").css('opacity',1);
            $("#h_img").css('opacity',0);                        
        }
    });

    $(".title_bracket").hover(function() {
        $("#title_explanation").css('display', 'inline').delay(2000).fadeOut();
    })

    var resume = 0;
    var photo = 0;
    var proj = 0;
    
    $("#photo").click(function() {
        photo = 0;
        $("#photo_details").show();
    })       

    $("#resume").click(function() {
        resume = 0;
        $("#resume_details").show();
	})

    $("#projects").click(function() {
        proj = 0;
        $("#projects_details").show();
    })

	$("#fadein").hover(function(){
        if (resume != 0) {
            $("#resume_details").delay(2000).hide();
        }				
        if (photo != 0) {
            $("#photo_details").delay(2000).hide();
        }
        if (proj != 0) {
            $("#projects_details").delay(2000).hide();
        }

	})

    $("#resume_details").hover(function(){
        resume = 1;
    })

    $("#photo_details").hover(function(){
        photo = 1;
    })

    $("#projects_details").hover(function(){
        proj = 1;
    })


    $(".gpa").hover(function(){
        $("#gpa_comment").css('display', 'inline').delay(2000).fadeOut();
    })

    $(".gpa").hover(function(){
        $("#gpa_comment").css('display', 'inline').delay(2000).fadeOut();
    })
    
    $("#d_mc").click(function() {
        $("#mediacloud").show();
    })
    $("#d_fml").click(function() {
        $("#harvardfml").show();
    })
    $("#d_isu").click(function() {
        $("#isawuharvard").show();
    })


});