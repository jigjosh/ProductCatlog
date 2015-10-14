(function () {
    'use strict';

    angular
        .module('Catlog')
        .controller('FilterController', FilterController);

    FilterController.$inject = ['$rootScope',
                                '$timeout',
                                '$state',
                                '$stateParams',
                                'lodash',
                                'TagService'];

    //--------------------------------------------------------//
    function FilterController($rootScope,
                            $timeout,
        $state,
        $stateParams,
        lodash,
        TagService) {

        var vm = this;

        vm.title = '<img src="img/icon.png" height="25px" style="padding-top:8px"> ver 1.3.1';

        vm.lookupdata = {};
        vm.applyFilter = applyFilter;
        vm.clearFilter = clearFilter;

        vm.selectval = {
            'Categories': undefined,
            'Designs': undefined,
            'DesignGroups': undefined,
            'ItemTypes': undefined,
            'Locations': undefined,
            'SubCategories': undefined,
            'SRNo': undefined,
            'SupplierRefNo': undefined,
            'MinTagPrice': undefined,
            'MaxTagPrice': undefined,
            'MinWeight': undefined,
            'MaxWeight': undefined
        };

        vm.selecttext = {
            'Category': 'Choose Cotegories',
            'Design': 'Choose Designs',
            'DesignGroup': 'Choose Design Groups',
            'ItemType': 'Choose ItemTypes',
            'Location': 'Choose Locations',
            'SubCategory': 'Choose Sub Categories'
        };

        //debugger;

        vm.categories = [];
        vm.designs = [];
        vm.designgroups = [];
        vm.itemtypes = [];
        vm.locations = [];
        vm.subcategories = [];

        TagService.getlookupData().then(function (result) {
            console.log(result);
            vm.lookupdata = result
            fillcategories();
            filldesigns();
            filldesigngroups();
            fillitemtypes();
            filllocations();
            fillsubcategories();
        });


        function fillcategories() {
            vm.categories = vm.lookupdata._categorySource;
            //            angular.forEach(vm.lookupdata._categorySource, function (value, key) {
            //                vm.categories.push({
            //                    id: value,
            //                    text: value,
            //                    checked: false,
            //                    icon: null
            //
            //                })
            //            });
        };

        function filldesigns() {
            vm.designs = vm.lookupdata._designSource;
            //            angular.forEach(vm.lookupdata._designSource, function (value, key) {
            //
            //                vm.designs.push({
            //                    id: value,
            //                    text: value,
            //                    checked: false,
            //                    icon: null
            //
            //                })
            //            });
        };

        function filldesigngroups() {
            vm.designgroups = vm.lookupdata._designgroupSource;
            //            angular.forEach(vm.lookupdata._designgroupSource, function (value, key) {
            //                vm.designgroups.push({
            //                    id: value,
            //                    text: value,
            //                    checked: false,
            //                    icon: null
            //
            //                })
            //            });
        };

        function fillitemtypes() {
            vm.itemtypes = vm.lookupdata._itemtypeSource;
            //            angular.forEach(vm.lookupdata._itemtypeSource, function (value, key) {
            //                vm.itemtypes.push({
            //                    id: value,
            //                    text: value,
            //                    checked: false,
            //                    icon: null
            //
            //                })
            //            });
        };

        function filllocations() {
            vm.locations = vm.lookupdata._locationSource;
            //            angular.forEach(vm.lookupdata._locationSource, function (value, key) {
            //                vm.locations.push({
            //                    id: value,
            //                    text: value,
            //                    checked: false,
            //                    icon: null
            //
            //                })
            //            });
        };

        function fillsubcategories() {
            vm.subcategories = vm.lookupdata._subcategorySource;
            //            angular.forEach(vm.lookupdata._subcategorySource, function (value, key) {
            //                vm.subcategories.push({
            //                    id: value,
            //                    text: value,
            //                    checked: false,
            //                    icon: null
            //
            //                })
            //            });
        };

        function applyFilter() {



            TagService.ApplyFillter(vm.selectval).then(function (result) {

                if (result === true) {
                    $state.go('main.tagList', {
                        id: $stateParams.id
                    });
                    $timeout(function(){
                    $rootScope.$broadcast('applyFilter', 1);
                    }, 1000)
                    
                }
            });
        };

        function clearFilter() {

            vm.selectval = {
                'Categories': undefined,
                'Designs': undefined,
                'DesignGroups': undefined,
                'ItemTypes': undefined,
                'Locations': undefined,
                'SubCategories': undefined,
                'SRNo': undefined,
                'SupplierRefNo': undefined,
                'MinTagPrice': undefined,
                'MaxTagPrice': undefined,
                'MinWeight': undefined,
                'MaxWeight': undefined
            };

            TagService.ApplyFillter(vm.selectval).then(function (result) {
                if (result === true) {
                    $state.go('main.tagList', {
                        id: $stateParams.id
                    });
                    $timeout(function(){
                    $rootScope.$broadcast('applyFilter', 0);
                    }, 1000)
                }
            });
        };

    }
})();