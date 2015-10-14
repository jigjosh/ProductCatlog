(function () {
    'use strict';

    angular
        .module('Catlog')
        .service('TagGroupingService', TagGroupingService);

    TagGroupingService.$inject = ['$q', 'lodash', 'AppUrls'];

    function TagGroupingService($q, lodash, AppUrls) {


        this.groupingtags = groupingtags;


        function groupingtags (alltags) {
            //var _retval;
            return lodash.chain(alltags)
                .groupBy('Brand')
                .map(function (value, key) {
                    return {
                        Brand: key,
                        tags: lodash.chain(value)
                            .groupBy('JewelleryType')
                            .map(function (value, key) {
                                return {
                                    JewelleryType: key,
                                    tags: value
                                        }
                            }).value()
                    }
                }).value();
            //return _retval
        }



    }
})();