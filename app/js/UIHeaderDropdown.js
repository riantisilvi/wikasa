;( function( $, R ) {
	R.ready( function() {
		var $ncs = $('.ncs'),
			$ncsDds = $('.ncs-dds'),
			$nup = $('.nav-unm-pri'),
			$nupDds = $('.nup-dds')
		;

		$ncs.on('click', function() { $ncsDds.toggleClass('open'); });
		$nup.on('click', function() {
			$nupDds.toggleClass('open');
			$nup.toggleClass('active');
		});
	});
})(jQuery, Response);
