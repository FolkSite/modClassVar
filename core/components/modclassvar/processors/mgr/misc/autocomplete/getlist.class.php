<?php

class modClassVarAutoCompleteProcessor extends modObjectProcessor
{
    /**
     * @return array|string
     */
    public function process()
    {
        $classKey = 'modClassVarValues';

        $class = $this->getProperty('class');
        $cid = $this->getProperty('cid');
        $key = $this->getProperty('key');

        $q = $this->modx->newQuery($classKey);
        $q->select("{$classKey}.value as value");
        $q->sortby("{$classKey}.value", 'ASC');
        $q->groupby("{$classKey}.value");
        $q->limit(0);
        $q->where(array(
            "{$classKey}.class"    => "{$class}",
            "{$classKey}.cid"      => "{$cid}",
            "{$classKey}.key"      => "{$key}",
            "{$classKey}.value:!=" => "",
        ));

        $query = $this->getProperty('query');
        if (!empty($query)) {
            $q->andCondition(array(
                "{$class}.value:LIKE" => "%{$query}%"
            ));
        }

        $found = false;
        if ($q->prepare() && $q->stmt->execute()) {
            $array = $q->stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($array as $k => $v) {
                if ($v['value'] == $query) {
                    $found = true;
                }
            }
        } else {
            $array = array();
        }

        if (!$found AND !empty($query)) {
            $array = array_merge_recursive(array(array('value' => $query)), $array);
        }

        $count = count($array);
        $start = $this->getProperty('start', 0);
        $limit = $this->getProperty('limit', 10);

        $array = array_slice($array, $start, $limit);

        return $this->outputArray($array, $count);
    }
}

return 'modClassVarAutoCompleteProcessor';