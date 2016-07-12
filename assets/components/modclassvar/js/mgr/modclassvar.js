var modclassvar = function (config) {
	config = config || {};
	modclassvar.superclass.constructor.call(this, config);
};
Ext.extend(modclassvar, Ext.Component, {
	page: {},
	window: {},
	grid: {},
	tree: {},
	panel: {},
	combo: {},
	config: {},
	view: {},
	tools: {}
});
Ext.reg('modclassvar', modclassvar);

modclassvar = new modclassvar();