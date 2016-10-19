Ext.namespace('modclassvar.combo');


modclassvar.combo.Search = function (config) {
	config = config || {};
	Ext.applyIf(config, {
		xtype: 'twintrigger',
		ctCls: 'x-field-search',
		allowBlank: true,
		msgTarget: 'under',
		emptyText: _('search'),
		name: 'query',
		triggerAction: 'all',
		clearBtnCls: 'x-field-search-clear',
		searchBtnCls: 'x-field-search-go',
		onTrigger1Click: this._triggerSearch,
		onTrigger2Click: this._triggerClear
	});
	modclassvar.combo.Search.superclass.constructor.call(this, config);
	this.on('render', function () {
		this.getEl().addKeyListener(Ext.EventObject.ENTER, function () {
			this._triggerSearch();
		}, this);
	});
	this.addEvents('clear', 'search');
};
Ext.extend(modclassvar.combo.Search, Ext.form.TwinTriggerField, {

	initComponent: function () {
		Ext.form.TwinTriggerField.superclass.initComponent.call(this);
		this.triggerConfig = {
			tag: 'span',
			cls: 'x-field-search-btns',
			cn: [{
				tag: 'div',
				cls: 'x-form-trigger ' + this.searchBtnCls
			}, {
				tag: 'div',
				cls: 'x-form-trigger ' + this.clearBtnCls
			}]
		};
	},

	_triggerSearch: function () {
		this.fireEvent('search', this);
	},

	_triggerClear: function () {
		this.fireEvent('clear', this);
	}

});
Ext.reg('modclassvar-field-search', modclassvar.combo.Search);


modclassvar.combo.Field = function (config) {
	config = config || {};

	if (config.custm) {
		config.triggerConfig = [{
			tag: 'div',
			cls: 'x-field-search-btns',
			style: String.format('width: {0}px;', config.clear ? 62 : 31),
			cn: [{
				tag: 'div',
				cls: 'x-form-trigger x-field-modclassvar-field-go'
			}]
		}];
		if (config.clear) {
			config.triggerConfig[0].cn.push({
				tag: 'div',
				cls: 'x-form-trigger x-field-modclassvar-field-clear'
			});
		}
		config.initTrigger = function () {
			var ts = this.trigger.select('.x-form-trigger', true);
			this.wrap.setStyle('overflow', 'hidden');
			var triggerField = this;
			ts.each(function (t, all, index) {
				t.hide = function () {
					var w = triggerField.wrap.getWidth();
					this.dom.style.display = 'none';
					triggerField.el.setWidth(w - triggerField.trigger.getWidth());
				};
				t.show = function () {
					var w = triggerField.wrap.getWidth();
					this.dom.style.display = '';
					triggerField.el.setWidth(w - triggerField.trigger.getWidth());
				};
				var triggerIndex = 'Trigger' + (index + 1);

				if (this['hide' + triggerIndex]) {
					t.dom.style.display = 'none';
				}
				t.on('click', this['on' + triggerIndex + 'Click'], this, {
					preventDefault: true
				});
				t.addClassOnOver('x-form-trigger-over');
				t.addClassOnClick('x-form-trigger-click');
			}, this);
			this.triggers = ts.elements;
		};
	}
	Ext.applyIf(config, {
		name: config.name || 'option',
		hiddenName: config.name || 'option',
		displayField: 'name',
		valueField: 'id',
		editable: true,
		fields: ['id', 'key', 'name', 'section_name'],
		pageSize: 10,
		emptyText: _('modclassvar_combo_select'),
		hideMode: 'offsets',
		url: modclassvar.config.connector_url,
		baseParams: {
			action: 'mgr/field/getlist',
			combo: true,
			addall: config.addall || 0,
			novalue: config.novalue || 0,
			active: config.active || '',
			class: config.class || '',
			cid: config.cid || 0,
		},
		tpl: new Ext.XTemplate(
			'<tpl for="."><div class="x-combo-list-item">',
			'<b>{key}</b> ',
			'<tpl if="name">',
			'<small>{name}</small>',
			'</tpl>',
			'<tpl if="section_name">',
			'<br/><small>({section_name})</small> ',
			'</tpl>',
			'</div></tpl>',
			{
				compiled: true
			}),
		cls: 'input-combo-modclassvar-field',
		clearValue: function () {
			if (this.hiddenField) {
				this.hiddenField.value = '';
			}
			this.setRawValue('');
			this.lastSelectionText = '';
			this.applyEmptyText();
			this.value = '';
			this.fireEvent('select', this, null, 0);
			this.getStore().reload();

			if(!!this.pageTb) {
				this.pageTb.show();
			}
		},

		getTrigger: function (index) {
			return this.triggers[index];
		},

		onTrigger1Click: function () {
			this.onTriggerClick();
		},

		onTrigger2Click: function () {
			this.clearValue();
		}
	});
	modclassvar.combo.Field.superclass.constructor.call(this, config);
};
Ext.extend(modclassvar.combo.Field, MODx.combo.ComboBox);
Ext.reg('modclassvar-combo-field', modclassvar.combo.Field);


modclassvar.combo.FieldType = function (config) {
	config = config || {};

	if (!config.data) {
		config.data = JSON.parse(
			MODx.config['modclassvar_option_types'] ||
			[
				'[' +
				'{"type":"textfield"}',
				'{"type":"numberfield"}',
				'{"type":"textarea"}',
				'{"type":"modx-combo-boolean"}',
				'{"type":"modx-combo-user"}',
				'{"type":"modclassvar-combo-chunk"}',
				'{"type":"modclassvar-combo-user"}',
				'{"type":"modclassvar-combo-users"}',
				'{"type":"modclassvar-combo-autocomplete"}',
				'{"type":"modclassvar-combo-option"}',
				'{"type":"modclassvar-combo-datetime"}',
				'{"type":"modclassvar-combo-file"}',
				'{"type":"modclassvar-combo-resource"}',
				'{"type":"modclassvar-combo-resources"}',
				'{"type":"modclassvar-combo-ymaps-place"}',
				'{"type":"modclassvar-combo-gmaps-place"}' +
				']'

			].join(',')
		);
	}

	if (config.custm) {
		config.triggerConfig = [{
			tag: 'div',
			cls: 'x-field-search-btns',
			style: String.format('width: {0}px;', config.clear ? 62 : 31),
			cn: [{
				tag: 'div',
				cls: 'x-form-trigger x-field-modclassvar-field-type-go'
			}]
		}];
		if (config.clear) {
			config.triggerConfig[0].cn.push({
				tag: 'div',
				cls: 'x-form-trigger x-field-modclassvar-field-type-clear'
			});
		}

		config.initTrigger = function () {
			var ts = this.trigger.select('.x-form-trigger', true);
			this.wrap.setStyle('overflow', 'hidden');
			var triggerField = this;
			ts.each(function (t, all, index) {
				t.hide = function () {
					var w = triggerField.wrap.getWidth();
					this.dom.style.display = 'none';
					triggerField.el.setWidth(w - triggerField.trigger.getWidth());
				};
				t.show = function () {
					var w = triggerField.wrap.getWidth();
					this.dom.style.display = '';
					triggerField.el.setWidth(w - triggerField.trigger.getWidth());
				};
				var triggerIndex = 'Trigger' + (index + 1);

				if (this['hide' + triggerIndex]) {
					t.dom.style.display = 'none';
				}
				t.on('click', this['on' + triggerIndex + 'Click'], this, {
					preventDefault: true
				});
				t.addClassOnOver('x-form-trigger-over');
				t.addClassOnClick('x-form-trigger-click');
			}, this);
			this.triggers = ts.elements;
		};
	}


	Ext.applyIf(config, {
		name: config.name || 'type',
		hiddenName: config.name || 'type',
		displayField: config.displayField || 'type',
		valueField: config.valueField || 'type',
		editable: false,
		mode: 'local',
		fields: ['type'],
		pageSize: 20,
		emptyText: _('modclassvar_combo_select'),
		hideMode: 'offsets',

		store: new Ext.data.JsonStore({
			data: config.data,
			fields: ['type']
		}),
		value: config.data[0] ? config.data[0] : '',

		tpl: new Ext.XTemplate(
			'<tpl for="."><div class="x-combo-list-item">',
			'<b>{type}</b><br/><small>{type:this.renderType}</small>',
			'</div></tpl>',
			{
				compiled: true,
				renderType: function (value, record) {
					return _('modclassvar_tooltip_type_' + value) || value;
				}
			}),
		cls: 'input-combo-modclassvar-field-type',
		clearValue: function () {
			if (this.hiddenField) {
				this.hiddenField.value = '';
			}
			this.setRawValue('');
			this.lastSelectionText = '';
			this.applyEmptyText();
			this.value = '';
			this.fireEvent('select', this, null, 0);
		},

		getTrigger: function (index) {
			return this.triggers[index];
		},

		onTrigger1Click: function () {
			this.onTriggerClick();
		},

		onTrigger2Click: function () {
			this.clearValue();
		}
	});
	modclassvar.combo.FieldType.superclass.constructor.call(this, config);
};
Ext.extend(modclassvar.combo.FieldType, MODx.combo.ComboBox);
Ext.reg('modclassvar-combo-field-type', modclassvar.combo.FieldType);



modclassvar.combo.FieldSection = function(config) {
	config = config || {};

	Ext.applyIf(config, {
		xtype: 'superboxselect',
		name: config.name || 'section',
		displayField: config.displayField || 'name',
		valueField: config.valueField || 'name',
		minChars: config.minChars || 1,
		valueDelimiter: config.valueDelimiter || '||',

		forceFormValue: false,
		forceSameValueQuery: true,
		allowBlank: true,
		allowAddNewData: true,
		addNewDataOnBlur: true,
		pinList: false,
		resizable: true,
		anchor: '100%',
		msgTarget: 'under',

		store: new Ext.data.JsonStore({
			root: 'results',
			autoLoad: false,
			autoSave: false,
			totalProperty: 'total',
			fields: ['name'],
			url: modclassvar.config.connector_url,
			baseParams: {
				action: 'mgr/section/getlist',
				combo: true,
				fid: config.fid || 0,
				addall: config.addall || 0,
			}
		}),

		mode: 'remote',
		triggerAction: 'all',
		extraItemCls: 'x-tag',
		expandBtnCls: 'x-form-trigger',
		clearBtnCls: 'x-form-trigger',

		queryValuesDelimiter: '|',
		listeners: {
			additem: function(bs, v) {
				MODx.Ajax.request({
					url: modclassvar.config.connector_url,
					params: {
						action: 'mgr/section/update',
						mode: 'add',
						fid: config.fid || 0,
						name: v,
					},
					listeners: {
						success: {
							fn: function() {
							},
							scope: this
						}
					}
				});
			},
			removeitem: function(bs, v) {
				MODx.Ajax.request({
					url: modclassvar.config.connector_url,
					params: {
						action: 'mgr/section/update',
						mode: 'remove',
						fid: config.fid || 0,
						name: v,
					},
					listeners: {
						success: {
							fn: function() {
							},
							scope: this
						}
					}
				});
			},
			clear: function(bs, v) {
				MODx.Ajax.request({
					url: modclassvar.config.connector_url,
					params: {
						action: 'mgr/section/remove',
						package: config.package,
						fid: config.fid || 0,
					},
					listeners: {
						success: {
							fn: function() {
							},
							scope: this
						}
					}
				});
			}
		}
	});
	modclassvar.combo.FieldSection.superclass.constructor.call(this, config);
};
Ext.extend(modclassvar.combo.FieldSection, Ext.ux.form.SuperBoxSelect, {
	setupFormInterception: function () {

	}
});
Ext.reg('modclassvar-combo-field-section', modclassvar.combo.FieldSection);


modclassvar.combo.Section = function (config) {
	config = config || {};

	if (config.custm) {
		config.triggerConfig = [{
			tag: 'div',
			cls: 'x-field-search-btns',
			style: String.format('width: {0}px;', config.clear ? 62 : 31),
			cn: [{
				tag: 'div',
				cls: 'x-form-trigger x-field-modclassvar-section-go'
			}]
		}];
		if (config.clear) {
			config.triggerConfig[0].cn.push({
				tag: 'div',
				cls: 'x-form-trigger x-field-modclassvar-section-clear'
			});
		}
		config.initTrigger = function () {
			var ts = this.trigger.select('.x-form-trigger', true);
			this.wrap.setStyle('overflow', 'hidden');
			var triggerField = this;
			ts.each(function (t, all, index) {
				t.hide = function () {
					var w = triggerField.wrap.getWidth();
					this.dom.style.display = 'none';
					triggerField.el.setWidth(w - triggerField.trigger.getWidth());
				};
				t.show = function () {
					var w = triggerField.wrap.getWidth();
					this.dom.style.display = '';
					triggerField.el.setWidth(w - triggerField.trigger.getWidth());
				};
				var triggerIndex = 'Trigger' + (index + 1);

				if (this['hide' + triggerIndex]) {
					t.dom.style.display = 'none';
				}
				t.on('click', this['on' + triggerIndex + 'Click'], this, {
					preventDefault: true
				});
				t.addClassOnOver('x-form-trigger-over');
				t.addClassOnClick('x-form-trigger-click');
			}, this);
			this.triggers = ts.elements;
		};
	}
	Ext.applyIf(config, {
		name: config.name || 'section',
		hiddenName: config.name || 'section',
		displayField: 'name',
		valueField: 'id',
		editable: true,
		fields: ['id', 'name'],
		pageSize: 10,
		emptyText: _('modclassvar_combo_select'),
		hideMode: 'offsets',
		url: modclassvar.config.connector_url,
		baseParams: {
			action: 'mgr/section/getlist',
			combo: true,
			addall: config.addall || 0,
			novalue: config.novalue || 0,
		},

		cls: 'input-combo-modclassvar-section',
		clearValue: function () {
			if (this.hiddenField) {
				this.hiddenField.value = '';
			}
			this.setRawValue('');
			this.lastSelectionText = '';
			this.applyEmptyText();
			this.value = '';
			this.fireEvent('select', this, null, 0);
			this.getStore().reload();

			if(!!this.pageTb) {
				this.pageTb.show();
			}
		},

		getTrigger: function (index) {
			return this.triggers[index];
		},

		onTrigger1Click: function () {
			this.onTriggerClick();
		},

		onTrigger2Click: function () {
			this.clearValue();
		}
	});
	
	modclassvar.combo.Section.superclass.constructor.call(this, config);
};
Ext.extend(modclassvar.combo.Section, MODx.combo.ComboBox);
Ext.reg('modclassvar-combo-section', modclassvar.combo.Section);


/**************************************************************/


modclassvar.combo.DateTime = function (config) {
	config = config || {};

	Ext.applyIf(config, {
		name: config.name || 'datetime',
		hiddenName: config.name || 'datetime',
		timePosition: 'right',
		allowBlank: config.allowBlank || true,
		hiddenFormat: 'Y-m-d H:i:s',
		dateFormat: MODx.config.manager_date_format,
		timeFormat: MODx.config.manager_time_format,
		dateWidth: 100,
		timeWidth: 100,
		cls: 'date-combo',
		ctCls: 'date-combo'
	});

	modclassvar.combo.DateTime.superclass.constructor.call(this, config);

};
Ext.extend(modclassvar.combo.DateTime, Ext.ux.form.DateTime, {});
Ext.reg('modclassvar-combo-datetime', modclassvar.combo.DateTime);


modclassvar.combo.AutoComplete = function (config) {
	config = config || {};

	if (config.custm) {
		config.triggerConfig = [{
			tag: 'div',
			cls: 'x-field-search-btns',
			style: String.format('width: {0}px;', config.clear ? 62 : 31),
			cn: [{
				tag: 'div',
				cls: 'x-form-trigger x-field-modclassvar-autocomplete-go'
			}]
		}];
		if (config.clear) {
			config.triggerConfig[0].cn.push({
				tag: 'div',
				cls: 'x-form-trigger x-field-modclassvar-autocomplete-clear'
			});
		}

		config.initTrigger = function () {
			var ts = this.trigger.select('.x-form-trigger', true);
			this.wrap.setStyle('overflow', 'hidden');
			var triggerField = this;
			ts.each(function (t, all, index) {
				t.hide = function () {
					var w = triggerField.wrap.getWidth();
					this.dom.style.display = 'none';
					triggerField.el.setWidth(w - triggerField.trigger.getWidth());
				};
				t.show = function () {
					var w = triggerField.wrap.getWidth();
					this.dom.style.display = '';
					triggerField.el.setWidth(w - triggerField.trigger.getWidth());
				};
				var triggerIndex = 'Trigger' + (index + 1);

				if (this['hide' + triggerIndex]) {
					t.dom.style.display = 'none';
				}
				t.on('click', this['on' + triggerIndex + 'Click'], this, {
					preventDefault: true
				});
				t.addClassOnOver('x-form-trigger-over');
				t.addClassOnClick('x-form-trigger-click');
			}, this);
			this.triggers = ts.elements;
		};
	}
	Ext.applyIf(config, {
		name: config.name || 'autocomplete',
		hiddenName: config.name || 'autocomplete',
		displayField: 'value',
		valueField: 'value',
		minChars: config.minChars || 1,
		editable: true,
		fields: ['value', 'id'],
		pageSize: 10,
		emptyText: _('modclassvar_combo_select'),
		hideMode: 'offsets',
		url: modclassvar.config.connector_url,
		baseParams: {
			action: 'mgr/misc/autocomplete/getlist',
			combo: true,
			key: config.key || 'key',
			class: config.class || '',
			addall: config.addall || 0,
			novalue: config.novalue || 0,
		},
		tpl: new Ext.XTemplate(
			'<tpl for="."><div class="x-combo-list-item">',
			'{value}',
			'</div></tpl>',
			{
				compiled: true
			}),
		cls: 'input-combo-modclassvar-autocomplete',
		clearValue: function () {
			if (this.hiddenField) {
				this.hiddenField.value = '';
			}
			this.setRawValue('');
			this.lastSelectionText = '';
			this.applyEmptyText();
			this.value = '';
			this.fireEvent('select', this, null, 0);
		},

		getTrigger: function (index) {
			return this.triggers[index];
		},

		onTrigger1Click: function () {
			this.onTriggerClick();
		},

		onTrigger2Click: function () {
			this.clearValue();
		}
	});
	modclassvar.combo.AutoComplete.superclass.constructor.call(this, config);

};
Ext.extend(modclassvar.combo.AutoComplete, MODx.combo.ComboBox);
Ext.reg('modclassvar-combo-autocomplete', modclassvar.combo.AutoComplete);


modclassvar.combo.Option = function (config) {
	config = config || {};

	Ext.applyIf(config, {
		xtype: 'superboxselect',
		name: config.name || 'option',
		displayField: config.displayField || 'value',
		valueField: config.valueField || 'value',
		minChars: config.minChars || 1,
		valueDelimiter: config.valueDelimiter || '||',
		forceFormValue: false,
		allowBlank: true,
		msgTarget: 'under',
		allowAddNewData: true,
		addNewDataOnBlur: true,
		pinList: false,
		resizable: true,
		anchor: '100%',
		store: new Ext.data.JsonStore({
			root: 'results',
			autoLoad: false,
			autoSave: false,
			totalProperty: 'total',
			fields: ['value'],
			url: modclassvar.config.connector_url,
			baseParams: {
				action: 'mgr/misc/option/getlist',
				combo: true,
				class: config.class || '',
				key: config.key || 'key',
				cid: config.cid || 0,
			}
		}),
		mode: 'remote',
		triggerAction: 'all',
		extraItemCls: 'x-tag',
		expandBtnCls: 'x-form-trigger',
		clearBtnCls: 'x-form-trigger',
	});

	modclassvar.combo.Option.superclass.constructor.call(this, config);
};
Ext.extend(modclassvar.combo.Option, Ext.ux.form.SuperBoxSelect, {
	setupFormInterception: function () {

	}
});
Ext.reg('modclassvar-combo-option', modclassvar.combo.Option);


modclassvar.combo.File = function (config) {
	config = config || {};

	Ext.applyIf(config, {
		name: config.name || 'file',
		width: 400,
		triggerAction: 'all',
		triggerClass: 'x-form-file-trigger',
		source: config.source || MODx.config.default_media_source,
		allowedExtension: ['jpeg', 'jpg', 'png', 'gif', 'bmp'],
		/*configThumb: ['h=120','w=210','zc=1']*/
	});
	modclassvar.combo.File.superclass.constructor.call(this, config);
	this.config = config;
};
Ext.extend(modclassvar.combo.File, Ext.form.TriggerField, {
	browser: null,

	onRender: function (ct, position) {
		this.doc = Ext.isIE ? Ext.getBody() : Ext.getDoc();
		Ext.form.DateField.superclass.onRender.call(this, ct, position);
		this.thumb = Ext.DomHelper.append(ct, {
			tag: 'div',
			cls: 'modclassvar-file-thumb-wrapper'
		}, true);
	},

	setValue: function (a) {
		Ext.form.TriggerField.superclass.setValue.call(this, a);
		this.renderThumb();
	},

	onTriggerClick: function (btn) {
		if (this.disabled) {
			return false;
		}

		this.browser = MODx.load({
			xtype: 'modx-browser',
			closeAction: 'close',
			id: Ext.id(),
			multiple: true,
			source: this.config.source || MODx.config.default_media_source,
			hideFiles: this.config.hideFiles || false,
			rootVisible: this.config.rootVisible || false,
			allowedFileTypes: this.config.allowedFileTypes || '',
			wctx: this.config.wctx || 'web',
			openTo: this.config.openTo || '',
			rootId: this.config.rootId || '/',
			hideSourceCombo: this.config.hideSourceCombo || false,
			listeners: {
				select: {
					fn: function (data) {
						this.setValue(data.fullRelativeUrl);
						this.fireEvent('select', data);
						this.renderThumb();
					},
					scope: this
				}
			}
		});

		this.browser.show(btn);

		return true;
	},

	onDestroy: function () {
		modclassvar.combo.File.superclass.onDestroy.call(this);
	},

	renderThumb: function () {
		var isThumb = false;
		var value = this.getValue();

		if (value) {
			var ext = value.split('.').pop().toLowerCase();
			if (this.config.allowedExtension.indexOf('' + ext + '') > 0) {
				isThumb = true;
			}
		}

		if (!isThumb && this.thumb) {
			Ext.DomHelper.overwrite(this.thumb, [''], true);
		}
		else if (this.thumb) {
			var url = MODx.config.site_url + value;
			var thumb = String.format('<img src="{0}" ext:qtip="{1}" ext:qtitle="{2}" ext:qclass="modclassvar-qtip" class="modclassvar-file-thumb"/>', url, String.format("<img src='{0}'>", url), value);
			Ext.DomHelper.overwrite(this.thumb, [thumb], true);
		}
	}

});
Ext.reg('modclassvar-combo-file', modclassvar.combo.File);


modclassvar.combo.YmapsPlace = function (config) {
	config = config || {};
	config.YmapsMaps = config.YmapsMaps || '.modclassvar-ymaps-place.yandexmaps-map-wrapper > .yandexmaps-maps';

	Ext.applyIf(config, {
		name: config.name || 'place',
		editable: false,
		width: 400,
		triggerAction: 'all',
		triggerClass: 'x-form-file-trigger',
		listeners: {
			changeCoords: {
				fn: function (coords, address) {
					coords = this._preCoords(coords);
					this.Place.geometry.setCoordinates(coords);
					this.Map.setCenter(coords);
				},
				scope: this
			}
		}
	});
	modclassvar.combo.YmapsPlace.superclass.constructor.call(this, config);
	this.config = config;

	this.addEvents('changeCoords');
	this._initYmaps();
};
Ext.extend(modclassvar.combo.YmapsPlace, Ext.form.TriggerField, {
	window: null,
	SuggestView: null,
	Map: null,
	Place: null,
	SearchControl: null,
	geolocation: null,

	onRender: function (ct, position) {
		this.doc = Ext.isIE ? Ext.getBody() : Ext.getDoc();
		Ext.form.DateField.superclass.onRender.call(this, ct, position);

		this.maps = Ext.DomHelper.append(ct, {
			tag: 'div',
			cls: 'modclassvar-ymaps-place-wrapper'
		}, true);
	},

	setValue: function (a) {
		Ext.form.TriggerField.superclass.setValue.call(this, a);
		this.renderMaps();
	},

	onTriggerClick: function (btn) {
		if (this.disabled) {
			return false;
		}

		this.window = MODx.load({
			xtype: 'window',
			modal: Ext.isIE ? false : true,
			width: 600,
			layout: 'form',
			closeAction: 'close',
			shadow: true,
			resizable: true,
			collapsible: true,
			maximizable: false,
			autoHeight: false,
			autoScroll: true,
			allowDrop: true,
			footer: false,
			cls: 'modclassvar-ymaps-place-window',

			items: this.getFields(this.config),
			listeners: this.getListeners(this.config),
			bbar: this.getBottomBar(this.config),
		});

		this.window.show(btn);

		return true;
	},

	_buildScriptTag: function (filename, callback) {
		var script = document.createElement('script'),
			head = document.getElementsByTagName("head")[0];
		script.type = "text/javascript";
		script.src = filename;

		return head.appendChild(script);
	},

	_initYmaps: function () {
		var script = MODx.config['modclassvar_script_ymaps'] || 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&mode=release';
		if (!window.ymaps) {
			this._buildScriptTag(script);
		}
	},

	getFields: function (config) {

		return [{
			layout: 'column',
			border: false,
			defaults: {
				layout: 'form',
				labelAlign: 'top',
				labelSeparator: '',
				anchor: '100%',
				border: false
			},
			items: [{
				columnWidth: .8,
				defaults: {msgTarget: 'under', anchor: '100%'},
				items: [{
					xtype: 'textfield',
					hideLabel: true,
					name: 'address',
					listeners: {
						afterrender: {
							fn: function (field) {
								if (!window.ymaps) {
									return true;
								}

								field.options = {};
								this.SuggestView = new ymaps.SuggestView(field.getId(), field.options);
								this.SuggestView.events.add('select', function (e) {
									this.getCoords(e.get('item').value);
								}, this);
							}, scope: this
						}
					}
				}]
			}, {
				columnWidth: .2,
				defaults: {msgTarget: 'under', anchor: '100%'},
				items: [{
					xtype: 'button',
					cls: 'ymaps-place-search',
					text: '<i class="icon icon-search"></i> ' + _('search'),
					handler: this.search,
					scope: this
				}]
			}, {
				columnWidth: 1,
				defaults: {msgTarget: 'under', anchor: '100%'},
				style: 'margin:0px;',
				items: [{
					xtype: 'displayfield',
					hideLabel: true,
					cls: 'modclassvar-ymaps-place yandexmaps-map-wrapper',
					listeners: {
						afterrender: {
							fn: function (field) {
								if (!window.ymaps) {
									return true;
								}

								var value = this.getValue();
								value = value ? value.split(',') : [0, 0];

								this.Place = new ymaps.Placemark(value);
								field.options = {
									center: value,
									controls: ['zoomControl', 'fullscreenControl'],
									zoom: 10
								};
								this.Map = new ymaps.Map(field.getId(), field.options);
								this.Map.geoObjects.add(this.Place);
								this.Map.events.add('click', function (e) {
									this.Place.geometry.setCoordinates(e.get('coords'));
									this.getCoords(e.get('coords'));
								}, this);
								this.getCoords();
							}, scope: this
						}
					}
				}]
			}]
		}];
	},

	search: function () {
		if (!window.ymaps) {
			return false;
		}
		var address = this.SuggestView.state.get('request');

		this.getCoords(address);
	},

	getCoords: function (address) {
		if (!window.ymaps) {
			return false;
		}
		if (address == 'undefined') {
			address = null;
		}
		else if (address == '') {
			address = null;
		}

		var coords = this.getValue();

		if (!this.SearchControl) {
			this.SearchControl = new ymaps.control.SearchControl({'noPlacemark': true, 'noPopup': true});
		}
		if (!this.geolocation) {
			this.geolocation = ymaps.geolocation.get({provider: 'yandex', mapStateAutoApply: true});
		}

		if (address instanceof Array) {
			this.fireEvent('changeCoords', address, address);
		}
		else if (!address && coords) {
			this.fireEvent('changeCoords', coords, address);
		}
		else if (!address) {
			this.geolocation.then(function (response) {
				var GeoObject = response.geoObjects.get(0);
				coords = GeoObject.geometry.getCoordinates();

				this.fireEvent('changeCoords', coords, address);
			}, this);
		}
		else {
			this.SearchControl.search(address, {results: 1}).then(function (response) {
				var GeoObject = response.geoObjects.get(0);
				coords = GeoObject.geometry.getCoordinates();

				this.fireEvent('changeCoords', coords, address);
			}, this);

		}
	},

	getListeners: function (config) {
		var listeners = {
			show: {
				fn: function () {
				},
				scope: this
			}
		};

		return Ext.applyIf(config.listeners || {}, listeners);
	},

	getBottomBar: function (config) {
		var component = [
			'left', 'cancel', 'set'
		];
		var bbar = [];

		var add = {
			left: '->',
			cancel: {
				handler: this.close,
				scope: this
			},
			set: {
				handler: this.set,
				scope: this
			}
		};

		component.filter(function (field) {
			if (add[field]) {
				Ext.applyIf(add[field], {
					text: _(field),
					listeners: {
						render: function (b) {
							var t = _(field);
							if (t) {
								Ext.QuickTips.register({
									target: b,
									text: t,
								});
							}
						}
					}
				});
				bbar.push(add[field]);
			}
		});

		return bbar;
	},

	onDestroy: function () {
		modclassvar.combo.YmapsPlace.superclass.onDestroy.call(this);
	},

	set: function () {
		this.setValue(this.Place.geometry.getCoordinates());
		this.close();
	},

	close: function () {
		this.window.close.call(this.window);
	},

	renderMaps: function () {
		if (!window.ymaps) {
			return false;
		}
		var isMaps = false;
		var value = this.getValue();

		if (value) {
			isMaps = true;
		}

		if (!isMaps && this.maps) {
			Ext.DomHelper.overwrite(this.maps, [''], true);
		}
		else if (this.maps) {
			ymaps.ready(function () {
				value = this._preCoords(value);
				var id = Ext.id();
				var maps = String.format('<div id="{0}" class="modclassvar-ymaps-place-mini-maps"/></div>', id);
				Ext.DomHelper.overwrite(this.maps, [maps], true);

				this._Place = new ymaps.Placemark(value);
				var options = {
					center: value,
					controls: [],
					zoom: 10
				};
				this._Map = new ymaps.Map(id, options);
				this._Map.geoObjects.add(this._Place);

			}, this);
		}
	},

	_preCoords: function (coords) {
		if (!(coords instanceof Array )) {
			coords = coords.split(',');
		}
		return coords;
	}

});
Ext.reg('modclassvar-combo-ymaps-place', modclassvar.combo.YmapsPlace);


modclassvar.combo.GmapsPlace = function (config) {
	config = config || {};
	config.YmapsMaps = config.YmapsMaps || '.modclassvar-gmaps-place.yandexmaps-map-wrapper > .yandexmaps-maps';

	Ext.applyIf(config, {
		name: config.name || 'place',
		editable: false,
		width: 400,
		triggerAction: 'all',
		triggerClass: 'x-form-file-trigger',
		listeners: {
			changeCoords: {
				fn: function (coords, address) {
					coords = this._preCoords(coords);

					this.self.Map.setCenter(coords);
					this.self.Place.setPosition(coords);
				},
				scope: this
			}
		}
	});
	modclassvar.combo.GmapsPlace.superclass.constructor.call(this, config);
	this.config = config;

	this.addEvents('changeCoords');
	this._initGmaps();
};
Ext.extend(modclassvar.combo.GmapsPlace, Ext.form.TriggerField, {
	self: null,

	onRender: function (ct, position) {
		this.doc = Ext.isIE ? Ext.getBody() : Ext.getDoc();
		Ext.form.DateField.superclass.onRender.call(this, ct, position);

		this.maps = Ext.DomHelper.append(ct, {
			tag: 'div',
			cls: 'modclassvar-gmaps-place-wrapper'
		}, true);
	},

	setValue: function (a) {
		Ext.form.TriggerField.superclass.setValue.call(this, a);
		this.renderMaps();
	},

	onTriggerClick: function (btn) {
		if (this.disabled) {
			return false;
		}

		this.window = MODx.load({
			xtype: 'window',
			modal: Ext.isIE ? false : true,
			width: 600,
			layout: 'form',
			closeAction: 'close',
			shadow: true,
			resizable: true,
			collapsible: true,
			maximizable: false,
			autoHeight: false,
			autoScroll: true,
			allowDrop: true,
			footer: false,
			cls: 'modclassvar-gmaps-place-window',

			items: this.getFields(this.config),
			listeners: this.getListeners(this.config),
			bbar: this.getBottomBar(this.config),
		});

		this.window.show(btn);

		return true;
	},

	_buildScriptTag: function (filename, callback) {
		var script = document.createElement('script'),
			head = document.getElementsByTagName("head")[0];
		script.type = "text/javascript";
		script.src = filename;

		return head.appendChild(script);
	},

	_initGmaps: function () {
		var script = MODx.config['modclassvar_script_gmaps'] || 'https://maps.google.com/maps/api/js?sensor=false';
		if (!window.google || !window.google.maps) {
			this._buildScriptTag(script);
		}
		this.self = this;
	},

	getFields: function (config) {

		return [{
			layout: 'column',
			border: false,
			defaults: {
				layout: 'form',
				labelAlign: 'top',
				labelSeparator: '',
				anchor: '100%',
				border: false
			},
			items: [{
				columnWidth: .8,
				defaults: {msgTarget: 'under', anchor: '100%'},
				items: [{
					xtype: 'textfield',
					hideLabel: true,
					name: 'address',
					listeners: {
						afterrender: {
							fn: function (field) {
								if (!window.google.maps) {
									return true;
								}

								this.self.address = field;
							}, scope: this
						}
					}
				}]
			}, {
				columnWidth: .2,
				defaults: {msgTarget: 'under', anchor: '100%'},
				items: [{
					xtype: 'button',
					cls: 'gmaps-place-search',
					text: '<i class="icon icon-search"></i> ' + _('search'),
					handler: this.search,
					scope: this
				}]
			}, {
				columnWidth: 1,
				defaults: {msgTarget: 'under', anchor: '100%'},
				style: 'margin:0px;',
				items: [{
					xtype: 'displayfield',
					hideLabel: true,
					cls: 'modclassvar-gmaps-place yandexmaps-map-wrapper',
					listeners: {
						afterrender: {
							fn: function (field) {
								if (!window.google.maps) {
									return true;
								}

								var value = this.getValue();
								value = this._preCoords(value);

								field.options = {
									center: value,
									zoom: 10
								};
								this.self.Map = new google.maps.Map(field.getEl().dom, field.options);
								this.self.Place = new google.maps.Marker({
									position: value,
									map: this.self.Map
								});

								var self = this.self;
								self.Map.addListener('click', function (e) {
									self.Map.setCenter(e.latLng);
									self.Place.setPosition(e.latLng);
									self.getCoords(e.latLng);
								}, this);
								this.getCoords();
							}, scope: this
						}
					}
				}]
			}]
		}];
	},

	search: function () {
		if (!window.google.maps) {
			return false;
		}
		var address = this.self.address.getValue();
		this.getCoords(address);
	},

	getCoords: function (address) {
		if (!window.google.maps) {
			return false;
		}
		if (address == 'undefined') {
			address = null;
		}
		else if (address == '') {
			address = null;
		}

		var coords = this.getValue();

		if (!this.self.geocoder) {
			this.self.geocoder = new google.maps.Geocoder();
		}

		var self = this.self;

		if (address instanceof Object) {
			this.fireEvent('changeCoords', address, address);
		}
		else if (!address && coords) {
			this.fireEvent('changeCoords', coords, address);
		}
		else if (!address && navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				function (r) {
					self.fireEvent('changeCoords', new google.maps.LatLng(r.coords.latitude, r.coords.longitude), address);
				},
				function (error) {
					console.log(error)
				},
				{maximumAge: 50000, timeout: 20000, enableHighAccuracy: true}
			);
		}
		else {
			self.geocoder.geocode({address: address}, function (response, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					self.fireEvent('changeCoords', response[0].geometry.location, address);
				}
			});
		}
	},

	getListeners: function (config) {
		var listeners = {
			show: {
				fn: function () {
				},
				scope: this
			}
		};

		return Ext.applyIf(config.listeners || {}, listeners);
	},

	getBottomBar: function (config) {
		var component = [
			'left', 'cancel', 'set'
		];
		var bbar = [];

		var add = {
			left: '->',
			cancel: {
				handler: this.close,
				scope: this
			},
			set: {
				handler: this.set,
				scope: this
			}
		};

		component.filter(function (field) {
			if (add[field]) {
				Ext.applyIf(add[field], {
					text: _(field),
					listeners: {
						render: function (b) {
							var t = _(field);
							if (t) {
								Ext.QuickTips.register({
									target: b,
									text: t,
								});
							}
						}
					}
				});
				bbar.push(add[field]);
			}
		});

		return bbar;
	},

	onDestroy: function () {
		modclassvar.combo.GmapsPlace.superclass.onDestroy.call(this);
	},

	set: function () {
		var LatLng = this.Place.getPosition();
		this.setValue(LatLng.lat() + ',' + LatLng.lng());
		this.close();
	},

	close: function () {
		this.window.close.call(this.window);
	},

	renderMaps: function () {
		if (!window.google || !window.google.maps) {
			return false;
		}
		var isMaps = false;
		var value = this.getValue();

		if (value) {
			isMaps = true;
		}

		if (!isMaps && this.maps) {
			Ext.DomHelper.overwrite(this.maps, [''], true);
		}
		else if (this.maps) {
			value = this._preCoords(value);
			var id = Ext.id();
			var maps = String.format('<div id="{0}" class="modclassvar-gmaps-place-mini-maps"/></div>', id);
			Ext.DomHelper.overwrite(this.maps, [maps], true);

			options = {
				center: value,
				zoom: 10
			};
			this._Map = new google.maps.Map(Ext.get(id).dom, options);
			this._Place = new google.maps.Marker({
				position: value,
				map: this._Map
			});
		}
	},

	_preCoords: function (coords) {
		if (!coords) {
			coords = '0,0';
		}
		if (!(coords instanceof Object )) {
			coords = coords.split(',');
			coords = new google.maps.LatLng(coords[0], coords[1])
		}

		return coords;
	}

});
Ext.reg('modclassvar-combo-gmaps-place', modclassvar.combo.GmapsPlace);



modclassvar.combo.Resource = function(config) {
	config = config || {};

	if (config.custm) {
		config.triggerConfig = [{
			tag: 'div',
			cls: 'x-field-search-btns',
			style: String.format('width: {0}px;', config.clear?62:31),
			cn: [{
				tag: 'div',
				cls: 'x-form-trigger x-field-modclassvar-resource-go'
			}]
		}];
		if (config.clear) {
			config.triggerConfig[0].cn.push({
				tag: 'div',
				cls: 'x-form-trigger x-field-modclassvar-resource-clear'
			});
		}

		config.initTrigger = function() {
			var ts = this.trigger.select('.x-form-trigger', true);
			this.wrap.setStyle('overflow', 'hidden');
			var triggerField = this;
			ts.each(function(t, all, index) {
				t.hide = function() {
					var w = triggerField.wrap.getWidth();
					this.dom.style.display = 'none';
					triggerField.el.setWidth(w - triggerField.trigger.getWidth());
				};
				t.show = function() {
					var w = triggerField.wrap.getWidth();
					this.dom.style.display = '';
					triggerField.el.setWidth(w - triggerField.trigger.getWidth());
				};
				var triggerIndex = 'Trigger' + (index + 1);

				if (this['hide' + triggerIndex]) {
					t.dom.style.display = 'none';
				}
				t.on('click', this['on' + triggerIndex + 'Click'], this, {
					preventDefault: true
				});
				t.addClassOnOver('x-form-trigger-over');
				t.addClassOnClick('x-form-trigger-click');
			}, this);
			this.triggers = ts.elements;
		};
	}
	Ext.applyIf(config, {
		name: config.name || 'resource',
		hiddenName: config.name || 'resource',
		displayField: config.displayField || 'pagetitle',
		valueField: 'id',
		editable: true,
		fields: ['pagetitle', 'id'],
		pageSize: 10,
		emptyText: _('modclassvar_combo_select'),
		hideMode: 'offsets',
		url: modclassvar.config.connector_url,
		baseParams: {
			action: 'mgr/misc/resource/getlist',
			combo: true
		},
		tpl: new Ext.XTemplate(
			'<tpl for="."><div class="x-combo-list-item">',
			'<small>({id})</small> <b>{pagetitle}</b>',
			'</div></tpl>',
			{
				compiled: true
			}),
		cls: 'input-combo-modclassvar-resource',
		clearValue: function() {
			if (this.hiddenField) {
				this.hiddenField.value = '';
			}
			this.setRawValue('');
			this.lastSelectionText = '';
			this.applyEmptyText();
			this.value = '';
			this.fireEvent('select', this, null, 0);
		},

		getTrigger: function(index) {
			return this.triggers[index];
		},

		onTrigger1Click: function() {
			this.onTriggerClick();
		},

		onTrigger2Click: function() {
			this.clearValue();
		}
	});
	modclassvar.combo.Resource.superclass.constructor.call(this, config);

};
Ext.extend(modclassvar.combo.Resource, MODx.combo.ComboBox);
Ext.reg('modclassvar-combo-resource', modclassvar.combo.Resource);



modclassvar.combo.Resources = function (config) {
	config = config || {};

	Ext.applyIf(config, {
		xtype: 'superboxselect',
		name: config.name || 'resources',
		/*displayField: config.displayField || 'pagetitle',*/

		displayField: config.displayField || '<small>({id})</small> {pagetitle}',
		displayFieldTpl: config.displayFieldTpl || '<small>({id})</small> {pagetitle}',
		tpl: new Ext.XTemplate(
			'<tpl for="."><div class="x-combo-list-item">',
			'<small>({id})</small> <b>{pagetitle}</b>',
			'</div></tpl>',
			{
				compiled: true
			}),

		valueField: config.valueField || 'id',
		minChars: config.minChars || 1,
		valueDelimiter: config.valueDelimiter || '||',
		forceFormValue: false,
		allowBlank: true,
		msgTarget: 'under',
		allowAddNewData: true,
		addNewDataOnBlur: true,
		pinList: false,
		resizable: true,
		anchor: '100%',
		store: new Ext.data.JsonStore({
			root: 'results',
			autoLoad: false,
			autoSave: false,
			totalProperty: 'total',
			fields: ['pagetitle', 'id'],
			url: modclassvar.config.connector_url,
			baseParams: {
				action: 'mgr/misc/resource/getlist',
				combo: true,
			}
		}),

		mode: 'remote',
		triggerAction: 'all',
		extraItemCls: 'x-tag',
		expandBtnCls: 'x-form-trigger',
		clearBtnCls: 'x-form-trigger',
	});

	modclassvar.combo.Resources.superclass.constructor.call(this, config);
};
Ext.extend(modclassvar.combo.Resources, Ext.ux.form.SuperBoxSelect, {
	setupFormInterception: function () {

	}
});
Ext.reg('modclassvar-combo-resources', modclassvar.combo.Resources);


modclassvar.combo.User = function(config) {
	config = config || {};

	if (config.custm) {
		config.triggerConfig = [{
			tag: 'div',
			cls: 'x-field-search-btns',
			style: String.format('width: {0}px;', config.clear?62:31),
			cn: [{
				tag: 'div',
				cls: 'x-form-trigger x-field-modclassvar-user-go'
			}]
		}];
		if (config.clear) {
			config.triggerConfig[0].cn.push({
				tag: 'div',
				cls: 'x-form-trigger x-field-modclassvar-user-clear'
			});
		}

		config.initTrigger = function() {
			var ts = this.trigger.select('.x-form-trigger', true);
			this.wrap.setStyle('overflow', 'hidden');
			var triggerField = this;
			ts.each(function(t, all, index) {
				t.hide = function() {
					var w = triggerField.wrap.getWidth();
					this.dom.style.display = 'none';
					triggerField.el.setWidth(w - triggerField.trigger.getWidth());
				};
				t.show = function() {
					var w = triggerField.wrap.getWidth();
					this.dom.style.display = '';
					triggerField.el.setWidth(w - triggerField.trigger.getWidth());
				};
				var triggerIndex = 'Trigger' + (index + 1);

				if (this['hide' + triggerIndex]) {
					t.dom.style.display = 'none';
				}
				t.on('click', this['on' + triggerIndex + 'Click'], this, {
					preventDefault: true
				});
				t.addClassOnOver('x-form-trigger-over');
				t.addClassOnClick('x-form-trigger-click');
			}, this);
			this.triggers = ts.elements;
		};
	}
	Ext.applyIf(config, {
		name: config.name || 'user',
		hiddenName: config.name || 'user',
		displayField: config.displayField || 'username',
		valueField: 'id',
		editable: true,
		fields: ['username', 'id'],
		pageSize: 10,
		emptyText: _('modclassvar_combo_select'),
		hideMode: 'offsets',
		url: modclassvar.config.connector_url,
		baseParams: {
			action: 'mgr/misc/user/getlist',
			combo: true
		},
		tpl: new Ext.XTemplate(
			'<tpl for="."><div class="x-combo-list-item">',
			'<small>({id})</small> <b>{username}</b>',
			'</div></tpl>',
			{
				compiled: true
			}),
		cls: 'input-combo-modclassvar-user',
		clearValue: function() {
			if (this.hiddenField) {
				this.hiddenField.value = '';
			}
			this.setRawValue('');
			this.lastSelectionText = '';
			this.applyEmptyText();
			this.value = '';
			this.fireEvent('select', this, null, 0);
		},

		getTrigger: function(index) {
			return this.triggers[index];
		},

		onTrigger1Click: function() {
			this.onTriggerClick();
		},

		onTrigger2Click: function() {
			this.clearValue();
		}
	});
	modclassvar.combo.User.superclass.constructor.call(this, config);

};
Ext.extend(modclassvar.combo.User, MODx.combo.ComboBox);
Ext.reg('modclassvar-combo-user', modclassvar.combo.User);



modclassvar.combo.Users = function (config) {
	config = config || {};

	Ext.applyIf(config, {
		xtype: 'superboxselect',
		name: config.name || 'users',
		/*displayField: config.displayField || 'username',*/

		displayField: config.displayField || '<small>({id})</small> {username}',
		displayFieldTpl: config.displayFieldTpl || '<small>({id})</small> {username}',
		tpl: new Ext.XTemplate(
			'<tpl for="."><div class="x-combo-list-item">',
			'<small>({id})</small> <b>{username}</b>',
			'</div></tpl>',
			{
				compiled: true
			}),

		valueField: config.valueField || 'id',
		minChars: config.minChars || 1,
		valueDelimiter: config.valueDelimiter || '||',
		forceFormValue: false,
		allowBlank: true,
		msgTarget: 'under',
		allowAddNewData: true,
		addNewDataOnBlur: true,
		pinList: false,
		resizable: true,
		anchor: '100%',
		store: new Ext.data.JsonStore({
			root: 'results',
			autoLoad: false,
			autoSave: false,
			totalProperty: 'total',
			fields: ['username', 'id'],
			url: modclassvar.config.connector_url,
			baseParams: {
				action: 'mgr/misc/user/getlist',
				combo: true,
			}
		}),
		mode: 'remote',
		triggerAction: 'all',
		extraItemCls: 'x-tag',
		expandBtnCls: 'x-form-trigger',
		clearBtnCls: 'x-form-trigger',
	});

	modclassvar.combo.Users.superclass.constructor.call(this, config);
};
Ext.extend(modclassvar.combo.Users, Ext.ux.form.SuperBoxSelect, {
	setupFormInterception: function () {

	}
});
Ext.reg('modclassvar-combo-users', modclassvar.combo.Users);



modclassvar.combo.Chunk = function(config) {
	config = config || {};

	if (config.custm) {
		config.triggerConfig = [{
			tag: 'div',
			cls: 'x-field-search-btns',
			style: String.format('width: {0}px;', config.clear?62:31),
			cn: [{
				tag: 'div',
				cls: 'x-form-trigger x-field-modclassvar-chunk-go'
			}]
		}];
		if (config.clear) {
			config.triggerConfig[0].cn.push({
				tag: 'div',
				cls: 'x-form-trigger x-field-modclassvar-chunk-clear'
			});
		}

		config.initTrigger = function() {
			var ts = this.trigger.select('.x-form-trigger', true);
			this.wrap.setStyle('overflow', 'hidden');
			var triggerField = this;
			ts.each(function(t, all, index) {
				t.hide = function() {
					var w = triggerField.wrap.getWidth();
					this.dom.style.display = 'none';
					triggerField.el.setWidth(w - triggerField.trigger.getWidth());
				};
				t.show = function() {
					var w = triggerField.wrap.getWidth();
					this.dom.style.display = '';
					triggerField.el.setWidth(w - triggerField.trigger.getWidth());
				};
				var triggerIndex = 'Trigger' + (index + 1);

				if (this['hide' + triggerIndex]) {
					t.dom.style.display = 'none';
				}
				t.on('click', this['on' + triggerIndex + 'Click'], this, {
					preventDefault: true
				});
				t.addClassOnOver('x-form-trigger-over');
				t.addClassOnClick('x-form-trigger-click');
			}, this);
			this.triggers = ts.elements;
		};
	}
	Ext.applyIf(config, {
		name: config.name || 'chunk',
		hiddenName: config.name || 'chunk',
		displayField: config.displayField || 'name',
		valueField: 'id',
		editable: true,
		fields: ['name', 'id'],
		pageSize: 10,
		emptyText: _('modclassvar_combo_select'),
		hideMode: 'offsets',
		url: modclassvar.config.connector_url,
		baseParams: {
			action: 'mgr/misc/chunk/getlist',
			combo: true,
		},
		tpl: new Ext.XTemplate(
			'<tpl for="."><div class="x-combo-list-item">',
			'<small>({id})</small> <b>{name}</b>',
			'</div></tpl>',
			{
				compiled: true
			}),
		cls: 'input-combo-modclassvar-chunk',
		clearValue: function() {
			if (this.hiddenField) {
				this.hiddenField.value = '';
			}
			this.setRawValue('');
			this.lastSelectionText = '';
			this.applyEmptyText();
			this.value = '';
			this.fireEvent('select', this, null, 0);
		},

		getTrigger: function(index) {
			return this.triggers[index];
		},

		onTrigger1Click: function() {
			this.onTriggerClick();
		},

		onTrigger2Click: function() {
			this.clearValue();
		}
	});
	modclassvar.combo.Chunk.superclass.constructor.call(this, config);

};
Ext.extend(modclassvar.combo.Chunk, MODx.combo.ComboBox);
Ext.reg('modclassvar-combo-chunk', modclassvar.combo.Chunk);

