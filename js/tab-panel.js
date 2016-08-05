$(document).ready(function(){
	var SWIPE_THRESHOLD = 300,
		MAX_OFFSET_PERCENT = 20,
		tabPanel = $('.tab-panel'),
		tabButtons = tabPanel.find('.tab-button'),
		tabs = tabPanel.find('.tab'),
		activeIndex = 0;

	tabButtons.click(function(){
		var selectedIndex = tabButtons.index(this);
		activateTab(selectedIndex);
	});

	function activateTab(index){
		activeIndex = index;
		tabButtons.removeClass('active');
		tabs.removeClass('active');
		$(tabButtons.get(index)).addClass('active');
		$(tabs.get(index)).addClass('active');
		snapToActiveTab();
	}

	function incrementActiveTab(incrementBy){
		var newIndex = activeIndex+incrementBy;
		if(newIndex >= 0 && newIndex < tabs.size()){
			activateTab(newIndex);
		}
	}

	function snapToActiveTab(){
		tabs.each(function(index, tab){
			var leftPosition = (index-activeIndex)*100;
			$(tab).css({left: leftPosition+'%'});
		});
	}

	function offsetTabs(offset){
		tabs.each(function(index, tab){
			var leftPosition = (index-activeIndex)*100 +
				Math.floor(offset > 0 ?
					Math.min(offset/5, MAX_OFFSET_PERCENT) :
					Math.max(offset/5, -MAX_OFFSET_PERCENT)
				);
			$(tab).css({left: leftPosition+'%'});
		});
	}

	function enableSwiping(allowOffset){
		var swipeStart, isSwiping;
		tabPanel.mousedown(function(e){
			swipeStart = e.clientX;
			isSwiping = true;
		});

		allowOffset && tabPanel.mousemove(function(e){
			isSwiping && offsetTabs(e.clientX - swipeStart);
		});

		$(document.body).mouseup(function(e){
			var distance = e.clientX - swipeStart;
			if(distance > SWIPE_THRESHOLD){
				incrementActiveTab(-1);
			}
			else if(distance < -SWIPE_THRESHOLD){
				incrementActiveTab(1);
			}
			isSwiping = false;
			snapToActiveTab();
		});
	}

	snapToActiveTab();
	enableSwiping(true);
});