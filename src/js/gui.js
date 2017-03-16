var baseUrl = window.location.href;
Favorites.restore();
jQuery(document).ready(function($) {

	var baseImgUrl = 'http://ganillagrace.jetshop.se';

	// Placeholder for products
	var $Products = $('section.products');
	var $TmplProduct = $Products.find('div.tmpl');
	// Remove empty div from section, not needed 
	$TmplProduct.remove().removeClass('tmpl');

	// Placeholder for categories
	var $CategoryUl = $('header > ul');
	// Template Li from UL,
	var $TmplLi = $CategoryUl.find('li.tmpl');
	// Remove empty Li from DOM, it's not needed. 
	$TmplLi.remove().removeClass('tmpl');

	var $TmplUl = $CategoryUl.clone(true);

	
	Api.fetch('categories').done(function(rsp) {
			parseCategories(rsp,{
				placeHolder: $CategoryUl,
				li: $TmplLi.clone(true),
				ul: $TmplUl.clone(true),
			})
	});

	// All the fancy bindings

	// header link, load products for that category
	$('header').on('click','a',function(event) {
		Api.fetch('categories/'+$(this).attr('data-id')+'/products').done(function(rsp) {
			// Clear Products placeholder
			$Products.html('');
			
			for(var key=0;key < rsp.ProductItems.length;key++) {
				var Product = rsp.ProductItems[key];
				var $curr = $TmplProduct.clone(true);
				$curr.find('> h2').html(Product.SubName);
				$curr.find('> span').html(Product.PriceString);
				$curr.find('> div > img')	.attr('src',baseImgUrl + Product.Images[0].Url)
																	.attr('alt',Product.Images[0].AltText);
				$curr.attr('data-obj',JSON.stringify(Product));
				if (Favorites.isFavorite(Product)) {
					$curr.find('.fa.fa-heart').toggleClass('active');
				}
				$Products.append($curr); 
			}
		});
		return false;
	});

		// Handle all A clicks here - Used for push state.
	$(document).on('click','a',function(event) {
		//history.pushState(null,$this.text(),baseUrl+$(this).attr('href'));
		return false;
	});

	$('.products').on('click','.fa.fa-heart',function(event) {
		var $this = $(this);
		Product = JSON.parse($this.parents('[data-obj]').attr('data-obj'));
		$this.toggleClass('active');
		if ($this.hasClass('active')) {
			Favorites.add(Product);
		} else {
			Favorites.remove(Product);
		}

	});

});


