<?php

interface _modClassVarValuesInterface
{
    public function getData(array $row = array());

    public function getValues(array $row = array());

    public function processValues(array $row = array());

}

//abstract

class _modClassVarValues implements _modClassVarValuesInterface
{
    /** @var modX $modx */
    protected $modx;
    /** @var modclassvar $modclassvar */
    protected $modclassvar;
    /** @var array $scriptProperties */
    protected $scriptProperties;
    /** @var  string $classVar */
    protected $classVar = 'modClassVarValues';

    public function __construct($modx, &$scriptProperties)
    {
        /** @var modX $modx */
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

    public function getData(array $row = array())
    {
        $class = $this->modx->getOption('class', $row);
        $cid = $this->modx->getOption('cid', $row);
        $key = $this->modx->getOption('key', $row);

        $q = $this->modx->newQuery($this->classVar);
        $q->select("{$this->classVar}.value");
        $q->where(array(
            "{$this->classVar}.class" => $class,
            "{$this->classVar}.cid"   => $cid,
            "{$this->classVar}.key"   => $key
        ));

        $data = array();
        $tstart = microtime(true);
        if ($q->prepare() && $q->stmt->execute()) {
            $this->modx->queryTime += microtime(true) - $tstart;
            $this->modx->executedQueries++;
            $data = $q->stmt->fetchAll(PDO::FETCH_COLUMN);
        }

        return $data;
    }

    public function getValues(array $row = array())
    {
        $values = $this->getData($row);
        $values = end($values);

        return (string)$values;
    }

    public function processValues(array $row = array())
    {
        $values = $this->modx->getOption('modclassvar', $row);

        return array($values);
    }


}