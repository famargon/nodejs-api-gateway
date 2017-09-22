(function(app){
	controller.$inject =["$http"];
	function controller(http){
		var vm = this;
		vm.loadFruits = function(){
			http.get('/api/fruits')
			.success(function(data) {
				vm.fruits = data;
				vm.salute = data[0].name;
				console.log(data)
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
		};
	}
	app.controller("ctrl",controller);
}(angular.module("app")));