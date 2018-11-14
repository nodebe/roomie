var roomieapp = angular.module('roomie', ['ui.router','ionic','ngCordova'])

roomieapp.config(['$urlRouterProvider','$stateProvider', function(urp,sp) {
	sp
	.state('abstract',{url:'/index', views:{'@':{controller:'maincontrol',templateUrl:'modules/abstract.html'},
	'feeds@abstract':{controller:'recentcontrol', templateUrl:'modules/recent.html'}}})
	.state('abstract.details',{url:'/details', views:{'feeds@abstract':{controller:'postcontrol',templateUrl:'modules/details.html'}}})
	.state('abstract.problem',{url:'/report', views:{'feeds@abstract':{templateUrl:'modules/problem.html'}}})
	.state('abstract.search',{url:'/Search', views:{'feeds@abstract':{controller:'searchcontrol',templateUrl:'modules/search.html'}}})
	.state('abstract.disclaimer',{url:'/Discalimer', views:{'feeds@abstract':{templateUrl:'modules/disclaimer.html'}}})

	urp.otherwise('/index')


}])
roomieapp.controller('maincontrol',['$scope','$state','$ionicSideMenuDelegate', function(sc,st,ismd){
	document.addEventListener("offline", onOffline, false);
	function onOffline() {
		// Handle the offline event
		window.plugins.toast.showLongBottom("No connection found!");
	}
	sc.close_box = false;

	sc.menu = function(){
		ismd.toggleLeft();
	}/* 
	sc.share = function(){
		//share code comes here
		alert('sharing')
	} */
}])
roomieapp.controller('postcontrol', ['$scope','$http','$state', function(sc,ht,st){
	document.addEventListener('deviceready', function () {
		sc.post = {operation:'Post'}
		sc.submit = function(){
			if(sc.post.name != (null && '')){
				if(sc.post.number != (null && '')){
						if(sc.post.price != (null && '')){
								if(sc.post.gender != (null && '')){
									var url = 'http://roomie.seclom.com/roomie.php'
										data = {
											operation: sc.post.operation,
											name:sc.post.name,
											number:sc.post.number,
											price:sc.post.price,
											gender:sc.post.gender,
											institute:sc.post.institute
										}
										ht.post(url,data).then(function(result){
											window.plugins.toast.showLongBottom(JSON.stringify(result.data.message))
											st.go('abstract')
										},
									function(error){
										window.plugins.toast.showShortBottom(JSON.stringify(error.data.message))
									})
								}
					}
				}
			}	
		}
	})
}])

roomieapp.controller('searchcontrol', ['$scope','$state','$http', function(sc,st,ht){
	document.addEventListener('deviceready', function(){
		sc.call = function(e){
			if (e[0] != 0 && e[0] != '+'){
				number = '0'+e
			}else{
				number = e
			}
			return window.plugins.CallNumber.callNumber(onSuccess, onError, number, false);
		}
		sc.searchinfo = sc.searchBackShow = false;
		sc.searchform = true;
		sc.search = {operation:'Search'};
		sc.contents = []
		sc.searchBack = function(){
			sc.searchinfo = sc.searchBackShow = false;
			sc.searchform = true;
			sc.contents = [];
		}
			sc.submit = function(){
				if(sc.search.institute != (null && '')){
					if(sc.search.price != (null && '')){
						if(sc.search.gender != (null && '')){
							sc.searchform = false;
							window.plugins.toast.showLongBottom('Searching')
							var url = 'http://roomie.seclom.com/roomie.php'
							data = {
								operation: sc.search.operation,
								price: sc.search.price,
								gender: sc.search.gender,
								institute: sc.search.institute
							}
							ht.post(url,data).then(function(result){
								var res = result["data"]
								if (result["data"] == '"No room found!"'){
									sc.searchform =true
								window.plugins.toast.showLongBottom(res)
								}else{
									sc.searchinfo = sc.searchBackShow = true;
									for(var i=0; i<res.length;i++){
										sc.contents.push({
											id: res[i].id,
											name: res[i].full_name,
											number:res[i].mobile_number,
											price:res[i].price,
											gender:res[i].gender,
											institute:res[i].institute
										})
									}
								}
							}, function(error){
								window.plugins.toast.showLongBottom('No data received!')
							})
						}
					}
				}
			}
		})
}])
function onSuccess(result) {
	console.log("Success:" + result);
}
function onError(result) {
	console.log("Error:" + result);
}
roomieapp.controller('recentcontrol', ['$scope', '$http', function (sc, ht) {
	document.addEventListener('deviceready', function(){
		sc.call = function(e){
			if (e[0] != 0 && e[0] != '+'){
				number = '0'+e
			}else{
				number = e
			}
			return window.plugins.CallNumber.callNumber(onSuccess, onError, number, false);
		}
		sc.wait = true
		var url = 'http://roomie.seclom.com/recent.php';
		sc.data = []
		ht.get(url).then(function (results) {
			if (results) {
				sc.wait = false
				var res = results["data"]
				for (var i = 0; i < res.length; i++) {
					sc.data.push({
						id: res[i].id,
						name: res[i].full_name,
						number: res[i].mobile_number,
						price: res[i].price,
						gender: res[i].gender,
						institute: res[i].institute
					})
				}
			}
		}, function (error) {
			sc.wait = false
			var res = error["data"]
			window.plugins.toast.showLongBottom('No data recieved!')
		})
	})	
 }])