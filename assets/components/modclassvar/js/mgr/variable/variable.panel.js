Ext.override(Ext.Component, {
	findParentByType: function(type){
		if (Ext.isFunction(type)){
			return this.findParentBy(function(p){
				return p instanceof type;
			});
		} else {
			return (Ext.isFunction(Ext.ComponentMgr.types[type]))?
				this.findParentByType(Ext.ComponentMgr.types[type]):
				null;
		}
	}
});


modclassvar.panel.Variable = function (config) {
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

			'<tpl if="values">',
			'{values:this.renderValues}',
			'</tpl>',

			' </tbody></table>',

			'</tpl>',
			{
				compiled: true,
				renderValues: function (value, record) {

					var values = [];
					var tmp = [];
					var pf = MODx.config['modclassvar_field_prefix'] || 'modclassvar.';
					var rx = new RegExp(pf.replace(".", ""));

					for (var i in record) {
						if (!record.hasOwnProperty(i)) {
							continue;
						}
						if (!rx.test(i)) {
							continue;
						}

						var name = i.split('.');
						name = name[1];

						switch (true) {
							case i == pf + name + '.name':
								tmp.push({name: name, title: record[i]});
								break;
							case i == pf + name && !!record[i] && typeof record[i] === 'object':
								tmp.push({name: name, value: record[i].join(', ')});
								break;
							case i == pf + name + '.value' && tmp.length == 1:
								tmp.push({name: name, value: record[i]});
								break;
						}

						if (tmp.length == 2 && tmp[0]['name'] == tmp[1]['name']) {
							if (tmp[0]['value'] && !!tmp[0]['value']) {
								values.push(String.format('<tr><td><b>{0}: </b>{1}</td></tr>',tmp[1]['title'],tmp[0]['value']));
							}
							else if (!!tmp[1]['value']) {
								values.push(String.format('<tr><td><b>{0}: </b>{1}</td></tr>',tmp[0]['title'],tmp[1]['value']));
							}
							tmp = [];
						}

					}

					return values.join('');
				}
			}
		)
	});


	this.exp.on('beforeexpand', function (rowexpander, record, body, rowIndex) {
		record['data']['json'] = record['json'];
		record['data'] = Ext.applyIf(record['data'], record['json']);
		return true;
	});


	this.sm = new Ext.grid.CheckboxSelectionModel({
		singleSelect: true,
		listeners: {
			rowselect: function(sm, rowIndex, record) {
				Ext.each(sm.grid.findParentByType('modx-tabs').findByType('modx-tabs'),function(t)
				{
					t.fireEvent('modClassVarFormReload', sm, t, rowIndex, record);
				});
			},
			selectionchange: function(sm) {
				Ext.each(sm.grid.findParentByType('modx-tabs').findByType('modx-tabs'),function(t)
				{
					t.fireEvent('modClassVarFormReload', sm, t, null, null);
				});
			}
		}
	});

	this.grid = new MODx.grid.Grid({
		url: modclassvar.config.connector_url,
		baseParams: {
			action: 'mgr/variable/getlist',
			class: config.class || 'modResource',
			cid: config.record.id || 0,
			sort: 'rank',
			dir: 'asc'
		},
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

		sm: this.sm,
		plugins: [this.exp],

		fields: this.getGridFields(config),
		columns: this.getColumns(config),
		tbar: this.getTopBar(config),
		listeners: {
			viewready: function (grid) {
				grid.getSelectionModel().selectRow(0);
			}
		},
		cls: 'modclassvar-grid',
		bodyCssClass: 'grid-with-buttons',

		getMenu:this.getMenu,
		onClick:this.onClick,
		remove:this.remove,
		setAction:this.setAction,
		_getSelectedIds: this._getSelectedIds,
	});

	this.tab = new MODx.Tabs({
		autoHeight: true,
		deferredRender: false,
		forceLayout: true,
		style: {
			'margin-top': '-28px'
		},
		cls: 'modclassvar-variable-field-tab',
		defaults: {
			autoHeight: true,
			layout: 'form',
			defaults: {anchor: '100%'},
			deferredRender: false,
			forceLayout: true,
			labelAlign: 'top'
		},
		items: [],
		listeners: {
			modClassVarFormReload: function (sm, t, rowIndex, record) {
				if (!sm) {
					t.removeAll();
					t.setActiveTab(0);
				}
				else if (t && sm.last === false) {
					t.removeAll();
					t.add({
						title: '',
						items: this.getFormField(this.config, record)
					});
					t.setActiveTab(0);
				}

				else if (t && record) {
					t.removeAll();
					t.add({
						title: '',
						items: this.getFormField(this.config, record)
					});
					t.setActiveTab(0);
				}

				if (t && record) {
					MODx.Ajax.request({
						url: modclassvar.config.connector_url,
						params: {
							action: 'mgr/variable/get',
							class: this.config.class || 'modResource',
							cid: record.json['cid'] || 0,
							key: record.json['key'] || 0,
						},
						listeners: {
							success: {
								fn: function (r) {
									var f = this.findParentByType('form');
									if (f && r.object) {
										f.getForm().setValues({modclassvar: r.object.modclassvar});
									}
								},
								scope: this
							}
						}
					});
				}
			},
			scope: this
		}
	});


	Ext.apply(config, {
		border: false,
		layout: 'column',
		cls: 'modclassvar-panel-variable',
		defaults: {msgTarget: 'under', border: false},
		items: this.getMainItems(config),
	});

	modclassvar.panel.Variable.superclass.constructor.call(this, config);
	this.addEvents('modClassVarFormReload');
};
Ext.extend(modclassvar.panel.Variable, MODx.Panel, {

	getFormField: function (config, record) {
		record = record || {json: {msg: null,cid: null}};
		record.json['actions'] = '';

		var field = [];
		var add = {
			msg: {
				html: '<p>' + _('modclassvar_combo_select') + '</p>',
				style: {
					'margin-top': '15px'
				}
			},
			cid: {
				xtype: 'numberfield',
				hidden: true
			},
			key: {
				xtype: 'textfield',
				hidden: true
			},
			type: {
				xtype: 'textfield',
				disabled: true
			}
		};

		field.push({
			xtype: 'toolbar',
			cls:'modclassvar-field-form-toolbar',
			items: [{
				cls: 'modclassvar-button-form-reset',
				text:  _('reset'),
				handler: this.resetField,
				scope: this
			},'->', {
				cls: 'modclassvar-button-form-save',
				text:  _('save'),
				handler: this.saveField,
				scope: this
			}, {
				xtype: 'spacer',
				style: 'width:1px;'
			}]
		});


		for (var item in record.json) {
			if (!record.json.hasOwnProperty(item)) {
				continue;
			}
			if (add[item]) {
				Ext.applyIf(add[item], {
					name: item,
					value: record.json[item],
				});
				field.push(add[item]);
			}
		}

		if (!record.json['type']) {
			return field;
		}

		var cnf = Ext.util.JSON.decode(record.json['config'] || '{}');

		/** */
		Ext.applyIf(cnf, {
			xtype: record.json['type'],
			class: this.config.class || 'modResource',
			cid: record.json['cid'] || 0,
			key: record.json['key'] || 0,
			name: 'modclassvar',
			hiddenName: 'modclassvar',
		});

		console.log(cnf);

		field.push(cnf);

		return field;
	},

	resetField:function (config) {

		var f = this.findParentByType('form').getForm();
		var record = f.getFieldValues();

		MODx.Ajax.request({
			url: modclassvar.config.connector_url,
			params: {
				action: 'mgr/variable/save',
				class: this.config.class || 'modResource',
				cid: record['cid'] || 0,
				key: record['key'] || 0,
				modclassvar: ''
			},
			listeners: {
				success: {
					fn: function (response) {
						f.setValues({modclassvar: ''});
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
		});

	},

	saveField: function (config) {
		var f = this.findParentByType('form').getForm();
		var record = f.getFieldValues();

		MODx.Ajax.request({
			url: modclassvar.config.connector_url,
			params: {
				action: 'mgr/variable/save',
				class: this.config.class || 'modResource',
				cid: record['cid'] || 0,
				key: record['key'] || 0,
				modclassvar: record['modclassvar']
			},
			listeners: {
				success: {
					fn: function (response) {

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
		});

	},


	getMainItems: function (config) {

		return [{
			columnWidth: 0.60,
			layout: 'fit',
			items: this.grid
		},{
			columnWidth: 0.4,
			layout: 'fit',
			items: this.tab
		}, {
			columnWidth: 1,
			layout: 'fit',
			html:"<div class='modclassvar-html-mg15'>"
		}];
	},

	getGridFields: function (config) {
		var fields = [
			'id', 'class', 'cid', 'key', 'name', 'value', 'actions'
		];

		return fields;
	},

	getColumns: function (config) {
		var columns = [this.exp, this.sm];
		var add = {
			class: {
				width: 15,
				hidden: true,
				sortable: true,
			},
			cid: {
				width: 10,
				hidden: true,
				sortable: true,
			},
			key: {
				width: 10,
				sortable: true,
			},
			name: {
				width: 15,
				sortable: true,
			},
			value: {
				width: 15,
				sortable: true,
				hidden: true,
			},
			actions: {
				width: 5,
				sortable: false,
				renderer: modclassvar.tools.renderActions,
				id: 'actions'
			}
		};

		var fields = this.getGridFields();
		for (var i = 0; i < fields.length; i++) {
			var field = fields[i];
			if (add[field]) {
				Ext.applyIf(add[field], {
					header: _('modclassvar_header_' + field),
					tooltip: _('modclassvar_tooltip_' + field),
					dataIndex: field
				});
				columns.push(add[field]);
			}
		}

		return columns;
	},

	getTopBar: function (config) {
		var tbar1 = [];
		var tbar2 = [];

		var component1 = ['toggle', 'field', 'left', 'type', 'section', 'spacer'];
		var component2 = ['tabfield'];

		var add = {
			toggle: {
				text: '<i class="icon icon-cog"></i>',
				handler: this._toggleExtra,
				scope: this
			},
			field: {
				xtype: 'panel',
				width: 200,
				layout: 'fit',
				cls: 'modclassvar-padding-fix',
				items: [{
					xtype: 'modclassvar-combo-field',
					id: 'modclassvar_option',
					name: 'option',
					emptyText: _('modclassvar_var'),
					width: 200,
					custm: true,
					clear: true,
					active: true,
					class: config.class || 'modResource',
					cid: config.record.id || 0,
					listeners: {
						select: {
							fn: this._addVariable,
							scope: this
						}
					}
				}]
			},
			/*type: {
				xtype: 'panel',
				width: 200,
				layout: 'fit',
				cls: 'modclassvar-padding-fix',
				items: [{
					xtype: 'modclassvar-combo-field-type',
					name: 'type',
					emptyText: _('modclassvar_type'),
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
			},*/

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

			tabfield:{
				xtype: 'modx-tabs',
				collapsible: true,
				collapsed: false,
				titleCollapse:true,
				defaults: {
					autoHeight: true,
					layout: 'fit',
					defaults: {anchor: '100%'},
					deferredRender: false,
					forceLayout: true,
				},
				cls: 'modclassvar-tab-field',
				items: [{
					title: _('modclassvar_field'),
					xtype: 'modclassvar-grid-field',
					listeners: {
						afterrender:{
							fn: function (field) {
								this._toggleExtra();
							},
							scope: this
						},
					},
				}]

			},
			left: '->',
			spacer: {
				xtype: 'spacer',
				width: '1px'
			}
		};

		component1.filter(function(item) {
			if (add[item]) {
				tbar1.push(add[item]);
			}
		});

		component2.filter(function(item) {
			if (add[item]) {
				tbar2.push(add[item]);
			}
		});

		var items = [];
		if (tbar1.length > 0) {
			items.push(new Ext.Toolbar(tbar1));
		}
		if (tbar2.length > 0) {
			items.push(new Ext.Panel({items:tbar2}));
		}

		return new Ext.Panel({items:items});
	},

	_toggleExtra: function () {
		Ext.each(Ext.query('.modclassvar-tab-field .x-tool-toggle', this.getEl().dom),function(t)
		{
			var o = Ext.get(t.id);
			if (o) o.dom.click();
		});
	},

	_addVariable: function(combo, row) {
		if (!row) {
			return false;
		}
		combo.reset();
		
		MODx.Ajax.request({
			url: modclassvar.config.connector_url,
			params: {
				action: 'mgr/variable/create',
				class: this.config.class || 'modResource',
				cid: this.config.record.id || 0,
				key: row.json['key'] || 0,
			},
			listeners: {
				success: {
					fn: function(r) {
						combo.getStore().reload();
						this.grid.refresh();
					},
					scope: this
				}
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
				action: 'mgr/variable/multiple',
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

	_filterByCombo: function (cb) {

		if (cb.name == 'section') {
			var comboOption = Ext.getCmp('modclassvar_option');

			if (comboOption) {
				comboOption.baseParams.section = cb.getValue();
				if (!!comboOption.pageTb) {
					comboOption.pageTb.show();
				}
				comboOption.store.load();
			}
		}

		this.grid.getStore().baseParams[cb.name] = cb.value;
		this.grid.getBottomToolbar().changePage(1);
	},

	_doSearch: function (tf) {
		this.grid.getStore().baseParams.query = tf.getValue();
		this.grid.getBottomToolbar().changePage(1);
	},

	_clearSearch: function () {
		this.grid.getStore().baseParams.query = '';
		this.grid.getBottomToolbar().changePage(1);
	},

	_getSelectedIds: function () {
		var ids = [];
		var selected = this.getSelectionModel().getSelections();

		for (var i in selected) {
			if (!selected.hasOwnProperty(i)) {
				continue;
			}

			ids.push([selected[i]['json']['class'],selected[i]['json']['cid'],selected[i]['json']['key']]);
		}
		
		return ids;
	}

});
Ext.reg('modclassvar-panel-variable', modclassvar.panel.Variable);


