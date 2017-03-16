var baseUrl = window.location.href;
Favorites.restore();
jQuery(document).ready(function($) {

	var baseImgUrl = 'http://ganillagrace.jetshop.se';

	// Placeholder for products
	var $Products = $('section.products');
	var $TmplProduct = $Products.find('div.tmpl');
	// Remove empty div from section, not needed 
	$TmplProduct.remove().removeAttr('class');

	// Placeholder for categories
	var $CategoryUl = $('header > ul');

	// Template Li from UL,
	var $TmplLi = $CategoryUl.find('li.tmpl');
	// Remove empty Li from DOM, it's not needed. 
	$TmplLi.remove().removeAttr('class');

	var $TmplUl = $CategoryUl.clone(true);

	
	Api.fetch('categories').done(function(rsp) {
		
		var $Ul = $TmplUl.clone(true);
		$Ul.find('li').remove();

			parseCategories(rsp,{
				placeHolder: $CategoryUl,
				li: $TmplLi.clone(true),
				ul: $Ul,
				breadcrumb: ""
			})
	});

	// All the fancy bindings

	// header link, load products for that category
	$('header').on('click','a',function(event) {
		if ($(this).hasClass('favorites')) {
			parseProducts(Favorites.getAll(),{
					placeHolder : $Products,
					div : $TmplProduct,
					baseImgUrl: baseImgUrl
			});
			$Products.addClass('favorites');
		} else {
			Api.fetch('categories/'+$(this).attr('data-id')+'/products').done(function(rsp) {
				parseProducts(rsp.ProductItems,{
					placeHolder : $Products,
					div : $TmplProduct,
					baseImgUrl: baseImgUrl
				});
				$Products.removeClass('favorites');
			});
		}

		$('.breadcrumb').html($(this).attr('data-breadcrumb'));
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
			if ($Products.hasClass('favorites')) {
				$this.parents('[data-obj]').fadeOut(300);
			}
		}


	});

});


