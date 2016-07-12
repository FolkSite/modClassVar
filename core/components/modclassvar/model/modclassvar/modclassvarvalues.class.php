<?php

class modClassVarValues extends xPDOObject
{

    public static function getValues(xPDO & $xpdo, $class = 'modResource', $cid = 0, $key = null, $process = true, $prefix = '')
    {
        $values = array();
        $classValue = 'modClassVarValues';
        $classField = 'modClassVarField';

        $q = $xpdo->newQuery($classField);
        $q->leftJoin($classValue, $classValue, "{$classField}.key={$classValue}.key AND {$classValue}.cid = {$cid}");
        $q->select($xpdo->getSelectColumns($classField, $classField));
        $q->select($xpdo->getSelectColumns($classValue, $classValue));
        
        if ($class) {
            $q->where(array(
                "{$classValue}.class" => "{$class}"
            ));
        }

        if ($key) {
            $q->where(array(
                "{$classValue}.key" => "{$key}"
            ));
        }
        
        if ($q->prepare() AND $q->stmt->execute()) {
            while ($row = $q->stmt->fetch(PDO::FETCH_ASSOC)) {
                $k = $prefix . $row['key'];
                if (isset($values[$k])) {
                    if (!is_array($values[$k])) {
                        $values[$k] = array($values[$k]);
                    }
                    $values[$k][] = $row['value'];
                } else {
                    $values[$k] = $row['value'];
                }

                if ($process) {
                    foreach ($row as $x => $value) {
                        $values[$k . '.' . $x] = $value;
                    }
                }
            }
        }

        if ($key AND !$process) {
            $values = $xpdo->getOption($key, $values, '', true);
        }

        return $values;
    }

    public static function removeValues(xPDO & $xpdo, $class = 'modResource', $cid = 0, $key = '')
    {
        if (empty($key)) {
            $sql = "DELETE FROM {$xpdo->getTableName('modClassVarValues')} WHERE `class` = '{$class}' AND `cid` = '{$cid}';";
        } else {
            $sql = "DELETE FROM {$xpdo->getTableName('modClassVarValues')} WHERE `class` = '{$class}' AND `cid` = '{$cid}' AND `key` = '{$key}';";
        }

        $stmt = $xpdo->prepare($sql);
        $stmt->execute();
        $stmt->closeCursor();
    }

    public static function saveValues(xPDO & $xpdo, $class = 'modResource', $cid = 0, array $values = array())
    {
        $sql = "INSERT INTO {$xpdo->getTableName('modClassVarValues')} (`class`, `cid`, `key`, `value`) VALUES (:class, :cid, :key, :value);";
        $stmt = $xpdo->prepare($sql);
        foreach ($values as $key => $field) {
            if (!is_array($field)) {
                $field = array($field);
            }
            foreach ($field as $value) {
                $stmt->bindValue(':class', $class);
                $stmt->bindValue(':cid', $cid);
                $stmt->bindValue(':key', $key);
                $stmt->bindValue(':value', $value);
                $stmt->execute();
            }
        }
        $stmt->closeCursor();
    }


}