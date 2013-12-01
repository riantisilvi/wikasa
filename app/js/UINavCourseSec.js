;( function( $, R ) {
	R.ready( function() {
		var $ncs = $('.ncs'),
			$ncsDds = $('.ncs-dds')
		;

		$ncs.on('click', function() {
			$ncsDds.toggleClass('open');
		});
	});
})(jQuery, Response);
