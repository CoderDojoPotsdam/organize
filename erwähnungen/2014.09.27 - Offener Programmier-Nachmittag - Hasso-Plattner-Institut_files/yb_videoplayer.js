$(window).load(makeVideolistVisible);
$(window).load(makePlayerVisible);
$(window).load(loadDeferredImages);

function makeVideolistVisible()
{
	$('div.yb_videolist .videoListItem').css('visibility', '');
	removeLoadingBars();
}

function makePlayerVisible()
{
	$('div.yb_videoplayer').css('visibility', '');
	removeLoadingBars();
}

function removeLoadingBars()
{
	$('div.loadingBar').remove();
}

function loadDeferredImages() {
	var imgDefer = document.getElementsByTagName('img');
	for (var i=0; i<imgDefer.length; i++) {
		if(imgDefer[i].getAttribute('data-src')) {
			imgDefer[i].setAttribute('src',imgDefer[i].getAttribute('data-src'));
		} 
	} 
}
