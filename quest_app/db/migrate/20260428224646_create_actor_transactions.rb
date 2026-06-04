class CreateActorTransactions < ActiveRecord::Migration[8.1]
  def change
    create_table :actor_transactions do |t|
      t.references :user, null: false, foreign_key: true
      t.references :game, foreign_key: true
      t.string :category
      t.float :amount
      t.string :transaction_type
      t.text :comment

      t.timestamps
    end
  end
end