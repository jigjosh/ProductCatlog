(function () {
    'use strict';

    angular
        .module('Catlog')
        .directive('breadcrumbs', breadcrumbs);

    breadcrumbs.$inject = [];

    //--------------------------------------------------------//
    function breadcrumbs() {
        return {
        restrict: 'E',
        replace: true,
        priority: 100,
        templateUrl: 'js/View/breadcrumbs.html'
    };
    }
})();


