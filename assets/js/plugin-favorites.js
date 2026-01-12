jQuery(document).ready(function($) {
    // Handle favorite toggle click
    $(document).on('click', '.plugin-favorite-link', function(e) {
        e.preventDefault();
        
        var $link = $(this);
        var pluginFile = $link.data('plugin');
        
        // Prevent multiple clicks
        if ($link.hasClass('processing')) {
            return;
        }
        
        $link.addClass('processing');
        
        // Send AJAX request
        $.ajax({
            url: pluginFavorites.ajaxurl,
            type: 'POST',
            data: {
                action: 'toggle_plugin_favorite',
                nonce: pluginFavorites.nonce,
                plugin: pluginFile
            },
            success: function(response) {
                if (response.success) {
                    // Update star icon and class
                    if (response.data.is_favorite) {
                        $link.text('⭐').addClass('is-favorite');
                        $link.attr('title', 'Remove from favorites');
                    } else {
                        $link.text('☆').removeClass('is-favorite');
                        $link.attr('title', 'Add to favorites');
                    }
                    
                    // Update favorites count in tab
                    $('.view-favorites .count').text('(' + response.data.count + ')');
                    
                    // If on favorites tab and removing favorite, remove the row
                    if (!response.data.is_favorite && window.location.search.indexOf('plugin_status=favorites') !== -1) {
                        $link.closest('tr').fadeOut(300, function() {
                            $(this).remove();
                            
                            // If no more favorites, show empty message
                            if ($('#the-list tr:visible').length === 0) {
                                location.reload();
                            }
                        });
                    }
                }
            },
            error: function() {
                alert('An error occurred. Please try again.');
            },
            complete: function() {
                $link.removeClass('processing');
            }
        });
    });
});