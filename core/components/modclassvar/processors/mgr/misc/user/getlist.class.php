<?php

class modClassVarUserGetListProcessor extends modObjectGetListProcessor
{
    public $classKey = 'modUser';
    public $languageTopics = array('user');
    public $permission = 'view_user';
    public $defaultSortField = 'username';

    public function initialize()
    {
        $initialized = parent::initialize();
        $this->setDefaultProperties(array(
            'usergroup' => false,
            'query'     => '',
        ));
        $this->setProperty('sort', 'modUser.id');

        return $initialized;
    }

    /** {@inheritDoc} */
    public function prepareQueryBeforeCount(xPDOQuery $c)
    {
        $pf = '|';

        $c->leftJoin('modUserProfile', 'Profile');

        $query = $this->getProperty('query');
        switch (true) {
            case is_numeric($query):
                $this->setProperty('id', $query);
                break;
            case (strpos($query, $pf) !== false):
                $query = explode($pf, $query);
                $c->andCondition(array(
                    "{$this->classKey}.id:IN" => $query
                ));
                break;
            case !empty($query):
                $c->where(array(
                    'modUser.username:LIKE'    => '%' . $query . '%',
                    'OR:Profile.fullname:LIKE' => '%' . $query . '%',
                    'OR:Profile.email:LIKE'    => '%' . $query . '%',
                ));
                break;
        }

        $id = $this->getProperty('id');
        if (!empty($id) AND $this->getProperty('combo')) {
            $q = $this->modx->newQuery($this->classKey);
            $q->where(array('id!=' => $id));
            $q->select('id');
            $q->limit($this->getProperty('limit') - 1);
            $q->prepare();
            $q->stmt->execute();
            $ids = $q->stmt->fetchAll(PDO::FETCH_COLUMN, 0);
            $ids = array_merge_recursive(array($id), $ids);
            $c->where(array(
                "{$this->classKey}.id:IN" => $ids
            ));
        }

        $userGroup = $this->getProperty('usergroup', 0);
        if (!empty($userGroup)) {
            if ($userGroup === 'anonymous') {
                $c->join('modUserGroupMember', 'UserGroupMembers', 'LEFT OUTER JOIN');
                $c->where(array(
                    'UserGroupMembers.user_group' => null,
                ));
            } else {
                $c->distinct();
                $c->innerJoin('modUserGroupMember', 'UserGroupMembers');
                $c->where(array(
                    'UserGroupMembers.user_group' => $userGroup,
                ));
            }
        }


        return $c;
    }

    public function prepareQueryAfterCount(xPDOQuery $c)
    {
        $c->select($this->modx->getSelectColumns('modUser', 'modUser'));
        $c->select($this->modx->getSelectColumns('modUserProfile', 'Profile', '',
            array('fullname', 'email', 'blocked')));

        return $c;
    }

    /** {@inheritDoc} */
    public function prepareRow(xPDOObject $object)
    {
        $array = $object->toArray();
        $array['blocked'] = $object->get('blocked') ? true : false;
        unset($array['password'], $array['cachepwd'], $array['salt']);

        return $array;
    }

    /** {@inheritDoc} */
    public function outputArray(array $array, $count = false)
    {
        if ($this->getProperty('novalue')) {
            $array = array_merge_recursive(array(
                array(
                    'id'        => '-',
                    'pagetitle' => $this->modx->lexicon('modClassVar_no')
                )
            ), $array);
        }
        if ($this->getProperty('addall')) {
            $array = array_merge_recursive(array(
                array(
                    'id'        => '-',
                    'pagetitle' => $this->modx->lexicon('modClassVar_all')
                )
            ), $array);
        }

        return parent::outputArray($array, $count);
    }

}

return 'modClassVarUserGetListProcessor';