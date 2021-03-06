/* Things Marionette takes for granted

XMLHttpRequest (sorry IE6)
JSON.parse
addEventListener (sorry IE)
FormData

*/

var Marionette = {};

Marionette.Application = function(templatePath, ready){
	/*
		requestUrl
		requestRunning
		requestResponseData
		templates
	*/
	
	this.onfailure = function(e){};
	
	var self = this;
	
	var onSuccess = function(){
		if(this.readyState == 1){
			self.requestRunning = true;
		}
		if(this.readyState == 4){
			self.requestRunning = false;
			if(this.status == 200){
				var redirect = this.getResponseHeader('X-Marionette-Location');
				if(redirect){
					this.open('GET', redirect);
					// Yuck. Refactor with a request wrapper.
					this.setRequestHeader('Accept', 'application/json;');
					this.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
					this.send();
				}else{
					var json;
					try{
						json = JSON.parse(this.responseText);
					}catch(e){
						self.onfailure.call(self, e);
						return;
					}
					self.requestResponseData = json;
					
					// Todo: Use Link headers instead of custom ones, and get rid of the template loader
					var templateName = this.getResponseHeader('X-Marionette-Template');
					var layout = this.getResponseHeader('X-Marionette-Layout') || 'layout';

					var rendered = Mustache.to_html(self.templates[templateName], json);
					var laid = Mustache.to_html(self.templates[layout], {"yield":rendered})
					
					// Todo: Make main container configurable
					var container = document.getElementById('container').innerHTML = laid;
				}
			}
		}
	}
	
	this.xhr = new XMLHttpRequest();
	
	this.xhr.onreadystatechange = function(){
		if(this.readyState == 4 && this.status == 200){
			// Set up the normal callback
			this.onreadystatechange = onSuccess;
			
			// Set up the listeners
			// what do we do about assholes who click-click-click-click?
			document.addEventListener('click', function(evt){
				if(evt.target.tagName == 'A'){
					evt.preventDefault();
					self.dispatch(evt.target);
				}
			});
			document.addEventListener('submit', function(evt){
				evt.preventDefault();
				self.dispatch(evt.target);
			});
			
			// TODO: error delegation
			self.templates = JSON.parse(this.responseText);
			
			ready.call(this);
		}else{
			// Throw a "Can't get Templates" Exception
		}
	}
	
	this.xhr.open('GET', templatePath);
	this.xhr.send();

};

Marionette.Application.prototype.dispatch = function(element){
	if(this.requestRunning) this.xhr.abort();
	var method = element.method || 'GET';
	var url = element.action || element.href; // what about data-method?
	
	var data = null;
	// TODO: Fix tagname stuff to work accross doctypes
	if(element.tagName == "FORM"){
		data = new FormData(element);
	}
	
	this.requestUrl = url;
	this.xhr.open(method, url);
	this.xhr.setRequestHeader('Accept', 'application/json;');
	this.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
	this.xhr.send(data);
}