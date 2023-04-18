
 

 var controller = new ScrollMagic.Controller();




// $(window).on('scroll', function(){
//     if ($("#myskills").is(':visible')){
//         $(".myWcontainer").addClass("slide-u");
//         $(".skills-icon-container").addClass("slide-r2");
//         $(".skills-title-container").addClass("slide-l2");
//         $(".container-title").addClass("isactive");
//         // alert('myskills');
        
//     } 
    
// });
// if(isOnScreen($('#myqualifications'))) {
//     /* Code here... */ 
//     $("#myqualifications").addClass("isactive") ;
//     $(".time-line").addClass("slide-l2") ;
//     alert('myqualifications');

//    };
// function isOnScreen(element)
//     {
//         var curPos = element.offset();
//         // var curTop = curPos.top;
//         var curTop = curPos.top - $(window).scrollTop();
//         var screenHeight = $(window).height();
//         return (curTop > screenHeight) ? false : true;
//     }

var slidemyinfo = 0, slidemypic = 0;
var slideL1 = 0, slideR1=0;
var slidemyWcontainer = 0;

var myinfoSlde = new ScrollMagic.Scene({
    triggerElement: "#mymarquee",
    triggerHook: 0.1,
})
.addTo(controller)
.on("enter leave", function (e) {
    if( e.type == "enter"){
         if(slidemyinfo == 0){
                addClassActive('#mymarquee .myinfo');
                slidemyinfo = 1;
                 
            } 
        
    } 
  });

var mypicSlde = new ScrollMagic.Scene({
    triggerElement: "#mymarquee",
    triggerHook: 0.1,
})
.addTo(controller)
.on("enter leave", function (e) {
    if( e.type == "enter"){
         if(slidemypic == 0){
                addClassActive('#mymarquee .mypic');
                slidemypic = 1;
                 
            } 
        
    } 
  });

var rightSlde = new ScrollMagic.Scene({
    triggerElement: "#myqualifications",
    triggerHook: 0.1,
})
.addTo(controller)
.on("enter leave", function (e) {
    if( e.type == "enter"){
         if(slideR1 == 0){
                addClassActive('#myqualifications .qlf-left-card-container');
                slideR1 = 1;
                 
            } 
        
    } 
  });

var leftSlde = new ScrollMagic.Scene({
    triggerElement: "#myqualifications",
    triggerHook: 0.1,
})
.addTo(controller)
.on("enter leave", function (e) {
    if( e.type == "enter"){
         if(slideL1 == 0){
                addClassActive('#myqualifications .qlf-right-card-container');
                slideL1 = 1;
                 
            } 
        
    } 
  });

  var myWcontainerSlde = new ScrollMagic.Scene({
    triggerElement: ".myinfo",
    triggerHook: 0.1,
})
.addTo(controller)
.on("enter leave", function (e) {
    if( e.type == "enter"){
         if(slidemyWcontainer == 0){
                addClassActive('#myskills .myWcontainer');
                addClassActive('.myskills-container');
                slidemyWcontainer = 1;
                 
            } 
        
    } 
  });
function sizeAll() {
    ww = $(window).width();

}

  $(window).resize(sizeAll);
  sizeAll();
  
  function addClassActive(_target){
      $(_target).addClass("isactive");
  }
  
  function removeClassActive(_target){
      $(_target).removeClass("isactive");
  }