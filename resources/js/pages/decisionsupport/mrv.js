/**
 * mrv
 * **/
$(function(){
    $(document).bind("click",function(e){
        //年份航程选择
        if($(e.target).closest("div").hasClass('mrv_years')){
            $(".mrv_years ul").toggleClass("hide")
        }else{
            $(".mrv_years ul").addClass("hide")
        }
        //年份选择
        if($(e.target).closest("div").hasClass('years')){
            $(".years ul").toggleClass("hide")
        }else{
            $(".years ul").addClass("hide")
        }
        //月份季度选择
        if($(e.target).closest("div").hasClass('month_quarter')){
            $(".month_quarter ul").toggleClass("hide")
        }else{
            $(".month_quarter ul").addClass("hide")
        }
    });
    $(".mrv_years ul li,.years ul li,.month_quarter ul li").bind("click",function(){
        var text = $(this).text();
        $(this).parent('ul').prev('p').find('span.text').text(text);
        if($(this).attr('name') == 1){
            $('.years_choice').removeClass('hide');
            $('.voyage_choice').addClass('hide');
        }else{
            $('.years_choice').addClass('hide');
            $('.voyage_choice').removeClass('hide');
        }
    })
});