<?php


/**
 * The base class for modclassvar.
 */
class modclassvar
{
    /** @var modX $modx */
    public $modx;

    /** @var mixed|null $namespace */
    public $namespace = 'modclassvar';
    /** @var array $config */
    public $config = array();
    /** @var array $initialized */
    public $initialized = array();


    /**
     * @param modX  $modx
     * @param array $config
     */
    function __construct(modX &$modx, array $config = array())
    {
        $this->modx =& $modx;

        $corePath = $this->getOption('core_path', $config,
            $this->modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/modclassvar/');
        $assetsPath = $this->getOption('assets_path', $config,
            $this->modx->getOption('assets_path', null, MODX_ASSETS_PATH) . 'components/modclassvar/');
        $assetsUrl = $this->getOption('assets_url', $config,
            $this->modx->getOption('assets_url', null, MODX_ASSETS_URL) . 'components/modclassvar/');
        $connectorUrl = $assetsUrl . 'connector.php';

        $this->config = array_merge(array(
            'namespace'      => $this->namespace,
            'connectorUrl'   => $connectorUrl,
            'assetsBasePath' => MODX_ASSETS_PATH,
            'assetsBaseUrl'  => MODX_ASSETS_URL,
            'assetsPath'     => $assetsPath,
            'assetsUrl'      => $assetsUrl,
            'cssUrl'         => $assetsUrl . 'css/',
            'jsUrl'          => $assetsUrl . 'js/',
            'corePath'       => $corePath,
            'modelPath'      => $corePath . 'model/',
            'handlersPath'   => $corePath . 'handlers/',
            'processorsPath' => $corePath . 'processors/',
            'templatesPath'  => $corePath . 'elements/templates/mgr/',
            'jsonResponse'   => true,
            'showLog'        => false,
        ), $config);


        $this->modx->addPackage('modclassvar', $this->config['modelPath']);
        $this->modx->lexicon->load('modclassvar:default');
        $this->namespace = $this->getOption('namespace', $config, 'modclassvar');
    }

    /**
     * @param       $n
     * @param array $p
     */
    public function __call($n, array$p)
    {
        echo __METHOD__ . ' says: ' . $n;
    }

    /**
     * @param       $key
     * @param array $config
     * @param null  $default
     *
     * @return mixed|null
     */
    public function getOption($key, $config = array(), $default = null, $skipEmpty = false)
    {
        $option = $default;
        if (!empty($key) AND is_string($key)) {
            if ($config != null AND array_key_exists($key, $config)) {
                $option = $config[$key];
            } elseif (array_key_exists($key, $this->config)) {
                $option = $this->config[$key];
            } elseif (array_key_exists("{$this->namespace}_{$key}", $this->modx->config)) {
                $option = $this->modx->getOption("{$this->namespace}_{$key}");
            }
        }
        if ($skipEmpty AND empty($option)) {
            $option = $default;
        }

        return $option;
    }

    /**
     * Initializes component into different contexts.
     *
     * @param string $ctx The context to load. Defaults to web.
     * @param array  $scriptProperties
     *
     * @return boolean
     */
    public function initialize($ctx = 'web', $scriptProperties = array())
    {
        $this->modx->error->reset();
        $this->config = array_merge($this->config, $scriptProperties, array('ctx' => $ctx));

        if (!empty($this->initialized[$ctx])) {
            return true;
        }

        switch ($ctx) {
            case 'mgr':
                break;
            default:
                if (!defined('MODX_API_MODE') OR !MODX_API_MODE) {
                    $this->initialized[$ctx] = true;
                }
                break;
        }

        return true;
    }

    /**
     * return lexicon message if possibly
     *
     * @param string $message
     *
     * @return string $message
     */
    public function lexicon($message, $placeholders = array())
    {
        $key = '';
        if ($this->modx->lexicon->exists($message)) {
            $key = $message;
        } elseif ($this->modx->lexicon->exists($this->namespace . '_' . $message)) {
            $key = $this->namespace . '_' . $message;
        }
        if ($key !== '') {
            $message = $this->modx->lexicon->process($key, $placeholders);
        }

        return $message;
    }

    /**
     * @param string $message
     * @param array  $data
     * @param array  $placeholders
     *
     * @return array|string
     */
    public function failure($message = '', $data = array(), $placeholders = array())
    {
        $response = array(
            'success' => false,
            'message' => $this->lexicon($message, $placeholders),
            'data'    => $data,
        );

        return $this->config['jsonResponse'] ? $this->modx->toJSON($response) : $response;
    }

    /**
     * @param string $message
     * @param array  $data
     * @param array  $placeholders
     *
     * @return array|string
     */
    public function success($message = '', $data = array(), $placeholders = array())
    {
        $response = array(
            'success' => true,
            'message' => $this->lexicon($message, $placeholders),
            'data'    => $data,
        );

        return $this->config['jsonResponse'] ? $this->modx->toJSON($response) : $response;
    }


    /**
     * @param        $array
     * @param string $delimiter
     *
     * @return array
     */
    public function explodeAndClean($array, $delimiter = ',')
    {
        $array = explode($delimiter, $array);     // Explode fields to array
        $array = array_map('trim', $array);       // Trim array's values
        $array = array_keys(array_flip($array));  // Remove duplicate fields
        $array = array_filter($array);            // Remove empty values from array
        return $array;
    }

    /**
     * @param        $array
     * @param string $delimiter
     *
     * @return array|string
     */
    public function cleanAndImplode($array, $delimiter = ',')
    {
        $array = array_map('trim', $array);       // Trim array's values
        $array = array_keys(array_flip($array));  // Remove duplicate fields
        $array = array_filter($array);            // Remove empty values from array
        $array = implode($delimiter, $array);

        return $array;
    }

    /**
     * @param array  $array
     * @param string $prefix
     *
     * @return array
     */
    public function flattenArray(array $array = array(), $prefix = '')
    {
        $outArray = array();
        foreach ($array as $key => $value) {
            if (is_array($value)) {
                $outArray = $outArray + $this->flattenArray($value, $prefix . $key . '.');
            } else {
                $outArray[$prefix . $key] = $value;
            }
        }

        return $outArray;
    }

    /** @return array Grid Field Fields */
    public function getGridFieldFields()
    {
        $fields = $this->getOption('grid_field_fields', null,
            'id,key,name,type,unit', true);
        $fields .= ',id,key,description,rank,properties,actions';
        $fields = $this->explodeAndClean($fields);

        return $fields;
    }

    /**
     * @param modManagerController $controller
     * @param array                $setting
     */
    public function loadControllerJsCss(modManagerController &$controller, array $setting = array())
    {
        $controller->addLexiconTopic('modclassvar:default');

        $config = $this->config;
        foreach (array('resource', 'user') as $key) {
            if (isset($config[$key]) AND is_object($config[$key]) AND $config[$key] instanceof xPDOObject) {
                /** @var $config xPDOObject[] */
                $config[$key] = $config[$key]->toArray();
            }
        }
        if (isset($config['user'])) {
            $config['working_groups'] = $this->getUserGroups($config['user']['id']);
        }

        $config['connector_url'] = $this->config['connectorUrl'];
        $config['grid_field_fields'] = $this->getGridFieldFields();

        if (!empty($setting['css'])) {
            $controller->addCss($this->config['cssUrl'] . 'mgr/main.css');
            $controller->addCss($this->config['cssUrl'] . 'mgr/bootstrap.buttons.css');
        }

        if (!empty($setting['config'])) {
            $controller->addHtml("<script type='text/javascript'>modclassvar.config={$this->modx->toJSON($config)}</script>");
        }

        if (!empty($setting['tools'])) {
            $controller->addJavascript($this->config['jsUrl'] . 'mgr/modclassvar.js');
            $controller->addJavascript($this->config['jsUrl'] . 'mgr/misc/tools.js');
            $controller->addJavascript($this->config['jsUrl'] . 'mgr/misc/combo.js');
        }

        if (!empty($setting['main'])) {
            $controller->addLastJavascript($this->config['jsUrl'] . 'mgr/main/main.panel.js');
        }

        if (!empty($setting['field'])) {
            $controller->addLastJavascript($this->config['jsUrl'] . 'mgr/field/field.window.js');
            $controller->addLastJavascript($this->config['jsUrl'] . 'mgr/field/field.grid.js');
        }

        if (!empty($setting['variable'])) {
            $controller->addLastJavascript($this->config['jsUrl'] . 'mgr/variable/variable.panel.js');
        }

        if (!empty($setting['resource/inject'])) {
            $controller->addLastJavascript($this->config['jsUrl'] . 'mgr/resource/inject/inject.tab.js');
            $controller->addLastJavascript($this->config['jsUrl'] . 'mgr/resource/inject/inject.panel.js');
        }

        if (!empty($setting['user/inject'])) {
            $controller->addLastJavascript($this->config['jsUrl'] . 'mgr/user/inject/inject.tab.js');
            $controller->addLastJavascript($this->config['jsUrl'] . 'mgr/user/inject/inject.panel.js');
        }

        if (
            $this->getOption('force_script_ymaps', null, false, true)
            AND
            $script = $this->getOption('script_ymaps', null, false, true)
        ) {
            $controller->addLastJavascript($script);
        }
        if (
            $this->getOption('force_script_gmaps', null, false, true)
            AND
            $script = $this->getOption('script_gmaps', null, false, true)
        ) {
            $controller->addLastJavascript($script);
        }
    }

    /**
     * @param int $id
     *
     * @return array
     */
    public function getUserGroups($id = 0)
    {
        $data = array();
        if (!empty($id)) {
            $q = $this->modx->newQuery('modUserGroupMember', array('member' => $id));
            $q->select('user_group');

            if ($q->prepare() && $q->stmt->execute()) {
                $data = $q->stmt->fetchAll(PDO::FETCH_COLUMN);
            }
        }

        return $data;
    }


    /**
     * @param modResource $resource
     *
     * @return bool
     */
    public function isWorkingTemplates(modResource $resource)
    {
        return in_array($resource->get('template'), $this->explodeAndClean($this->getOption('working_templates')));
    }

    /**
     * @param modUser $user
     *
     * @return bool
     */
    public function isWorkingGroups(modUser $user)
    {
        $groups = $this->getUserGroups($user->get('id'));

        return (bool)array_intersect($groups, $this->explodeAndClean($this->getOption('working_groups')));
    }


    /**
     * @param string $class
     * @param int    $cid
     * @param null   $key
     * @param bool   $process
     * @param null   $prefix
     *
     * @return mixed|null
     */
    public function getValues($cid = 0, $class = 'modResource', $key = null, $process = false, $prefix = null)
    {
        switch (true) {
            case empty($cid) AND $class == 'modResource':
                $cid = $this->modx->resource->id;
                break;
            case empty($cid) AND $class == 'modUser':
                $cid = $this->modx->user->id;
                break;
        }

        switch (true) {
            case !$process:
                $prefix = '';
                break;
            case $process AND is_null($prefix):
                $prefix = '';
                break;
            case $process AND !$prefix:
                $prefix = $this->getOption('field_prefix', null, '', true);
                break;
        }

        return $this->modx->call('modClassVarValues', 'getValues', array(&$this->modx, $class, $cid, $key, $process, $prefix));
    }

    /**
     * @param        $fqn
     * @param string $path
     *
     * @return bool|string
     */
    public function loadClass($fqn, $path = '')
    {
        if (empty($fqn)) {
            $this->modx->log(xPDO::LOG_LEVEL_ERROR, "No class specified for loadClass");

            return false;
        }

        $pos = strrpos($fqn, '.');
        if ($pos === false) {
            $class = $fqn;
            $fqn = strtolower($class);
        } else {
            $class = substr($fqn, $pos + 1);
            $fqn = substr($fqn, 0, $pos) . '.' . strtolower($class);
        }

        $included = class_exists($class, false);
        if ($included) {
            return $class;
        } else {
            $fqcn = str_replace('.', '/', $fqn) . '.class.php';
            /* include class */
            if (!file_exists($path . $fqcn)) {
                return false;
            }
            if (!$rt = include_once($path . $fqcn)) {
                $this->modx->log(xPDO::LOG_LEVEL_WARN, "Could not load class: {$class} from {$path}{$fqcn}");
                $class = false;
            }
        }

        return $class;
    }

}