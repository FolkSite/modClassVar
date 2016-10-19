<?php

class modClassVarOptionProcessor extends modObjectProcessor
{
    /**
     * @return array|string
     */
    public function process()
    {
        $classKey = 'modClassVarValues';

        $class = $this->getProperty('class');
        $key = $this->getProperty('key');

        $q = $this->modx->newQuery($classKey);
        $q->select("{$classKey}.value as value");
        $q->sortby("{$classKey}.value", 'ASC');
        $q->groupby("{$classKey}.value");
        $q->limit(0);
        $q->where(array(
            "{$classKey}.class"    => "{$class}",
            "{$classKey}.key"      => "{$key}",
            "{$classKey}.value:!=" => "",
        ));

       /* $cid = (int)$this->getProperty('cid');
        if ($cid) {
            $q->andCondition(array(
                "{$classKey}.cid" => "{$cid}",
            ));
        }*/

        $query = trim($this->getProperty('query'));
        if ($query) {
            $pf = '|';
            if (strpos($query, $pf) !== false) {
                $query = explode($pf, $query);
                $q->andCondition(array(
                    "{$classKey}.value:IN" => $query
                ));
            } else {
                $q->andCondition(array(
                    "{$classKey}.value:LIKE" => "%{$query}%"
                ));
            }
        }

        $found = false;
        if ($q->prepare() && $q->stmt->execute()) {
            $array = $q->stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($array as $k => $v) {
                if (is_string($query) AND $v['value'] == $query) {
                    $found = true;
                }
            }
        } else {
            $array = array();
        }

        if (!$found AND !empty($query) AND is_string($query)) {
            $array = array_merge_recursive(array(array('value' => $query)), $array);
        }

        $count = count($array);
        $start = $this->getProperty('start', 0);
        $limit = $this->getProperty('limit', $count);

        $array = array_slice($array, $start, $limit);

        return $this->outputArray($array, $count);
    }
}

return 'modClassVarOptionProcessor';