HTMLCollection.prototype.forEach = Array.prototype.forEach;
HTMLCollection.prototype.indexOf = Array.prototype.indexOf;

var SWIPE_THRESHOLD = 300,
	MAX_OFFSET_PERCENT = 20;

window.onload = function(){
	var tabPanel = document.getElementById('tab-panel'),
		tabButtons = tabPanel.getElementsByClassName('tab-button'),
		tabs = tabPanel.getElementsByClassName('tab'),
		activeIndex = 0;

	tabButtons.forEach(function(button){
		button.onclick = function(){
			var selectedIndex = tabButtons.indexOf(this);
			activateTab(selectedIndex);
		};
	});

	function activateTab(index){
		activeIndex = index;
		for(var i=0; i<tabButtons.length; i++){
			tabButtons[i].className = (i == activeIndex) ? 'tab-button active' : 'tab-button';
		}
		snapToActiveTab();
	}

	function incrementActiveTab(incrementBy){
		var newIndex = activeIndex+incrementBy;
		if(newIndex >= 0 && newIndex < tabs.length){
			activateTab(newIndex);
		}
	}

	function snapToActiveTab(){
		tabs.forEach(function(tab){
			var index = tabs.indexOf(tab),
				leftPosition = (index-activeIndex)*100;
			tab.style = 'left:'+leftPosition+'%';
		});
	}

	function offsetTabs(offset){
		tabs.forEach(function(tab){
			var index = tabs.indexOf(tab),
				leftPosition = (index-activeIndex)*100 +
				Math.floor(offset > 0 ?
					Math.min(offset/5, MAX_OFFSET_PERCENT) :
					Math.max(offset/5, -MAX_OFFSET_PERCENT)
				);
			tab.style = 'left:'+leftPosition+'%';
		});
	}

	function enableSwiping(allowOffset){
		var swipeStart, isSwiping;
		tabPanel.onmousedown = function(e){
			swipeStart = e.clientX;
			isSwiping = true;
		};

		if(allowOffset){
			tabPanel.onmousemove = function(e){
				isSwiping && offsetTabs(e.clientX - swipeStart);
			};
		}

		document.body.onmouseup = function(e){
			var distance = e.clientX - swipeStart;
			if(distance > SWIPE_THRESHOLD){
				incrementActiveTab(-1);
			}
			else if(distance < -SWIPE_THRESHOLD){
				incrementActiveTab(1);
			}
			isSwiping = false;
			snapToActiveTab();
		};
	}

	snapToActiveTab();
	enableSwiping(true);
};