class CreateActorSchedules < ActiveRecord::Migration[8.1]
  def change
    create_table :actor_schedules do |t|
      t.references :user, null: false, foreign_key: true
      t.integer :quest_id
      t.integer :day_of_week

      t.timestamps
    end
  end
end
