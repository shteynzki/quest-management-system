class AddNameToQuests < ActiveRecord::Migration[8.1]
  def change
    add_column :quests, :name, :string
  end
end
