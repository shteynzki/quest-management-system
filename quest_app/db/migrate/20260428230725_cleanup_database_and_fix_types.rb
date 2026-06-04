class CleanupDatabaseAndFixTypes < ActiveRecord::Migration[8.1]
  def up
    drop_table :user_infos if table_exists?(:user_infos)
    
    remove_column :reports, :info if column_exists?(:reports, :info)
    
    change_column :reports, :discount_custom, :integer, using: "NULLIF(discount_custom, '')::integer"
    
    add_foreign_key :actor_schedules, :quests unless foreign_key_exists?(:actor_schedules, :quests)
  end

  def down
    create_table :user_infos do |t|
      t.references :user, null: false, foreign_key: true
      t.text :info
      t.timestamps
    end
    
    add_column :reports, :info, :string
    
    change_column :reports, :discount_custom, :string
    
    remove_foreign_key :actor_schedules, :quests if foreign_key_exists?(:actor_schedules, :quests)
  end
end