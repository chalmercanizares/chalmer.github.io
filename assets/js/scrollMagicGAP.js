
(function (root, factory) {
		if (typeof define === 'function' && define.amd) {
			// AMD. Register as an anonymous module.
			define(['ScrollMagic', 'TweenMax', 'TimelineMax'], factory);
		} else if (typeof exports === 'object') {
			// CommonJS
			// Loads whole gsap package onto global scope.
			require('gsap');
			factory(require('scrollmagic'), TweenMax, TimelineMax);
		} else {
			// Browser globals
			factory(root.ScrollMagic || (root.jQuery && root.jQuery.ScrollMagic), root.TweenMax || root.TweenLite, root.TimelineMax || root.TimelineLite);
		}
	}(this, function(ScrollMagic, Tween, Timeline) {
		"use strict";
		var NAMESPACE = "animation.gsap";

		// (BUILD) - REMOVE IN MINIFY - START
		var
			console = window.console || {},
			err = Function.prototype.bind.call(console.error || console.log || function() {}, console);
		if (!ScrollMagic) {
			err("(" + NAMESPACE + ") -> ERROR: The ScrollMagic main module could not be found. Please make sure it's loaded before this plugin or use an asynchronous loader like requirejs.");
		}
		if (!Tween) {
			err("(" + NAMESPACE + ") -> ERROR: TweenLite or TweenMax could not be found. Please make sure GSAP is loaded before ScrollMagic or use an asynchronous loader like requirejs.");
		}
		// (BUILD) - REMOVE IN MINIFY - END
		
		
		ScrollMagic.Scene.addOption(
			"tweenChanges", // name
			false, // default
			function (val) { // validation callback
				return !!val;
			}
		);
	  
		ScrollMagic.Scene.extend(function () {
			var Scene = this,
			_tween;

			// (BUILD) - REMOVE IN MINIFY - START
			var log = function () {
				if (Scene._log) { // not available, when main source minified
					Array.prototype.splice.call(arguments, 1, 0, "(" + NAMESPACE + ")", "->");
					Scene._log.apply(this, arguments);
				}
			};
			// (BUILD) - REMOVE IN MINIFY - END

			// set listeners
			Scene.on("progress.plugin_gsap", function () {
				updateTweenProgress();
			});
			Scene.on("destroy.plugin_gsap", function (e) {
				Scene.removeTween(e.reset);
			});

			/**
			 * Update the tween progress to current position.
			 * @private
			 */
			var updateTweenProgress = function () {
				if (_tween) {
					var
						progress = Scene.progress(),
						state = Scene.state();
					if (_tween.repeat && _tween.repeat() === -1) {
						// infinite loop, so not in relation to progress
						if (state === 'DURING' && _tween.paused()) {
							_tween.play();
						} else if (state !== 'DURING' && !_tween.paused()) {
							_tween.pause();
						}
					} else if (progress != _tween.progress()) { // do we even need to update the progress?
						// no infinite loop - so should we just play or go to a specific point in time?
						if (Scene.duration() === 0) {
							// play the animation
							if (progress > 0) { // play from 0 to 1
								_tween.play();
							} else { // play from 1 to 0
								_tween.reverse();
							}
						} else {
							// go to a specific point in time
							if (Scene.tweenChanges() && _tween.tweenTo) {
								// go smooth
								_tween.tweenTo(progress * _tween.duration());
							} else {
								// just hard set it
								_tween.progress(progress).pause();
							}
						}
					}
				}
			};

			
			Scene.setTween = function (TweenObject, duration, params) {
				var newTween;
				if (arguments.length > 1) {
					if ( arguments.length < 3) {
						params = duration;
						duration = 1;
					}
					TweenObject = Tween.to(TweenObject, duration, params);
				}
				try {
					// wrap Tween into a Timeline Object if available to include delay and repeats in the duration and standardize methods.
					if (Timeline) {
						newTween = new Timeline({smoothChildTiming: true})
							.add(TweenObject);
					} else {
						newTween = TweenObject;
					}
					newTween.pause();
				} catch (e) {
					log(1, "ERROR calling method 'setTween()': Supplied argument is not a valid TweenObject");
					return Scene;
				}
				if (_tween) { // kill old tween?
					Scene.removeTween();
				}
				_tween = newTween;

				// some properties need to be transferred it to the wrapper, otherwise they would get lost.
				if (TweenObject.repeat && TweenObject.repeat() === -1) {// TweenMax or TimelineMax Object?
					_tween.repeat(-1);
					_tween.yoyo(TweenObject.yoyo());
				}
				// (BUILD) - REMOVE IN MINIFY - START
				// Some tween validations and debugging helpers

				if (Scene.tweenChanges() && !_tween.tweenTo) {
					log(2, "WARNING: tweenChanges will only work if the TimelineMax object is available for ScrollMagic.");
				}

				// check if there are position tweens defined for the trigger and warn about it :)
				if (_tween && Scene.controller()  && Scene.triggerElement() && Scene.loglevel() >= 2) {// controller is needed to know scroll direction.
					var
						triggerTweens = Tween.getTweensOf(Scene.triggerElement()),
						vertical = Scene.controller().info("vertical");
					triggerTweens.forEach(function (value, index) {
						var
							tweenvars = value.vars.css || value.vars,
							condition = vertical ? (tweenvars.top !== undefined || tweenvars.bottom !== undefined) : (tweenvars.left !== undefined || tweenvars.right !== undefined);
						if (condition) {
							log(2, "WARNING: Tweening the position of the trigger element affects the scene timing and should be avoided!");
							return false;
						}
					});
				}

				// warn about tween overwrites, when an element is tweened multiple times
				if (parseFloat(TweenLite.version) >= 1.14) { // onOverwrite only present since GSAP v1.14.0
					var
						list = _tween.getChildren ? _tween.getChildren(true, true, false) : [_tween], // get all nested tween objects
						newCallback = function () {
							log(2, "WARNING: tween was overwritten by another. To learn how to avoid this issue see here: https://github.com/janpaepke/ScrollMagic/wiki/WARNING:-tween-was-overwritten-by-another");
						};
					for (var i=0, thisTween, oldCallback; i<list.length; i++) {
						/*jshint loopfunc: true */
						thisTween = list[i];
						if (oldCallback !== newCallback) { // if tweens is added more than once
							oldCallback = thisTween.vars.onOverwrite;
							thisTween.vars.onOverwrite = function () {
								if (oldCallback) {
									oldCallback.apply(this, arguments);
								}
								newCallback.apply(this, arguments);
							};
						}
					}
				}
				// (BUILD) - REMOVE IN MINIFY - END
				log(3, "added tween");

				updateTweenProgress();
				return Scene;
			};

			Scene.removeTween = function (reset) {
				if (_tween) {
					if (reset) {
						_tween.progress(0).pause();
					}
					_tween.kill();
					_tween = undefined;
					log(3, "removed tween (reset: " + (reset ? "true" : "false") + ")");
				}
				return Scene;
			};

		});
	}));

//Swipe reference
(function( $ ){

    function calculateResults(startX, startY, endX, endY, tresholdX, tresholdY){
        var swipeDirection = {up:false, right:false, down: false, left:false};
        if(startX > endX && startX - endX >= tresholdX)
            swipeDirection.left = true;
        else if(startX < endX && endX - startX >= tresholdX)
            swipeDirection.right = true;
        
        if(startY < endY && endY - startY >= tresholdY)
            swipeDirection.down = true
        else if(startY > endY && startY - endY >=tresholdY)
            swipeDirection.up = true;

        return swipeDirection;

    }
    $.fn.onSwipe = function(f, timeTreshold, tresholdX, tresholdY){
        if(jQuery.isFunction(f)){ //We are only going to do our thing if the user passed a function

        if(typeof timeTreshold === 'undefined' || timeTreshold === null)
            timeTreshold = 100;//ms

        if(typeof tresholdX === 'undefined' || tresholdX === null)
            tresholdX = 30;//px
        
        if(typeof tresholdY === 'undefined' || tresholdY === null)
            tresholdY = 30;//px

        var startX,  startY; //Position when touch begins
        var endX, endY; //Position when touch ends

        var time; //Our timer variable
        var totalTime = 0; //Total time that the swipe took

        //When a touch starts on this element.
            //We can start a timer, and start getting coordinates.
        $(this).on("touchstart", function(e){

            //Let's get our touch coordinates
            startX = e.touches[0].clientX; //This is where touchstart coordinates are stored
            startY = e.touches[0].clientY;

            time = setInterval(function(){ //Let's see how long the swipe lasts.
                totalTime += 10;
            }, 10);
        });

        $(this).on("touchend", function(e){

            endX = e.changedTouches[0].clientX; //This is where touchend coordinates are stored.
            endY = e.changedTouches[0].clientY;

            clearInterval(time); //Let's stop calculating time and free up resources.

            if(totalTime >= timeTreshold) //If swipe time is less than our treshold we won't do anything. Useful for preventing spam and accidental swipes.
                f(calculateResults(startX, startY, endX, endY, 30, 30)); //Send results to user's function

            

            totalTime = 0;
        });
        } else console.error("You need to pass a function in order to process swipe data.");

        return $(this);
    }
})( jQuery );