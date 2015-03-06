
 /* Interactive Map by @sekler */
(function($) { var InteractiveMap = function() {var self = this;self.o = {/*source: 'locations.json',*/height: 420,locations: true,minimap: true,sidebar: true,search: true,clear: true,slide: 80,zoomLimit: 5};self.init = function(el, params) {self.o = $.extend(self.o, params);var o = self.o;self.el = el.addClass('im-element').height(o.height);self.container = $('<div></div>').addClass('im-container').height(o.height).appendTo(el);self.map = $('<div></div>').addClass('im-map').appendTo(self.container);var map = self.map;$.getJSON(o.source, function(data) {self.data = data;var nrlevels = 0;var shownLevel;self.levelselect = $('<select></select>').addClass('im-levels-select');var hw_ratio = data.mapheight / data.mapwidth;if (data.mapheight / self.container.height() > data.mapwidth / self.container.width()) {self.min_width = self.container.width();self.min_height = self.container.width() * hw_ratio;}else {self.min_height = self.container.height();self.min_width = self.container.height() / hw_ratio;}map.css({'width': data.mapwidth,'height': data.mapheight});if (o.minimap) {self.minimap = $('<div></div>').addClass('im-minimap').appendTo(self.container);self.minimap.css('height', self.minimap.width() * hw_ratio);self.minimap.click(function(e) {e.preventDefault();var pos = $(this).offset(),posX = (e.pageX - pos.left) / $(this).width(),posY = (e.pageY - pos.top) / $(this).height();self.goTo(posX, posY, 800);});}if (o.sidebar) {self.sidebar = $('<div></div>').addClass('im-sidebar').appendTo(el);if (o.search) {var form = $('<form></form>').addClass('im-search-form').submit(function() {return false;}).appendTo(self.sidebar);self.clear = $('<button></button>').addClass('im-search-clear').click(function() {input.val('');input.keyup();}).appendTo(form);var input = $('<input>').attr({'type': 'text', 'spellcheck': 'false', 'placeholder': 'Procurar Local...'}).addClass('im-search-input').keyup(function() {var keyword = $(this).val();self.search(keyword);}).prependTo(form);}var listContainer = $('<div></div>').addClass('im-list-container').appendTo(self.sidebar);var list = $('<ol></ol>').addClass('im-list').appendTo(listContainer);if (data.categories) {$.each(data.categories, function(index, value) {var item = $('<li></li>').addClass('im-list-category').addClass(value.id);var ol = $('<ol></ol>').css('border-color', value.color).appendTo(item);if (value.show == 'false') ol.hide();var link = $('<a></a>').attr('href', '#').attr('title', value.title).css('background-color', value.color).text(value.title).click(function(e) {ol.slideToggle(200);return false;}).prependTo(item);if (value.icon) $('<img>').attr('src', value.icon).prependTo(link);$('<span></span>').text('0').addClass('im-list-count').prependTo(link);list.append(item);});}}if (data.levels) {$.each(data.levels, function(index, value) {var source = value.map;var extension = source.substr((source.lastIndexOf('.') + 1)).toLowerCase();var locations;var layer = $('<div></div>').addClass('im-layer').addClass(value.id).hide().appendTo(map);switch (extension) {case 'jpg': case 'jpeg': case 'png': case 'gif':$('<img>').attr('src', source).addClass('im-map-image').appendTo(layer);if (o.locations) locations = $('<div></div>').addClass('im-locations').appendTo(layer);break;case 'svg':$('<div></div>').addClass('im-map-image').load(source).appendTo(layer);if (o.locations) locations = $('<div></div>').addClass('im-locations').appendTo(layer);break;default:alert('File type ' + extension + ' is not supported!');}if (o.minimap) {var minimap_layer = $('<div></div>').addClass('im-minimap-layer').addClass(value.id).appendTo(self.minimap);$('<img>').attr('src', value.minimap).appendTo(minimap_layer);$('<div></div>').addClass('im-minimap-overlay').appendTo(minimap_layer);$('<img>').attr('src', value.minimap).addClass('im-minimap-active').appendTo(minimap_layer);}self.levelselect.prepend($('<option></option>').attr('value', value.id).text(value.name));if (value.show) {shownLevel = value.id;}$.each(value.locations, function(index, value) {var top = value.y * 100;var left = value.x * 100;if (value.pin != 'false') {if (o.locations) var pin = $('<a></a>').attr({'href': '#' + value.id, 'title': value.label}).addClass('im-pin').css({'top': top + '%', 'left': left + '%'}).appendTo(locations);if (value.pin) pin.addClass(value.pin);}if (o.sidebar) {var item = $('<li></li>').addClass('im-list-location').addClass('im-list-shown');var link = $('<a></a>').attr('href', '#' + value.id).appendTo(item);if (value.thumbnail) $('<img>').attr('src', value.thumbnail).appendTo(link);$('<h4></h4>').text(value.label).appendTo(link);$('<span></span>').text(value.description).appendTo(link);var category = $('.im-list-category.' + value.category);if (category.length) $('ol', category).append(item);else list.append(item);}});nrlevels++;});}self.tooltip = $('<div></div>').addClass('im-tooltip').appendTo(self.map);$('<div></div>').addClass('im-tooltip-triangle').appendTo(self.tooltip);$('<button></button>').click(function(e) {e.preventDefault();if (!$.support.leadingWhitespace) window.location.hash = '';	else history.pushState('', document.title, window.location.pathname);self.tooltip.fadeOut(200);}).appendTo(self.tooltip);$('<img>').hide().appendTo(self.tooltip);$('<h4></h4>').appendTo(self.tooltip);$('<p></p>').appendTo(self.tooltip);$('<a class="">More</a>').attr('href', '#').hide().appendTo(self.tooltip);if (o.sidebar) {$('.im-list > li', self.el).each(function() {var count = $('.im-list-shown', this).length;$('.im-list-count', this).text(count);	});}if (o.clear) {$('<button></button>').addClass('im-clear-button').click(function() {if (!$.support.leadingWhitespace) window.location.hash = '';else history.pushState('', document.title, window.location.pathname);self.tooltip.fadeOut(200);self.zoomTo(0.5, 0.5, 1);}).appendTo(self.container);}if (nrlevels > 1) {self.levels = $('<div></div>').addClass('im-levels');var up = $('<button></button>').addClass('im-levels-up').appendTo(self.levels);self.levelselect.appendTo(self.levels);var down = $('<button></button>').addClass('im-levels-down').appendTo(self.levels);self.container.append(self.levels);self.levelselect.change(function() {var value = $(this).val();self.level(value);});up.click(function() {self.level('+');});down.click(function() {self.level('-');});}self.level(shownLevel);var id = location.hash.slice(1);if (id) self.showLocation(id, 0);else self.zoomTo(0.5, 0.5, 1, 0);}).fail(function() {alert('Arquivo perdido ou inválido!');});$(window).on('hashchange', function() {var id = location.hash.slice(1);self.showLocation(id, 800);var locationData = self.getLocationData(id);self.showTooltip(locationData);});document.ondragstart = function() { return false; };map.data('mouseMove', false);map.on('mousedown', function(e) {e.preventDefault();map.data('mouseMove', true);map.data('mouseX', e.clientX);map.data('mouseY', e.clientY);	map.css('cursor', 'move');}).mousemove(move);$(document).mouseup(function(e) {if (map.data('mouseMove')) {map.data('mouseMove', false);map.css('cursor', 'default');map.finish();map.animate({left: map.data('newX'),top: map.data('newY')}, 400, 'easeOutExpo');return false;}});map.on('dblclick', function(e) {var mapPos = self.map.offset();var x = (e.pageX - mapPos.left) / self.map.width();var y = (e.pageY - mapPos.top) / self.map.height();var z = self.map.width() / self.min_width * 2;self.zoomTo(x, y, z, 600);});map.on('touchstart', function(e) {var orig = e.originalEvent,pos = map.position();map.data('touchY', orig.changedTouches[0].pageY - pos.top);map.data('touchX', orig.changedTouches[0].pageX - pos.left);});map.on('touchmove', function(e) {e.preventDefault();var orig = e.originalEvent;var newX = orig.changedTouches[0].pageX - map.data('touchX'),newY = orig.changedTouches[0].pageY - map.data('touchY'),minX = self.container.width() - map.width(),minY = self.container.height() - map.height();if (newX > 0) newX = 0;else if (newX < minX) newX = minX;if (newY > 0) newY = 0;else if (newY < minY) newY = minY;map.css({top: newY,left: newX});map.data('newX', newX);map.data('newY', newY);if (self.o.minimap) updateMinimap(self.container, map);});self.container.bind('mousewheel DOMMouseScroll', function(e, delta) {e.preventDefault();var positionContainer = self.container.offset();var posX = e.pageX - positionContainer.left;var posY = e.pageY - positionContainer.top;var pos = map.position();var ratio = 1 + delta / 5;var scaleX = map.width();var scaleY = map.height();var newW = map.width() * ratio;var newH = map.height() * ratio;if (newW < self.min_width) newW = self.min_width;else if (newW > self.min_width * self.o.zoomLimit) newW = self.min_width * self.o.zoomLimit;if (newH < self.min_height) newH = self.min_height;else if (newH > self.min_height * self.o.zoomLimit) newH = self.min_height * self.o.zoomLimit;scaleX = newW / scaleX; scaleY = newH /scaleY;var newX = pos.left - ((posX - pos.left) * scaleX - (posX - pos.left));var newY = pos.top - ((posY - pos.top) * scaleY - (posY - pos.top));if (delta < 0) {var minX = self.container.width() - newW;var minY = self.container.height() - newH;if (newX > 0) newX = 0;else if (newX < minX) newX = minX;if (newY > 0) newY = 0;else if (newY < minY) newY = minY;}map.finish();map.animate({width: newW,height: newH,left: newX,top: newY}, 200, 'easeOutExpo');map.data('newX', newX);map.data('newY', newY);if (self.o.minimap) updateMinimap(self.container, map, newW, newH);});return self;};self.getLocationData = function(id) {var data = null;$.each(self.data.levels, function(index, layer) {$.each(layer.locations, function(index, value) {if (value.id == id) {data = value;}});});return data;};self.showTooltip = function(location) {self.tooltip.hide();if (location.image) $('img', self.tooltip).attr('src', location.image).show();else $('img', self.tooltip).hide();if (location.link) $('a', self.tooltip).attr('href', location.link).show();else $('a', self.tooltip).hide();$('h4', self.tooltip).text(location.label);$('p', self.tooltip).text(location.description);var x = location.x * 100;y = location.y * 100;mt = -self.tooltip.height() - 54;self.tooltip.css({left: x + '%',top: y + '%',marginTop: mt});self.tooltip.fadeIn();};self.search = function(keyword) {if (keyword) self.clear.fadeIn(100);else self.clear.fadeOut(100);$('.im-list li', self.el).each(function() {if ($('h4', this).text().search(new RegExp(keyword, "i")) < 0) {$(this).removeClass('im-list-shown');$(this).slideUp(200);} else {$(this).addClass('im-list-shown');$(this).show();}});$('.im-list > li', self.el).each(function() {var count = $('.im-list-shown', this).length;$('.im-list-count', this).text(count);});};self.level = function(target) {switch (target) {case '+':target = $('option:selected', self.levelselect).removeAttr('selected').prev().prop('selected', 'selected').val();break;case '-':target = $('option:selected', self.levelselect).removeAttr('selected').next().prop('selected', 'selected').val();break;default:$('option[value="' + target + '"]', self.levelselect).prop('selected', 'selected');}var layer = $('.im-layer.' + target);if (layer.is(':visible')) return;self.tooltip.hide();if (!$.support.leadingWhitespace) window.location.hash = '';else history.pushState('', document.title, window.location.pathname);$('.im-layer:visible').hide();layer.show();if (self.o.minimap) {$('.im-minimap-layer:visible').hide();$('.im-minimap-layer.' + target).show();}var index = self.levelselect.get(0).selectedIndex,up = $('.im-levels-up', self.levels),down = $('.im-levels-down', self.levels);up.attr('disabled', false);down.attr('disabled', false);if (index == 0) {up.attr('disabled', true);}else if (index == self.levelselect.get(0).length - 1) {down.attr('disabled', true);}};self.zoomTo = function(x, y, z, duration) {var map = self.map;var container = self.container;duration = typeof duration !== 'undefined' ? duration : 800;var newW = self.min_width * z;var newH = self.min_height * z;if (newW < self.min_width) newW = self.min_width;else if (newW > self.min_width * self.o.zoomLimit) newW = self.min_width * self.o.zoomLimit;if (newH < self.min_height) newH = self.min_height;else if (newH > self.min_height * self.o.zoomLimit) newH = self.min_height * self.o.zoomLimit;var newX = container.width() * 0.5 - newW * x;var newY = container.height() * 0.5 - newH * y;map.finish();map.animate({left: newX,top: newY,width: newW,height: newH}, duration, 'easeInOutCubic');map.data('newX', newX);map.data('newY', newY);if (self.o.minimap) updateMinimap(container, map, newW, newH);};self.goTo = function(x, y, duration) {var map = self.map;var container = self.container;duration = typeof duration !== 'undefined' ? duration : 800;var newX = container.width() * 0.5 - x * map.width();var newY = container.height() * 0.5 - y * map.height();map.finish();map.animate({left: newX,top: newY}, duration, 'easeInOutCubic');map.data('newX', newX);map.data('newY', newY);if (self.o.minimap) updateMinimap(container, map);};self.showLocation = function(id, duration) {$.each(self.data.levels, function(index, layer) {$.each(layer.locations, function(index, value) {if (value.id == id) {var zoom = typeof value.zoom !== 'undefined' ? value.zoom : 4;self.level(layer.id);self.zoomTo(value.x, value.y, zoom, duration);}});});};var move = function(e) {var map = self.map,slide = self.o.slide;if (map.data('mouseMove')) {var changeX = e.clientX - map.data('mouseX');var changeY = e.clientY - map.data('mouseY');var pos = map.position();var newX = pos.left + changeX;var newY = pos.top + changeY;var rawX = newX;var rawY = newY;var minX = self.container.width() - map.width();var minY = self.container.height() - map.height();if (newX > 0) {rawX = Math.min(newX, slide);newX = 0;}else if (newX < minX) {rawX = Math.max(newX, minX - slide);newX = minX;}if (newY > 0) {rawY = Math.min(newY, slide);newY = 0;}else if (newY < minY) {rawY = Math.max(newY, minY - slide);newY = minY;}map.finish();map.animate({left: rawX,top: rawY}, 0, 'easeOutExpo');map.data('newX', newX);map.data('newY', newY);map.data('mouseX', e.clientX);map.data('mouseY', e.clientY);if (self.o.minimap) updateMinimap(self.container, map);}};var updateMinimap = function(container, map, mapWidth, mapHeight) {var minimap = self.minimap,active = $('.im-minimap-active', minimap);mapWidth = typeof mapWidth !== 'undefined' ? mapWidth : map.width();mapHeight = typeof mapHeight !== 'undefined' ? mapHeight : map.height();var width = Math.round(container.width() / mapWidth * minimap.width()),height = Math.round(container.height() / mapHeight * minimap.height()),top = Math.round((-map.data('newY')) / mapWidth * minimap.width()),left = Math.round((-map.data('newX')) / mapHeight * minimap.height()),right = left + width,bottom = top + height;active.css('clip', 'rect(' + top + 'px, ' + right + 'px, ' + bottom + 'px, ' + left + 'px)');};};$.fn.interactiveMap = function(params) {var len = this.length;return this.each(function(index) {var me = $(this),key = 'interactivemap' + (len > 1 ? '-' + ++index : ''),instance = (new InteractiveMap).init(me, params);me.data(key, instance).data('key', key);});};})(jQuery);