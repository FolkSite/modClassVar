Ext.override(MODx.panel.User, {

	modclassvarValue: null,
	modclassvarOriginals: {
		getFields: MODx.panel.User.prototype.getFields,
		beforeSubmit: MODx.panel.User.prototype.beforeSubmit,
		success: MODx.panel.User.prototype.success
	},

	getFields: function(config) {
		var fields = this.modclassvarOriginals.getFields.call(this, config);

		var isHide = false;

		if (!modclassvar.config.user) {
			isHide = true;
		}

		var groups = MODx.config.modclassvar_working_groups || '';
		isHide = !modclassvar.tools.arrayIntersect(groups.split(','), modclassvar.config.working_groups);

		if (!isHide) {
			fields.push({
				xtype: 'modclassvar-panel-user-inject',
				title: _('modclassvar_user')
			});
		}

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