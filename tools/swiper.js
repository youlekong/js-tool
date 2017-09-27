
;(function (fn) {
	if (typeof define === 'function' && define.amd === 'object' && define.amd) {
		define(function () { return fn() })
	} else if (typeof exports === "object" && typeof module !== "undefined") {
		module.exports = fn()
	} else {
		window.swiper = fn()
	}
})(function () {
	function swiper(el, options) {
		'use strict'

		var container = document.getElementById(el)
		var element = container.children[0]
		var slides = element.children

		var width = container.getBoundingClientRect().width || container.offsetWidth
		element.style.width = width * slides.length + 'px'

		var index = 0, speed = 300

		options.continuous = options.continuous || true

		if (slides.length < 2) options.continuous = false;
		if (options.continuous && slides.length < 3) {
	      	element.appendChild(slides[0].cloneNode(true));
	      	element.appendChild(element.children[1].cloneNode(true));
	      	slides = element.children;
	    }

		var slidePos = []
		for (var i = 0; i < slides.length; i++) {
			var slide = slides[i]

			slide.style.width = width + 'px'
			slide.style.height = '100%'
			slide.style.position = 'relative'
			slide.style.float = 'left'

			slide.style.left = -width * i

			_move(i, index > i ? -width : (index < i ? width : 0), 0);
			
			if (options.continuous) {
		      _move(circle(index-1), -width, 0);
		      _move(circle(index+1), width, 0);
		    }
		}

		var start = {}, delta = {}, isScrolling
		function eventsStart(events) {
			var touches = events.touches ? events.touches[0] : events

			start = {
				x: touches.pageX,
				y: touches.pageY,
				start: +new Date
			}
			delta = {}
			isScrolling = -1

			element.addEventListener('touchmove', eventsMove)
			element.addEventListener('touchend', eventsEnd)
			element.addEventListener('mousemove', eventsMove)
			element.addEventListener('mouseup', eventsEnd)
		}
		function eventsMove(events) {
			var touches = events.touches ? events.touches[0] : events

			delta = {
				x: touches.pageX - start.x,
				y: touches.pageY - start.y
			}

			if (isScrolling === -1) // 0: x 1: y
				isScrolling = Math.abs(delta.x) - Math.abs(delta.y) > 0 ? 0 : 1

			if (!isScrolling) {
				events.preventDefault()

				if (options.continuous) { 
		          	_translate(circle(index-1), delta.x + slidePos[circle(index-1)], 0);
		          	_translate(index, delta.x + slidePos[index], 0);
		          	_translate(circle(index+1), delta.x + slidePos[circle(index+1)], 0);
		        } else {
		        	_translate(index-1, delta.x + slidePos[index-1], 0);
	          		_translate(index, delta.x + slidePos[index], 0);
	          		_translate(index+1, delta.x + slidePos[index+1], 0);	
		        }
			}
		}
		function eventsEnd(events) {
			var duration = +new Date - start.time

			var isValidSlide = Number(duration) < 250 && Math.abs(delta.x) > 20 || Math.abs(delta.x) > width/2;
			var isPastBounds = !index && delta.x > 0 || index == slides.length - 1 && delta.x < 0;
	      	var direction = delta.x < 0;

	      	if (options.continuous) isPastBounds = false;

	      	if (!isScrolling) {
	        	if (isValidSlide && !isPastBounds) {
		          	if (direction) {            
		          		if (options.continuous) { 
				            _move(circle(index-1), -width, 0);
				            _move(circle(index+2), width, 0);
				        } else {
				            _move(index-1, -width, 0);
				        }

			            _move(index, slidePos[index]-width, speed);
			            _move(circle(index+1), slidePos[circle(index+1)]-width, speed);
			            index = circle(index+1);
				    } else {
			        	if (options.continuous) { 
				            _move(circle(index+1), width, 0);
				            _move(circle(index-2), -width, 0);
				        } else {
				            _move(index+1, width, 0);
				        }

			            _move(index, slidePos[index]+width, speed);
			            _move(circle(index-1), slidePos[circle(index-1)]+width, speed);
			            index = circle(index-1);
		          	} 
		        } else {
		        	_move(index-1, -width, speed);
		          	_move(index, 0, speed);
		          	_move(index+1, width, speed);
		        }
		    }

		    element.removeEventListener('touchmove', eventsMove, false)
	      	element.removeEventListener('touchend', eventsEnd, false)
	      	element.removeEventListener('mousemove', eventsMove, false)
	      	element.removeEventListener('mouseup', eventsEnd, false)
		}

		element.addEventListener('touchstart', eventsStart)
		element.addEventListener('mousedown', eventsStart)

		function circle(index) {
	      	return (slides.length + (index % slides.length)) % slides.length;
	    }

	    function _move(index, dist, speed) {
	      	_translate(index, dist, speed);
	      	slidePos[index] = dist;
	    }
		function _translate(index, dist, speed) {
	      	var slide = slides[index];
	      	var style = slide && slide.style;

	      	if (!style) return;

	      	style.webkitTransitionDuration =
	      	style.MozTransitionDuration =
	      	style.msTransitionDuration =
	      	style.OTransitionDuration =
	      	style.transitionDuration = speed + 'ms';

	      	style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
	      	style.msTransform =
	      	style.MozTransform =
	      	style.OTransform = 'translateX(' + dist + 'px)';
	    }
	}
	return swiper
})