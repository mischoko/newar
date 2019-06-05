jQuery(document).ready(function($){

	var productViewer = function(element) {
		this.element = element;
		this.handleContainer = this.element.find('.cd-product-viewer-handle');
		this.handleFill = this.handleContainer.children('.fill');
		this.handle = this.handleContainer.children('.handle');
		this.imageWrapper = this.element.find('.product-viewer');
		this.slideShow = this.imageWrapper.children('.product-sprite');
		this.frames = this.element.data('frame');
		//increase this value to increase the friction while dragging on the image - it has to be bigger than zero
		this.friction = this.element.data('friction');
		this.visibleFrame = 0;
		this.loaded = false;
		this.animating = false;
		this.xPosition = 0;
		this.loadFrames();
	} 

	productViewer.prototype.loadFrames = function() {
		var self = this,
			imageUrl = this.slideShow.data('image'),
			newImg = $('<img/>');
		this.loading('0.5');
		//you need this to check if the image sprite has been loaded
		newImg.attr('src', imageUrl).load(function() {
			$(this).remove();
  			self.loaded = true;
  		}).each(function(){
  			image = this;
			if(image.complete) {
		    	$(image).trigger('load');
		  	}
		});
	}

	productViewer.prototype.loading = function(percentage) {
		var self = this;
		transformElement(this.handleFill, 'scaleX('+ percentage +')');
		setTimeout(function(){
			if( self.loaded ){
				//sprite image has been loaded
				self.element.addClass('loaded');
				transformElement(self.handleFill, 'scaleX(1)');
				self.dragImage();
				//turn off the loader bar
				$('.cd-product-viewer-handle').css('opacity','0');
				if(self.handle) self.dragHandle();
			} else {
				//sprite image has not been loaded - increase self.handleFill scale value
				var newPercentage = parseFloat(percentage) + .1;
				if ( newPercentage < 1 ) {
					self.loading(newPercentage);
				} else {
					self.loading(parseFloat(percentage));
				}
			}
		}, 500);
	}
	//draggable funtionality - credits to http://css-tricks.com/snippets/jquery/draggable-without-jquery-ui/
	productViewer.prototype.dragHandle = function() {
		//implement handle draggability
		var self = this;
		self.handle.on('mousedown vmousedown', function (e) {
	        self.handle.addClass('cd-draggable');
	        var dragWidth = self.handle.outerWidth(),
	            containerOffset = self.handleContainer.offset().left,
	            containerWidth = self.handleContainer.outerWidth(),
	            minLeft = containerOffset - dragWidth/2,
	            maxLeft = containerOffset + containerWidth - dragWidth/2;

	        self.xPosition = self.handle.offset().left + dragWidth - e.pageX;

	        self.element.on('mousemove vmousemove', function (e) {
	        	if( !self.animating) {
	        		self.animating =  true;
		        	( !window.requestAnimationFrame )
		        		? setTimeout(function(){self.animateDraggedHandle(e, dragWidth, containerOffset, containerWidth, minLeft, maxLeft);}, 100)
		        		: requestAnimationFrame(function(){self.animateDraggedHandle(e, dragWidth, containerOffset, containerWidth, minLeft, maxLeft);});
	        	}
	        }).one('mouseup vmouseup', function (e) {
	            self.handle.removeClass('cd-draggable');
	            self.element.off('mousemove vmousemove');
	        });

	        e.preventDefault();

	    }).on('mouseup vmouseup', function (e) {
	        self.handle.removeClass('cd-draggable');
	    });
	}

	productViewer.prototype.animateDraggedHandle = function(e, dragWidth, containerOffset, containerWidth, minLeft, maxLeft) {
		var self = this;
		var leftValue = e.pageX + self.xPosition - dragWidth;
	    // constrain the draggable element to move inside his container
	    if (leftValue < minLeft) {
	        leftValue = minLeft;
	    } else if (leftValue > maxLeft) {
	        leftValue = maxLeft;
	    }

	    var widthValue = Math.ceil( (leftValue + dragWidth / 2 - containerOffset) * 1000 / containerWidth)/10;
	    self.visibleFrame = Math.ceil( (widthValue * (self.frames-1))/100 );

	    //update image frame
	    self.updateFrame();
	    //update handle position
	    $('.cd-draggable', self.handleContainer).css('left', widthValue + '%').one('mouseup vmouseup', function () {
	        $(this).removeClass('cd-draggable');
	    });

	    self.animating = false;
	}

	productViewer.prototype.dragImage = function() {
		//implement image draggability
		var self = this;
		self.slideShow.on('mousedown vmousedown', function (e) {
	        self.slideShow.addClass('cd-draggable');
	        var containerOffset = self.imageWrapper.offset().left,
	            containerWidth = self.imageWrapper.outerWidth(),
	            minFrame = 0,
	            maxFrame = self.frames - 1;

	        self.xPosition = e.pageX;

	        self.element.on('mousemove vmousemove', function (e) {
	        	if( !self.animating) {
	        		self.animating =  true;
		        	( !window.requestAnimationFrame )
		        		? setTimeout(function(){self.animateDraggedImage(e, containerOffset, containerWidth);}, 100)
		        		: requestAnimationFrame(function(){self.animateDraggedImage(e, containerOffset, containerWidth);});
		        }
	        }).one('mouseup vmouseup', function (e) {
	            self.slideShow.removeClass('cd-draggable');
	            self.element.off('mousemove vmousemove');
	            self.updateHandle();
	        });

	        e.preventDefault();

	    }).on('mouseup vmouseup', function (e) {
	        self.slideShow.removeClass('cd-draggable');
	    });
	}

	productViewer.prototype.animateDraggedImage = function(e, containerOffset, containerWidth) {
		var self = this;
		var leftValue = self.xPosition - e.pageX;
        var widthValue = Math.ceil( (leftValue) * 100 / ( containerWidth * self.friction ));
        var frame = (widthValue * (self.frames-1))/100;
        if( frame > 0 ) {
        	frame = Math.floor(frame);
        } else {
        	frame = Math.ceil(frame);
        }
        var newFrame = self.visibleFrame + frame;

        if (newFrame < 0) {
            newFrame = self.frames - 1;
        } else if (newFrame > self.frames - 1) {
            newFrame = 0;
        }

        if( newFrame != self.visibleFrame ) {
        	self.visibleFrame = newFrame;
        	self.updateFrame();
        	self.xPosition = e.pageX;
        }

        self.animating =  false;
	}

	productViewer.prototype.updateHandle = function() {
		if(this.handle) {
			var widthValue = 100*this.visibleFrame/this.frames;
			this.handle.animate({'left': widthValue + '%'}, 200);
		}
	}

	productViewer.prototype.updateFrame = function() {
		var transformValue = - (100 * this.visibleFrame/this.frames);
		transformElement(this.slideShow, 'translateX('+transformValue+'%)');
	}

	function transformElement(element, value) {
		element.css({
			'-moz-transform': value,
		    '-webkit-transform': value,
			'-ms-transform': value,
			'-o-transform': value,
			'transform': value,
		});
	}

	var productToursWrapper = $('.cd-product-viewer-wrapper');
	productToursWrapper.each(function(){
		new productViewer($(this));
	});
});

//gets the value of tranform translateX
$('.fullscreen').on('click',function(){
	var matrix = $('.product-sprite').css('transform').replace(/[^0-9\-.,]/g, '').split(',');
	var finalMatrix = matrix[4];
	var totalWidth = $(window).width();
	var sprite = $('.product-sprite').width();
	var countMob = finalMatrix / sprite;
	var fixed = countMob * 100
	var final = fixed.toFixed(2);
	if(totalWidth < 700){
		switch(final){
			case "0":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/01.jpg')");
			break;
			case "-2.78":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/02.jpg')");
			break;
			case "-5.56":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/03.jpg')");
			break;
			case "-8.33":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/04.jpg')");
			break;
			case "-11.11":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/05.jpg')");
			break;
			case "-13.89":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/06.jpg')");
			break;
			case "-16.67":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/07.jpg')");
			break;
			case "-19.44":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/08.jpg')");
			break;
			case "-22.22":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/09.jpg')");
			break;
			case "-25.00":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/10.jpg')");
			break;
			case "-27.78":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/11.jpg')");
			break;
			case "-30.55":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/12.jpg')");
			break;
			case "-33.33":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/13.jpg')");
			break;
			case "-36.11":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/14.jpg')");
			break;
			case "-38.89":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/15.jpg')");
			break;
			case "-41.67":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/16.jpg')");
			break;
			case "-44.44":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/17.jpg')");
			break;
			case "-47.22":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/18.jpg')");
			break;
			case "-50.00":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/19.jpg')");
			break;
			case "-52.78":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/20.jpg')");
			break;
			case "-55.56":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/21.jpg')");
			break;
			case "-58.33":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/22.jpg')");
			break;
			case "-61.11":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/23.jpg')");
			break;
			case "-63.89":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/24.jpg')");
			break;
			case "-66.67":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/25.jpg')");
			break;
			case "-69.44":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/26.jpg')");
			break;
			case "-72.22":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/27.jpg')");
			break;
			case "-75.00":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/28.jpg')");
			break;
			case "-77.78":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/29.jpg')");
			break;
			case "-80.56":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/30.jpg')");
			break;
			case "-83.33":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/31.jpg')");
			break;
			case "-86.11":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/32.jpg')");
			break;
			case "-88.89":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/33.jpg')");
			break;
			case "-91.67":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/34.jpg')");
			break;
			case "-94.44":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/35.jpg')");
			break;
			case "-97.22":
			$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/36.jpg')");
			break;
		}
	}
	switch(finalMatrix){
		case "0":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/01.jpg')");
		break;
		case "-600":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/02.jpg')");
		break;
		case "-1200":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/03.jpg')");
		break;
		case "-1800":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/04.jpg')");
		break;
		case "-2400":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/05.jpg')");
		break;
		case "-3000":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/06.jpg')");
		break;
		case "-3600":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/07.jpg')");
		break;
		case "-4200":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/08.jpg')");
		break;
		case "-4800":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/09.jpg')");
		break;
		case "-5400":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/10.jpg')");
		break;
		case "-6000":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/11.jpg')");
		break;
		case "-6600":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/12.jpg')");
		break;
		case "-7200":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/13.jpg')");
		break;
		case "-7800":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/14.jpg')");
		break;
		case "-8400":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/15.jpg')");
		break;
		case "-9000":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/16.jpg')");
		break;
		case "-9600":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/17.jpg')");
		break;
		case "-10200":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/18.jpg')");
		break;
		case "-10800":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/19.jpg')");
		break;
		case "-11400":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/20.jpg')");
		break;
		case "-12000":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/21.jpg')");
		break;
		case "-12600":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/22.jpg')");
		break;
		case "-13200":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/23.jpg')");
		break;
		case "-13800":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/24.jpg')");
		break;
		case "-14400":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/25.jpg')");
		break;
		case "-15000":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/26.jpg')");
		break;
		case "-15600":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/27.jpg')");
		break;
		case "-16200":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/28.jpg')");
		break;
		case "-16800":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/29.jpg')");
		break;
		case "-17400":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/30.jpg')");
		break;
		case "-18000":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/31.jpg')");
		break;
		case "-18600":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/32.jpg')");
		break;
		case "-19200":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/33.jpg')");
		break;
		case "-19800":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/34.jpg')");
		break;
		case "-20400":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/35.jpg')");
		break;
		case "-21000":
		$('.zoomImg').css('background-image',"url('https://www.arvisual.eu/kavehome/360viewer-03/4k/36.jpg')");
		break;
	}
	$('.popupMain').css('display','block');
});

//exit button from popup zoom
$('.exit').on('click',function(){
	$('.popupMain').css('display','none');
	$('.zoomImg').trigger('zoom.destroy');
	$('.zoomImg').css('cursor','unset');
	$('.zoom').css('display','block');
	$('.zoomInfo').css('display','none');
	$('.unzoom').css('display','none');
});

//zoom functionality
 $('.fullscreen').on('click',function(){
	var src = $('.zoomImg').css('background-image');
	src = src.replace('url(','').replace(')','').replace(/\"/gi, "");
	$('.zoom').on('click',function(){
		$('.zoomImg').zoom({url: src});
		$('.zoomImg').css('cursor','move');
		$(this).css('display','none');
		$('.unzoom').css('display','block');
		$('.zoomInfo').css('display','block');
		$('.zoomInfo').css('opacity','1');
		setTimeout(() => {
			$('.zoomInfo').css('opacity','0');	
		}, 3000);
	})
	$('.unzoom').on('click',function(){
		$('.zoomImg').trigger('zoom.destroy');
		$('.zoomImg').css('cursor','unset');
		$('.zoom').css('display','block');
		$(this).css('display','none');
		$('.zoomInfo').css('opacity','1');
		$('.zoomInfo').css('display','none');
	});
   });