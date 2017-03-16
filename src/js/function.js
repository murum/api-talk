
var Api = {
	baseUrl: 'http://ganillagrace.jetshop.se/Services/rest/v2/json/sv-SE/',
	/*
	 * Fetch data from api
	 * @param string: entity - What should we fetch today
	 * @param object: opts - What are the options to be used with jQuery?
	 * @return object: jQuery.ajax() - so we can handle .done() in caller.
	 */
	fetch : function(entity, currency ,opts) {
		if (opts === undefined){
			var opts = {};
		}
		if (currency !== undefined) {
			opts.url = this.baseUrl+currency+'/'+entity;
		} else {
			opts.url = this.baseUrl+entity;
		}
		opts.crossDomain = true;
		opts.dataType = 'json';
		return jQuery.ajax(opts);
	}
}

var Favorites = {
	favorites : [],
	add : function(Obj) {
		var key = this.find(Obj);
		if (key > -1) {
			this.favorites[key] = Obj;
		} else {
			this.favorites.push(Obj)
		}
		this.save();
	},
	remove : function (Obj) {
		var key = this.find(Obj);
		if (key > -1) {
			this.favorites.splice(key,1);
			this.save();
		}
	},
	isFavorite : function(Obj) {
		var key = this.find(Obj);
		if (key > -1) {
			return true;
		} 
		return false;
	},
	find : function (Obj) {
		for (var key=0; key < this.favorites.length; key++) {
			if (this.favorites[key].Id === Obj.Id) {
				return key;
			}
		}
		return -1;
	},
	save : function () {
		localStorage.setItem("jetshop.favs",JSON.stringify(this.favorites));
	},
	restore : function() {
		try {
			this.favorites = JSON.parse(localStorage.getItem('jetshop.favs'))
		} catch (err) {

		}
	}
}

/*
 * Parses categories from API call
 * @param object: Categories
 * @param object: Opts - Options for placeholder, ul template and li template
 * @return none - Function places the parsed category into the DOM
 */
function parseCategories(Categories,Opts) {

	// We should have some form of validation here

	for (var key=0;key<Categories.length;key++) {
		var Category = Categories[key];
		var $Li = Opts.li.clone(true);
		var $Link = $Li.find('a');

		$Link	.html(Category.Name)
					.attr('href',Category.CategoryUrl)
					.attr('data-id',Category.Id);

		if (Category.HasSubCategories === true) {

			var $Ul = Opts.ul.clone();
			parseCategories(Category.SubCategories,{
				placeHolder: $Ul,
				ul: Opts.ul,
				li: Opts.li
			});
			$Li.append($Ul);

		}
		Opts.placeHolder.append($Li);
	}
}
