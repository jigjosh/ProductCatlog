(function () {
    'use strict';

    angular
        .module('Catlog')
        .service('TagService', TagService);

    TagService.$inject = ['$q', '$http', 'lodash', 'AppUrls', 'TagGroupingService'];

    function TagService($q, $http, lodash, AppUrls, TagGroupingService) {
        var _db

        var _tags = [];
        
        var _GroupLevel1Tags = [];

        var _currentTag;
        var _grouptags;
        var _filterOption;

        var _lookupData;


        this.initDB = initDB;
        this.addTag = addTag;
        this.addTags = addTags;

        this.updatetag = updatetag;
        this.updatelookuptag = updatelookuptag;
        this.deletetag = deletetag;
        this.getAlltags = getAlltags;

        this.ApplyFillter = ApplyFillter;

        this.getSyncTags = getSyncTags;
        this.getTag = getTag;


        this.getlookupData = getlookupData;

        this.createIndex = createIndex;

        this.getGroupLevel1tags = getGroupLevel1tags;
        this.getGroupLevel2tags = getGroupLevel2tags;
        this.getBottomLeveltags = getBottomLeveltags;
        this.getdocTypelookupData = getdocTypelookupData;

        //Init Database
        function initDB() {
            _db = new PouchDB('cdProductCatlog', {
                adapter: 'websql'
            });

        };

        // Add Single tag to Database
        function addTag(tag) {
            return $q.when(_db.post(tag));
        };

        function updatetag(tag) {
            tag._id = '0' + tag.Brand + tag.JewelleryType + tag.SRNo;
            return $q.when(_db.put(tag));
        };

        function updatelookuptag(tag) {
            return $q.when(_db.put(tag));
        }

        function deletetag(tag) {
            return $q.when(_db.remove(tag));
        };

        // Add Multiple tags to Database
        function addTags(tags) {
            angular.forEach(tags, function (value, key) {
                value._id = value.ID;
            });
            return $q.when(_db.bulkDocs(tags));
        };

        function getTag(id) {
            return $q.when(_db.get(id));
        }

        function ApplyFillter(filterOption) {

            _tags = [];
            if (JSON.stringify(filterOption) !== JSON.stringify(_filterOption)) {
                _GroupLevel1Tags = [];
            };

            _filterOption = angular.copy(filterOption);

            _filterOption.SRNo = ((angular.isDefined(_filterOption.SRNo) && _filterOption.SRNo !== '') ? _filterOption.SRNo : undefined);
            _filterOption.SupplierRefNo = ((angular.isDefined(_filterOption.SupplierRefNo) && _filterOption.SupplierRefNo !== '') ? _filterOption.SupplierRefNo : undefined);
            _filterOption.MinTagPrice = ((angular.isDefined(_filterOption.MinTagPrice) && _filterOption.MinTagPrice !== '0') ? _filterOption.MinTagPrice : undefined);
            _filterOption.MaxTagPrice = ((angular.isDefined(_filterOption.MaxTagPrice) && _filterOption.MaxTagPrice !== '0') ? _filterOption.MaxTagPrice : undefined);
            _filterOption.MinWeight = ((angular.isDefined(_filterOption.MinWeight) && _filterOption.MinWeight !== '0') ? _filterOption.MinWeight : undefined);
            _filterOption.MaxWeight = ((angular.isDefined(_filterOption.MaxWeight) && _filterOption.MaxWeight !== '0') ? _filterOption.MaxWeight : undefined);

            _filterOption.Categories = ((angular.isDefined(_filterOption.Categories) && _filterOption.Categories !== '') ? _filterOption.Categories.split(";") : [])
            _filterOption.Designs = ((angular.isDefined(_filterOption.Design) && _filterOption.Design !== '') ? _filterOption.Design.split(";") : [])
            _filterOption.DesignGroups = ((angular.isDefined(_filterOption.DesignGroups) && _filterOption.DesignGroups !== '') ? _filterOption.DesignGroups.split(";") : [])
            _filterOption.ItemTypes = ((angular.isDefined(_filterOption.ItemTypes) && _filterOption.ItemTypes !== '') ? _filterOption.ItemTypes.split(";") : [])
            _filterOption.Locations = ((angular.isDefined(_filterOption.Locations) && _filterOption.Locations !== '') ? _filterOption.Locations.split(";") : [])
            _filterOption.SubCategories = ((angular.isDefined(_filterOption.SubCategories) && _filterOption.SubCategories !== '') ? _filterOption.SubCategories.split(";") : [])


            return $q.when(true);


        }

        // Get all the Tags from Database 
        function getAlltags() {
            //_filterOption.Designs.length > 0

            if (_tags.length === 0) {
                console.log('come for getting');
                var alltags
                return $q.when(_db.allDocs({
                        include_docs: true
                    }))
                    .then(function (docs) {
                        alltags = docs.rows.map(function (row) {
                            return row.doc;
                        });


                        if (angular.isDefined(_filterOption)) {

                            var filtertag = lodash.filter(alltags, _filtertags);
                            _tags = TagGroupingService.groupingtags(filtertag)
                                //                            var filtertags = [];
                                //                            angular.forEach(_alltags, function (currTag) {
                                //                                filtertags.push(_SRNoFilter(_SupplierRefFilter(_CategoryFilter(_DesignFilter(_DesignGroupFilter(_ItemTypeFilter(_SubCategoryFilter(_LocationFilter(_MinPriceFilter(_MaxPriceFilter(_MinWeightFilter(_MaxWeightFilter(currTag)))))))))))));
                                //                            });
                                //
                                //                            _alltags = lodash.filter(filtertags, _filternulls);
                                //                            console.log(_alltags);
                                //                            _alltags = lodash.chain(_alltags).
                                //                            filter(angular.isDefined(_filterOption.SRNo) ? _SRNoFilter : _filtertrue).
                                //                            filter(angular.isDefined(_filterOption.SupplierRefNo) ? _SupplierRefFilter: _filtertrue).
                                //                            filter((_filterOption.Categories.length > 0) ? _CategoryFilter: _filtertrue).
                                //                            filter((_filterOption.Designs.length > 0) ? _DesignFilter: _filtertrue).
                                //                            filter((_filterOption.DesignGroups.length > 0) ? _DesignGroupFilter: _filtertrue).
                                //                            filter((_filterOption.SubCategories.length > 0)  ? _ItemTypeFilter: _filtertrue).
                                //                            filter((_filterOption.SubCategories.length > 0)  ? _SubCategoryFilter: _filtertrue).
                                //                            filter((_filterOption.Locations.length > 0)  ? _LocationFilter: _filtertrue).
                                //                            filter((angular.isDefined(_filterOption.MinTagPrice)) ? _MinPriceFilter: _filtertrue).
                                //                            filter((angular.isDefined(_filterOption.MaxTagPrice)) ? _MaxPriceFilter: _filtertrue).
                                //                            filter((angular.isDefined(_filterOption.MinWeight)) ? _MinWeightFilter: _filtertrue).
                                //                            filter((angular.isDefined(_filterOption.MaxWeight)) ? _MaxWeightFilter: _filtertrue)
                        } else {
                            _tags = TagGroupingService.groupingtags(alltags)

                        };


                        //                        TagGroupingService.groupingtags(_alltags).then(function(result){
                        //                            
                        //                        });

                        return $q.when(_tags);

                        //.on('change', onDatabaseChange);
                        // Listen for changes on the database.
                        //                        _db.changes({
                        //                                live: true,
                        //                                since: 'now',
                        //                                include_docs: true
                        //                            })
                        //   

                    });
            } else {
                // Return cached data as a promise
                console.log('return saved tags');
                return $q.when(_tags);
            }
        };


        function _filtertags(currTag) {

            return (
                (angular.isDefined(_filterOption.SRNo) ? (currTag.SRNo === _filterOption.SRNo) : true) &&
                (angular.isDefined(_filterOption.MinTagPrice) ? (currTag.TagPriceBC >= _filterOption.MinTagPrice) : true) &&
                (angular.isDefined(_filterOption.MaxTagPrice) ? (currTag.TagPriceBC <= _filterOption.MaxTagPrice) : true) &&
                (angular.isDefined(_filterOption.MaxWeight) ? (currTag.DiamondWeight <= _filterOption.MaxWeight) : true) &&
                (angular.isDefined(_filterOption.MinWeight) ? (currTag.DiamondWeight >= _filterOption.MinWeight) : true) &&
                (angular.isDefined(_filterOption.SupplierRefNo) ? (currTag.SupplierRefNo === _filterOption.SupplierRefNo) : true) &&
                ((_filterOption.Categories.length > 0) ? (lodash.includes(_filterOption.Categories, currTag.Category)) : true) &&
                ((_filterOption.Designs.length > 0) ? (lodash.includes(_filterOption.Designs, currTag.Design)) : true) &&
                ((_filterOption.DesignGroups.length > 0) ? (lodash.includes(_filterOption.DesignGroups, currTag.DesignGroup)) : true) &&
                ((_filterOption.ItemTypes.length > 0) ? (lodash.includes(_filterOption.ItemTypes, currTag.ItemType)) : true) &&
                ((_filterOption.SubCategories.length > 0) ? (lodash.includes(_filterOption.SubCategories, currTag.SubCategory)) : true) &&
                ((_filterOption.Locations.length > 0) ? (lodash.includes(_filterOption.Locations, currTag.Location)) : true)
            )


        };


        function _filternulls(currTag) {
            return currTag !== null;
        };

        function _SRNoFilter(currTag) {
            return (angular.isDefined(_filterOption.SRNo) ? (currTag.SRNo === _filterOption.SRNo ? currTag : null) : currTag);
            //return currTag.SRNo === _filterOption.SRNo;
        };

        function _MinPriceFilter(currTag) {
            return (angular.isDefined(_filterOption.MinTagPrice) ?
                (currTag.TagPriceBC >= _filterOption.MinTagPrice ? currTag : null) : currTag);
            //return (currTag.TagPriceBC >= _filterOption.MinTagPrice);
        }

        function _MaxPriceFilter(currTag) {
            return (angular.isDefined(_filterOption.MaxTagPrice) ?
                (currTag.TagPriceBC <= _filterOption.MaxTagPrice ? currTag : null) : currTag);
            //return (currTag.TagPriceBC <= _filterOption.MaxTagPrice);
        }

        function _MinWeightFilter(currTag) {
            return (angular.isDefined(_filterOption.MinWeight) ?
                (currTag.DiamondWeight >= _filterOption.MinWeight ? currTag : null) : currTag);
            //    return (currTag.DiamondWeight >= _filterOption.MinWeight);
        }

        function _MaxWeightFilter(currTag) {
            return (angular.isDefined(_filterOption.MaxWeight) ?
                (currTag.DiamondWeight <= _filterOption.MaxWeight ? currTag : null) : currTag);
            //return (currTag.DiamondWeight <= _filterOption.MaxWeight);
        }

        function _SupplierRefFilter(currTag) {

            return (angular.isDefined(_filterOption.SupplierRefNo) ?
                (currTag.SupplierRefNo === _filterOption.SupplierRefNo ? currTag : null) : currTag);
            //return currTag.SupplierRefNo === _filterOption.SupplierRefNo;
        };

        function _CategoryFilter(currTag) {

            return ((_filterOption.Categories.length > 0) ?
                (lodash.includes(_filterOption.Categories, currTag.Category) ? currTag : null) : currTag);
            //return lodash.includes(_filterOption.Categories, currTag.Category);
        };

        function _DesignFilter(currTag) {
            return ((_filterOption.Designs.length > 0) ?
                (lodash.includes(_filterOption.Designs, currTag.Design) ? currTag : null) : currTag);
            //    return lodash.includes(_filterOption.Designs, currTag.Design);
        };

        function _DesignGroupFilter(currTag) {
            return ((_filterOption.DesignGroups.length > 0) ?
                (lodash.includes(_filterOption.DesignGroups, currTag.DesignGroup) ? currTag : null) : currTag);
            //    return lodash.includes(_filterOption.DesignGroups, currTag.DesignGroup);
        };

        function _ItemTypeFilter(currTag) {
            return ((_filterOption.ItemTypes.length > 0) ?
                (lodash.includes(_filterOption.ItemTypes, currTag.ItemType) ? currTag : null) : currTag);
            //return lodash.includes(_filterOption.ItemTypes, currTag.ItemType);
        };

        function _SubCategoryFilter(currTag) {
            return ((_filterOption.SubCategories.length > 0) ?
                (lodash.includes(_filterOption.SubCategories, currTag.SubCategory) ? currTag : null) : currTag);
            //return lodash.includes(_filterOption.SubCategories, currTag.SubCategory);
        };

        function _LocationFilter(currTag) {
            return ((_filterOption.Locations.length > 0) ?
                (lodash.includes(_filterOption.Locations, currTag.Location) ? currTag : null) : currTag);
            //    return lodash.includes(_filterOption.Locations, currTag.Location);
        };

        function getlookupData() {

            if (!_lookupData) {

                var getLookupPromise = [];
                _lookupData = {
                    _locationSource: [],
                    _categorySource: [],
                    _subcategorySource: [],
                    _designSource: [],
                    _designgroupSource: [],
                    _itemtypeSource: []
                }

                getLookupPromise.push(getdocTypelookupData('1Location'));
                getLookupPromise.push(getdocTypelookupData('2Category'));
                getLookupPromise.push(getdocTypelookupData('3SubCategory'));
                getLookupPromise.push(getdocTypelookupData('4Design'));
                getLookupPromise.push(getdocTypelookupData('5DesignGroup'));
                getLookupPromise.push(getdocTypelookupData('6ItemType'));

                return $q.all(getLookupPromise)
                    .then(function (results) {

                        _lookupData = {
                            _locationSource: results[0],
                            _categorySource: results[1],
                            _subcategorySource: results[2],
                            _designSource: results[3],
                            _designgroupSource: results[4],
                            _itemtypeSource: results[5]
                        };

                        console.log(_lookupData._locationSource);
                        return _lookupData;
                    });


            } else {
                return $q.when(_lookupData);
            }

        };

        function getUniquevalue(tagArr, prop) {


            return lodash.filter(
                lodash.unique(
                    lodash.pluck(
                        lodash.flattenDeep(tagArr), prop)),
                function (value) {
                    return (angular.isDefined(value) ? value.length > 0 : false)
                });
        };


        function getdocTypelookupData(docType) {
            var startbrandKey = docType;
            var endbrandKey = docType + '\uffff';

            return $q.when(_db.allDocs({
                    include_docs: true,
                    startkey: startbrandKey,
                    endkey: endbrandKey
                }))
                .then(function (docs) {
                    var docType = [];
                    var i = 1
                    lodash.each(docs.rows, function (row) {
                        docType.push({
                            "id": row.doc.value,
                            "text": row.doc.value,
                            "checked": false
                        });
                        i = i + 1;
                    });
                    return docType
                });
        };


        function findTag(SRNo) {
            return lodash.find(_tags, function (tag) {
                return tag.SRNo = SRNo
            });
        };

        function tagInfo(tag) {
            return {
                SRNo: tag.SRNo,
                ItemDescription: tag.ItemDescription,
                Brand: tag.Brand,
                SupplierRefNo: tag.SupplierRefNo,
                DiamondQuantityDetail: tag.DiamondQuantityDetail,
                TaggingLine1: tag.TaggingLine1,
                TaggingLine2: tag.TaggingLine2,
                TaggingLine3: tag.TaggingLine3,
                Category: tag.Category,
                JewelleryType: tag.JewelleryType,
                TagPrice: tag.TagPrice,
                Location: tag.Location
            }
        };


        //        function onDatabaseChange(change) {
        //            var index = findIndex(_tags, change.id);
        //            var tag = _tags[index];
        //
        //            if (change.deleted) {
        //                if (tag) {
        //                    _tags.splice(index, 1); // delete
        //                }
        //            } else {
        //                if (tag && tag._id === change.id) {
        //                    _tag[index] = change.doc; // update
        //                } else {
        //                    _tag.splice(index, 0, change.doc) // insert
        //                }
        //            }
        //        }
        //
        //        // Binary search, the array is by default sorted by _id.
        //        function findIndex(array, id) {
        //            var low = 0,
        //                high = array.length,
        //                mid;
        //            while (low < high) {
        //                mid = (low + high) >>> 1;
        //                array[mid]._id < id ? low = mid + 1 : high = mid
        //            }
        //            return low;
        //        }


        //Get data from Server and sync to Local Database
        function getSyncTags(tagNo, pageNo) {
            
            alert(AppUrls.dataURL + 'uspGetProductsByTagNoAndPage');

            var config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            return $http.post(AppUrls.dataURL + 'uspGetProductsByTagNoAndPage', {
                "UserID": 100,
                "TagNo": tagNo,
                "PageNo": pageNo,
                "PageSize": AppUrls.pageSize
            }, config);
        };

        function getGroupLevel1tags() {

            if (_GroupLevel1Tags.length === 0) {
                var startkey = "0";
                var endkey = '0\uffff';

                return $q.when(_db.allDocs({
                        include_docs: true,
                        startkey: startkey,
                        endkey: endkey
                    }))
                    .then(function (docs) {
                        //var brandGroup = [];
                        var oldbrand = '';
                        var count = 0;
                        var lastSRNo;
                        lodash.each(docs.rows, function (row) {
                            if ((!_filterOption) || (_filtertags(row.doc))) {
                                if (oldbrand !== '') {
                                    if (row.doc.Brand !== oldbrand) {
                                        _GroupLevel1Tags.push({
                                            "id": oldbrand,
                                            "src": ((window.cordova) ? cordova.file.dataDirectory + "Images/" + lastSRNo + ".jpg" : AppUrls.imageURL + lastSRNo + ".jpg"),
                                            "tagno": oldbrand + ('( ' + count.toString() + ' )')
                                        });
                                        oldbrand = row.doc.Brand;
                                        count = 0;
                                    };
                                } else {
                                    oldbrand = row.doc.Brand;
                                    count = 0;
                                };
                                count = count + 1;
                                lastSRNo = row.doc.SRNo;
                            };
                        });
                        if (oldbrand !== '') {
                            _GroupLevel1Tags.push({
                                "id": oldbrand,
                                "src": ((window.cordova) ? cordova.file.dataDirectory + "Images/" + lastSRNo + ".jpg" : AppUrls.imageURL + lastSRNo + ".jpg"),
                                "tagno": oldbrand + ('( ' + count.toString() + ' )')
                            });
                        }
                        return _GroupLevel1Tags
                    })
            }else{
                return $q.when(_GroupLevel1Tags);
            }
        };


        function getGroupLevel2tags(brandKey) {

            
            var startbrandKey = "0" + brandKey;
            var endbrandKey = "0" + brandKey + '\uffff';

            return $q.when(_db.allDocs({
                    include_docs: true,
                    startkey: startbrandKey,
                    endkey: endbrandKey
                }))
                .then(function (docs) {
                    var JewelleryTypeGroup = [];
                    var oldJewelleryType = '';
                    var count = 0;
                    var lastSRNo;
                    lodash.each(docs.rows, function (row) {
                        if ((!_filterOption) || (_filtertags(row.doc))) {
                            if (oldJewelleryType !== '') {
                                if (row.doc.JewelleryType !== oldJewelleryType) {
                                    JewelleryTypeGroup.push({
                                        "id": oldJewelleryType,
                                        "src": ((window.cordova) ? cordova.file.dataDirectory + "Images/" + lastSRNo + ".jpg" : AppUrls.imageURL + lastSRNo + ".jpg"),
                                        "tagno": oldJewelleryType + ('( ' + count.toString() + ' )')
                                    });
                                    oldJewelleryType = row.doc.JewelleryType;
                                    count = 0;
                                };
                            } else {
                                oldJewelleryType = row.doc.JewelleryType;
                                count = 0;
                            };
                            count = count + 1;
                            lastSRNo = row.doc.SRNo;
                        };

                    });
                    if (oldJewelleryType !== '') {
                        JewelleryTypeGroup.push({
                            "id": oldJewelleryType,
                            "src": ((window.cordova) ? cordova.file.dataDirectory + "Images/" + lastSRNo + ".jpg" : AppUrls.imageURL + lastSRNo + ".jpg"),
                            "tagno": oldJewelleryType + ('( ' + count.toString() + ' )')
                        });
                    }
                    return JewelleryTypeGroup
                })
        };


        function getBottomLeveltags(brandKey, jewellerytypekey) {
            var startkey = "0" + brandKey + jewellerytypekey;
            var endkey = "0" + brandKey + jewellerytypekey + '\uffff';

            return $q.when(_db.allDocs({
                    include_docs: true,
                    startkey: startkey,
                    endkey: endkey
                }))
                .then(function (docs) {
                    var TagsGroup = [];
                    var Tag = '';
                    lodash.each(docs.rows, function (row) {
                        if ((!_filterOption) || (_filtertags(row.doc))) {
                            TagsGroup.push({
                                "id": row.doc.SRNo,
                                "src": ((window.cordova) ? cordova.file.dataDirectory + "Images/" + row.doc.SRNo + ".jpg" : AppUrls.imageURL + row.doc.SRNo + ".jpg"),
                                "tagno": row.doc.SRNo,
                                "tagInfo": row.doc
                            });
                        };
                    });
                    return TagsGroup
                })
        };


        function createIndex() {


            $q.when(_db.allDocs({
                    include_docs: true
                }))
                .then(function (docs) {

                    var brandGroup = []
                    var oldbrand = ''
                    var count = 0
                    lodash.each(docs.rows, function (row) {

                        if (oldbrand !== '') {
                            if (row.doc.Brand !== oldbrand) {
                                oldbrand = row.doc.Brand;
                                brandGroup.push({
                                    "Brand": oldbrand,
                                    "Count": count
                                });
                                count = 0;
                            };
                        } else {
                            oldbrand = row.doc.Brand;
                            count = 0;
                        }
                        count = count + 1;
                    });
                    console.log(brandGroup);
                })
        };

    }
})();



//                        var alltags = docs.rows.map(function (row) {
//                            return row.doc;
//                        });



//            var designDoc = {
//                _id: '_design/my_index',
//                views: {
//                    'my_index': {
//                        map: function (doc) {
//                            emit(doc.Brand + doc.JewelleryType + doc.SRNo, doc);
//                        }.toString()
//                    }
//                }
//            };



//            _db.get('_design/my_index').then(function (doc) {
//                return _db.remove(doc);
//            }).then(function (result) {
//                console.log('remove done')
//                return result
//            }).catch(function (err) {
//                console.log(err);
//            });

//            _db.put(designDoc).then(function (info) {
//                console.log(info);
//            }).catch(function (err) {
//                console.log(err);
//            });
//            _db.query('my_index',
//                      {
//                        reduce: '_count',
//                        group: true,
//                        group_level:1
//                      }
//                     ).then(function (result) {
//                console.log(result);
//            });



//            
//            var myIndex = {
//                _id: '_design/brand_index',
//                views: {
//                    'brand_index': {
//                        map: function (doc) {
//                            console.log(doc.Brand + doc.JewelleryType + doc.SRNo);
//                            emit(doc.Brand + doc.JewelleryType + doc.SRNo);
//                        }.toString()
//                    }
//                }
//            }
//            _db.put(myIndex).then(function () {
//                    return _db.query('brand_index', {stale: 'update_after'});
//                }).then(function () {
//                    return pouch.query('brand_index');
//                }).then(function (result) {
//                    console.log(result)
//            });