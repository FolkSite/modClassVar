<?php

/**
 * The home manager controller for modclassvar.
 *
 */
class modclassvarHomeManagerController extends modclassvarMainController
{
    /* @var modclassvar $modclassvar */
    public $modclassvar;


    /**
     * @param array $scriptProperties
     */
    public function process(array $scriptProperties = array())
    {
    }


    /**
     * @return null|string
     */
    public function getPageTitle()
    {
        return $this->modx->lexicon('modclassvar');
    }


    /**
     * @return void
     */
    public function loadCustomCssJs()
    {
        $this->addCss($this->modclassvar->config['cssUrl'] . 'mgr/main.css');
        $this->addCss($this->modclassvar->config['cssUrl'] . 'mgr/bootstrap.buttons.css');
        $this->addJavascript($this->modclassvar->config['jsUrl'] . 'mgr/misc/utils.js');
        $this->addJavascript($this->modclassvar->config['jsUrl'] . 'mgr/widgets/items.grid.js');
        $this->addJavascript($this->modclassvar->config['jsUrl'] . 'mgr/widgets/items.windows.js');
        $this->addJavascript($this->modclassvar->config['jsUrl'] . 'mgr/widgets/home.panel.js');
        $this->addJavascript($this->modclassvar->config['jsUrl'] . 'mgr/sections/home.js');
        $this->addHtml('<script type="text/javascript">
		Ext.onReady(function() {
			MODx.load({ xtype: "modclassvar-page-home"});
		});
		</script>');
    }


    /**
     * @return string
     */
    public function getTemplateFile()
    {
        return $this->modclassvar->config['templatesPath'] . 'home.tpl';
    }
}