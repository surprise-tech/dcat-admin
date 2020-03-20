
let actions = {
    // 刷新按钮
    refreshAction: function (Dcat) {
        $('[data-action="refresh"]').off('click').click(function () {
            Dcat.reload($(this).data('url'));
        });
    },
    // 删除按钮初始化
    deleteAction: function (Dcat) {
        let lang = Dcat.lang;

        $('[data-action="delete"]').off('click').click(function() {
            let url = $(this).data('url'),
                redirect = $(this).data('redirect');

            Dcat.confirm(lang.delete_confirm, url, function () {
                Dcat.NP.start();
                $.ajax({
                    method: 'post',
                    url: url,
                    data: {
                        _method: 'delete',
                        _token: Dcat.token,
                    },
                    success: function (data) {
                        Dcat.NP.done();
                        if (data.status) {
                            Dcat.reload(redirect);
                            Dcat.swal.success(data.message);
                        } else {
                            Dcat.swal.error(data.message);
                        }
                    }
                });
            });
        });
    },
    // 批量删除按钮初始化
    batchDeleteAction: function (Dcat) {
        $('[data-action="batch-delete"]').off('click').on('click', function() {
            let url = $(this).data('url'),
                name = $(this).data('name'),
                keys = Dcat.grid.selected(name),
                lang = Dcat.lang;

            if (! keys.length) {
                return;
            }
            Dcat.confirm(lang.delete_confirm, keys.join(', '), function () {
                Dcat.NP.start();
                $.ajax({
                    method: 'post',
                    url: url + '/' + keys.join(','),
                    data: {
                        _method: 'delete',
                        _token: Dcat.token,
                    },
                    success: function (data) {
                        Dcat.NP.done();
                        if (data.status) {
                            Dcat.reload();
                            Dcat.swal.success(data.message);
                        } else {
                            Dcat.swal.error(data.message);
                        }
                    }
                });
            });
        });
    },

    // 图片预览
    imagePreview: function (Dcat) {
        $('[data-action="preview"]').off('click').click(function () {
            return Dcat.previewImage($(this).attr('src'));
        });
    },

    popover: function () {
        $('.popover').remove();

        $('[data-action="popover"]').popover();
    },

    // box-collapse
    boxActions: function () {
        $('.box [data-action="collapse"]').click(function (e) {
            e.preventDefault();

            $(this).find('i').toggleClass('icon-minus icon-plus');

            $(this).closest('.box').find('.box-body').first().collapse("toggle");
        });

        // Close box
        $('.box [data-action="remove"]').click(function () {
            $(this).closest(".box").removeClass().slideUp("fast");
        });
    }

};

export default class DataActions {
    constructor(Dcat) {
        for (let name in actions) {
            actions[name](Dcat)
        }
    }
}
