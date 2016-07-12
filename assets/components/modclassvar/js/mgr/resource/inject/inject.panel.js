modclassvar.panel.ResourceInject = function(config) {
    config = config || {};

    if (!config.update) {
        config.update = false;
    }

    Ext.apply(config, {
		id: 'modclassvar-panel-resource-inject',
		cls: 'modclassvar-panel-resource-inject',
		bodyCssClass: 'main-wrapper',
        forceLayout: true,
        deferredRender: false,
        autoHeight: true,
        border: false,
        items: this.getMainItems(config)
    });

	modclassvar.panel.ResourceInject.superclass.constructor.call(this, config);
};
Ext.extend(modclassvar.panel.ResourceInject, MODx.Panel, {

    getMainItems: function (config) {
		return [{
			xtype       : 'panel',
			layout      : 'fit',
			items :[{
				xtype: 'modclassvar-panel-variable',
				class: 'modResource',
				record: modclassvar.config.resource
			}]
		}];
    }

});

Ext.reg('modclassvar-panel-resource-inject', modclassvar.panel.ResourceInject);

