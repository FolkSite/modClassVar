modclassvar.panel.UserInject = function (config) {
	config = config || {};

	if (!config.update) {
		config.update = false;
	}

	Ext.apply(config, {
		id: 'modclassvar-panel-user-inject',
		cls: 'modclassvar-panel-user-inject',
		bodyCssClass: 'main-wrapper',
		forceLayout: true,
		deferredRender: false,
		autoHeight: true,
		border: false,
		items: this.getMainItems(config)
	});

	modclassvar.panel.UserInject.superclass.constructor.call(this, config);
};
Ext.extend(modclassvar.panel.UserInject, MODx.Panel, {

	getMainItems: function (config) {
		return [{
			xtype: 'panel',
			layout: 'fit',
			items: [{
				xtype: 'modclassvar-panel-variable',
				class: 'modUser',
				record: modclassvar.config.user
			}]
		}];
	}

});

Ext.reg('modclassvar-panel-user-inject', modclassvar.panel.UserInject);

