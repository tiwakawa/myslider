/*
 * mySlider
 *
 */

(function($) {

  $.fn.mySlider = function(options){

    // set default configuration
    var defaults = {
      vertical:     false,
      speed:        800,
      auto:         false,
      pause:       2000,
      loop:        false,
      thumbnailID: "thumbnail"
    };

    var options = $.extend(defaults, options);
    var tID = "#" + options.thumbnailID

    this.each(function() {
      var obj = $(this);


      $("li", $(tID)).each(function(i) {
        // each thumbnails numbering
        $(this).attr('class', 'item' + (i+1));

        // bind method for thumbnails
        $(tID + " .item" + (i+1)).click(function() {
          thumbnailClick(i);
        })
      });
      $("li.item1", $(tID)).addClass("selected");

      var size   = $("li", obj).length;
      var width  = $("li", obj).width();
      var height = $("li", obj).height();

      obj.width(width);
      if(!options.vertical) {
        obj.height(height);
      } else {
        obj.height(height/2);
      }

      obj.css("overflow", "hidden");
      var ts = size - 1;
      var t = 0;
      var preFlashPos = 0;

      $("ul", obj).css('width', size * width);
      if(!options.vertical) $("li", obj).css('float', 'left');

      /**
       *
       * Execute animation.
       *
       * @method animate
       * @return undefined
       * @param target  {String}
       * @param clicked {Boolean}
       *
       */
      function animate(target, clicked){
        var ot = t;
        switch(target){
          case "next":
            t = (ot >= ts) ? (options.loop ? 0 : ts) : t + 1;
            break;
          case "prev":
            t = (t <= 0) ? (options.loop ? ts : 0) : t - 1;
            break;
          case "first":
            t = 0;
            break;
          case "last":
            t = ts;
            break;
          default:
            break;
        };

        var diff = Math.abs(ot - t);
        var speed = options.speed;
//        var speed = diff * options.speed;

        flashPos = t * height;

        // horizontal
        if(!options.vertical) {
          animatePos = (t * width * -1);
          $("ul", obj).animate(
            { marginLeft: animatePos },
            speed,
            "swing",
            function() {
              $("li", $(tID)).removeClass("selected");
              $("li.item" + (t + 1), $(tID)).addClass("selected");
            }
          );

        // vertical
        } else {

          if(ot == 0) {
            animatePos = (height/2 * -1);
          } else {
            animatePos = (preFlashPos + height/2) * -1;
          }

          $("ul", obj).animate(
            { marginTop: animatePos },
            speed,
            "swing",
            function() {
              $("ul", obj).css("marginTop", flashPos * -1);
              $("li", $(tID)).removeClass("selected");
              $("li.item" + (t + 1), $(tID)).addClass("selected");
              preFlashPos = flashPos;
            }
          );
        };


        if(clicked) clearTimeout(timer);
        if(options.auto && target == "next" && !clicked){;
          timer = setTimeout(function(){
            animate("next", false);
          }, options.speed + options.pause);
//          }, diff * options.speed + options.pause);
        };
      };

      /**
       *
       * Change slider image which you clicked.
       *
       */
      function thumbnailClick(n) {
        // clear timer
        clearTimeout(timer);

        // stop animation
        $("ul", obj).stop();

        // change slider image
        if(!options.vertical) {
          $("ul", obj).css("marginLeft", n * width * -1);
        } else {
          $("ul", obj).css("marginTop", n * height * -1);
          t = n;
          preFlashPos = t * height;
        }

        // modify CSS
        $("li", $(tID)).removeClass("selected");
        $("li.item" + (n+1), $(tID)).addClass("selected");


        // loop
        if(options.auto){;
          timer = setTimeout(function(){
            animate("next", false);
          }, options.pause);
        };

      }

      // initalize
      var timer;
      if(options.auto){;
        timer = setTimeout(function(){
          animate("next", false);
        }, options.pause);
      };

    });

  };

})(jQuery);
