Ext.override(MODx.panel.Resource, {
	
	modclassvarValue: null,
	modclassvarOriginals: {
		getFields: MODx.panel.Resource.prototype.getFields,
		beforeSubmit: MODx.panel.Resource.prototype.beforeSubmit,
		success: MODx.panel.Resource.prototype.success
	},

	getFields: function(config) {
		var fields = this.modclassvarOriginals.getFields.call(this, config);

		var isHide = false;
		var templates = MODx.config.modclassvar_working_templates || '';
		if (templates.split(',').indexOf(''+config.record.template+'') < 0) {
			isHide = true;
		}

		if (!modclassvar.config.resource) {
			isHide = true;
		}

		fields.filter(function(row) {
			if (row.id == 'modx-resource-tabs' && !isHide) {
				row.items.push({
					xtype: 'modclassvar-panel-resource-inject',
					title: _('modclassvar_resource')
				});
			}
		});

		return fields;
	},

	success: function(o) {
		this.modclassvarOriginals.success.call(this,o);
		var modclassvar = this.getForm().findField('modclassvar');

		if (modclassvar && this.modclassvarValue) {
			modclassvar.setValue(this.modclassvarValue);
		}
	},

	beforeSubmit: function(o) {
		var modclassvar = this.getForm().findField('modclassvar');
		if (modclassvar) {
			this.modclassvarValue = modclassvar.getValue();
			modclassvar.setValue('');
		}

		this.modclassvarOriginals.beforeSubmit.call(this,o);
	}

});
