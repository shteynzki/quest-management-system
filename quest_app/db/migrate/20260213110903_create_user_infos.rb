class CreateUserInfos < ActiveRecord::Migration[8.1]
  def change
    create_table :user_infos do |t|
      t.references :user, null: false, foreign_key: true
      t.text :info

      t.timestamps
    end
  end
end
