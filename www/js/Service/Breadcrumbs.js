(function () {
    'use strict';

    angular
        .module('Catlog')
        .factory('Breadcrumbs', Breadcrumbs);

    Breadcrumbs.$inject = ['$state',  '$interpolate'];

    function Breadcrumbs($state,  $interpolate) {
         var list = [], title;

    function getProperty(object, path) {
        function index(obj, i) {
            return obj[i];
        }

        return path.split('.').reduce(index, object);
    }

    function addBreadcrumb(title, state) {
        list.push({
            title: title,
            state: state
        });
    }

    function generateBreadcrumbs(state) {
        if(angular.isDefined(state.parent)) {
            generateBreadcrumbs(state.parent);
        }

        if(angular.isDefined(state.breadcrumb)) {
            if(angular.isDefined(state.breadcrumb.title)) {
                addBreadcrumb($interpolate(state.breadcrumb.title)(state.locals.globals), state.name);
            }
        }
    }

    function appendTitle(translation, index) {
        var title = translation;

        if(index < list.length - 1) {
            title += ' > ';
        }

        return title;
    }

    function generateTitle() {
        title = '';

        angular.forEach(list, function(breadcrumb, index) {
            title += appendTitle(breadcrumb.title, index);
        });
    }

    return {
        generate: function() {
            list = [];

            generateBreadcrumbs($state.$current);
            generateTitle();
        },

        title: function() {
            return title;
        },

        list: function() {
            return list;
        }
    };
    }
})();