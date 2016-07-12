modclassvar.grid.Field = function (config) {
	config = config || {};

	this.exp = new Ext.grid.RowExpander({
		expandOnDblClick: false,
		enableCaching: false,
		tpl: new Ext.XTemplate(
			'<tpl for=".">',

			'<table class="modclassvar-expander"><tbody>',

			'<tpl if="description">',
			'<tr>',
			'<td><b>' + _('modclassvar_description') + ': </b>{description}</td>',
			'</tr>',
			'</tpl>',

			' </tbody></table>',

			'</tpl>',
			{
				compiled: true,
			}
		),
		renderer : function(v, p, record){
			return !!record.json['description'] ? '<div class="x-grid3-row-expander">&#160;</div>' : '&#160;';
		}
});

	this.exp.on('beforeexpand', function (rowexpander, record, body, rowIndex) {
		record['data']['json'] = record['json'];
		record['data'] = Ext.applyIf(record['data'], record['json']);
		return true;
	});

	this.dd = function (grid) {
		this.dropTarget = new Ext.dd.DropTarget(grid.container, {
			ddGroup: 'dd',
			copy: false,
			notifyDrop: function (dd, e, data) {
				var store = grid.store.data.items;
				var target = store[dd.getDragData(e).rowIndex].id;
				var source = store[data.rowIndex].id;
				if (target != source) {
					dd.el.mask(_('loading'), 'x-mask-loading');
					MODx.Ajax.request({
						url: modclassvar.config.connector_url,
						params: {
							action: config.action || 'mgr/field/sort',
							source: source,
							target: target
						},
						listeners: {
							success: {
								fn: function (r) {
									dd.el.unmask();
									grid.refresh();
								},
								scope: grid
							},
							failure: {
								fn: function (r) {
									dd.el.unmask();
								},
								scope: grid
							}
						}
					});
				}
			}
		});
	};

	this.sm = new Ext.grid.CheckboxSelectionModel();

	Ext.applyIf(config, {
		id: 'modclassvar-grid-field',
		url: modclassvar.config.connector_url,
		baseParams: {
			action: 'mgr/field/getlist',
			sort: 'rank',
			dir: 'asc'
		},
		save_action: 'mgr/field/updatefromgrid',
		autosave: true,
		save_callback: this._updateRow,
		fields: this.getFields(config),
		columns: this.getColumns(config),
		tbar: this.getTopBar(config),
		listeners: this.getListeners(config),

		sm: this.sm,
		plugins: [this.exp],

		ddGroup: 'dd',
		enableDragDrop: true,

		paging: true,
		pageSize: 10,
		remoteSort: true,
		viewConfig: {
			forceFit: true,
			enableRowBody: true,
			autoFill: true,
			showPreview: true,
			scrollOffset: 0
		},
		autoHeight: true,
		cls: 'modclassvar-grid',
		bodyCssClass: 'grid-with-buttons',
		stateful: false,
	});
	modclassvar.grid.Field.superclass.constructor.call(this, config);
	this.exp.addEvents('beforeexpand', 'beforecollapse');


};
Ext.extend(modclassvar.grid.Field, MODx.grid.Grid, {
	windows: {},

	getFields: function (config) {
		var fields = modclassvar.config.grid_field_fields;

		return fields;
	},

	getTopBar: function (config) {
		var tbar = [];

		var component = ['menu', 'update', 'left', 'search', 'bigspacer', 'section', 'spacer'];

		var add = {
			menu: {
				text: '<i class="icon icon-cogs"></i> ',
				menu: [{
					text: '<i class="icon icon-plus"></i> ' + _('modclassvar_action_create'),
					cls: 'modclassvar-cogs',
					handler: this.create,
					scope: this
				}, {
					text: '<i class="icon icon-trash-o red"></i> ' + _('modclassvar_action_remove'),
					cls: 'modclassvar-cogs',
					handler: this.remove,
					scope: this
				}, '-', {
					text: '<i class="icon icon-toggle-on green"></i> ' + _('modclassvar_action_turnon'),
					cls: 'modclassvar-cogs',
					handler: this.active,
					scope: this
				}, {
					text: '<i class="icon icon-toggle-off red"></i> ' + _('modclassvar_action_turnoff'),
					cls: 'modclassvar-cogs',
					handler: this.inactive,
					scope: this
				}]
			},
			update: {
				text: '<i class="icon icon-refresh"></i>',
				handler: this._updateRow,
				scope: this
			},
			left: '->',

			search: {
				xtype: 'panel',
				width: 200,
				layout: 'fit',
				cls: 'modclassvar-padding-fix',
				items: [{
					xtype: 'modclassvar-field-search',
					width: 190,
					listeners: {
						search: {
							fn: function (field) {
								this._doSearch(field);
							},
							scope: this
						},
						clear: {
							fn: function (field) {
								field.setValue('');
								this._clearSearch();
							},
							scope: this
						}
					}
				}]
			},

			section: {
				xtype: 'panel',
				width: 200,
				layout: 'fit',
				cls: 'modclassvar-padding-fix',
				items: [{
					xtype: 'modclassvar-combo-section',
					name: 'section',
					emptyText: _('modclassvar_section'),
					width: 200,
					custm: true,
					clear: true,
					addall: true,
					value: '',
					listeners: {
						select: {
							fn: this._filterByCombo,
							scope: this
						},
						afterrender: {
							fn: this._filterByCombo,
							scope: this
						}
					}
				}]
			},

			bigspacer: {
				xtype: 'spacer',
				style: 'width:5px;'
			},

			spacer: {
				xtype: 'spacer',
				style: 'width:1px;'
			}
		};

		component.filter(function (item) {
			if (add[item]) {
				tbar.push(add[item]);
			}
		});

		var items = [];
		if (tbar.length > 0) {
			items.push(new Ext.Toolbar(tbar));
		}

		return new Ext.Panel({items: items});
	},

	getColumns: function (config) {
		var columns = [this.exp, this.sm];
		var add = {
			id: {
				width: 5,
				hidden: true,
			},
			key: {
				width: 10,
				sortable: true,
				editor: {
					xtype: 'textfield',
					allowBlank: false
				}
			},
			type: {
				width: 20,
				sortable: true,
				editor: {
					xtype: 'modclassvar-combo-field-type',
					fieldLabel: _('modclassvar_type'),
					name: 'type',
					custm: true,
					clear: true,
					allowBlank: false
				}
			},
			name: {
				width: 10,
				sortable: true,
				editor: {
					xtype: 'textfield',
					allowBlank: false
				}
			},
			unit: {
				width: 10,
				sortable: true,
				hidden: true,
				editor: {
					xtype: 'textfield',
					allowBlank: true
				}
			},
			actions: {
				width: 10,
				sortable: false,
				id: 'actions',
				renderer: modclassvar.tools.renderActions,

			}
		};

		var fields = this.getFields();
		fields.filter(function (field) {
			if (add[field]) {
				Ext.applyIf(add[field], {
					header: _('modclassvar_header_' + field),
					tooltip: _('modclassvar_tooltip_' + field),
					dataIndex: field
				});
				columns.push(add[field]);
			}
		});

		return columns;
	},

	getListeners: function (config) {
		return Ext.applyIf(config.listeners, {
			render: {
				fn: this.dd,
				scope: this
			}
		});
	},

	getMenu: function (grid, rowIndex) {
		var ids = this._getSelectedIds();
		var row = grid.getStore().getAt(rowIndex);
		var menu = modclassvar.tools.getMenu(row.data['actions'], this, ids);
		this.addContextMenuItem(menu);
	},

	onClick: function(e) {
		var elem = e.getTarget();
		if (elem.nodeName == 'BUTTON') {
			var row = this.getSelectionModel().getSelected();
			if (typeof(row) != 'undefined') {
				var action = elem.getAttribute('action');
				if (action == 'showMenu') {
					var ri = this.getStore().find('id', row.id);
					return this._showMenu(this, ri, e);
				} else if (typeof this[action] === 'function') {
					this.menu.record = row.data;
					return this[action](this, e);
				}
			}
		}
		return this.processEvent('click', e);
	},

	setAction: function (method, field, value) {
		var ids = this._getSelectedIds();
		if (!ids.length && (field !== 'false')) {
			return false;
		}
		MODx.Ajax.request({
			url: modclassvar.config.connector_url,
			params: {
				action: 'mgr/field/multiple',
				method: method,
				field_name: field,
				field_value: value,
				ids: Ext.util.JSON.encode(ids)
			},
			listeners: {
				success: {
					fn: function () {
						this.refresh();
					},
					scope: this
				},
				failure: {
					fn: function (response) {
						MODx.msg.alert(_('error'), response.message);
					},
					scope: this
				}
			}
		})
	},

	remove: function () {
		Ext.MessageBox.confirm(
			_('modclassvar_action_remove'),
			_('modclassvar_confirm_remove'),
			function (val) {
				if (val == 'yes') {
					this.setAction('remove');
				}
			},
			this
		);
	},


	active: function (btn, e) {
		this.setAction('setproperty', 'active', 1);
	},

	inactive: function (btn, e) {
		this.setAction('setproperty', 'active', 0);
	},

	create: function (btn, e) {
		var record = {
			active: 1
		};

		var w = MODx.load({
			xtype: 'modclassvar-window-field-update',
			action: 'mgr/field/create',
			record: record,
			class: this.config.class,
			listeners: {
				success: {
					fn: function () {
						this.refresh();
					}, scope: this
				}
			}
		});
		w.reset();
		w.setValues(record);
		w.show(e.target);
	},

	update: function (btn, e, row) {
		if (typeof(row) != 'undefined') {
			this.menu.record = row.data;
		}
		else if (!this.menu.record) {
			return false;
		}
		var id = this.menu.record.id;
		MODx.Ajax.request({
			url: this.config.url,
			params: {
				action: 'mgr/field/get',
				id: id
			},
			listeners: {
				success: {
					fn: function (r) {
						var record = r.object;
						var w = MODx.load({
							xtype: 'modclassvar-window-field-update',
							title: _('modclassvar_action_update'),
							action: 'mgr/field/update',
							record: record,
							update: true,
							listeners: {
								success: {
									fn: this.refresh,
									scope: this
								}
							}
						});
						w.reset();
						w.setValues(record);
						w.show(e.target);
					}, scope: this
				}
			}
		});
	},

	_filterByCombo: function (cb) {
		this.getStore().baseParams[cb.name] = cb.value;
		this.getBottomToolbar().changePage(1);
	},

	_doSearch: function (tf) {
		this.getStore().baseParams.query = tf.getValue();
		this.getBottomToolbar().changePage(1);
	},

	_clearSearch: function () {
		this.getStore().baseParams.query = '';
		this.getBottomToolbar().changePage(1);
	},

	_updateRow: function () {
		this.refresh();
	},

	_getSelectedIds: function () {
		var ids = [];
		var selected = this.getSelectionModel().getSelections();

		for (var i in selected) {
			if (!selected.hasOwnProperty(i)) {
				continue;
			}
			ids.push(selected[i]['id']);
		}

		return ids;
	}

});
Ext.reg('modclassvar-grid-field', modclassvar.grid.Field);
