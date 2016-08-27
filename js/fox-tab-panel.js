angular.module('FoxTabPanelDirective', [])
	.directive('foxTabPanel', function(){
		var SWIPE_THRESHOLD = 300,
			MAX_OFFSET_PERCENT = 20;

		return {
			restrict: 'E',
			templateUrl: 'templates/fox-tab-panel.html',
			transclude: true,
			link: function(scope, tabPanel, attrs){
				console.log(attrs);
				var activeIndex = attrs.activeTabIndex || 0,
					tabs = tabPanel.find('fox-tab'),
					tabNav = tabPanel.find('.fox-tab-nav'),
					tabButtons;

				function createTabButtons(){
					tabs.each(function(index, tab){
						var title = $(tab).attr('title'),
							button = $('<div class="fox-tab-button">'+title+'</div>');
						button.appendTo(tabNav).click(function(){
							var selectedIndex = tabButtons.index(this);
							activateTab(selectedIndex);
						});
					});
					tabButtons = tabPanel.find('.fox-tab-button');
				}

				function activateTab(index){
					activeIndex = parseInt(index);
					tabButtons.removeClass('active');
					tabs.removeClass('active');
					$(tabButtons.get(activeIndex)).addClass('active');
					$(tabs.get(activeIndex)).addClass('active');
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

				createTabButtons();
				activateTab(activeIndex);
				enableSwiping(true);
			}
		};
	})
	.directive('foxTab', function(){
		return {
			restrict: 'E',
			template: '<ng-transclude></ng-transclude>',
			transclude: true
		};
	});
