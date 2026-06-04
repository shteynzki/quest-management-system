class CreateQuestViews < ActiveRecord::Migration[8.1]
  def change
    create_table :quest_views do |t|
      t.references :user, null: false, foreign_key: true
      t.references :quest, null: false, foreign_key: true

      t.timestamps
    end
  end
end
