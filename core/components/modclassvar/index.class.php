<?php

/**
 * Class modclassvarMainController
 */
abstract class modclassvarMainController extends modExtraManagerController
{
    /** @var modclassvar $modclassvar */
    public $modclassvar;


    /**
     * @return void
     */
    public function initialize()
    {
        $corePath = $this->modx->getOption('modclassvar_core_path', null,
            $this->modx->getOption('core_path') . 'components/modclassvar/');
        require_once $corePath . 'model/modclassvar/modclassvar.class.php';

        $this->modclassvar = new modclassvar($this->modx);
        $this->addCss($this->modclassvar->config['cssUrl'] . 'mgr/main.css');
        $this->addJavascript($this->modclassvar->config['jsUrl'] . 'mgr/modclassvar.js');
        $this->addHtml('
		<script type="text/javascript">
			modclassvar.config = ' . $this->modx->toJSON($this->modclassvar->config) . ';
			modclassvar.config.connector_url = "' . $this->modclassvar->config['connectorUrl'] . '";
		</script>
		');

        parent::initialize();
    }


    /**
     * @return array
     */
    public function getLanguageTopics()
    {
        return array('modclassvar:default');
    }


    /**
     * @return bool
     */
    public function checkPermissions()
    {
        return true;
    }
}


/**
 * Class IndexManagerController
 */
class IndexManagerController extends modclassvarMainController
{

    /**
     * @return string
     */
    public static function getDefaultController()
    {
        return 'home';
    }
}