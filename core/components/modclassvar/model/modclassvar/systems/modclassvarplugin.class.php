<?php

abstract class modClassVarPlugin
{
    /** @var modX $modx */
    protected $modx;
    /** @var modclassvar $modclassvar */
    protected $modclassvar;
    /** @var array $scriptProperties */
    protected $scriptProperties;
    /** @var  string $classVar */
    protected $classVar = 'modClassVarValues';

    public function __construct(modX $modx, &$scriptProperties)
    {
        $this->modx = $modx;
        $this->scriptProperties =& $scriptProperties;

        $fqn = $modx->getOption('modclassvar_class', null, 'modclassvar.modclassvar', true);
        $path = $modx->getOption('modclassvar_class_path', null,
            $modx->getOption('core_path', null, MODX_CORE_PATH) . 'components/modclassvar/');
        if (!$this->modclassvar = $modx->getService($fqn, '', $path . 'model/',
            array('core_path' => $path))
        ) {
            return false;
        }

        $this->modclassvar->initialize($this->modx->context->key, $scriptProperties);
    }

    abstract public function run();
}