/**
 * User: meimeibw
 */

!function($){
    var MMGrid = function (element, options) {
        this._id = (((1 + Math.random()) * 0x10000) | 0).toString(16);
        this.opts = options;
        this._initLayout($(element));
        this._initHead();
        this._initOptions();
        this._initEvents();
        this._populate(options.items);
    };

    MMGrid.prototype = {
        _initLayout: function($el){
            var $elParent = $el.parent();
            var elIndex = $el.index();

            var mmGrid = [
                '<div class="mmGrid">',
                    '<style></style>',
                    '<div class="mmg-headWrapper">',
                        '<table class="mmg-head"></table>',
                        '<div class="mmg-colResizePointer"></div>',
                    '</div>',
                    '<div class="mmg-backboard">',
                        '<a class="mmg-btnBackboardUp"></a>',
                    '</div>',
                    '<div class="mmg-bodyWrapper">',
                        '<a class="mmg-btnBackboardDn"></a>',
                        '<div class="mmg-noData">'+ this.opts.noDataText +'</div>',
                    '</div>',
                    '<div class="mmg-mask mmg-transparent"></div>',
                    '<div class="mmg-loading">',
                        '<div class="mmg-loadingImg"></div>',
                        '<div class="mmg-loadingText">'+ this.opts.loadingText +'</div>',
                    '</div>',

                '</div>'
            ];

            //cached object
            var $mmGrid = $(mmGrid.join(''));
            this.$mmGrid = $mmGrid;
            this.$style = $mmGrid.find('style');
            this.$headWrapper = $mmGrid.find('.mmg-headWrapper');
            this.$head = $mmGrid.find('.mmg-head');
            this.$backboard = $mmGrid.find('.mmg-backboard');
            this.$bodyWrapper = $mmGrid.find('.mmg-bodyWrapper');
            this.$body = $el.addClass('mmg-body').empty()
                .html('<tbody><td style="border: 0px;background: none;">&nbsp;</td></tbody>')
                .appendTo(this.$bodyWrapper);

            //放回原位置
            if(elIndex === 0 || $elParent.children().length == 0){
                $elParent.prepend(this.$mmGrid);
            }else{
                $elParent.children().eq(elIndex-1).after(this.$mmGrid);
            }

            var opts = this.opts;
            $mmGrid.width(opts.width);
            if(!opts.fitRows){
                $mmGrid.height(opts.height);
            }

        }

        , _initHead: function(){
            var opts = this.opts;
            var $head = this.$head;

            if(opts.cols){
                var theadHtmls = ['<thead>'];

                for(var colIndex=0; colIndex< opts.cols.length; colIndex++){
                    var col = opts.cols[colIndex];
                    theadHtmls.push('<th class="');
                    theadHtmls.push(this._genColClass(colIndex));
                    theadHtmls.push(' nowrap">');
                    theadHtmls.push('<div class="mmg-titleWrapper" >');
                    theadHtmls.push('<span class="mmg-title ');
                    if(col.sortable) theadHtmls.push('mmg-canSort ');
                    theadHtmls.push('">');
                    theadHtmls.push(col.title);
                    theadHtmls.push('</span><div class="mmg-sort"></div>');
                    if(!col.lockWidth) theadHtmls.push('<div class="mmg-colResize"></div>');
                    theadHtmls.push('</div></th>');
                }

                theadHtmls.push('</thead>');
                $head.html(theadHtmls.join(''));
            }

        }

        , _initOptions: function(){

        }

        , _initEvents: function(){

        }
        , _populate: function(items){
            var opts = this.opts;
            var $body = this.$body;

            if(items && items.length !== 0 && opts.cols){
                var tbodyHtmls = [];
                tbodyHtmls.push('<tbody>');
                for(var rowIndex=0; rowIndex < items.length; rowIndex++){
                    var item = items[rowIndex];

                    tbodyHtmls.push('<tr data-rowIndex="');
                    tbodyHtmls.push(rowIndex);
                    tbodyHtmls.push('">');
                    for(var colIndex=0; colIndex < opts.cols.length; colIndex++){
                        var col = opts.cols[colIndex];
                        tbodyHtmls.push('<td class="');
                        tbodyHtmls.push(this._genColClass(colIndex));
                        if(opts.nowrap){
                            tbodyHtmls.push(' nowrap');
                        }
                        tbodyHtmls.push('"><span class="');
                        if(opts.nowrap){
                            tbodyHtmls.push('nowrap');
                        }
                        tbodyHtmls.push('">');
                        if(col.renderer){
                            tbodyHtmls.push(col.renderer(item[col.name],item,items,rowIndex));
                        }else{
                            tbodyHtmls.push(item[col.name]);
                        }

                        tbodyHtmls.push('</span></td>');
                    };
                    tbodyHtmls.push('</tr>');
                };
                tbodyHtmls.push('</tbody>');
                $body.empty().html(tbodyHtmls.join(''));
                var $trs = $body.find('tr');
                for(var rowIndex=0; rowIndex < items.length; rowIndex++){
                    $.data($trs.eq(rowIndex)[0],'item',items[rowIndex]);
                }
            }else{
                $body.empty().html('<tbody><td style="border: 0px;background: none;">&nbsp;</td></tbody>');
            }
        }

        /* 生成列类 */
        , _genColClass: function(colIndex){
            return 'mmg'+ this._id +'-col'+colIndex;
        }
    };

    $.fn.mmGrid = function(){
        if(arguments.length === 0 || typeof arguments[0] === 'object'){
            var option = arguments[0];
            return this.each(function(){
                var $this = $(this)
                    , data = $this.data('mmGrid')
                    , options = $.extend(true, {}, $.fn.mmGrid.defaults, option);
                if (!data) $this.data('mmGrid', new MMGrid(this, options))
            });
        }
        if(typeof arguments[0] === 'string'){
            var data = $(this).data('mmGrid');
            var func =  data[arguments[0]];
            if(func){
                return func.apply(data,arguments.slice(1));
            }
        }
    };

    $.fn.mmGrid.defaults = {
        width: 'auto'
        , height: '280px'
        , cols: []
        , items: []
        , loadingText: '正在载入...'
        , noDataText: '没有数据'
        , fitCols: false
        , fitRows: false
    };

    $.fn.mmGrid.Constructor = MMGrid;

}(window.jQuery);