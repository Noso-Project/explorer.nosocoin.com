<?php
declare(strict_types=1);

namespace App\Model\Table;

use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * Blocks Model
 *
 * @method \App\Model\Entity\Block newEmptyEntity()
 * @method \App\Model\Entity\Block newEntity(array $data, array $options = [])
 * @method \App\Model\Entity\Block[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\Block get($primaryKey, $options = [])
 * @method \App\Model\Entity\Block findOrCreate($search, ?callable $callback = null, $options = [])
 * @method \App\Model\Entity\Block patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\Block[] patchEntities(iterable $entities, array $data, array $options = [])
 * @method \App\Model\Entity\Block|false save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\Block saveOrFail(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\Block[]|\Cake\Datasource\ResultSetInterface|false saveMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\Block[]|\Cake\Datasource\ResultSetInterface saveManyOrFail(iterable $entities, $options = [])
 * @method \App\Model\Entity\Block[]|\Cake\Datasource\ResultSetInterface|false deleteMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\Block[]|\Cake\Datasource\ResultSetInterface deleteManyOrFail(iterable $entities, $options = [])
 *
 * @mixin \Cake\ORM\Behavior\TimestampBehavior
 */
class BlocksTable extends Table
{
    /**
     * Initialize method
     *
     * @param array $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config): void
    {
        parent::initialize($config);

        $this->setTable('blocks');
        $this->setDisplayField('hash');
        $this->setPrimaryKey('id');

        $this->addBehavior('Timestamp');
    }

    /**
     * Default validation rules.
     *
     * @param \Cake\Validation\Validator $validator Validator instance.
     * @return \Cake\Validation\Validator
     */
    public function validationDefault(Validator $validator): Validator
    {
        $validator
            ->integer('id')
            ->allowEmptyString('id', null, 'create');

        $validator
            ->requirePresence('number', 'create')
            ->notEmptyString('number');

        $validator
            ->scalar('hash')
            ->maxLength('hash', 255)
            ->requirePresence('hash', 'create')
            ->notEmptyString('hash');

        $validator
            ->requirePresence('time_end', 'create')
            ->notEmptyString('time_end');

        $validator
            ->requirePresence('time_start', 'create')
            ->notEmptyString('time_start');

        $validator
            ->integer('time_total')
            ->requirePresence('time_total', 'create')
            ->notEmptyString('time_total');

        $validator
            ->integer('last_20')
            ->requirePresence('last_20', 'create')
            ->notEmptyString('last_20');

        $validator
            ->integer('total_transactions')
            ->requirePresence('total_transactions', 'create')
            ->notEmptyString('total_transactions');

        $validator
            ->integer('difficulty')
            ->requirePresence('difficulty', 'create')
            ->notEmptyString('difficulty');

        $validator
            ->scalar('target')
            ->maxLength('target', 255)
            ->requirePresence('target', 'create')
            ->notEmptyString('target');

        $validator
            ->scalar('solution')
            ->maxLength('solution', 1024)
            ->requirePresence('solution', 'create')
            ->notEmptyString('solution');

        $validator
            ->scalar('last_block_hash')
            ->maxLength('last_block_hash', 255)
            ->requirePresence('last_block_hash', 'create')
            ->notEmptyString('last_block_hash');

        $validator
            ->integer('next_difficulty')
            ->requirePresence('next_difficulty', 'create')
            ->notEmptyString('next_difficulty');

        $validator
            ->scalar('miner')
            ->maxLength('miner', 255)
            ->requirePresence('miner', 'create')
            ->notEmptyString('miner');

        $validator
            ->requirePresence('fees_paid', 'create')
            ->notEmptyString('fees_paid');

        $validator
            ->requirePresence('reward', 'create')
            ->notEmptyString('reward');

        return $validator;
    }
}
