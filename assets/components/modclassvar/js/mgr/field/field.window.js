modclassvar.window.FieldUpdate = function (config) {
    config = config || { record: {} };

    if (!config.update) {
        config.update = false;
    }
    if (!config.class) {
        config.class = 'modClassVarField';
    }

    Ext.applyIf(config, {
        title: _('create'),
        width: 650,
        autoHeight: true,
        url: modclassvar.config.connector_url,
        action: 'mgr/field/update',
        fields: this.getFields(config),
        keys: this.getKeys(config),
        listeners: this.getListeners(config),
        cls: 'modclassvar-panel-variable',
    });

    modclassvar.window.FieldUpdate.superclass.constructor.call(this, config);
    this.addEvents('modClassVarFormReload');
};
Ext.extend(modclassvar.window.FieldUpdate, MODx.Window, {

    getKeys: function (config) {
        return [{
            key: Ext.EventObject.ENTER, shift: true, fn: function () {
                this.submit()
            }, scope: this
        }];
    },

    getFields: function (config) {
        return [{
            layout: 'form',
            defaults: {border: false, anchor: '100%'},
            items: [{
                xtype: 'hidden',
                name: 'id'
            }, {
                layout: 'column',
                border: false,
                items: [{
                    columnWidth: .5,
                    layout: 'form',
                    defaults: {border: false, anchor: '100%'},
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: _('modclassvar_key'),
                        name: 'key',
                        allowBlank: false
                    }, {
                        xtype: 'textfield',
                        fieldLabel: _('modclassvar_handler'),
                        msgTarget: 'under',
                        name: 'handler',
                        allowBlank: true
                    }, {
                        xtype: 'modclassvar-combo-field-type',
                        fieldLabel: _('modclassvar_type'),
                        name: 'type',
                        custm: true,
                        clear: true,
                        allowBlank: false,
                        listeners: {
                            afterrender: {
                                fn: function(r) {
                                    this._changeType();
                                },
                                scope: this
                            },
                            select: {
                                fn: function(r) {
                                    this._changeType();
                                },
                                scope: this
                            }
                        }
                    }]
                }, {
                    columnWidth: .5,
                    layout: 'form',
                    defaults: {border: false, anchor: '100%'},
                    items: [{
                        xtype: 'textfield',
                        fieldLabel: _('modclassvar_name'),
                        name: 'name',
                        allowBlank: false
                    },{
                        xtype: 'textfield',
                        fieldLabel: _('modclassvar_unit'),
                        name: 'unit',
                        allowBlank: true
                    }, {
                        xtype: 'modclassvar-combo-field-section',
                        fieldLabel: _('modclassvar_section'),
                        name: 'section',
                        msgTarget: 'under',
                        fid: config.record.id || 0,
                        allowBlank: true
                    }]
                }]
            }, {
                html:"<div class='modclassvar-html-mg10'>"
            }, {
                xtype: 'xcheckbox',
                hideLabel: true,
                boxLabel: _('modclassvar_value'),
                name: '_handler',
                checked: false,
                listeners: {
                    check: modclassvar.tools.handleChecked,
                    afterrender: modclassvar.tools.handleChecked
                }
            },  {
                xtype: 'modx-tabs',
                autoHeight: true,
                deferredRender: false,
                forceLayout: true,
                style: {
                    'margin': '-5px 0px 5px 0px'
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

                        if (!record) {
                            t.removeAll();
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
                                    class: 'modClassVarField',
                                    cid: this.config.record.id || 0,
                                    key: record.json['key'] || 0,
                                    type: record.json['type'] || '',
                                    handler: record.json['handler'] || '',
                                },
                                listeners: {
                                    success: {
                                        fn: function (r) {
                                            var f = this.fp.getForm();
                                            if (r.object) {
                                                f.setValues({modclassvar: r.object.modclassvar});
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
            }, {
                xtype: 'xcheckbox',
                hideLabel: true,
                disableWork: false,
                boxLabel: _('modclassvar_config'),
                name: '_config',
                checked: false,
                listeners: {
                    check: modclassvar.tools.handleChecked,
                    afterrender: modclassvar.tools.handleChecked
                }
            }, {
                xtype: 'textarea',
                fieldLabel: _('modclassvar_config'),
                msgTarget: 'under',
                name: 'config',
                allowBlank: true
            }, {
                xtype: 'xcheckbox',
                hideLabel: true,
                disableWork: false,
                boxLabel: _('modclassvar_condition'),
                name: '_condition',
                checked: false,
                listeners: {
                    check: modclassvar.tools.handleChecked,
                    afterrender: modclassvar.tools.handleChecked
                }
            }, {
                xtype: 'textarea',
                fieldLabel: _('modclassvar_condition'),
                msgTarget: 'under',
                name: 'condition',
                allowBlank: true
            }, {
                xtype: 'xcheckbox',
                hideLabel: true,
                disableWork: false,
                boxLabel: _('modclassvar_description'),
                name: '_description',
                checked: false,
                listeners: {
                    check: modclassvar.tools.handleChecked,
                    afterrender: modclassvar.tools.handleChecked
                }
            }, {
                xtype: 'textarea',
                fieldLabel: '',
                msgTarget: 'under',
                name: 'description',
                height: 50,
                allowBlank: true
            }, {
                xtype: 'checkboxgroup',
                fieldLabel: '',
                hideLabel: true,
                columns: 2,
                items: [{
                    xtype: 'xcheckbox',
                    boxLabel: _('modclassvar_active'),
                    name: 'active',
                    checked: config.record.active
                }]
            }]
        }];

    },

    getFormField: function (config, record) {
        record = record || {json: {msg: null,cid: null}};

        var field = [];
        if (!record.json['type']) {
            return field;
        }

        var cnf = Ext.util.JSON.decode(record['config'] || '{}');

        Ext.applyIf(cnf, {
            xtype: record.json['type'],
            class: record.json['class'] || 'modClassVarField',
            cid: this.config.record.id || 0,
            key: record.json['key'] || 0,
            name: 'modclassvar',
            hiddenName: 'modclassvar',
        });

        field.push(cnf);

        return field;
    },

    _changeType: function(change) {
        var form = this.fp.getForm();
        var fieldType = form.findField('type');

        var record = null;
        var type = fieldType.getValue();
        if (type) {
            //record = form.getFieldValues();
            record = modclassvar.tools.getFieldValues(form, true);
            record.json = record;
        }

        Ext.each(this.fp.findByType('modx-tabs'),function(t)
        {
            t.fireEvent('modClassVarFormReload', null, t, null, record);
        });

    },

    saveField: function (config, record) {
        var f = this.fp.getForm();
        if (!record) {
            record = f.getFieldValues();
        }

        MODx.Ajax.request({
            url: modclassvar.config.connector_url,
            params: {
                action: 'mgr/variable/save',
                class: 'modClassVarField',
                cid: record['id'] || 0,
                key: record['key'] || 0,
                type: record['type'] || '',
                handler: record['handler'] || '',
                modclassvar: record['modclassvar'],
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

    getListeners: function (config) {
        return Ext.applyIf(config.listeners, {
            beforeSubmit: {
                fn: function () {
                    //this.saveField();
                }, scope: this
            }
        });
    },

    submit: function(close) {
        close = close === false ? false : true;
        var f = this.fp.getForm();
        if (f.isValid() && this.fireEvent('beforeSubmit',f.getValues())) {
            f.submit({
                waitMsg: _('saving')
                ,submitEmptyText: this.config.submitEmptyText !== false
                ,scope: this
                ,failure: function(frm,a) {
                    if (this.fireEvent('failure',{f:frm,a:a})) {
                        MODx.form.Handler.errorExt(a.result,frm);
                    }
                    this.doLayout();
                }
                ,success: function(frm,a) {
                    if (this.config.success) {
                        Ext.callback(this.config.success,this.config.scope || this,[frm,a]);
                    }
                    this.fireEvent('success',{f:frm,a:a});

                    if (a.result && a.result.object) {

                        var o = a.result.object;
                        var record = f.getFieldValues();
                        Ext.applyIf(record, {
                            cid: o['id'] || 0,
                            key: o['key'] || 0,
                            type: o['type'] || '',
                            handler: o['handler'] || '',
                        });

                        this.saveField(this.config, record);
                    }

                    if (close) { this.config.closeAction !== 'close' ? this.hide() : this.close(); }
                    this.doLayout();
                }
            });
        }
    },

    loadDropZones: function() {

    }

});
Ext.reg('modclassvar-window-field-update', modclassvar.window.FieldUpdate);
